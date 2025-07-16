import fs from 'fs/promises';

async function fetchAllQuestions() {
  const allQuestions = {};
  for (let level = 1; level <= 10; level++) {
    try {
      const response = await fetch(`https://api-ghz-v2.azurewebsites.net/api/v2/quiz?level=${level}`);
      if (!response.ok) {
        console.error(`Failed to fetch level ${level}`);
        continue;
      }
      const apiJson = await response.json();
      let questions = [];
      if (Array.isArray(apiJson)) {
        questions = apiJson;
      } else if (Array.isArray(apiJson.questions)) {
        questions = apiJson.questions;
      } else if (Array.isArray(apiJson.test?.question)) {
        questions = apiJson.test.question;
      }
      allQuestions[level] = questions.map((q, idx) => ({
        id: q.id ?? idx + 1,
        question: q.question,
        answers: q.answers,
        correct: q.test_answer ?? q.correct,
        level: q.level ?? level
      }));
      console.log(`Fetched level ${level}`);
    } catch (error) {
      console.error(`Error fetching level ${level}:`, error);
    }
  }

  await fs.writeFile('quiz-questions.json', JSON.stringify(allQuestions, null, 2));
  console.log('All questions fetched and saved to quiz-questions.json');
}

fetchAllQuestions();
