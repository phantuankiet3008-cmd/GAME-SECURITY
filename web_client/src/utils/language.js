export const LANGUAGES = {
  en: 'EN',
  vi: 'VI',
};

export const uiText = {
  en: {
    answer: 'Answer',
    beginnerTitle: 'beginner',
    advancedTitle: 'advanced',
    chooseLanguage: 'Choose language',
    close: 'Close',
    details: 'Details',
    goodAnswer: 'Good Answer',
    howToPlay: 'How to play ?',
    language: 'Language',
    loadingResults: 'Loading results ...',
    question: 'Question',
    ready: 'Are you ready ?',
    start: 'Start',
    score: 'score',
    viewLeaderboard: 'View Leaderboard',
    welcome: 'Welcome',
    yourAnswer: 'Your Answer',
    instructions:
      'Within a time limit, you will have to answer a series of questions on the theme of cybersecurity. Each correct answer gives you extra time. To answer the questions, you must drag and drop the card on one of the sides. At the end of the timer, your score is computed.',
    haveFun: 'Have fun !',
  },
  vi: {
    answer: 'Đáp án',
    beginnerTitle: 'cơ bản',
    advancedTitle: 'nâng cao',
    chooseLanguage: 'Chọn ngôn ngữ',
    close: 'Đóng',
    details: 'Giải thích',
    goodAnswer: 'Đáp án đúng',
    howToPlay: 'Cách chơi ?',
    language: 'Ngôn ngữ',
    loadingResults: 'Đang tải kết quả ...',
    question: 'Câu hỏi',
    ready: 'Bạn đã sẵn sàng chưa ?',
    start: 'Bắt đầu',
    score: 'điểm',
    viewLeaderboard: 'Xem bảng xếp hạng',
    welcome: 'Chào mừng',
    yourAnswer: 'Câu trả lời của bạn',
    instructions:
      'Trong thời gian giới hạn, bạn sẽ trả lời các câu hỏi về an ninh mạng. Mỗi câu trả lời đúng sẽ cộng thêm thời gian. Để trả lời, hãy kéo thả thẻ sang một phía hoặc bấm nút đáp án. Khi hết giờ, hệ thống sẽ tính điểm của bạn.',
    haveFun: 'Chúc bạn chơi vui !',
  },
};

export const getStoredLanguage = () => {
  const language = sessionStorage.getItem('language');
  return LANGUAGES[language] ? language : 'en';
};

export const localizeQuestion = (question, language) => ({
  ...question,
  ...(language === 'vi' ? question.vi : {}),
});
