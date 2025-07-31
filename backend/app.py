import os
import sys
import requests
from flask import Flask, jsonify, request, render_template
from models import db, User, Quiz, ScoreLog
from datetime import date
from quiz_generator.quiz_gen import generate_quiz
import json
from dotenv import load_dotenv
from flask_cors import CORS

load_dotenv()
app = Flask(__name__)
CORS(app)

# Use a unique file-based database to avoid conflicts
#DATABASE_URL = os.getenv("DATABASE_URL")
DATABASE_URL = "sqlite:///quiz.db"
app.config["SQLALCHEMY_DATABASE_URI"] = DATABASE_URL
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db.init_app(app)

# Create all database tables
with app.app_context():
    db.create_all()


# Home route -- HTML page index.html
@app.route("/")
def index():
    return render_template("index.html")

@app.route("/signup")
def signup():
    return render_template("signup.html")

@app.route("/store")
def store():
    return render_template("store.html")

@app.route("/end_stats")
def end_stats():
    return render_template("end_stats.html")

# Path to get the daily quiz, using JSON file as output
@app.route("/today-quiz", methods=["GET"])
def get_today_quiz():
    today = str(date.today())
    location = get_region_by_ip(request.remote_addr)
    if location == "Unknown" or location == "Other":
        return jsonify({"error": "Unknown location"}), 400
    topic = request.args.get("topic")  # or set a default topic
    quiz = Quiz.query.filter_by(date=today, location=location).first()
    if quiz:
        return jsonify({
            "date": quiz.date,
            "location": location,
            "topic": quiz.topic,
            "questions": json.loads(quiz.questions)
        })
    else:
        quiz_data = generate_and_store_quiz(topic, location)
        if "error" in quiz_data:
            return jsonify({"error": quiz_data["error"]}), quiz_data.get("status", 500)
        return quiz_data
    

def generate_and_store_quiz(topic, location):
    quiz_data = generate_quiz(topic, location)
    if not quiz_data:
        return {"error": "Failed to generate quiz", "status": 500}
    
    quiz = Quiz()
    quiz.date = quiz_data["date"]
    quiz.topic = quiz_data["topic"]
    quiz.location = location
    quiz.questions = json.dumps(quiz_data["questions"])
    db.session.add(quiz)
    db.session.commit()
    return quiz_data


@app.route("/check-user", methods=["GET"])
def check_user():
    uid = request.args.get("uid")
    if not uid:
        return jsonify({"error": "Missing uid parameter"}), 400
    
    try:
        user = User.query.filter_by(uid=uid).first()
        if user:
            return jsonify({
                "uid": user.uid,
                "name": user.name,
                "region": user.region,
                "last_active": user.last_active,
                "points": user.points,
                "streak": user.streak
            })
        else:
            return jsonify({"error": "User not found"}), 404
    except Exception as e:
        print(f"Error checking user: {e}")
        return jsonify({"error": "Database error"}), 500

@app.route("/test-quiz-completion", methods=["GET"])
def test_quiz_completion():
    """Test endpoint to verify quiz completion check works"""
    uid = request.args.get("uid", "test_user")
    today = str(date.today())
    
    # Simulate checking if user completed today's quiz
    # In a real scenario, this would check the ScoreLog table
    return jsonify({
        "uid": uid,
        "date": today,
        "completed": False,  # Simulate not completed
        "message": "Test endpoint - user has not completed today's quiz"
    })

@app.route("/user-stats", methods=["GET"])
def get_user_stats():
    uid = request.args.get("uid")
    if not uid:
        return jsonify({"error": "Missing uid parameter"}), 400
    
    try:
        # Get user info
        user = User.query.filter_by(uid=uid).first()
        if not user:
            return jsonify({"error": "User not found"}), 404
        
        # Get user's quiz history (all score logs)
        score_logs = ScoreLog.query.filter_by(uid=uid).order_by(ScoreLog.date.desc()).all()
        
        # Format the quiz history
        quiz_history = []
        for log in score_logs:
            quiz_history.append({
                "date": log.date,
                "score": log.score,
                "streak": log.streak,
                "time": log.time,
                "bonus": log.bonus
            })
        
        return jsonify({
            "user": {
                "name": user.name,
                "total_points": user.points,
                "current_streak": user.streak,
                "region": user.region,
                "last_active": user.last_active
            },
            "quiz_history": quiz_history,
            "total_quizzes": len(quiz_history),
            "average_score": sum(log.score for log in score_logs) / len(score_logs) if score_logs else 0
        })
    except Exception as e:
        print(f"Error getting user stats: {e}")
        return jsonify({"error": "Database error"}), 500

@app.route("/check-quiz", methods=["GET"])
def check_today_quiz():
    today = str(date.today())
    location = get_region_by_ip(request.remote_addr)
    if location == "Unknown" or location == "Other":
        return jsonify({"error": "Unknown location"}), 400
    quiz = Quiz.query.filter_by(date=today, location=location).first()
    if quiz:
        return jsonify({
            "date": quiz.date,
            "location": location,
            "topic": quiz.topic,
            "questions": json.loads(quiz.questions)
        })
    else:
        return jsonify({
            "quiz": False
        })


