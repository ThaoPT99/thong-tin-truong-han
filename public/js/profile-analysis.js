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
  const MIN_SAVINGS_D2 = 18000;

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
        result.risks.push('Rủi ro: Tuổi > 25 có thể bị ĐSQ xem xét kỹ hơn về mục đích du học.');
        result.actions.push('Cần giải trình rõ ràng: tại sao đi du học muộn, mục tiêu nghề nghiệp sau khi về nước.');
      } else if (age > RISKY_AGE) {
        result.weaknesses.push('Tuổi cao (' + age + ') — rủi ro cao bị từ chối visa.');
        result.risks.push('Rủi ro cao: Tuổi > ' + RISKY_AGE + ' dễ bị nghi ngờ mục đích du học.');
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
      result.risks.push('Rủi ro: Nam giới độc thân có tỉ lệ trượt visa cao hơn.');
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
        result.risks.push('Rủi ro: Khu vực ' + profile.region + ' thuộc vùng có tỉ lệ vi phạm visa cao.');
        result.actions.push('Cần tăng cường chứng minh tài chính và cam kết về nước nếu ở khu vực rủi ro.');
      }
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
        result.risks.push('Rủi ro: GPA thấp có thể bị ĐSQ đánh giá không đủ năng lực học tập.');
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
      result.risks.push('Rủi ro: Không có tiếng Hàn, khó thuyết phục ĐSQ về mục đích du học.');
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
      result.risks.push('Rủi ro: D-2 thường yêu cầu TOPIK 3+ — trình độ hiện tại chưa đáp ứng.');
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
        result.risks.push('Rủi ro: Gap > ' + MAX_GAP_YEARS + ' năm cần giải trình chi tiết và có chứng cứ kèm theo.');
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
        result.risks.push('Rủi ro: Không có HĐLĐ, ĐSQ có thể nghi ngờ tính xác thực của việc làm.');
        result.actions.push('Cần giấy xác nhận từ công ty (có dấu mộc) để thay thế HĐLĐ.');
        result.actions.push('Sao kê lương qua tài khoản ngân hàng cũng là chứng cứ hữu ích.');
      }
    } else if (profile.gapYears && profile.gapYears > 0.5) {
      // Gap nhưng ko đi làm
      result.weaknesses.push('Không có việc làm trong thời gian gap — cần giải trình cụ thể.');
      result.risks.push('Rủi ro: Gap không có việc làm dễ bị ĐSQ đánh giá thiếu mục đích.');
      result.actions.push('Giải trình rõ ràng: học thêm ngoại ngữ, chờ đủ điều kiện, lý do sức khỏe...');
      result.actions.push('Nếu có tham gia khóa học/kỹ năng mới — cung cấp chứng chỉ hoặc giấy xác nhận.');
    } else if (!profile.hasWorkExperience && !profile.gapYears) {
      result.strengths.push('Mới tốt nghiệp, chưa đi làm — không có gap year, hồ sơ gọn nhẹ.');
    }

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
      result.risks.push('Rủi ro: Thiếu tài chính là một trong những lý do trượt visa phổ biến nhất!');
      result.actions.push('Cần tăng sổ tiết kiệm lên tối thiểu ' + minSavings.toLocaleString() + ' USD.');
      result.actions.push('Nếu khó khăn: xem xét có người bảo lãnh tài chính (cha/mẹ/người thân).');
    } else {
      result.missingEvidence.push('Chưa khai báo số tiền sổ tiết kiệm.');
      result.actions.push('Cần mở sổ tiết kiệm tối thiểu ' + minSavings.toLocaleString() + ' USD — nên duy trì ít nhất 3 tháng trước khi nộp hồ sơ.');
    }

    // Người bảo lãnh
    if (profile.sponsorIsSelf === false) {
      result.weaknesses.push('Người bảo lãnh: ' + (profile.sponsorRelation === 'parent' ? 'Cha/Mẹ' : 'Người thân khác') + ' — cần thêm giấy tờ chứng minh quan hệ.');
      if (profile.sponsorRelation === 'other') {
        result.risks.push('Rủi ro: Bảo lãnh từ người thân khác (không phải cha/mẹ) thường bị ĐSQ xem xét kỹ hơn.');
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

    // Trượt visa
    if (profile.hasVisaRejection) {
      result.weaknesses.push('Đã từng trượt visa Hàn Quốc — yếu tố rủi ro lớn.');
      result.risks.push('Rủi ro cao: Hồ sơ trượt visa sẽ bị xem xét kỹ lưỡng hơn lần nộp lại.');
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
    } else {
      result.strengths.push('Chưa từng trượt visa Hàn Quốc — lịch sử nhập cảnh sạch.');
    }

    return result;
  }

  /**
   * 6. Gia đình — Người thân tại Hàn? Người thân bất hợp pháp?
   */
  function analyzeFamily(profile) {
    var result = { group: 'Gia đình', icon: '👨‍👩‍👧‍👧', strengths: [], weaknesses: [], risks: [], missingEvidence: [], actions: [] };

    // Người thân bất hợp pháp
    if (profile.hasIllegalRelative) {
      result.weaknesses.push('Có người thân ở lại Hàn Quốc bất hợp pháp — rủi ro rất cao.');
      result.risks.push('Rủi ro cực cao: Người thân bất hợp pháp hầu như chắc chắn bị từ chối visa.');
      result.actions.push('Cần khai báo trung thực trong đơn xin visa — nếu giấu sẽ bị cấm visa vĩnh viễn.');
      result.actions.push('Cần tư vấn riêng với chuyên viên — hồ sơ này cần xử lý đặc biệt.');
      result.actions.push('Cân nhắc: chọn trường ở khu vực khác, tăng cường tài chính, chứng minh ràng buộc Việt Nam mạnh.');
    }

    // Người thân tại Hàn
    if (profile.hasRelativeInKorea) {
      result.weaknesses.push('Có người thân đang sinh sống tại Hàn Quốc.');
      result.risks.push('Rủi ro: Có người thân tại Hàn dễ bị nghi ngờ có ý định ở lại.');
      result.actions.push('Khai báo rõ ràng mối quan hệ và tình trạng lưu trú của người thân.');
      result.actions.push('Trong Study Plan, nhấn mạnh cam kết về nước sau khi hoàn thành khóa học.');
    }

    // Cha/Mẹ bảo lãnh (đã xử lý ở finance, nhưng thêm gia đình)
    if (profile.sponsorIsSelf !== true && profile.sponsorRelation === 'parent') {
      if (profile.sponsorOccupation) {
        result.strengths.push('Cha/Mẹ bảo lãnh, nghề nghiệp: ' + profile.sponsorOccupation + ' — có thu nhập ổn định.');
      }
    }

    return result;
  }

  // ─── OVERALL ASSESSMENT ───

  function computeOverall(results) {
    var totalScore = 100;
    var riskCount = 0;
    var weaknessCount = 0;
    var strengthCount = 0;
    var missingCount = 0;
    var allActions = [];
    var allRisks = [];

    results.forEach(function(r) {
      weaknessCount += r.weaknesses.length;
      riskCount += r.risks.length;
      strengthCount += r.strengths.length;
      missingCount += r.missingEvidence.length;
      allActions = allActions.concat(r.actions);
      allRisks = allRisks.concat(r.risks);
    });

    // Trừ điểm dựa trên rủi ro
    totalScore -= riskCount * 10;
    totalScore -= weaknessCount * 5;
    totalScore += strengthCount * 3;
    totalScore = Math.max(0, Math.min(100, totalScore));

    // Phân hạng
    var level, color, label;
    if (totalScore >= 80) {
      level = 'low';
      color = '#059669';
      label = 'Hồ sơ tốt';
    } else if (totalScore >= 60) {
      level = 'medium';
      color = '#d97706';
      label = '⚠ Hồ sơ trung bình';
    } else if (totalScore >= 40) {
      level = 'high';
      color = '#dc2626';
      label = '⚠ Hồ sơ rủi ro';
    } else {
      level = 'critical';
      color = '#991b1b';
      label = 'Hồ sơ rủi ro cao';
    }

    // Quyết định sau phân tích
    var decisions = [];
    if (totalScore >= 70) {
      decisions.push('Có thể nhận hồ sơ và tiến hành làm thủ tục.');
    } else if (totalScore >= 50) {
      decisions.push('Có thể nhận nhưng cần bổ sung giấy tờ và giải trình.');
    } else {
      decisions.push('Cần tư vấn kỹ trước khi nhận hồ sơ.');
    }

    if (riskCount >= 3) {
      decisions.push('Cần xem xét đổi kỳ nhập học để có thêm thời gian chuẩn bị.');
    }
    if (weaknessCount >= 5) {
      decisions.push('Nên bổ sung thêm chứng chỉ tiếng Hàn (TOPIK) trước khi nộp.');
    }

    // Đề xuất hành động ưu tiên (top 3)
    var uniqueActions = [];
    allActions.forEach(function(a) {
      if (uniqueActions.indexOf(a) === -1) uniqueActions.push(a);
    });

    return {
      score: totalScore,
      level: level,
      color: color,
      label: label,
      decisions: decisions,
      topActions: uniqueActions.slice(0, 5),
      summary: {
        strengths: strengthCount,
        weaknesses: weaknessCount,
        risks: riskCount,
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

    // Tính overall
    var overall = computeOverall(groups);

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
