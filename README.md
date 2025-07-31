# RC_Project3: Quizzly – A Trivia Web Game
Welcome to **Quizzly**, a fun and fast-paced trivia game designed for web browsers (both laptop and mobile). Each day, players answer 5 multiple-choice questions centered around **Los Angeles**, **Hong Kong**, or trending topics (like coffee ☕). It's gamified to reward streaks, share scores, and encourage friendly competition.

---

## Features

- Home & Login Flow: Welcome page, user name capture, and navigation.

- Topic Wheel: Spin a roulette to randomly select one of six topics.

- Dynamic Quiz: Fetches 5 questions from backend per topic with a 30-second timer.

- Scoring & Streaks: Points awarded for accuracy and speed; streak indicator after 2+ correct answers.

- Results & Leaderboard: Displays score, computes earned credits, shows dynamic leaderboard including the current user.

- Share Functionality: Copy score text to clipboard for sharing.

- Store Page: Spend credits on unlockables (e.g., dark mode, badge, extra hint).

- Backend Quiz Generator: Uses Google Gemini API to generate trivia questions stored by date & region.

- User & Score Management: Tracks user info, daily play restriction, points, streaks, and logs history.

## Tools & Frameworks Used

| Component        | Tool                          | Purpose                                         |
|------------------|-------------------------------|-------------------------------------------------|
| Frontend     | React + Vite                   | Build interactive, maintainable UI with client-side routing             |
| Backend  | Python, Flask, SQLAlchemy,       | Serve API endpoints, manage database interactions, handle CORS)  |
| Database     | Configurable viaDATABASE_URL (e.g., PostgreSQL, SQLite)  | Store user profiles, quiz questions, scores, and logs    |
| Quiz Generation  | Google Generative AI (Gemini 2.5)               | Parse text and transform to JSON               |

## 🗂️ Project Structure
```
quiz-app/
├── frontend/                 # Web UI (HTML/JS/CSS or React)
│   ├── index.html
│   ├── style.css
│   ├── script.js
│   └── assets/               # Icons, fonts, badges
│
├── backend/                 # API + Firestore logic
│   ├── app.py
│   ├── firestore_db.py
│   └── api_routes/           # API route handlers
│       ├── quiz.py           # Endpoints like /quiz/today and /quiz/submit
│       ├── leaderboard.py    # Endpoints like /leaderboard
│       └── user.py      # Endpoints like /user/streak
│   ├── quiz_gen/                # LLM-based trivia generator
│       ├── generate_quiz.py
│
├── shared/                   # Shared formats, mock data
│   ├── quiz_schema.json
│   └── test_data.json
│   └── user_schema.json
│
├── README.md
└── requirements.txt
```
---
# 📚 Quiz App API Documentation

This Flask-based API powers a location-aware, daily quiz app that tracks user progress, scores, and streaks.

---

## 🔗 API Endpoints

### 📅 Daily Quiz

| Method | Endpoint              | Description                                                                 |
|--------|-----------------------|-----------------------------------------------------------------------------|
| GET    | `/today-quiz`         | Fetch today’s quiz based on user location. Optional `topic` query param.   |
| GET    | `/check-today-quiz`   | Check if the user has completed today's quiz. Requires `uid` as a query param. |
| GET    | `/check-quiz`         | Check if a quiz exists for today at the user's location.                   |
| GET    | `/test-quiz-completion` | Simulated quiz completion response for testing.                            |
=======


### 👤 User

| Method | Endpoint              | Description                                                                 |
|--------|-----------------------|-----------------------------------------------------------------------------|
| GET    | `/check-user`         | Fetch user profile by `uid`.                                               |
| GET    | `/user-stats`         | Get user's quiz history, current streak, and average score. Requires `uid`.|
| POST   | `/submit_user_info`   | Create or update a user with `uid` and optional `name`. Region is IP-based.|

---

### 📝 Quiz Submission

| Method | Endpoint              | Description                                                                 |
|--------|-----------------------|-----------------------------------------------------------------------------|
| POST   | `/update-score`       | Submit quiz score. Requires `uid` and `score`. Updates streak, points, and logs result. |

---

### 🏆 Leaderboard

| Method | Endpoint              | Description                                                                 |
|--------|-----------------------|-----------------------------------------------------------------------------|
| GET    | `/api/leaderboard`    | Returns the top 5 users by total points.                                   |

---

## 🌐 Frontend Routes (HTML Pages)

| Route         | Purpose                          |
|---------------|----------------------------------|
| `/`           | Homepage                         |
| `/signup`     | Sign-up page                     |
| `/store`      | Store / rewards page             |
| `/end_stats`  | End-of-quiz stats summary page   |

---

## 🌍 Region Detection