@app.route("/check-today-quiz", methods=["GET"])
def check_quiz_completion():
    uid = request.args.get("uid")
    if not uid:
        return jsonify({"error": "Missing uid parameter"}), 400
    
    try:
        today = str(date.today())
        # Check if user has a score log for today
        score_log = ScoreLog.query.filter_by(uid=uid, date=today).first()
        
        if score_log:
            return jsonify({
                "completed": True,
                "score": score_log.score,
                "date": score_log.date
            })
        else:
            return jsonify({
                "completed": False
            })
    except Exception as e:
        print(f"Error checking today's quiz: {e}")
        return jsonify({"error": "Database error"}), 500

# Path to create or update user information
@app.route("/submit_user_info", methods=["POST"])
def submit_user():
    try:
        data = request.json
        if not data:
            return jsonify({"error": "No JSON data provided"}), 400
        
        uid = data["uid"]
        name = data.get("name", "Guest") #default
        ip = request.remote_addr
        region = get_region_by_ip(ip)
        today = str(date.today())

        user = User.query.filter_by(uid=uid).first()
        if not user:
            # Check if a user with the same name already exists
            existing_user = User.query.filter_by(name=name).first()
            if existing_user:
                # Merge duplicate users by combining their points
                existing_user.points += getattr(existing_user, 'credits', 0)  # Add any credits as points
                existing_user.last_active = today
                existing_user.region = region
                db.session.commit()
                user = existing_user
            else:
                user = None
        
        if user:   #if user exists, update their information
            user.uid = uid  # Update UID if it changed
            user.last_active = today
            user.region = region
        else:
            user = User()
            user.uid = uid
            user.name = name
            user.region = region
            user.last_active = today
            user.points = 0
            user.streak = 0
            db.session.add(user)

        db.session.commit()
        return jsonify({
            "message": "User information submitted",
            "uid": user.uid, # Explicitly return the UID
            "name": user.name,
            "region": user.region,
            "last_active": user.last_active,
            "points": user.points,
            "streak": user.streak
        })
    except Exception as e:
        print(f"Error in submit_user: {e}")
        db.session.rollback()
        return jsonify({"error": f"Failed to create user: {str(e)}"}), 500

def get_region_by_ip(ip):
    ip = requests.get('https://api.ipify.org').text
    try:
        response = requests.get(f"https://ipinfo.io/{ip}/json")
        data = response.json()
        city = data.get("city", "").lower()
        print("detected city: ", city)
        if "hong" in city or "kowloon" in city:
            return "Hong Kong"
        elif "el" in city or "folsom" in city:
            return "Folsom"
        elif "merced" in city:
            return "Merced"
        else:
            return "Other"
    except:
        return "Unknown"
    
@app.route("/update-score", methods=["POST"])
def submit_score():
    data = request.get_json()
    if not data:
        return jsonify({"message": "No JSON data provided"}), 400

    uid = data.get("uid")
    score = int(data.get("score", 0)) # Ensure score is an integer

    if not uid:
        return jsonify({"message": "Missing 'uid' in request data"}), 400

    user = User.query.filter_by(uid=uid).first()

    if not user:
        # If user doesn't exist, you might want to create them or return an error.
        # Based on your /submit-user_info, users should ideally exist before submitting scores.
        return jsonify({"message": "User not found."}), 404

    today_str = str(date.today())

    # Check if the user has already completed today's quiz
    existing_score = ScoreLog.query.filter_by(uid=uid, date=today_str).first()
    if existing_score:
        return jsonify({"message": "User has already completed today's quiz."}), 400

    # Update streak and points
    user.streak += 1
    user.points += score
    user.last_active = today_str # Update last_active to today

    # Add to ScoreLog
    log = ScoreLog()
    log.uid = uid
    log.score = score
    log.date = today_str
    log.time = 0  # Default value
    log.bonus = 0  # Default value
    log.streak = user.streak
    db.session.add(log)

    db.session.commit()
    return jsonify({
        "message": "Score submitted successfully.",
        "uid": uid,
        "name": user.name,
        "score": score,
        "streak": user.streak,
        "total_points": user.points
    })

@app.route("/api/leaderboard", methods=["GET"])
def get_leaderboard():
    try:
        # Get top 5 users by total points
        leaderboard = User.query.order_by(User.points.desc()).limit(5).all()
        
        # Format the leaderboard data
        leaderboard_data = []
        for user in leaderboard:
            leaderboard_data.append({
                "name": user.name,
                "points": user.points,
                "streak": user.streak,
                "region": user.region
            })
        
        return jsonify({
            "leaderboard": leaderboard_data
        })
    except Exception as e:
        print(f"Error getting leaderboard: {e}")
        return jsonify({"error": "Database error"}), 500


if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True)