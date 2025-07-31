# RC_Project3: Trivia Daily – A Trivia Web Game
Welcome to **Trivia Daily**, a fun and fast-paced trivia game designed for web browsers (both laptop and mobile). Each day, players answer 5 multiple-choice questions centered around **Los Angeles**, **Hong Kong**, or trending topics (like coffee ☕). It's gamified to reward streaks, share scores, and encourage friendly competition.

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

## Setup

### Prerequisites

- Node.js & npm (v14+)
- Python 3.8+
- Git

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

## 🔗 API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET`  | `today-quiz?topic=<topic>` | Fetch today’s quiz for given topic and region |
| `GET`  |`/generate-quiz?topic=<topic>`|Force generate a new quiz.|
| `POST` | `/submit_user_info` | Submit answers and get result |
| `GET`  | `/update-score` | Submit score; updates user points, streak, and logs play. |
| `GET`  | `GET /leaderboard` | Render top users by points.|

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
# RC_Project3: Trivia Daily – A Trivia Web Game
Welcome to **Trivia Daily**, a fun and fast-paced trivia game designed for web browsers (both laptop and mobile). Each day, players answer 5 multiple-choice questions centered around **Los Angeles**, **Hong Kong**, or trending topics (like coffee ☕). It's gamified to reward streaks, share scores, and encourage friendly competition.

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
|── frontend/src/
|   ├── assets/
|   ├── App.css
|   ├── App.jsx
|   ├── index.css              # Syle Sheet for UI
|   ├── main.jsx
|   ├── pages/
|      ├── HomePage.jsx        # Landing screen with Play, Credits, and Store
|      ├── LogInPage.jsx       # Log In for new users
|      ├── TopicPage.jsx       # Spin-the-wheel category selector
|      ├── QuizPage.jsx        # Displays 5 questions with audio and transitions
|      ├── ResultPage.jsx      # Score summary, leaderboard, streaks, and sharing
|      ├── StorePage.jsx       # Game customization and achievement badges
|      ├── Credits.jsx         # Acknowledgments and info
│
├── quiz_gen/                  # LLM-based trivia generator
│   ├── generate_quiz.py
│   ├── topics.txt
│   ├── questions.json         # Output format
│   └── utils.py
│
├── backend/                   # API + Firestore logic
│   ├── app.py
│   ├── firestore_db.py
│   └── api_routes/            # API route handlers
│       ├── quiz.py            # Endpoints like /quiz/today and /quiz/submit
│       ├── leaderboard.py     # Endpoints like /leaderboard
│       └── user.py            # Endpoints like /user/streak
│
├── shared/                    # Shared formats, mock data
│   ├── quiz_schema.json
│   └── test_data.json
│   └── user_schema.json
│
├── README.md
└── requirements.txt
```
---

## Setup

### Prerequisites

- Node.js & npm (v14+)
- Python 3.8+
- Git

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
   npm install react-custom-roulette --legacy-peer-deps (topic wheel) (only need --legacy-peer-deps if using react ver 19+)
   npm install @fontsource/lexend @fontsource/nunito @fontsource/poppins
   npm install react-router-dom  
   ```

### MySQL Database Setup
```bash
   mysql -h database-1.c36awkaocf5l.us-east-2.rds.amazonaws.com -u admin -p
   SHOW DATABASES;
   USE quiz_db;
   SHOW TABLES;
   DESCRIBE user;
   SELECT * FROM user;
   EXIT;
   ```

### Database Storage
```bash
   AWS RDS MySQL instance is used to store user profiles, quiz questions, scores, and logs.
   The database URL is configured in the `.env` file.
   The backend uses SQLAlchemy to interact with the database.
   https://us-east-2.console.aws.amazon.com/ec2/home?region=us-east-2#Overview:
   ```

## API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET`  | `today-quiz?topic=<topic>` | Fetch today’s quiz for given topic and region |
| `GET`  |`/generate-quiz?topic=<topic>`|Force generate a new quiz.|
| `POST` | `/submit_user_info` | Submit answers and get result |
| `GET`  | `/update-score` | Submit score; updates user points, streak, and logs play. |
| `GET`  | `GET /leaderboard` | Render top users by points.|

---


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