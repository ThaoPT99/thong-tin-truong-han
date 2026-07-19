// checklist-data.js — Master checklist definitions cho từng visa type
// Mỗi item có rule để quyết định có hiển thị hay không dựa trên profile học sinh
// Đây là "Rule Engine" cho Dynamic Checklist cá nhân hoá

window.CHECKLIST_DATA = {

  // ═══════════════════════════════════════════════════════════
  // D-4-1: Visa học tiếng Hàn
  // ═══════════════════════════════════════════════════════════
  'D-4-1': {
    visaType: 'D-4-1',
    name: 'Visa D-4-1: Du học tiếng Hàn',
    description: 'Dành cho học sinh đăng ký khóa học tiếng Hàn tại Hàn Quốc.',
    modules: [
      {
        id: 'A1',
        name: 'Giấy tờ hành chính cá nhân',
        icon: '🪪',
        description: 'Giấy tờ tùy thân cơ bản — ai cũng cần chuẩn bị.',
        required: true,
        items: [
          {
            id: 'A1-1',
            name: 'Đơn xin visa mẫu KSD0-2014',
            description: 'Tải mẫu từ website ĐSQ/LSQ Hàn Quốc, điền đầy đủ thông tin.',
            documentType: 'visa_application_form',
            required: true,
            rule: null // Luôn hiển thị
          },
          {
            id: 'A1-2',
            name: 'Hộ chiếu còn hạn',
            description: 'Còn hạn ít nhất 6 tháng, còn trang trống để dán visa.',
            documentType: 'passport',
            required: true,
            rule: null
          },
          {
            id: 'A1-3',
            name: 'Ảnh thẻ 3.5x4.5cm',
            description: 'Nền trắng, chụp trong 6 tháng gần nhất, 2-4 ảnh.',
            documentType: 'photo',
            required: true,
            rule: null
          },
          {
            id: 'A1-4',
            name: 'CCCD/CMND (bản photo)',
            description: 'Photo rõ ràng, không cần công chứng.',
            documentType: 'id_card',
            required: true,
            rule: null
          },
          {
            id: 'A1-5',
            name: 'Sổ hộ khẩu (bản photo)',
            description: 'Photo tất cả các trang, có thể cần dịch thuật.',
            documentType: 'household_registration',
            required: true,
            rule: null
          },
          {
            id: 'A1-6',
            name: 'Giấy khai sinh',
            description: 'Bản sao có xác nhận của địa phương hoặc công chứng.',
            documentType: 'birth_certificate',
            required: true,
            rule: null
          }
        ]
      },

      {
        id: 'A2',
        name: 'Giấy tờ học vấn',
        icon: '🎓',
        description: 'Chuẩn bị theo trình độ học vấn cao nhất của bạn.',
        required: true,
        items: [
          {
            id: 'A2-1',
            name: 'Bằng tốt nghiệp THPT',
            description: 'Bản gốc + bản dịch công chứng sang tiếng Hàn hoặc Anh.',
            documentType: 'diploma',
            required: true,
            rule: null
          },
          {
            id: 'A2-2',
            name: 'Học bạ THPT (bảng điểm 3 năm)',
            description: 'Bản gốc + bản dịch công chứng. Điểm trung bình nên >= 5.0.',
            documentType: 'transcript',
            required: true,
            rule: null
          },
          {
            id: 'A2-3',
            name: 'Giải trình khoảng trống thời gian',
            description: 'Viết giải trình nếu sau tốt nghiệp > 6 tháng chưa đi học/đi làm.',
            documentType: 'gap_explanation',
            required: false,
            rule: { gap_years: { gt: 0.5 } }, // Chỉ hiển thị nếu gap > 6 tháng
            hasAiAssist: true
          },
          {
            id: 'A2-4',
            name: 'Bằng tốt nghiệp Đại học/Cao đẳng (nếu có)',
            description: 'Bản gốc + dịch công chứng.',
            documentType: 'university_diploma',
            required: false,
            rule: { education_level: { eq: 'university' } }
          },
          {
            id: 'A2-5',
            name: 'Bảng điểm Đại học (nếu có)',
            description: 'Bản gốc + dịch công chứng.',
            documentType: 'university_transcript',
            required: false,
            rule: { education_level: { eq: 'university' } }
          }
        ]
      },

      {
        id: 'A3',
        name: 'Giấy tờ từ trường Hàn Quốc',
        icon: '🏫',
        description: 'Những giấy tờ này do trường Hàn Quốc cấp — bạn chỉ cần theo dõi trạng thái.',
        required: true,
        items: [
          {
            id: 'A3-1',
            name: 'Admission Letter / Certificate of Admission',
            description: 'Thư nhập học từ trường Hàn Quốc — kiểm tra thông tin cá nhân và ngành học.',
            documentType: 'admission_letter',
            required: true,
            source: 'school',
            rule: null
          },
          {
            id: 'A3-2',
            name: 'Invoice học phí',
            description: 'Hóa đơn học phí từ trường — dùng để chứng minh đã đóng học phí.',
            documentType: 'tuition_invoice',
            required: true,
            source: 'school',
            rule: null
          }
        ]
      },

      {
        id: 'A4',
        name: 'Chứng minh tài chính',
        icon: '💰',
        description: 'Quan trọng nhất trong bộ hồ sơ — cần chuẩn bị kỹ.',
        required: true,
        items: [
          {
            id: 'A4-1',
            name: 'Sổ tiết kiệm',
            description: 'Tối thiểu 10,000 USD (~250 triệu VND). Kỳ hạn tối thiểu 1 tháng trước ngày nộp.',
            documentType: 'savings_book',
            required: true,
            rule: null,
            warning: 'Sổ tiết kiệm cần được mở trước ngày nộp hồ sơ ít nhất 1 tháng.'
          },
          {
            id: 'A4-2',
            name: 'Xác nhận số dư tài khoản ngân hàng',
            description: 'Sao kê 3 tháng gần nhất, có dấu ngân hàng.',
            documentType: 'bank_statement',
            required: true,
            rule: null
          },
          {
            id: 'A4-3',
            name: 'Giấy cam kết bảo lãnh tài chính',
            description: 'Người bảo lãnh cam kết chi trả toàn bộ chi phí du học.',
            documentType: 'sponsorship_letter',
            required: false,
            rule: { sponsor_is_self: { eq: false } }, // Nếu người bảo lãnh không phải tự thân
            hasAiAssist: true
          },
          {
            id: 'A4-4',
            name: 'Giấy tờ chứng minh quan hệ với người bảo lãnh',
            description: 'Giấy khai sinh, sổ hộ khẩu, đăng ký kết hôn (nếu bảo lãnh là người thân).',
            documentType: 'relationship_proof',
            required: false,
            rule: { sponsor_is_self: { eq: false } }
          },
          {
            id: 'A4-5',
            name: 'Giấy tờ chứng minh thu nhập người bảo lãnh',
            description: 'Hợp đồng lao động, sao kê lương, xác nhận công việc, giấy phép kinh doanh...',
            documentType: 'income_proof',
            required: true,
            rule: { sponsor_is_self: { eq: false } }
          },
          {
            id: 'A4-6',
            name: 'Hợp đồng lao động / sao kê lương (tự thân)',
            description: 'Nếu bạn tự bảo lãnh chính mình — cần chứng minh thu nhập ổn định.',
            documentType: 'self_income_proof',
            required: false,
            rule: { sponsor_is_self: { eq: true } }
          },
          {
            id: 'A4-7',
            name: 'Giấy tờ tài sản (sổ đỏ, xe, cổ phiếu...)',
            description: 'Chứng minh tài sản có thể thanh khoản của gia đình.',
            documentType: 'asset_proof',
            required: false,
            rule: null, // Không bắt buộc nhưng khuyến khích
            recommended: true
          },
          {
            id: 'A4-8',
            name: 'Dịch công chứng toàn bộ giấy tờ tài chính',
            description: 'Tất cả giấy tờ tiếng Việt cần dịch công chứng sang tiếng Hàn hoặc Anh.',
            documentType: 'notarized_translation',
            required: true,
            rule: null
          }
        ]
      },

      {
        id: 'A5',
        name: 'Study Plan / Personal Statement',
        icon: '✍️',
        description: 'Phần quan trọng nhất để thể hiện mục đích du học thật.',
        required: true,
        items: [
          {
            id: 'A5-1',
            name: 'Kế hoạch học tập (Study Plan)',
            description: '500-800 từ, viết bằng tiếng Hàn hoặc Anh. Trình bày rõ mục tiêu, lộ trình, kế hoạch tương lai.',
            documentType: 'study_plan',
            required: true,
            hasAiAssist: true,
            rule: null
          },
          {
            id: 'A5-2',
            name: 'Giới thiệu bản thân (Personal Statement)',
            description: 'Giới thiệu về bản thân, động lực du học, thành tích, định hướng nghề nghiệp.',
            documentType: 'personal_statement',
            required: false,
            hasAiAssist: true,
            rule: null,
            recommended: true
          }
        ]
      },

      {
        id: 'A6',
        name: 'Nộp hồ sơ & Theo dõi',
        icon: '📬',
        description: 'Bước cuối cùng — nộp hồ sơ tại ĐSQ/LSQ và theo dõi kết quả.',
        required: true,
        items: [
          {
            id: 'A6-1',
            name: 'Đặt lịch hẹn KVAC',
            description: 'Đặt lịch qua KVAC (Hà Nội hoặc TP.HCM). Lịch thường đầy nhanh, cần đặt sớm.',
            documentType: 'kvac_booking',
            required: true,
            rule: null,
            link: 'https://visaforkorea-vt.com/'
          },
          {
            id: 'A6-2',
            name: 'Giấy khám sức khỏe',
            description: 'Khám lao phổi tại bệnh viện được ĐSQ/LSQ chỉ định.',
            documentType: 'health_check',
            required: true,
            rule: null
          },
          {
            id: 'A6-3',
            name: 'Bảo hiểm du học',
            description: 'Mua bảo hiểm du học Hàn Quốc (bắt buộc khi nộp visa).',
            documentType: 'insurance',
            required: true,
            rule: null
          },
          {
            id: 'A6-4',
            name: 'Nộp hồ sơ tại ĐSQ/LSQ',
            description: 'Mang đầy đủ giấy tờ gốc + bản dịch công chứng đến đúng giờ hẹn.',
            documentType: 'submission',
            required: true,
            rule: null
          },
          {
            id: 'A6-5',
            name: 'Theo dõi kết quả visa',
            description: 'Thời gian xử lý 5-20 ngày làm việc. Kiểm tra trạng thái online.',
            documentType: 'result_tracking',
            required: true,
            rule: null
          }
        ]
      },

      // Module đặc biệt: chỉ hiển thị nếu có rủi ro
      {
        id: 'RISK',
        name: 'Xử lý rủi ro đặc thù',
        icon: '⚠️',
        description: 'Các giấy tờ bổ sung dựa trên tình huống cá nhân của bạn.',
        required: false, // Module chỉ hiển thị khi có ít nhất 1 item phù hợp
        items: [
          {
            id: 'RISK-1',
            name: 'Giải trình lý do trượt visa lần trước',
            description: 'Nếu đã từng trượt visa Hàn — cần phân tích nguyên nhân và giải trình khắc phục.',
            documentType: 'visa_rejection_explanation',
            required: true,
            hasAiAssist: true,
            rule: { has_visa_rejection: { eq: true } }
          },
          {
            id: 'RISK-2',
            name: 'Bản sao hồ sơ visa lần trước',
            description: 'Nộp lại toàn bộ hồ sơ đã nộp lần trước để đối chiếu.',
            documentType: 'previous_visa_dossier',
            required: true,
            rule: { has_visa_rejection: { eq: true } }
          },
          {
            id: 'RISK-3',
            name: 'Hợp đồng lao động / xác nhận công việc',
            description: 'Nếu có gap year và đã đi làm — cần chứng minh công việc trong thời gian đó.',
            documentType: 'work_contract',
            required: true,
            rule: { has_work_experience: { eq: true }, gap_years: { gt: 0 } }
          },
          {
            id: 'RISK-4',
            name: 'Chứng chỉ tiếng Hàn TOPIK',
            description: 'Nếu đã có — giúp tăng cơ hội đậu visa. Nên có tối thiểu TOPIK 2.',
            documentType: 'topik_certificate',
            required: false,
            hasAiAssist: false,
            rule: { has_topik: { eq: true } },
            recommended: true
          },
          {
            id: 'RISK-5',
            name: 'Thư giới thiệu từ giáo viên',
            description: 'Hữu ích nếu học lực trung bình hoặc có gap year dài. Có thể bổ sung hồ sơ.',
            documentType: 'recommendation_letter',
            required: false,
            rule: null,
            recommended: true,
            hasAiAssist: true
          },
          {
            id: 'RISK-6',
            name: 'Chứng chỉ tiếng Hàn Sejong / bằng online',
            description: 'Bổ sung nếu chưa có TOPIK — thể hiện đã có nền tảng tiếng Hàn.',
            documentType: 'korean_certificate',
            required: false,
            rule: { korean_level: { neq: 'none' } },
            recommended: true
          }
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════
  // D-2: Visa đại học chính quy
  // ═══════════════════════════════════════════════════════════
  'D-2': {
    visaType: 'D-2',
    name: 'Visa D-2: Du học đại học chính quy',
    description: 'Dành cho học sinh đăng ký chương trình đại học/cao đẳng chính quy tại Hàn Quốc.',
    modules: [
      {
        id: 'B1',
        name: 'Giấy tờ hành chính',
        icon: '🪪',
        required: true,
        items: [
          { id: 'B1-1', name: 'Đơn xin visa mẫu KSD0-2014', description: 'Tải mẫu từ website ĐSQ/LSQ.', documentType: 'visa_form', required: true, rule: null },
          { id: 'B1-2', name: 'Hộ chiếu còn hạn (6 tháng+)', description: 'Còn trang trống và hạn sử dụng >= 6 tháng.', documentType: 'passport', required: true, rule: null },
          { id: 'B1-3', name: 'Ảnh thẻ 3.5x4.5cm', description: 'Nền trắng, chụp trong 6 tháng.', documentType: 'photo', required: true, rule: null },
          { id: 'B1-4', name: 'CCCD/CMND photo', description: 'Photo rõ ràng.', documentType: 'id_card', required: true, rule: null },
          { id: 'B1-5', name: 'Giấy khai sinh', description: 'Bản sao.', documentType: 'birth_certificate', required: true, rule: null },
          { id: 'B1-6', name: 'Sổ hộ khẩu', description: 'Photo hoặc sao y.', documentType: 'household_registration', required: true, rule: null }
        ]
      },
      {
        id: 'B2',
        name: 'Giấy tờ học vấn',
        icon: '🎓',
        required: true,
        items: [
          { id: 'B2-1', name: 'Bằng tốt nghiệp THPT', description: 'Bản gốc + dịch công chứng.', documentType: 'diploma', required: true, rule: null },
          { id: 'B2-2', name: 'Học bạ THPT', description: 'Bản gốc + dịch công chứng.', documentType: 'transcript', required: true, rule: null },
          { id: 'B2-3', name: 'Bằng tốt nghiệp ĐH (nếu có)', description: 'Nếu đã học đại học.', documentType: 'uni_diploma', required: false, rule: { education_level: { eq: 'university' } } },
          { id: 'B2-4', name: 'Bảng điểm ĐH (nếu có)', description: 'Nếu đã học đại học.', documentType: 'uni_transcript', required: false, rule: { education_level: { eq: 'university' } } },
          { id: 'B2-5', name: 'Thư giới thiệu từ giáo viên', description: 'Cần 2 thư giới thiệu cho visa D-2.', documentType: 'recommendation_letter', required: true, rule: null, hasAiAssist: true },
          { id: 'B2-6', name: 'Chứng chỉ TOPIK / IELTS', description: 'TOPIK 3+ hoặc IELTS 5.5+ thường là yêu cầu đầu vào.', documentType: 'language_cert', required: true, rule: null },
          { id: 'B2-7', name: 'Giải trình khoảng trống (nếu có)', description: 'Gap > 6 tháng cần giải trình.', documentType: 'gap_explanation', required: false, rule: { gap_years: { gt: 0.5 } }, hasAiAssist: true }
        ]
      },
      {
        id: 'B3',
        name: 'Giấy tờ trường Hàn',
        icon: '🏫',
        required: true,
        items: [
          { id: 'B3-1', name: 'Admission Letter / Offer Letter', description: 'Thư nhập học chính thức.', documentType: 'admission_letter', required: true, rule: null },
          { id: 'B3-2', name: 'Invoice học phí', description: 'Chi tiết học phí toàn khóa.', documentType: 'tuition_invoice', required: true, rule: null },
          { id: 'B3-3', name: 'Giới thiệu chương trình học', description: 'Mô tả chi tiết ngành học.', documentType: 'program_intro', required: false, rule: null }
        ]
      },
      {
        id: 'B4',
        name: 'Chứng minh tài chính',
        icon: '💰',
        required: true,
        items: [
          { id: 'B4-1', name: 'Sổ tiết kiệm (tối thiểu $10,000)', description: 'Tương đương ~250 triệu VND.', documentType: 'savings_book', required: true, rule: null },
          { id: 'B4-2', name: 'Sao kê ngân hàng 3 tháng', description: 'Xác nhận số dư tài khoản.', documentType: 'bank_statement', required: true, rule: null },
          { id: 'B4-3', name: 'Giấy bảo lãnh tài chính', description: 'Nếu người bảo lãnh không phải tự thân.', documentType: 'sponsorship', required: false, rule: { sponsor_is_self: { eq: false } } },
          { id: 'B4-4', name: 'Giấy tờ chứng minh quan hệ', description: 'Quan hệ với người bảo lãnh.', documentType: 'relationship', required: false, rule: { sponsor_is_self: { eq: false } } },
          { id: 'B4-5', name: 'Chứng minh thu nhập người bảo lãnh', description: 'HĐLĐ, sao kê lương, thu nhập từ kinh doanh.', documentType: 'income_proof', required: true, rule: { sponsor_is_self: { eq: false } } },
          { id: 'B4-6', name: 'Dịch công chứng toàn bộ', description: 'Tất cả giấy tờ tài chính.', documentType: 'notarized', required: true, rule: null }
        ]
      },
      {
        id: 'B5',
        name: 'Study Plan / Personal Statement',
        icon: '✍️',
        required: true,
        items: [
          { id: 'B5-1', name: 'Study Plan (Kế hoạch học tập)', description: '800-1200 từ. Chi tiết hơn D-4-1.', documentType: 'study_plan', required: true, hasAiAssist: true, rule: null },
          { id: 'B5-2', name: 'Personal Statement', description: 'Giới thiệu bản thân, mục tiêu.', documentType: 'personal_statement', required: true, hasAiAssist: true, rule: null }
        ]
      },
      {
        id: 'B6',
        name: 'Nộp hồ sơ & Theo dõi',
        icon: '📬',
        required: true,
        items: [
          { id: 'B6-1', name: 'Đặt lịch hẹn KVAC', description: 'Đặt lịch sớm.', documentType: 'kvac', required: true, rule: null },
          { id: 'B6-2', name: 'Khám sức khỏe', description: 'Theo mẫu ĐSQ yêu cầu.', documentType: 'health', required: true, rule: null },
          { id: 'B6-3', name: 'Bảo hiểm du học', description: 'Bắt buộc.', documentType: 'insurance', required: true, rule: null },
          { id: 'B6-4', name: 'Nộp và theo dõi kết quả', description: 'Theo dõi online.', documentType: 'tracking', required: true, rule: null }
        ]
      },
      // Module rủi ro đặc thù D-2
      {
        id: 'RISK-D2',
        name: 'Xử lý rủi ro đặc thù D-2',
        icon: '⚠️',
        required: false,
        items: [
          { id: 'RISK-D2-1', name: 'Giải trình trượt visa', description: 'Nếu đã từng trượt visa Hàn.', documentType: 'rejection_explain', required: true, hasAiAssist: true, rule: { has_visa_rejection: { eq: true } } },
          { id: 'RISK-D2-2', name: 'Chứng nhận hoàn thành khóa học dự bị', description: 'Nếu cần hoàn thành khóa dự bị trước.', documentType: 'prep_course', required: false, rule: { need_prep_course: { eq: true } } }
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════
  // D4→D2: Chuyển đổi visa
  // ═══════════════════════════════════════════════════════════
  'D4-to-D2': {
    visaType: 'D4-to-D2',
    name: 'Chuyển đổi Visa D4 → D2',
    description: 'Dành cho học sinh đang ở Hàn với visa D-4-1, muốn chuyển lên visa D-2.',
    modules: [
      {
        id: 'C1',
        name: 'Giấy tờ tại Hàn',
        icon: '🏛️',
        required: true,
        items: [
          { id: 'C1-1', name: 'Giấy chứng nhận hoàn thành khóa tiếng', description: 'Từ trường tiếng Hàn.', documentType: 'completion_cert', required: true, rule: null },
          { id: 'C1-2', name: 'Bảng điểm khóa tiếng Hàn', description: 'Thể hiện kết quả học tập.', documentType: 'korean_transcript', required: true, rule: null },
          { id: 'C1-3', name: 'Admission Letter từ trường ĐH', description: 'Thư nhập học đại học.', documentType: 'admission_letter', required: true, rule: null },
          { id: 'C1-4', name: 'Hộ chiếu + Thẻ ngoại kiều (ARC)', description: 'Bản photo thẻ cư trú hiện tại.', documentType: 'arc_copy', required: true, rule: null },
          { id: 'C1-5', name: 'Đơn xin chuyển đổi visa (mẫu Hàn)', description: 'Nộp tại Immigration Hàn Quốc.', documentType: 'change_form', required: true, rule: null },
          { id: 'C1-6', name: 'Giấy tờ tài chính chứng minh đủ điều kiện', description: 'Sổ tiết kiệm tại Hàn hoặc VN.', documentType: 'finance_proof', required: true, rule: null }
        ]
      }
    ]
  }
};

// ════════════════════════════════════════════════════════════════
// Rule Engine — Đánh giá điều kiện của từng item dựa trên profile
// ════════════════════════════════════════════════════════════════
window.evaluateChecklistRule = function(rule, profile) {
  if (!rule) return true; // Không có rule = luôn hiển thị

  for (const [field, condition] of Object.entries(rule)) {
    const value = profile[field];

    for (const [operator, expected] of Object.entries(condition)) {
      switch (operator) {
        case 'eq':
          if (value !== expected) return false;
          break;
        case 'neq':
          if (value === expected) return false;
          break;
        case 'gt':
          if (value === undefined || value === null || Number(value) <= expected) return false;
          break;
        case 'gte':
          if (value === undefined || value === null || Number(value) < expected) return false;
          break;
        case 'lt':
          if (value === undefined || value === null || Number(value) >= expected) return false;
          break;
        case 'lte':
          if (value === undefined || value === null || Number(value) > expected) return false;
          break;
        case 'in':
          if (!Array.isArray(expected) || !expected.includes(value)) return false;
          break;
        case 'not_in':
          if (Array.isArray(expected) && expected.includes(value)) return false;
          break;
        default:
          return true;
      }
    }
  }
  return true;
};

// ════════════════════════════════════════════════════════════════
// Sinh checklist cá nhân hoá từ profile
// ════════════════════════════════════════════════════════════════
window.generatePersonalizedChecklist = function(visaType, profile) {
  const template = window.CHECKLIST_DATA[visaType];
  if (!template) return null;

  const result = {
    visaType: template.visaType,
    name: template.name,
    description: template.description,
    generatedAt: new Date().toISOString(),
    profile: { ...profile },
    modules: [],
    totalItems: 0,
    requiredItems: 0,
    recommendedItems: 0
  };

  let totalItems = 0;
  let requiredItems = 0;
  let recommendedItems = 0;

  for (const module of template.modules) {
    const filteredItems = module.items.filter(item => {
      return window.evaluateChecklistRule(item.rule, profile);
    });

    if (filteredItems.length === 0) continue; // Bỏ module không có item nào

    const moduleItems = filteredItems.map(item => ({
      id: item.id,
      name: item.name,
      description: item.description,
      documentType: item.documentType,
      required: item.required,
      recommended: item.recommended || false,
      hasAiAssist: item.hasAiAssist || false,
      source: item.source || 'user',
      warning: item.warning || null,
      link: item.link || null,
      status: 'pending', // pending | in_progress | completed | not_applicable
      note: ''
    }));

    totalItems += moduleItems.length;
    requiredItems += moduleItems.filter(i => i.required).length;
    recommendedItems += moduleItems.filter(i => i.recommended && !i.required).length;

    result.modules.push({
      id: module.id,
      name: module.name,
      icon: module.icon,
      description: module.description,
      required: module.required,
      items: moduleItems
    });
  }

  result.totalItems = totalItems;
  result.requiredItems = requiredItems;
  result.recommendedItems = recommendedItems;

  return result;
};

// ════════════════════════════════════════════════════════════════
// Tính % hoàn thành từ checklist đã generate
// ════════════════════════════════════════════════════════════════
window.calculateChecklistProgress = function(checklist) {
  if (!checklist || !checklist.modules) return 0;

  let completed = 0;
  let total = 0;

  for (const mod of checklist.modules) {
    for (const item of mod.items) {
      total++;
      if (item.status === 'completed' || item.status === 'not_applicable') {
        completed++;
      }
    }
  }

  return total === 0 ? 0 : Math.round((completed / total) * 100);
};

// ════════════════════════════════════════════════════════════════
// Lưu/Lấy checklist từ localStorage (cho phiên bản không auth)
// ════════════════════════════════════════════════════════════════
window.saveChecklistToLocal = function(key, data) {
  try {
    localStorage.setItem('checklist_' + key, JSON.stringify(data));
    return true;
  } catch (e) {
    console.warn('Không thể lưu checklist:', e);
    return false;
  }
};

window.loadChecklistFromLocal = function(key) {
  try {
    const data = localStorage.getItem('checklist_' + key);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    return null;
  }
};

window.loadProfileFromLocal = function() {
  try {
    const data = localStorage.getItem('checklist_profile');
    return data ? JSON.parse(data) : null;
  } catch (e) {
    return null;
  }
};

window.saveProfileToLocal = function(profile) {
  try {
    localStorage.setItem('checklist_profile', JSON.stringify(profile));
    return true;
  } catch (e) {
    console.warn('Không thể lưu profile:', e);
    return false;
  }
};
