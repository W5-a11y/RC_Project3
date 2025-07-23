import os
import sys
import requests
from flask import Flask, jsonify, request, render_template
from models import db, User, Quiz, ScoreLog
from datetime import date
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
DATABASE_URL = os.getenv("DATABASE_URL")
app.config["SQLALCHEMY_DATABASE_URI"] = DATABASE_URL
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(app)
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
    quiz = Quiz.query.filter_by(date=today).first()
    if quiz:
        return jsonify({
            "date": quiz.date,
            "topic": quiz.topic,
            "questions": quiz.questions
        })
    else:
        return jsonify({"message": f"No quiz available for today."}), 404 

# Path to create or update user information
@app.route("/submit_user_info", methods=["POST"])
def submit_user():
    data = request.json
    uid = data["uid"]
    name = data.get("name", "Guest") #default
    ip = request.remote_addr
    region = get_region_by_ip(ip)
    today = str(date.today())

    user = User.query.filter_by(uid=uid).first()
    if user:   #if user exists, update their information
        user.last_active = today
        user.region = region
    else:
        user = User(uid=uid, name=name, region=region, last_active = today, points=0, streak=0)
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

def get_region_by_ip(ip):
    try:
        response = requests.get(f"https://ipinfo.io/{ip}/json")
        data = response.json()
        city = data.get("city", "").lower()
        if "hong" in city or "kowloon" in city:
            return "Hong Kong"
        elif "los" in city or "angeles" in city:
            return "Los Angeles"
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

    # Check if the user has already played today
    if user.last_active == today_str: # Assuming last_active tracks last play, not just last login/update
        return jsonify({"message": "User has already played today. No score update."}), 400

    # Update streak and points
    user.streak += 1
    user.points += score
    user.last_active = today_str # Update last_active to today

    # Add to ScoreLog
    # ERROR FIX: ScoreLog model has 'time' and 'bonus' which are not in data.
    # Defaulting them or requiring them. Assuming they are optional for now.
    log = ScoreLog(uid=uid, score=score, date=today_str, streak=user.streak) # 'time' and 'bonus' are missing
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

@app.route("/leaderboard")
def leaderboard(): 
    leader = User.query.order_by(User.points.desc()).limit(10).all() # Example: top 10 by points
    return render_template("leaderboard.html", users=leader)

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True)