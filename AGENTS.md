# Agents Plan

This document outlines the plan to refactor the quiz application to use the `quiz-questions.json` file for loading questions based on levels.

## 1. Understand the Data Structure

The first step is to inspect the `server/quiz-questions.json` file to understand how the questions and levels are structured. This will inform how the data is fetched and parsed in the application.

## 2. Refactor Level and Question Logic

The following files will be modified to implement the new logic:

- **`server/index.js`**: The server will be updated to read the `quiz-questions.json` file and provide an endpoint to fetch questions for a specific level.
- **`src/hooks/useQuizAPI.ts`**: This hook will be updated to fetch questions from the new server endpoint based on the selected level.
- **`src/pages/LevelsPage.tsx`**: This page will be updated to correctly handle level selection and pass the selected level to the `useQuizAPI.ts` hook.
- **`src/pages/QuizPage.tsx`**: This page will be updated to render the questions fetched for the selected level.

## 3. Fix Level-Related Issues

All existing issues related to level progression and question loading will be addressed during the refactoring process. This includes ensuring that:

- The correct questions are loaded for each level.
- The user's progress through the levels is correctly tracked.
- The UI correctly reflects the user's current level and progress.
