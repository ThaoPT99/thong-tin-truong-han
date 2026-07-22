const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'api', 'deepseek.js');
let c = fs.readFileSync(filePath, 'utf8');

const newTools = `

  interview_simulator: {
    description: 'Luyen phong van visa KVAC voi AI. Dung tool nay khi hoc sinh muon luyen phong van.',
    params: {
      action: { type: 'string', description: 'start (bat dau) hoac answer (tra loi cau hoi)', required: true },
      answer: { type: 'string', description: 'Cau tra loi cua hoc sinh (chi can khi action=answer)', required: false },
    },
    handler: async function(params, profile) {
      var vt = profile.visaType || 'D4-1';
      var p = {
        fullName: profile.fullName || 'Hoc sinh', visaType: vt,
        educationLevel: profile.educationLevel || 'THPT', koreanLevel: profile.koreanLevel || 'none',
        gpa: profile.gpa || null, hasVisaRejection: profile.hasVisaRejection || false,
        gapYears: profile.gapYears || 0, chosenSchool: profile.chosenSchool || '', chosenMajor: profile.chosenMajor || '',
      };
      var topics = {
        'D4-1': ['Gioi thieu ban than va muc dich du hoc','Ly do chon Han Quoc de hoc tieng','Tai sao khong hoc tieng Han o Viet Nam?','Ke hoach hoc tieng cu the va muc tieu TOPIK','Sau khi hoc tieng xong du dinh lam gi?','Tai chinh va nguoi bao lanh'],
        'D2-6': ['Gioi thieu ban than va muc dich du hoc','Ly do chon Han Quoc','Tai sao chon truong va nganh nay?','Ke hoach hoc tap cu the tu tung hoc ky','Tai chinh va nguoi bao lanh','Du dinh sau khi tot nghiep'],
      };
      var interviewTopics = topics[vt] || topics['D4-1'];
      if (params.action === 'start') {
        var topicsText = interviewTopics.map(function(t, i) { return (i+1) + '. ' + t; }).join('\\n');
        var sys = 'Ban la nhan vien phong van visa Han Quoc tai KVAC. Phong van hs xin visa ' + vt + '.\\nTHONG TIN HS: ' + p.fullName + ', ' + (p.educationLevel === 'university' ? 'DH' : 'THPT') + (p.gpa ? ', GPA: ' + p.gpa : '') + ', Tieng Han: ' + p.koreanLevel + (p.chosenSchool ? ', Truong: ' + p.chosenSchool : '') + (p.chosenMajor ? ', Nganh: ' + p.chosenMajor : '') + (p.hasVisaRejection ? ', DA truot visa' : '') + '\\nCAC CAU HOI:\\n' + topicsText + '\\nHay bat dau bang cau hoi DAU TIEN. Chi hoi 1 cau, bang tieng Viet.';
        var result = await callDeepSeek([{ role: 'system', content: sys }, { role: 'user', content: 'Hoi cau hoi dau tien.' }], { temperature: 0.5, maxTokens: 400, timeout: 15000 });
        if (!result) return { error: 'AI khong phan hoi, vui long thu lai.' };
        return { type: 'interview_question', questionNumber: 1, totalQuestions: interviewTopics.length, question: result.replace(/\`\`\`[\s\S]*?\`\`\`/g, '').trim(), message: 'Toi se phong van ban. Hay tra loi tu nhien nhe!' };
      }
      if (params.action === 'answer') {
        var sys2 = 'Ban la nhan vien phong van visa Han Quoc tai KVAC. Danh gia cau tra loi cua hs.\\nHS: ' + p.fullName + ', visa ' + vt + '\\nCAU TRA LOI: \"' + (params.answer || '') + '\"\\nNHIEM VU: 1. Danh gia (2-3 cau, tinh than xay dung) 2. Hoi cau tiep theo (chi 1 cau) 3. Neu het, bao KET_THUC';
        var result2 = await callDeepSeek([{ role: 'system', content: sys2 }, { role: 'user', content: 'Danh gia va hoi cau tiep theo.' }], { temperature: 0.4, maxTokens: 500, timeout: 15000 });
        if (!result2) return { error: 'AI khong phan hoi.' };
        var cleaned = result2.replace(/\`\`\`[\s\S]*?\`\`\`/g, '').trim();
        if (cleaned.includes('KET_THUC') || cleaned.includes('ket thuc')) {
          return { type: 'interview_complete', feedback: cleaned.replace('KET_THUC', '').trim(), message: 'Cam on ban da tham gia phong van!' };
        }
        return { type: 'interview_answer', feedback: cleaned, message: 'Hay tra loi cau hoi tiep theo!' };
      }
      return { error: 'Action khong hop le.' };
    },
  },

  upload_document: {
    description: 'Kiem tra trang thai giay to ho so can chuan bi',
    params: {
      docType: { type: 'string', description: 'De trong de xem tat ca, hoac nhap ten giay to', required: false },
    },
    handler: async function(params, profile) {
      if (!profile || !profile.email) return { error: 'Can dang nhap de kiem tra giay to.' };
      var { data: sp } = await supabase.from('student_profiles').select('id').eq('email', profile.email).maybeSingle();
      if (!sp) return { error: 'Khong tim thay tai khoan.' };
      var { data: docs } = await supabase.from('student_documents').select('doc_type, status, file_url').eq('student_id', sp.id);
      var docMap = {};
      for (var di = 0; di < (docs || []).length; di++) docMap[docs[di].doc_type] = docs[di];
      var required = [
        { type: 'passport', label: 'Ho chieu' }, { type: 'id_card', label: 'CCCD/CMND' },
        { type: 'photo', label: 'Anh 3.5x4.5' }, { type: 'household_registration', label: 'So ho khau' },
        { type: 'birth_certificate', label: 'Giay khai sinh' }, { type: 'diploma', label: 'Bang THPT' },
        { type: 'transcript', label: 'Hoc ba' }, { type: 'admission_letter', label: 'Thu nhap hoc' },
        { type: 'savings_book', label: 'So tiet kiem' }, { type: 'bank_statement', label: 'Xac nhan so du' },
        { type: 'income_proof', label: 'Giay to thu nhap' }, { type: 'health_check', label: 'Kham lao phoi' },
        { type: 'study_plan', label: 'Study Plan' },
      ];
      var statusLabels = { 'not_ready': 'Chua co', 'ready': 'Da co', 'translated': 'Da dich', 'notarized': 'Da cong chung', 'legalized': 'Da hop phap hoa', 'uploaded': 'Da upload' };
      var statusColors = { 'not_ready': '#dc2626', 'ready': '#2563eb', 'translated': '#7c3aed', 'notarized': '#7c3aed', 'legalized': '#059669', 'uploaded': '#059669' };
      var filtered = required;
      if (params.docType) {
        var dt = params.docType.toLowerCase();
        filtered = required.filter(function(d) { return d.type.includes(dt) || d.label.toLowerCase().includes(dt); });
      }
      var result = filtered.map(function(doc) {
        var ex = docMap[doc.type];
        var s = ex ? ex.status : 'not_ready';
        return { type: doc.type, label: doc.label, status: statusLabels[s] || s, statusRaw: s, color: statusColors[s] || '#6b7280', hasFile: !!(ex && ex.file_url) };
      });
      var ready = result.filter(function(d) { return d.statusRaw === 'uploaded' || d.statusRaw === 'legalized'; }).length;
      return { type: 'document_status', documents: result, summary: ready + '/' + result.length + ' giay to da san sang', message: ready === result.length ? 'Tat ca giay to da san sang!' : 'Con ' + (result.length - ready) + ' giay to can chuan bi.' };
    },
  },

`;
// Insert before get_checklist
const anchor = '  get_checklist:';
const idx = c.indexOf(anchor);
if (idx === -1) {
  console.error('ERROR: Could not find insertion point');
  process.exit(1);
}
c = c.substring(0, idx) + newTools + c.substring(idx);
fs.writeFileSync(filePath, c, 'utf8');
console.log('DONE: Inserted new tools at position', idx);
