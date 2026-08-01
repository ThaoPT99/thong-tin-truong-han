// profile-analysis.js — Rule-based Profile Analysis Engine
// Phân tích hồ sơ học sinh theo 6 nhóm của KB_ANALYSIS_FRAMEWORK
// Kết quả: Điểm mạnh, Điểm yếu, Rủi ro, Chứng cứ thiếu, Hành động đề xuất

(function() {
  'use strict';

  // ─── Hằng số phân tích ───

  const MIN_GPA = 5.0;
  const GOOD_GPA = 7.0;
  const MAX_GAP_YEARS = 2;
  const RISKY_AGE = 28;
  const MIN_SAVINGS_D41 = 10000;
  const MIN_SAVINGS_D2 = 15000;

  // ─── Risk weights: mỗi rủi ro có mức độ ảnh hưởng khác nhau ───
  const RISK_WEIGHT = {
    critical: 30,  // Người thân bất hợp pháp, trượt visa + tài chính yếu
    high: 20,      // Tuổi > 35, không tiếng Hàn + D-2, sổ TK < 50%
    medium: 10,    // Tuổi 28-35, GPA thấp, gap > 2 năm, sổ TK thiếu
    low: 5         // Gap 1-2 năm, nam giới, sổ TK mới, không HĐLĐ
  };

  // ─── Deal-breakers: nếu có → auto ĐỎ ───
  function checkDealBreakers(profile) {
    var reasons = [];
    if (profile.hasIllegalRelative === true) {
      reasons.push('Có người thân ở lại Hàn Quốc bất hợp pháp — gần như chắc chắn bị từ chối visa.');
    }
    if (profile.hasVisaRejection === true && profile.age > 28) {
      reasons.push('Đã trượt visa + tuổi cao (' + profile.age + ') — hồ sơ rủi ro rất cao.');
    }
    if (profile.hasVisaRejection === true && profile.savingsAmount < getMinSavings(profile.visaType)) {
      reasons.push('Đã trượt visa + tài chính yếu — cần tư vấn đặc biệt.');
    }
    if (profile.age && profile.age > 35) {
      reasons.push('Tuổi trên 35 — khả năng đậu visa rất thấp, cần tư vấn riêng.');
    }
    if (profile.hasVisaRejection === true && profile.gapYears && profile.gapYears > 2) {
      reasons.push('Trượt visa + gap dài — hồ sơ cần xử lý đặc biệt.');
    }
    return reasons.length > 0 ? reasons : null;
  }

  // ─── Helper ───

  function label(profile, field, fallback) {
    var v = profile[field];
    if (v === null || v === undefined || v === '') return fallback || 'Chưa rõ';
    if (field === 'educationLevel') return v === 'university' ? 'Đại học/Cao đẳng' : 'THPT';
    if (field === 'gender') return v === 'male' ? 'Nam' : v === 'female' ? 'Nữ' : v;
    if (field === 'koreanLevel') {
      var map = { none: 'Chưa học', beginner: 'Mới bắt đầu', sejong2b: 'Sejong 2B', topik1: 'TOPIK 1', topik2: 'TOPIK 2', topik3: 'TOPIK 3', topik4: 'TOPIK 4+' };
      return map[v] || v;
    }
    if (field === 'sponsorRelation') return v === 'parent' ? 'Cha/Mẹ' : v === 'other' ? 'Người thân' : 'Tự thân';
    return v;
  }

  function getAge(profile) {
    if (profile.dateOfBirth) {
      var birth = new Date(profile.dateOfBirth);
      var diff = new Date() - birth;
      return Math.floor(diff / 31557600000);
    }
    return profile.age || null;
  }

  function getMinSavings(visaType) {
    var map = { 'D-4-1': MIN_SAVINGS_D41, 'D-2': MIN_SAVINGS_D2, 'D4-to-D2': MIN_SAVINGS_D41 };
    return map[visaType || 'D-4-1'] || MIN_SAVINGS_D41;
  }

  function levelToScore(level) {
    var map = { none: 0, beginner: 10, sejong2b: 20, topik1: 30, topik2: 40, topik3: 50, topik4: 60 };
    return map[level] || 0;
  }

  // ─── 6 NHÓM PHÂN TÍCH ───

  /**
   * 1. Nhân thân — Tuổi, giới tính, quê quán, tình trạng hôn nhân
   */
  function analyzePersonal(profile) {
    var result = { group: 'Nhân thân', strengths: [], weaknesses: [], risks: [], missingEvidence: [], actions: [] };
    var age = getAge(profile);
    var gender = profile.gender;

    // Tuổi
    if (age !== null) {
      if (age >= 18 && age <= 25) {
        result.strengths.push('Tuổi phù hợp với du học (' + age + ' tuổi) — độ tuổi lý tưởng cho visa Hàn Quốc.');
      } else if (age > 25 && age <= RISKY_AGE) {
        result.weaknesses.push('Tuổi ' + age + ' — hơi cao so với mặt bằng du học sinh Hàn Quốc. Cần lý do du học hợp lý.');
        result.risks.push({ text: 'Rủi ro: Tuổi ' + age + ' có thể bị ĐSQ xem xét kỹ hơn về mục đích du học.', level: 'medium' });
        result.actions.push('Cần giải trình rõ ràng: tại sao đi du học muộn, mục tiêu nghề nghiệp sau khi về nước.');
      } else if (age > RISKY_AGE) {
        result.weaknesses.push('Tuổi cao (' + age + ') — rủi ro cao bị từ chối visa.');
        result.risks.push({ text: 'Rủi ro cao: Tuổi > ' + RISKY_AGE + ' dễ bị nghi ngờ mục đích du học.', level: 'high' });
        result.actions.push('Cần giải trình cụ thể: lộ trình học tập, cam kết về nước, kế hoạch nghề nghiệp rõ ràng.');
        result.actions.push('Nên chọn trường phù hợp với độ tuổi — tránh trường có yêu cầu khắt khe về tuổi.');
      }
    } else {
      result.missingEvidence.push('Chưa có thông tin ngày sinh/ tuổi — cần bổ sung.');
      result.actions.push('Khai báo ngày sinh để đánh giá độ tuổi.');
    }

    // Giới tính
    if (gender === 'male') {
      result.weaknesses.push('Nam giới — tỉ lệ đậu visa thường thấp hơn nữ do rủi ro bỏ trốn/lao động bất hợp pháp cao hơn.');
      result.risks.push({ text: 'Rủi ro: Nam giới độc thân có tỉ lệ trượt visa cao hơn.', level: 'low' });
      result.actions.push('Cần chứng minh mạnh mẽ: tài chính vững, việc làm ổn định tại Việt Nam, cam kết về nước.');
    } else if (gender === 'female') {
      result.strengths.push('Nữ giới — tỉ lệ đậu visa thường cao hơn nam.');
    }

    // Khu vực
    if (profile.region) {
      var highRiskRegions = ['nghe an', 'ha tinh', 'quang binh', 'thai binh', 'hai duong', 'bac giang'];
      var regionLower = (profile.region || '').toLowerCase();
      var isHighRisk = highRiskRegions.some(function(r) { return regionLower.indexOf(r) !== -1; });
      if (isHighRisk) {
        result.risks.push({ text: 'Rủi ro: Khu vực ' + profile.region + ' thuộc vùng có tỉ lệ vi phạm visa cao.', level: 'medium' });
        result.actions.push('Cần tăng cường chứng minh tài chính và cam kết về nước nếu ở khu vực rủi ro.');
      }
    }

    // Vùng lãnh sự (Consular Region)
    if (profile.consularRegion) {
      if (profile.consularRegion === 'kvac_hanoi') {
        result.strengths.push('Nộp hồ sơ tại KVAC Hà Nội — quy trình quen thuộc, thời gian xử lý 13-20 ngày làm việc.');
        result.actions.push('Đến KVAC Hà Nội (Tầng 12, Discovery Complex, 302 Cầu Giấy, phường Cầu Giấy) trong giờ làm việc 08:00-16:30. KVAC HN đã dừng đặt lịch online từ 06/04/2026 — đến trực tiếp lấy số thứ tự.');
        result.actions.push('Khám lao phổi tại BV Phổi Trung ương (Hoàng Hoa Thám, Hà Nội).');
        // Nếu khu vực rủi ro + KVAC Hà Nội = cảnh báo kép
        if (profile.region) {
          var rl = (profile.region || '').toLowerCase();
          var hr = ['nghe an', 'ha tinh', 'quang binh', 'thai binh', 'hai duong', 'bac giang'];
          var inHighRisk = hr.some(function(r) { return rl.indexOf(r) !== -1; });
          if (inHighRisk) {
            result.risks.push({ text: 'Rủi ro: Ở khu vực rủi ro cao và nộp tại KVAC Hà Nội — hồ sơ sẽ bị soi kỹ. Cần chuẩn bị tài chính thật vững.', level: 'medium' });
          }
        }
      } else if (profile.consularRegion === 'lsq_hcm') {
        result.strengths.push('Nộp hồ sơ tại LSQ Hàn Quốc TP.HCM — tỉ lệ đậu visa thường cao hơn KVAC Hà Nội.');
        result.actions.push('Đặt lịch hẹn LSQ TP.HCM (địa chỉ: 107 Nguyễn Du, Quận 1).');
        result.actions.push('Khám lao phổi tại bệnh viện ĐSQ chỉ định: Phước An (HEPA), ĐH Y Dược, Sante, Quốc tế Sài Gòn (TP.HCM) — kiểm tra danh sách mới trên website KVAC.');
      }
    } else {
      result.missingEvidence.push('Chưa chọn vùng lãnh sự (KVAC Hà Nội / LSQ TP.HCM).');
      result.actions.push('Chọn vùng lãnh sự phù hợp với nơi cư trú: KVAC Hà Nội (từ Huế trở ra) hoặc LSQ TP.HCM (miền Nam).');
    }

    return result;
  }

  /**
   * 2. Học vấn — Trình độ, GPA, năm tốt nghiệp, TOPIK, IELTS
   */
  function analyzeEducation(profile) {
    var result = { group: 'Học vấn', strengths: [], weaknesses: [], risks: [], missingEvidence: [], actions: [] };
    var gpa = profile.gpa;
    var koreanLevel = profile.koreanLevel;
    var visaType = profile.visaType || 'D-4-1';

    // GPA
    if (gpa !== null && gpa !== undefined && gpa > 0) {
      if (gpa >= GOOD_GPA) {
        result.strengths.push('GPA ' + gpa + '/10 — mức tốt, thể hiện năng lực học tập vững vàng.');
      } else if (gpa >= MIN_GPA) {
        result.weaknesses.push('GPA ' + gpa + '/10 — ở mức trung bình, không phải điểm mạnh.');
      } else {
        result.weaknesses.push('GPA ' + gpa + '/10 — thấp hơn mức khuyến nghị (' + MIN_GPA + '+).');
        result.risks.push({ text: 'Rủi ro: GPA thấp có thể bị ĐSQ đánh giá không đủ năng lực học tập.', level: 'medium' });
        result.actions.push('Cần thư giới thiệu từ giáo viên để bù đắp cho GPA thấp.');
        result.actions.push('Chọn trường có yêu cầu đầu vào không quá cao về GPA.');
      }
    } else {
      result.missingEvidence.push('Chưa có GPA — cần bổ sung bảng điểm THPT.');
    }

    // Tiếng Hàn
    var kScore = levelToScore(koreanLevel);
    if (kScore >= 40) {
      result.strengths.push('Trình độ tiếng Hàn ' + label(profile, 'koreanLevel') + ' — lợi thế lớn cho visa và học tập.');
    } else if (kScore >= 20) {
      result.weaknesses.push('Trình độ tiếng Hàn ' + label(profile, 'koreanLevel') + ' — cần cải thiện thêm.');
      result.actions.push('Nên học lên TOPIK 2+ trước khi sang Hàn để tăng tỉ lệ đậu visa.');
    } else {
      result.weaknesses.push('Chưa có tiếng Hàn — điểm yếu lớn trong hồ sơ.');
      result.risks.push({ text: 'Rủi ro: Không có tiếng Hàn, khó thuyết phục ĐSQ về mục đích du học.', level: 'medium' });
      result.actions.push('Tham gia khóa học Sejong 2B trước khi nộp hồ sơ.');
      result.actions.push('Có chứng chỉ TOPIK sẽ tăng đáng kể tỉ lệ đậu visa.');
    }

    // TOPIK chứng chỉ
    if (profile.hasTopik && profile.topikGrade) {
      result.strengths.push('Đã có chứng chỉ TOPIK ' + profile.topikGrade + ' — minh chứng rõ ràng về năng lực tiếng Hàn.');
    } else if (koreanLevel && koreanLevel !== 'none') {
      result.missingEvidence.push('Chưa có chứng chỉ TOPIK — nên thi để có minh chứng chính thức.');
    }

    // D-2 yêu cầu TOPIK 3+
    if (visaType === 'D-2' && kScore < 50) {
      result.risks.push({ text: 'Rủi ro: D-2 thường yêu cầu TOPIK 3+ — trình độ hiện tại chưa đáp ứng.', level: 'high' });
      result.actions.push('Cần kiểm tra kỹ điều kiện đầu vào tiếng Hàn của trường dự định.');
      result.actions.push('Nếu chưa đủ TOPIK 3, cân nhắc học tiếng trước (D-4-1) trước khi xin D-2.');
    }

    // IELTS
    if (profile.ieltsScore && profile.ieltsScore >= 5.5) {
      result.strengths.push('IELTS ' + profile.ieltsScore + ' — lợi thế cho visa D-2 và các chương trình tiếng Anh.');
    }

    // Gap year
    if (profile.gapYears && profile.gapYears > 0.5) {
      if (profile.gapYears <= MAX_GAP_YEARS) {
        result.weaknesses.push('Gap ' + profile.gapYears + ' năm — khoảng trống cần giải trình.');
        result.actions.push('Cần viết giải trình khoảng trống thời gian — nêu rõ đã làm gì trong thời gian này.');
      } else {
        result.weaknesses.push('Gap ' + profile.gapYears + ' năm — khoảng trống dài, rủi ro cao.');
        result.risks.push({ text: 'Rủi ro: Gap > ' + MAX_GAP_YEARS + ' năm cần giải trình chi tiết và có chứng cứ kèm theo.', level: 'medium' });
        result.actions.push('Cần giải trình gap + xác nhận công việc (HĐLĐ, chứng chỉ, giấy tờ).');
        result.actions.push('Nếu có đi làm trong gap — cung cấp HĐLĐ, BHXH, sao kê lương để minh chứng.');
      }
    }

    // Thư giới thiệu
    if (visaType === 'D-2' && !profile.hasRecommendation) {
      result.missingEvidence.push('D-2 cần 2 thư giới thiệu từ giáo viên — chưa có.');
      result.actions.push('Liên hệ giáo viên cũ để xin thư giới thiệu sớm (cần 2 thư cho D-2).');
    }

    return result;
  }

  /**
   * 3. Kinh nghiệm làm việc — Đã đi làm? HĐLĐ? BHXH?
   */
  function analyzeWork(profile) {
    var result = { group: 'Kinh nghiệm', strengths: [], weaknesses: [], risks: [], missingEvidence: [], actions: [] };

    if (profile.hasWorkExperience) {
      // Có kinh nghiệm làm việc
      if (profile.workCompany && profile.workDuration && profile.workDuration >= 1) {
        result.strengths.push('Đã đi làm ' + profile.workDuration + ' năm tại ' + (profile.workCompany || 'công ty') + (profile.workPosition ? ' (vị trí ' + profile.workPosition + ')' : '') + ' — thể hiện sự ổn định.');
      }

      if (profile.hasLaborContract) {
        result.strengths.push('Có HĐLĐ/BHXH — minh chứng việc làm rõ ràng, tăng độ tin cậy.');
      } else {
        result.weaknesses.push('Đã đi làm nhưng không có HĐLĐ chính thức — thiếu minh chứng.');
        result.risks.push({ text: 'Rủi ro: Không có HĐLĐ, ĐSQ có thể nghi ngờ tính xác thực của việc làm.', level: 'low' });
        result.actions.push('Cần giấy xác nhận từ công ty (có dấu mộc) để thay thế HĐLĐ.');
        result.actions.push('Sao kê lương qua tài khoản ngân hàng cũng là chứng cứ hữu ích.');
      }
    } else if (profile.gapYears && profile.gapYears > 0.5) {
      // Gap nhưng ko đi làm
      result.weaknesses.push('Không có việc làm trong thời gian gap — cần giải trình cụ thể.');
      result.risks.push({ text: 'Rủi ro: Gap không có việc làm dễ bị ĐSQ đánh giá thiếu mục đích.', level: 'medium' });
      result.actions.push('Giải trình rõ ràng: học thêm ngoại ngữ, chờ đủ điều kiện, lý do sức khỏe...');
      result.actions.push('Nếu có tham gia khóa học/kỹ năng mới — cung cấp chứng chỉ hoặc giấy xác nhận.');
    } else if (profile.hasWorkExperience === false && (!profile.gapYears || profile.gapYears <= 0.5)) {
      // Chỉ thêm điểm mạnh khi user đã khai báo rõ là chưa đi làm VÀ không có gap (hoặc gap rất nhỏ)
      result.strengths.push('Chưa đi làm, không có gap year — hồ sơ gọn nhẹ, không cần giải trình khoảng trống.');
    }
    // Nếu chưa khai báo gì về work/gap → không thêm điểm mạnh giả

    // D-2: Kinh nghiệm làm việc liên quan ngành học
    if (profile.hasWorkExperience && profile.chosenMajor && profile.workPosition) {
      var isRelevant = profile.workPosition.toLowerCase().indexOf(profile.chosenMajor.toLowerCase().slice(0, 5)) !== -1;
      if (isRelevant) {
        result.strengths.push('Kinh nghiệm làm việc liên quan đến ngành dự định học — điểm cộng cho visa D-2.');
      }
    }

    return result;
  }

  /**
   * 4. Tài chính — Người bảo trợ, thu nhập, sổ tiết kiệm
   */
  function analyzeFinance(profile) {
    var result = { group: 'Tài chính', strengths: [], weaknesses: [], risks: [], missingEvidence: [], actions: [] };
    var visaType = profile.visaType || 'D-4-1';
    var minSavings = getMinSavings(visaType);
    var savings = profile.savingsAmount || 0;

    // Sổ tiết kiệm
    if (savings >= minSavings * 1.5) {
      result.strengths.push('Sổ tiết kiệm ' + savings.toLocaleString() + ' USD — vượt mức tối thiểu (' + minSavings.toLocaleString() + ' USD), tài chính vững.');
    } else if (savings >= minSavings) {
      result.weaknesses.push('Sổ tiết kiệm ' + savings.toLocaleString() + ' USD — đủ mức tối thiểu (' + minSavings.toLocaleString() + ' USD) nhưng không dư dả.');
    } else if (savings > 0) {
      result.weaknesses.push('Sổ tiết kiệm ' + savings.toLocaleString() + ' USD — dưới mức tối thiểu ' + minSavings.toLocaleString() + ' USD cho ' + visaType + '.');
      result.risks.push({ text: 'Rủi ro: Thiếu tài chính là một trong những lý do trượt visa phổ biến nhất!', level: 'high' });
      result.actions.push('Cần tăng sổ tiết kiệm lên tối thiểu ' + minSavings.toLocaleString() + ' USD.');
      result.actions.push('Nếu khó khăn: xem xét có người bảo lãnh tài chính (cha/mẹ/người thân).');
    } else {
      result.missingEvidence.push('Chưa khai báo số tiền sổ tiết kiệm.');
      result.actions.push('Cần mở sổ tiết kiệm tối thiểu ' + minSavings.toLocaleString() + ' USD — nên duy trì ít nhất 3 tháng trước khi nộp hồ sơ.');
    }

    // Tương quan thu nhập vs sổ tiết kiệm
    var monthlyIncome = profile.monthlyIncome || 0;
    if (savings > 0 && monthlyIncome > 0) {
      var incomeRatio = savings / monthlyIncome;
      if (incomeRatio > 24) {
        result.weaknesses.push('Sổ tiết kiệm gấp ' + Math.round(incomeRatio) + ' tháng thu nhập (' + monthlyIncome.toLocaleString() + ' USD/tháng) — tỉ lệ bất thường, cần giải trình nguồn gốc rõ ràng.');
        result.risks.push({ text: 'Rủi ro: Sổ tiết kiệm quá lớn so với thu nhập, ĐSQ sẽ nghi ngờ tiền đi mượn.', level: 'medium' });
        result.actions.push('Cần giải trình nguồn gốc: tích luỹ nhiều năm, bán tài sản, thừa kế hoặc hỗ trợ từ người thân — phải có giấy tờ chứng minh.');
      } else if (incomeRatio > 12) {
        result.weaknesses.push('Sổ tiết kiệm gấp ' + Math.round(incomeRatio) + ' tháng thu nhập — hơi cao, nên chuẩn bị giải trình nguồn gốc.');
        result.actions.push('Chuẩn bị giải trình tích luỹ hoặc giấy tờ bán tài sản/thừa kế nếu có.');
      } else {
        result.strengths.push('Sổ tiết kiệm tương xứng với thu nhập (' + Math.round(incomeRatio) + ' tháng lương) — tài chính hợp lý, dễ giải trình.');
      }
    } else if (savings > 0 && monthlyIncome <= 0) {
      result.missingEvidence.push('Chưa khai báo thu nhập hàng tháng — không thể đánh giá tương quan với sổ tiết kiệm.');
      result.actions.push('Khai báo thu nhập gia đình để hệ thống kiểm tra tương quan tài chính.');
    }

    // Sổ tiết kiệm thời gian duy trì
    if (profile.savingsDurationMonths !== null && profile.savingsDurationMonths !== undefined) {
      if (profile.savingsDurationMonths >= 6) {
        result.strengths.push('Sổ tiết kiệm đã duy trì ' + profile.savingsDurationMonths + ' tháng — thời gian đủ dài, tạo độ tin cậy.');
      } else if (profile.savingsDurationMonths >= 3) {
        result.weaknesses.push('Sổ tiết kiệm mới duy trì ' + profile.savingsDurationMonths + ' tháng — đạt mức tối thiểu nhưng chưa lý tưởng. Nên giữ thêm nếu có thời gian.');
        result.actions.push('Nếu còn thời gian, giữ sổ thêm 1-3 tháng nữa trước khi nộp để tăng độ tin cậy.');
      } else if (profile.savingsDurationMonths > 0) {
        result.weaknesses.push('Sổ tiết kiệm mới chỉ duy trì ' + profile.savingsDurationMonths + ' tháng — rủi ro bị ĐSQ nghi ngờ tiền "nóng".');
        result.risks.push({ text: 'Rủi ro: Sổ tiết kiệm mới mở < 3 tháng là dấu hiệu của "tiền đi mượn" hoặc "nạp sốc".', level: 'low' });
        result.actions.push('Tuyệt đối không nộp sổ mới mở < 3 tháng. Nên chờ ít nhất 3 tháng hoặc dùng kỹ thuật built-up.');
      }
    }

    // Người bảo lãnh
    if (profile.sponsorIsSelf === false) {
      result.weaknesses.push('Người bảo lãnh: ' + (profile.sponsorRelation === 'parent' ? 'Cha/Mẹ' : 'Người thân khác') + ' — cần thêm giấy tờ chứng minh quan hệ.');
      if (profile.sponsorRelation === 'other') {
        result.risks.push({ text: 'Rủi ro: Bảo lãnh từ người thân khác (không phải cha/mẹ) thường bị ĐSQ xem xét kỹ hơn.', level: 'medium' });
      }
      result.missingEvidence.push('Cần giấy tờ chứng minh quan hệ với người bảo lãnh (giấy khai sinh, sổ hộ khẩu).');
      result.missingEvidence.push('Cần giấy tờ chứng minh thu nhập của người bảo lãnh.');
      result.actions.push('Công chứng giấy tờ quan hệ gia đình (giấy khai sinh, hộ khẩu).');
      result.actions.push('Thu thập: HĐLĐ, sao kê lương, xác nhận thu nhập của người bảo lãnh.');

      if (profile.sponsorName) {
        result.strengths.push('Đã có thông tin người bảo lãnh: ' + profile.sponsorName + (profile.sponsorOccupation ? ' (' + profile.sponsorOccupation + ')' : ''));
      }
    } else if (profile.sponsorIsSelf === true) {
      result.strengths.push('Tự bảo lãnh tài chính — không cần giấy tờ quan hệ hay chứng minh thu nhập người thân.');
      result.actions.push('Cần chứng minh nguồn gốc sổ tiết kiệm (sao kê tài khoản, giấy xác nhận số dư).');
    }

    return result;
  }

  /**
   * 5. Lịch sử nhập cảnh — Đã từng xin visa? Trượt visa? Xuất cảnh?
   */
  function analyzeImmigration(profile) {
    var result = { group: 'Nhập cảnh', strengths: [], weaknesses: [], risks: [], missingEvidence: [], actions: [] };

    // Trượt visa — chỉ đánh giá khi đã được khai báo rõ ràng
    if (profile.hasVisaRejection === true) {
      result.weaknesses.push('Đã từng trượt visa Hàn Quốc — yếu tố rủi ro lớn.');
      result.risks.push({ text: 'Rủi ro cao: Hồ sơ trượt visa sẽ bị xem xét kỹ lưỡng hơn lần nộp lại.', level: 'high' });
      result.missingEvidence.push('Cần hồ sơ visa cũ (bản photo) để đối chiếu.');
      result.missingEvidence.push('Cần giải trình lý do trượt visa và cách đã khắc phục.');
      result.actions.push('Phân tích nguyên nhân trượt cụ thể: tài chính? Study Plan? Thiếu giấy tờ?');
      result.actions.push('Viết giải trình trượt visa — cam kết hồ sơ lần này đã hoàn chỉnh hơn.');
      result.actions.push('Chờ tối thiểu 3 tháng kể từ ngày bị từ chối trước khi nộp lại.');

      if (profile.rejectionReason) {
        result.actions.push('Nguyên nhân trượt đã biết: "' + profile.rejectionReason + '" — tập trung khắc phục chính yếu tố này.');
      } else {
        result.actions.push('Liên hệ KVAC/ĐSQ để biết lý do trượt nếu chưa rõ.');
      }
    } else if (profile.hasVisaRejection === false) {
      result.strengths.push('Chưa từng trượt visa Hàn Quốc — lịch sử nhập cảnh sạch.');
    }
    // Nếu hasVisaRejection chưa được khai báo (undefined) → bỏ qua, không thêm điểm mạnh giả

    return result;
  }

  /**
   * 6. Gia đình — Người thân tại Hàn? Người thân bất hợp pháp?
   */
  function analyzeFamily(profile) {
    var result = { group: 'Gia đình', strengths: [], weaknesses: [], risks: [], missingEvidence: [], actions: [] };

    // Người thân bất hợp pháp
    if (profile.hasIllegalRelative) {
      result.weaknesses.push('Có người thân ở lại Hàn Quốc bất hợp pháp — rủi ro rất cao.');
      result.risks.push({ text: 'Rủi ro cực cao: Người thân bất hợp pháp hầu như chắc chắn bị từ chối visa.', level: 'critical' });
      result.actions.push('Cần khai báo trung thực trong đơn xin visa — nếu giấu sẽ bị cấm visa vĩnh viễn.');
      result.actions.push('Cần tư vấn riêng với chuyên viên — hồ sơ này cần xử lý đặc biệt.');
      result.actions.push('Cân nhắc: chọn trường ở khu vực khác, tăng cường tài chính, chứng minh ràng buộc Việt Nam mạnh.');
    }

    // Người thân tại Hàn
    if (profile.hasRelativeInKorea) {
      result.weaknesses.push('Có người thân đang sinh sống tại Hàn Quốc.');
      result.risks.push({ text: 'Rủi ro: Có người thân tại Hàn dễ bị nghi ngờ có ý định ở lại.', level: 'medium' });
      result.actions.push('Khai báo rõ ràng mối quan hệ và tình trạng lưu trú của người thân.');
      result.actions.push('Trong Study Plan, nhấn mạnh cam kết về nước sau khi hoàn thành khóa học.');
    }

    // Cha/Mẹ bảo lãnh (đã xử lý ở finance, nhưng thêm gia đình)
    if (profile.sponsorIsSelf === false && profile.sponsorRelation === 'parent') {
      if (profile.sponsorOccupation) {
        result.strengths.push('Cha/Mẹ bảo lãnh, nghề nghiệp: ' + profile.sponsorOccupation + ' — có thu nhập ổn định.');
      }
    }

    return result;
  }

  // ─── OVERALL ASSESSMENT ───
  // Công thức mới: base=50, điểm mạnh +5, yếu -3, thiếu -2, rủi ro theo weight (5-30)
  // Deal-breaker → auto ĐỎ (score=15)
  // Risk levels: 🟢 Xanh (>=70), 🟡 Vàng (50-69), 🟠 Cam (25-49), 🔴 Đỏ (<25)

  function computeOverall(results, profile) {
    var weightedRiskTotal = 0;
    var weaknessCount = 0;
    var strengthCount = 0;
    var missingCount = 0;
    var allActions = [];
    var allRisks = [];

    results.forEach(function(r) {
      weaknessCount += r.weaknesses.length;
      strengthCount += r.strengths.length;
      missingCount += r.missingEvidence.length;
      allActions = allActions.concat(r.actions);
      // Duyệt từng risk — tính weighted score
      r.risks.forEach(function(risk) {
        var level = risk.level || 'medium';
        weightedRiskTotal += RISK_WEIGHT[level] || 10;
        allRisks.push(risk.text || risk);
      });
    });

    // Kiểm tra deal-breaker trước — nếu có → auto ĐỎ
    var dealBreakers = checkDealBreakers(profile);
    var hasDealBreaker = dealBreakers !== null;

    // Tính score: base=50
    var totalScore = 50;
    totalScore += strengthCount * 5;
    totalScore -= weightedRiskTotal;
    totalScore -= weaknessCount * 3;
    totalScore -= missingCount * 2;
    totalScore = Math.max(0, Math.min(100, totalScore));

    // Nếu có deal-breaker → ghi đè score xuống 15
    if (hasDealBreaker) {
      totalScore = Math.min(totalScore, 15);
    }

    // Phân hạng mới: 🟢 🟡 🟠 🔴
    var level, color, label, icon;
    if (hasDealBreaker) {
      level = 'critical';
      color = '#991b1b';
      label = '🔴 Hồ sơ rủi ro cao';
      icon = '🔴';
    } else if (totalScore >= 70) {
      level = 'low';
      color = '#059669';
      label = '🟢 Hồ sơ ổn';
      icon = '🟢';
    } else if (totalScore >= 50) {
      level = 'medium';
      color = '#ca8a04';
      label = '🟡 Hồ sơ cần bổ sung';
      icon = '🟡';
    } else if (totalScore >= 25) {
      level = 'high';
      color = '#dc2626';
      label = '🟠 Hồ sơ rủi ro trung bình';
      icon = '🟠';
    } else {
      level = 'critical';
      color = '#991b1b';
      label = '🔴 Hồ sơ rủi ro cao';
      icon = '🔴';
    }

    // Quyết định dựa trên risk level
    var decisions = [];
    if (hasDealBreaker) {
      decisions = decisions.concat(dealBreakers);
      decisions.push('⚠ CẦN TƯ VẤN ĐẶC BIỆT: Hồ sơ có yếu tố rủi ro nghiêm trọng.');
    } else if (totalScore >= 70) {
      decisions.push('Có thể nhận hồ sơ và tiến hành làm thủ tục.');
    } else if (totalScore >= 50) {
      decisions.push('Có thể nhận nhưng cần bổ sung giấy tờ và giải trình.');
    } else {
      decisions.push('Cần tư vấn kỹ trước khi nhận hồ sơ.');
    }

    if (weightedRiskTotal >= 30) {
      decisions.push('Cần xem xét đổi kỳ nhập học để có thêm thời gian chuẩn bị.');
    }

    // Đề xuất hành động ưu tiên (top 5)
    var uniqueActions = [];
    allActions.forEach(function(a) {
      if (uniqueActions.indexOf(a) === -1) uniqueActions.push(a);
    });

    return {
      score: totalScore,
      level: level,
      color: color,
      label: label,
      icon: icon,
      hasDealBreaker: hasDealBreaker,
      dealBreakers: dealBreakers,
      decisions: decisions,
      topActions: uniqueActions.slice(0, 5),
      summary: {
        strengths: strengthCount,
        weaknesses: weaknessCount,
        risks: allRisks.length,
        missing: missingCount
      }
    };
  }

  // ─── MAIN: analyzeStudentProfile ───

  /**
   * Phân tích toàn diện hồ sơ học sinh theo 6 nhóm
   * @param {Object} profile — hồ sơ học sinh
   * @returns {Object} kết quả phân tích
   */
  window.analyzeStudentProfile = function(profile) {
    // Chỉ phân tích khi đã đăng nhập
    if (!localStorage.getItem('student_token')) {
      return { error: 'Vui lòng đăng nhập để xem phân tích hồ sơ.', requireLogin: true };
    }

    if (!profile || typeof profile !== 'object') {
      return { error: 'Không có hồ sơ để phân tích.' };
    }

    var p = profile;
    var visaType = p.visaType || 'D-4-1';

    // Phân tích từng nhóm
    var groups = [
      analyzePersonal(p),
      analyzeEducation(p),
      analyzeWork(p),
      analyzeFinance(p),
      analyzeImmigration(p),
      analyzeFamily(p)
    ];

    // Tính overall (weighted risks + deal-breaker)
    var overall = computeOverall(groups, p);

    return {
      visaType: visaType,
      analyzedAt: new Date().toISOString(),
      groups: groups,
      overall: overall
    };
  };

  // ─── Analyze with DeepSeek AI (action=profile-analysis) ───

  /**
   * Gọi AI để phân tích hồ sơ sâu hơn, bổ sung cho rule-based engine
   * @param {Object} profile — hồ sơ học sinh
   * @returns {Promise<Object>} kết quả phân tích từ AI
   */
  window.analyzeWithAI = async function(profile) {
    if (!profile || typeof profile !== 'object') {
      return { error: 'Không có hồ sơ để phân tích.' };
    }

    try {
      var res = await fetch('/api/deepseek?action=profile-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile: profile }),
      });
      var data = await res.json();

      if (data.success && data.analysis) {
        return data.analysis;
      } else if (data.success && data.rawAnalysis) {
        // Fallback: trả về text raw nếu JSON parse thất bại
        return { rawText: data.rawAnalysis };
      } else {
        return { error: data.error || 'AI không phản hồi.' };
      }
    } catch (err) {
      console.error('AI analysis error:', err);
      return { error: 'Mất kết nối. Vui lòng thử lại.' };
    }
  };

  // ─── Helper: Escape HTML (dùng chung) ───
  window.escapeHtml = window.escapeHtml || function(str) {
    var d = document.createElement('div');
    d.textContent = String(str || '');
    return d.innerHTML;
  };

})();
