const fs = require('fs');
let c = fs.readFileSync('api/deepseek.js', 'utf8');

// Find the get_advisor_history section by anchor text
const marker = 'get_advisor_history: {\r\n    description: ';
const idx = c.indexOf(marker);
if (idx === -1) {
  console.log('ERROR: marker not found');
  process.exit(1);
}

// Find the end of this handler - look for '  },\r\n\r\n  check_deadlines:'
const endMarker = '  },\r\n\r\n  check_deadlines:';
const endIdx = c.indexOf(endMarker, idx);
if (endIdx === -1) {
  console.log('ERROR: end marker not found');
  process.exit(1);
}

// Read the full handler text
const handlerText = c.substring(idx, endIdx + endMarker.length);
console.log('Found handler at', idx, 'length:', handlerText.length);

// Build replacement: properly lookup phone from email then use .eq()
const newHandler = `get_advisor_history: {\r\n    description: 'Xem lich su tu van AI truoc day (cac phan tich ho so da thuc hien)',\r\n    params: {\r\n      limit: { type: 'number', description: 'So luong ket qua toi da', required: false },\r\n    },\r\n    handler: async function(params, profile) {\r\n      if (!profile || !profile.email) return { error: 'Can dang nhap de xem lich su tu van.' };\r\n      // Look up phone from student_profiles by email, then query advisor_cases\r\n      var phone = profile.phone || '';\r\n      if (!phone) {\r\n        var { data: sp } = await supabase\r\n          .from('student_profiles')\r\n          .select('phone')\r\n          .eq('email', profile.email)\r\n          .maybeSingle();\r\n        if (sp && sp.phone) phone = sp.phone;\r\n      }\r\n      if (!phone) return { error: 'Khong tim thay so dien thoai lien ket voi tai khoan.' };\r\n      var { data: cases } = await supabase\r\n        .from('advisor_cases')\r\n        .select('id, student_name, visa_type, top_schools, result, ai_advice, created_at')\r\n        .eq('student_phone', phone)\r\n        .order('created_at', { ascending: false })\r\n        .limit(params.limit || 10);\r\n      if (!cases || cases.length === 0) {\r\n        return { message: 'Ban chua co lich su tu van AI nao. Hay dung cong cu Phan tich ho so truoc.' };\r\n      }\r\n      return {\r\n        type: 'advisor_history',\r\n        cases: cases.map(function(c) {\r\n          return {\r\n            id: c.id, studentName: c.student_name || 'Khong ro',\r\n            visaType: c.visa_type || 'Khong ro',\r\n            schools: (c.top_schools || []).slice(0, 3).map(function(s) { return s.name || ''; }).filter(Boolean).join(', '),\r\n            result: c.result || 'pending',\r\n            advicePreview: (c.ai_advice || '').substring(0, 200),\r\n            createdAt: c.created_at,\r\n          };\r\n        }),\r\n      };\r\n    },\r\n  },\r\n\r\n  check_deadlines:`;

c = c.replace(handlerText, newHandler);
fs.writeFileSync('api/deepseek.js', c, 'utf8');
console.log('Fixed get_advisor_history handler successfully!');
