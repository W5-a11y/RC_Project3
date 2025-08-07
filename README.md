# Trivia Daily: A Web-Based Trivia Game

**Trivia Daily** is a fast-paced trivia web game where players answer 5 multiple-choice questions each day. The game covers fun and diverse topics such as **Los Angeles**, **Hong Kong**, and trending themes like coffee. It is accessible on both desktop and mobile browsers and designed to encourage friendly competition through streaks, points, and leaderboards.

---

## 🌟 Features

- **User Flow**: Welcome screen, name input, and intuitive navigation.
- **Topic Roulette**: Spin a wheel to randomly select one of six trivia topics.
- **Daily Quiz**: Automatically fetches 5 questions per topic with a 30-second timer.
- **Scoring System**: Rewards for speed and accuracy; bonus streaks after 2+ correct answers.
- **Leaderboard**: Displays the day’s top scorers, including your ranking.
- **Score Sharing**: Easily copy your score to clipboard for sharing.
- **In-App Store**: Spend earned credits on perks (e.g., dark mode, badges, hints).
- **LLM Integration**: Generates daily trivia via Google Gemini API.
- **User & Score Management**: Tracks streaks, logs scores, and manages one play per day.

---

## 🛠️ Tech Stack

| Component | Tool | Purpose |
|----------|------|---------|
| Frontend | React + Vite | Interactive UI with client-side routing |
| Backend | Python + Flask + SQLAlchemy | RESTful APIs, database logic, CORS |
| Database | MySQL (AWS RDS) | Stores users, scores, questions, streaks |
| AI Trivia | Google Gemini (2.5) | Generates daily quiz questions |

---

## 📁 Project Structure

```
quiz-app/
├── frontend/                 # Web UI (HTML/JS/CSS or React)
│   ├── src//pages/
|     ├── HomePage.jsx        # Landing screen with Play, Credits, and Store
|     ├── LogInPage.jsx       # Log In for new users
|     ├── StorePage.jsx       # Game customization and achievement badges
|     ├── TopicPage.jsx       # Spin-the-wheel category selector
|     ├── QuizPage.jsx        # Displays 5 questions with audio and transitions
|     ├── ResultPage.jsx      # Score summary, leaderboard, streaks, and sharing
|     └── Credits.jsx         # Acknowledgments and info
│   ├── index.html
│   ├── style.css
│   ├── script.js
│   └── assets/               # Icons, fonts, badges
│
├── quiz_gen/                # LLM-based trivia generator
│   ├── generate_quiz.py
│   ├── topics.txt
│   ├── questions.json        # Output format
│   └── utils.py
│
├── backend/                 # API + Firestore logic
│   ├── app.py
│   ├── firestore_db.py
│   └── api_routes/           # API route handlers
│       ├── quiz.py           # Endpoints like /quiz/today and /quiz/submit
│       ├── leaderboard.py    # Endpoints like /leaderboard
│       └── user.py           # Endpoints like /user/streak
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

## ⚙️ Setup Instructions

### 1. Prerequisites

- Node.js & npm (v14+)
- Python 3.8+
- Git

### 2. Environment Variables

Create a `.env` file in the `backend/` folder:

```ini
DATABASE_URL=your_database_url_here
GOOGLE_API_KEY=your_google_gemini_api_key
```

### 3. Installation

#### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # For macOS/Linux
# OR venv\\Scripts\\activate.bat for Windows
pip install -r requirements.txt
```

#### Frontend

```bash
cd frontend
npm install
npm install react-router-dom
npm install react-custom-roulette --legacy-peer-deps
npm install @fontsource/lexend @fontsource/nunito @fontsource/poppins
```

---

## 🧠 Database Setup

Connect to AWS RDS MySQL:

```bash
mysql -h [host] -u admin -p
USE quiz_db;
SHOW TABLES;
SELECT * FROM user;
```

Tables include:

- `user` (uid, name, streak, points)
- `score_log` (uid, date, time, bonus, streak)
- `quiz ` (date, topic, location, questions)

---

## 📡 API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET`  | `/today-quiz?topic=<topic>` | Get today’s quiz |
| `GET`  | `/generate-quiz?topic=<topic>` | Force generate quiz |
| `POST` | `/submit_user_info` | Submit user name/info |
| `POST` | `/update-score` | Submit and log score |
| `GET`  | `/leaderboard` | Return leaderboard info |

---

## 🧾 Example Quiz JSON

```json
[
  {
    "question": "Which ocean is located on the west coast of the United States?",
    "options": ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"],
    "answer": "Pacific Ocean"
  },
  {
    "question": "What is the name of the longest mountain range in North America?",
    "options": ["Appalachian Mountains", "Rocky Mountains", "Sierra Nevada", "Himalayas"],
    "answer": "Rocky Mountains"
  }
]
```

---

## 🎨 Typography

Fonts imported via `@fontsource`:

- **Poppins**: for headers
- **Nunito**: for questions
- **Lexend**: for body text

Custom styles defined in `frontend/src/index.css`.
