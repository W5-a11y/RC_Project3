# RC_Project3: Trivia Daily – A Trivia Web Game
Welcome to **Trivia Daily**, a fun and fast-paced trivia game designed for web browsers (both laptop and mobile). Each day, players answer 5 multiple-choice questions centered around **Los Angeles**, **Hong Kong**, or trending topics (like coffee ☕). It's gamified to reward streaks, share scores, and encourage friendly competition.

---

## 🚀 Project Overview

- 🎯 **Goal**: Build a responsive quiz web app with daily auto-generated trivia, fun UI, and gamification elements.
- 📱 **Platform**: Web-based (Chrome, Safari, etc.)

## 🗂️ Project Structure
quiz-app/
├── frontend/                 # Web UI (HTML/JS/CSS or React)
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

---

## 🔗 API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET`  | `/quiz/today` | Fetch today’s quiz |
| `POST` | `/quiz/submit` | Submit answers and get result |
| `GET`  | `/leaderboard` | Fetch top player scores |
| `GET`  | `/user/streak` | Get current streak and badge info |

---

### 📄 Quiz JSON Schema (`shared/quiz_schema.json`)
- Not Needed -- May Delete Later
```json
{
  "type": "object",
  "required": ["date", "topic", "questions"],
  "properties": {
    "date": {
      "type": "string",
      "format": "date"
    },
    "topic": {
      "type": "string"
    },
    "questions": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["q", "options", "answer"],
        "properties": {
          "q": { "type": "string" },
          "options": {
            "type": "array",
            "items": { "type": "string" },
            "minItems": 4,
            "maxItems": 4
          },
          "answer": { "type": "string" }
        }
      }
    }
  }
}
```
### 📄 Test JSON Data (`shared/quiz_schema.json`)
```json
{
  "date": "2025-07-17",
  "topic": "Coffee",
  "questions": [
    {
      "q": "Which country consumes the most coffee?",
      "options": ["USA", "Finland", "Italy", "Brazil"],
      "answer": "Finland"
    }
  ]
}
```
---
## Setup Instructions 

1. **Install Python dependencies**
```bash
pip install -r requirements.txt
```