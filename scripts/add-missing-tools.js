const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'api', 'deepseek.js');
let c = fs.readFileSync(filePath, 'utf8');

const newTools = `

  generate_study_plan: {
    description: 'Soan Study Plan cho hoc sinh dua tren ho so va cau tra loi cua ban',
    params: {
      type: { type: 'string', description: 'Loai: study_plan (mac dinh), gap_explanation, visa_rejection_explanation', required: false },
      visaType: { type: 'string', description: 'D-4-1 hoac D2-6', required: false },
    },
    handler: async function(params, profile) {
      if (!profile || !profile.fullName) return { error: 'Can co ho so hoc sinh de soan Study Plan. Hay nhap thong tin truoc.' };
      try {
        var fetchRes = await fetch('http://localhost:3000/api/deepseek?action=generate-checklist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: params.type || 'study_plan',
            profile: profile,
            visaType: params.visaType || profile.visaType || 'D4-1',
          }),
        });
        var data = await fetchRes.json();
        if (data.success && data.draft) {
          return { type: 'study_plan_draft', draft: data.draft.substring(0, 3000), message: 'Day la ban nhap Study Plan cua ban. Ban co the yeu cau chinh sua hoac luu lai.' };
        }
        return { error: 'AI khong phan hoi. Vui long thu lai.' };
      } catch (e) {
        return { error: 'Loi ket noi AI: ' + e.message };
      }
    },
  },

  get_advisor_history: {
    description: 'Xem lich su tu van AI truoc day (cac phan tich ho so da thuc hien)',
    params: {
      limit: { type: 'number', description: 'So luong ket qua toi da', required: false },
    },
    handler: async function(params, profile) {
      if (!profile || !profile.email) return { error: 'Can dang nhap de xem lich su tu van.' };
      var { data: cases } = await supabase
        .from('advisor_cases')
        .select('id, student_name, visa_type, top_schools, result, ai_advice, created_at')
        .eq('student_phone', profile.phone || '')
        .order('created_at', { ascending: false })
        .limit(params.limit || 10);
      if (!cases || cases.length === 0) {
        return { message: 'Ban chua co lich su tu van AI nao. Hay dung cong cu Phan tich ho so truoc.' };
      }
      return {
        type: 'advisor_history',
        cases: cases.map(function(c) {
          return {
            id: c.id, studentName: c.student_name || 'Khong ro',
            visaType: c.visa_type || 'Khong ro',
            schools: (c.top_schools || []).slice(0, 3).map(function(s) { return s.name || ''; }).filter(Boolean).join(', '),
            result: c.result || 'pending',
            advicePreview: (c.ai_advice || '').substring(0, 200),
            createdAt: c.created_at,
          };
        }),
      };
    },
  },

  check_deadlines: {
    description: 'Xem cac han nop giay to sap toi va nhac nho con dang do',
    params: {},
    handler: async function(params, profile) {
      if (!profile || !profile.email) return { error: 'Can dang nhap de xem han nop giay to.' };
      var { data: sp } = await supabase.from('student_profiles').select('id').eq('email', profile.email).maybeSingle();
      if (!sp) return { error: 'Khong tim thay tai khoan.' };
      var { data: reminders } = await supabase
        .from('reminders')
        .select('id, title, description, due_date, reminder_type, is_completed')
        .eq('student_id', sp.id)
        .order('due_date', { ascending: true });
      if (!reminders || reminders.length === 0) {
        return { message: 'Ban chua co nhac nho nao. Hay tao nhac nho bang tool set_reminder.' };
      }
      var now = new Date();
      var typeLabels = {
        document: 'Giay to', submission: 'Nop ho so', interview: 'Phong van',
        health_check: 'Suc khoe', visa_appointment: 'Hen visa', other: 'Khac',
      };
      var rows = reminders.map(function(r) {
        var due = new Date(r.due_date);
        var daysLeft = Math.ceil((due - now) / (1000 * 60 * 60 * 24));
        var statusColor = daysLeft < 0 ? '#dc2626' : daysLeft <= 7 ? '#d97706' : '#059669';
        var statusText = daysLeft < 0 ? 'Qua han!' : daysLeft <= 7 ? 'Sap den han' : 'Con ' + daysLeft + ' ngay';
        return {
          id: r.id, title: r.title, description: r.description || '',
          dueDate: r.due_date, type: typeLabels[r.reminder_type] || r.reminder_type,
          daysLeft: daysLeft, statusColor: statusColor, statusText: statusText,
          completed: r.is_completed,
        };
      });
      var overdue = rows.filter(function(r) { return r.daysLeft < 0 && !r.completed; }).length;
      var upcoming = rows.filter(function(r) { return r.daysLeft >= 0 && r.daysLeft <= 7 && !r.completed; }).length;
      return {
        type: 'deadlines',
        reminders: rows,
        summary: 'Co ' + rows.length + ' nhac nho',
        warnings: overdue > 0 ? (overdue + ' nhac nho qua han!') : (upcoming > 0 ? (upcoming + ' nhac nho sap den han trong 7 ngay') : 'Khong co nhac nho nao sap den han'),
      };
    },
  },
`;
// Insert before get_checklist
const anchor = '  get_checklist:';
const idx = c.indexOf(anchor);
if (idx === -1) { console.error('ERROR: Could not find insertion point'); process.exit(1); }
c = c.substring(0, idx) + newTools + c.substring(idx);
fs.writeFileSync(filePath, c, 'utf8');
console.log('DONE: Inserted 3 new tools at position', idx);
