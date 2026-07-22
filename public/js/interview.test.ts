import { describe, it, expect, vi, beforeAll } from 'vitest';

// Simulate interview scoring logic
function simulateInterviewScore(answers: { question: string; answer: string }[]) {
  let totalScore = 0;
  const feedback: string[] = [];

  for (const qa of answers) {
    const ans = (qa.answer || '').toLowerCase().trim();
    let score = 0;
    
    if (ans.length > 100) { score += 3; feedback.push('Câu trả lời chi tiết'); }
    else if (ans.length > 50) { score += 2; feedback.push('Câu trả lời khá'); }
    else if (ans.length > 20) { score += 1; feedback.push('Câu trả lời ngắn'); }
    else { feedback.push('Câu trả lời quá ngắn, cần chi tiết hơn'); }

    if (ans.includes('hàn quốc') || ans.includes('korea')) score += 1;
    if (ans.includes('học tập') || ans.includes('study')) score += 1;
    if (ans.includes('visa')) score += 1;

    totalScore += score;
  }

  const maxScore = answers.length * 6;
  const percent = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;
  
  let label = 'Chưa đánh giá';
  if (percent >= 80) label = 'Xuất sắc';
  else if (percent >= 60) label = 'Khá tốt';
  else if (percent >= 40) label = 'Tạm ổn';
  else label = 'Cần cải thiện';

  return { score: percent, label, feedback, totalAnswers: answers.length };
}

const sampleQuestions = [
  'Tại sao bạn chọn Hàn Quốc để du học?',
  'Kế hoạch học tập của bạn là gì?',
  'Ai bảo lãnh tài chính cho bạn?',
  'Sau khi tốt nghiệp bạn định làm gì?',
];

describe('Interview Engine', () => {
  it('should have at least 4 sample questions', () => {
    expect(sampleQuestions.length).toBeGreaterThanOrEqual(4);
  });

  it('should score well for detailed answers', () => {
    const result = simulateInterviewScore([
      {
        question: 'Tại sao chọn Hàn Quốc?',
        answer: 'Tôi chọn Hàn Quốc vì chất lượng giáo dục cao và cơ hội học tập trong môi trường quốc tế. Tôi muốn học chuyên ngành tại một trường đại học hàng đầu Hàn Quốc. Sau khi tốt nghiệp, tôi muốn apply visa E7 và làm việc tại một công ty Hàn Quốc liên quan đến lĩnh vực học tập của tôi. Đây là cơ hội tuyệt vời để phát triển sự nghiệp.',
      },
      {
        question: 'Kế hoạch học tập?',
        answer: 'Tôi dự định học tiếng Hàn 6 tháng đầu để đạt TOPIK 3, sau đó học chuyên ngành kinh tế tại trường. Tôi sẽ tham gia các hoạt động ngoại khóa để nâng cao kỹ năng mềm. Mục tiêu của tôi là tốt nghiệp với bằng giỏi và có cơ hội học lên cao học hoặc apply visa E7 làm việc tại Hàn Quốc.',
      },
    ]);
    expect(result.score).toBeGreaterThanOrEqual(60);
    expect(result.label).toMatch(/Xuất sắc|Khá tốt/);
  });

  it('should score low for short answers', () => {
    const result = simulateInterviewScore([
      {
        question: 'Tại sao chọn Hàn Quốc?',
        answer: 'Không biết',
      },
    ]);
    expect(result.label).toMatch(/Cần cải thiện/);
    expect(result.score).toBeLessThan(40);
  });

  it('should provide feedback for each answer', () => {
    const result = simulateInterviewScore([
      {
        question: 'Tại sao chọn Hàn Quốc?',
        answer: 'Tôi muốn học tập tại Hàn Quốc vì nền giáo dục phát triển.',
      },
      {
        question: 'Kế hoạch học tập?',
        answer: 'Có.',
      },
    ]);
    expect(result.feedback.length).toBe(2);
    expect(result.feedback[0]).not.toBe(result.feedback[1]);
  });

  it('should handle empty answers', () => {
    const result = simulateInterviewScore([
      { question: 'Test?', answer: '' },
    ]);
    expect(result.score).toBe(0);
  });

  it('should return 0 when no answers', () => {
    const result = simulateInterviewScore([]);
    expect(result.score).toBe(0);
    expect(result.totalAnswers).toBe(0);
  });
});
