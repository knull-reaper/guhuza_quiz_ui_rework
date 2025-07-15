const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
app.use(express.json());

const db = new sqlite3.Database(path.join(__dirname, 'quiz.db'));

// Init database
function init() {
  db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS submissions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT,
      level INTEGER,
      totalScore INTEGER,
      totalTime INTEGER,
      avgTime REAL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )`);
  });
}

init();

// Helper to get user submissions
function getUserSubmissions(username) {
  return new Promise((resolve, reject) => {
    db.all(
      'SELECT * FROM submissions WHERE username = ? ORDER BY created_at ASC',
      [username],
      (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      }
    );
  });
}

// POST /api/submit
app.post('/api/submit', (req, res) => {
  const { username, level, totalScore, totalTime, avgTime } = req.body;
  if (!username) return res.status(400).json({ error: 'username required' });

  db.run(
    `INSERT INTO submissions (username, level, totalScore, totalTime, avgTime) VALUES (?, ?, ?, ?, ?)`,
    [username, level, totalScore, totalTime, avgTime],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true, newlyAwarded: { achievements: [], badges: [] } });
    }
  );
});

// GET /api/leaderboard
app.get('/api/leaderboard', (_req, res) => {
  db.all(
    `SELECT username, level, totalScore, avgTime, totalTime, created_at
     FROM submissions
     ORDER BY totalScore DESC, avgTime ASC, totalTime ASC
     LIMIT 10`,
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    }
  );
});

// GET /api/user/:username/levels
app.get('/api/user/:username/levels', async (req, res) => {
  try {
    const submissions = await getUserSubmissions(req.params.username);
    const levels = calculateLevelStatuses(submissions);
    res.json(levels);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/user/:username/achievements
app.get('/api/user/:username/achievements', async (req, res) => {
  try {
    const submissions = await getUserSubmissions(req.params.username);
    const achievements = calculateUserAchievements(submissions);
    const badges = calculateUserBadges(submissions);
    res.json({ achievements, badges });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/v2/quiz
app.get('/api/v2/quiz', async (req, res) => {
  const level = parseInt(req.query.level, 10) || 1;
  try {
    const response = await fetch(
      `https://api-ghz-v2.azurewebsites.net/api/v2/quiz?level=${level}`
    );
    if (!response.ok) {
      throw new Error('Failed to fetch remote quiz');
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

    if (!questions.length) {
      throw new Error('Unexpected API response');
    }

    const normalized = questions.map((q, idx) => ({
      id: q.id ?? idx + 1,
      question: q.question,
      answers: q.answers,
      correct: q.test_answer ?? q.correct,
      level: q.level ?? level
    }));

    res.json(normalized);
  } catch (err) {
    console.warn('Remote quiz fetch failed, using mock data', err);
    res.json(generateMockQuestions(level));
  }
});

function generateMockQuestions(level) {
  const difficulties = ['easy', 'medium', 'hard', 'expert'];
  const difficulty = difficulties[Math.min(level - 1, 3)] || 'expert';
  return Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    question: `Level ${level} ${difficulty} question ${i + 1}: What is the capital of a fictional country?`,
    answers: ['Answer A', 'Answer B', 'Answer C', 'Answer D'],
    correct: Math.floor(Math.random() * 4),
    level
  }));
}

// Helper functions reused from hooks
function calculateLevelStatuses(userSubmissions) {
  const levels = [];
  for (let i = 1; i <= 10; i++) {
    const levelSubmissions = userSubmissions.filter(s => s.level === i);
    const bestSubmission = levelSubmissions.reduce((best, current) => {
      if (!best) return current;
      if (current.totalScore > best.totalScore) return current;
      if (current.totalScore === best.totalScore && current.totalTime < best.totalTime) return current;
      return best;
    }, null);

    const bestScore = bestSubmission ? bestSubmission.totalScore : 0;
    const scorePercentage = (bestScore / 10) * 100;
    let stars = 0;
    if (scorePercentage >= 90) stars = 3;
    else if (scorePercentage >= 80) stars = 2;
    else if (scorePercentage >= 70) stars = 1;

    let unlocked = i === 1;
    if (i > 1) {
      const prevLevel = levels[i - 2];
      unlocked = prevLevel && prevLevel.bestScore !== undefined && (prevLevel.bestScore / 10) * 100 >= 70;
    }

    levels.push({
      level: i,
      unlocked,
      stars,
      bestScore: bestSubmission ? bestSubmission.totalScore : undefined,
      required: 7,
      completed: bestSubmission !== null
    });
  }
  return levels;
}

function calculateUserAchievements(userSubmissions) {
  const all = [
    { id: 1, name: 'Quiz Novice', description: 'Complete your first quiz' },
    { id: 2, name: 'Quiz Enthusiast', description: 'Complete 10 quizzes' },
    { id: 3, name: 'Flawless Victory', description: 'Answer all questions correctly in a quiz' },
    { id: 4, name: 'Speed Demon', description: 'Average ≤ 5 seconds per question over 10 quizzes' },
    { id: 5, name: 'Level Conqueror', description: 'Complete level 10' }
  ];
  const earned = [];
  if (userSubmissions.length >= 1) {
    earned.push({ ...all[0], awarded_at: userSubmissions[0].created_at });
  }
  if (userSubmissions.length >= 10) {
    earned.push({ ...all[1], awarded_at: userSubmissions[9].created_at });
  }
  const flawlessQuiz = userSubmissions.find(s => s.totalScore === 10);
  if (flawlessQuiz) {
    earned.push({ ...all[2], awarded_at: flawlessQuiz.created_at });
  }
  if (userSubmissions.length >= 10) {
    const avgTimePerQuestion =
      userSubmissions.slice(-10).reduce((sum, s) => sum + s.totalTime, 0) / (10 * 10);
    if (avgTimePerQuestion <= 5) {
      earned.push({ ...all[3], awarded_at: userSubmissions[userSubmissions.length - 1].created_at });
    }
  }
  const level10Quiz = userSubmissions.find(s => s.level === 10);
  if (level10Quiz) {
    earned.push({ ...all[4], awarded_at: level10Quiz.created_at });
  }
  return earned;
}

function calculateUserBadges(userSubmissions) {
  const all = [
    { id: 1, name: 'On the Board', description: 'Make it to the leaderboard' },
    { id: 2, name: 'Streak Starter', description: 'Answer 5 questions correctly in a row' }
  ];
  const earned = [];
  if (userSubmissions.length >= 1) {
    earned.push({ ...all[0], awarded_at: userSubmissions[0].created_at });
  }
  if (userSubmissions.length >= 3) {
    earned.push({ ...all[1], awarded_at: userSubmissions[2].created_at });
  }
  return earned;
}

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