Location is determined via IP address using the [ipinfo.io](https://ipinfo.io/) API:

```python
response = requests.get(f"https://ipinfo.io/{ip}/json")
```

---
## Setup Instructions 
=======
### Environment Variables

Create a `.env` file in `backend/` with:

```ini
DATABASE_URL=your_database_url_here
GOOGLE_API_KEY=your_google_gemini_api_key
```

### Installation

1. **Backend**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate       # macOS/Linux
   venv\Scripts\activate.bat    # Windows
   pip install -r requirements.txt
   ```
2. **Frontend**
   ```bash
   cd ../frontend
   npm install
   ```
### MySQL Database Setup
mysql -h database-1.c36awkaocf5l.us-east-2.rds.amazonaws.com -u admin -p
```bash
   SHOW DATABASES;
   USE quiz_db;
   SHOW TABLES;
   DESCRIBE user;
   SELECT * FROM user;
   DELETE FROM user WHERE uid='uid';
   ```


### Quiz JSON Schema (`shared/quiz_schema.json`)
```json
[
  {
    "question": "Which ocean is located on the west coast of the United States?",
    "options": [
      "Atlantic Ocean",
      "Indian Ocean",
      "Arctic Ocean",
      "Pacific Ocean"
    ],
    "answer": "Pacific Ocean"
  },
  {
    "question": "What is the name of the longest mountain range in North America?",
    "options": [
      "Appalachian Mountains",
      "Rocky Mountains",
      "Sierra Nevada",
      "Himalayas"
    ],
    "answer": "Rocky Mountains"
  },
  {
    "question": "Which continent is the largest in terms of land area?",
    "options": [
      "Africa",
      "Asia",
      "North America",
      "Antarctica"
    ],
    "answer": "Asia"
  },
  {
    "question": "What is the name of the large desert that covers parts of the southwestern United States?",
    "options": [
      "Sahara Desert",
      "Gobi Desert",
      "Amazon Rainforest",
      "Mojave Desert"
    ],
    "answer": "Mojave Desert"
  },
  {
    "question": "What is the name of the river that flows through the Grand Canyon?",
    "options": [
      "Mississippi River",
      "Colorado River",
      "Amazon River",
      "Nile River"
    ],
    "answer": "Colorado River"
  }
]

---
### Typography and Styling
Fonts are imported locally using @fontsource. The app uses:

Poppins – For headers (h1, h2)

Nunito – For quiz questions

Lexend – For body and caption text

Global styles and reusable classes (e.g., .icon-button) are defined in src/index.css.
```

### Page Structure
```
frontend/src/pages/
├── HomePage.jsx        # Landing screen with Play, Credits, and Store
├── LogInPage.jsx       # Log In for new users
├── TopicPage.jsx       # Spin-the-wheel category selector
├── QuizPage.jsx        # Displays 5 questions with audio and transitions
├── ResultPage.jsx      # Score summary, leaderboard, streaks, and sharing
├── StorePage.jsx       # Game customization and achievement badges
├── Credits.jsx         # Acknowledgments and info
```

## 🛠️ Running & Testing the App

### Backend (Flask)
- Install dependencies:
  pip install -r requirements.txt

- Create a `.env` file with:
  DATABASE_URL=sqlite:///quiz.db (Insert your own DATABASE URL here)

- Run the Flask server:
  cd backend
  python app.py

  The backend will be running at http://127.0.0.1:5000

### Frontend (React with Vite)
- Install dependencies:
  cd frontend
  npm install

- Start the development server:
  npm run dev

  The frontend will be running at http://localhost:5173

### Testing
- Test endpoints with Postman, curl, or browser:
  - GET http://127.0.0.1:5000/today-quiz
  - POST http://127.0.0.1:5000/submit_user_info
  - GET http://127.0.0.1:5000/api/leaderboard

Make sure both frontend and backend are running before testing!

## Tech Stack

### Backend
- **Python** — Core programming language
- **Flask** — Lightweight web framework for API development
- **Gemini LLM** — Language model used for generating trivia questions dynamically
- **SQLAlchemy** — ORM for database interactions
- **SQLite** (or configurable via `DATABASE_URL`) — Database for storing users, quizzes, and scores
- **Requests** — For IP-based region detection via external APIs
- **Flask-CORS** — Enable Cross-Origin Resource Sharing between frontend and backend

### Frontend
- **React** (with Vite) — Frontend UI framework and build tool
- **React Router DOM** — Client-side routing for multi-page experience
- **React Custom Roulette** — For category/topic wheel component
- **@fontsource** — Self-hosted fonts for typography (Poppins, Nunito, Lexend)
- **Tailwind CSS** or **Custom CSS** — Styling (adjust based on what you actually use)

### Dev & Tools
- **Python dotenv** — Manage environment variables securely
- **Postman / curl** — API testing
- **Node.js & npm** — Package management for frontend dependencies
- **Git** — Version control
=======