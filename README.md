# Quiz Arena

Quiz Arena is a web-based application that allows users to test their knowledge on various topics by answering a series of multiple-choice questions. The application features a scoring system, achievements, and a leaderboard to track user progress and compete with others.

## Features

- **User Authentication**: Users can sign up and log in to track their progress.
- **Quiz Gameplay**: A timed quiz with multiple-choice questions.
- **Achievements**: Users can unlock badges for reaching certain milestones.
- **Leaderboard**: A global leaderboard to see how you rank against other players.
- **Profile Page**: View your stats and unlocked achievements.

## Technologies Used

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## Backend Server

This project includes a small Express API backed by SQLite. The server will forward quiz requests to the public API so you can work with real questions.

During development you can run the frontend and backend together with one command:

```bash
npm run dev
```

If you only need the API server, run:

```bash
npm run start:server
```

To just launch the Vite dev server run:

```bash
npm run dev:client
```

The database file is stored at `server/quiz.db` and will be created automatically.

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

You need to have Node.js and npm installed on your machine. You can use `nvm` to manage Node.js versions.

- [nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

### Installation

1.  Clone the repo
    ```sh
    git clone https://github.com/knull-reaper/quiz-arena-achievements-unlocked.git
    ```
2.  Install NPM packages
    ```sh
    npm install
    ```
3.  Start the development server
    ```sh
    npm run dev
    ```

The application will be available at `http://localhost:5173`.
