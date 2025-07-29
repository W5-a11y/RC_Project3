import os
import requests
from flask import Flask, jsonify, request, render_template
from models import db, User, Quiz
from datetime import date
from quiz_generator.quiz_gen import generate_quiz
import json
from dotenv import load_dotenv
from flask_cors import CORS, cross_origin
from flask_sqlalchemy import SQLAlchemy


load_dotenv(dotenv_path=".env")
app = Flask(__name__)
CORS(app)

DATABASE_URL =  os.getenv("DATABASE_URL") 
app.config["SQLALCHEMY_DATABASE_URI"] = DATABASE_URL
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db.init_app(app)


# Home route -- HTML page index.html
# @app.route("/")
# def index():
#     return render_template("index.html")

# @app.route("/login")
# def signup():
#     return render_template("signup.html")

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

@app.route("/generate-quiz", methods=["GET"])
def generate_quiz_route():
    topic = request.args.get("topic")
    if not topic:
        return jsonify({"error": "Missing topic parameter"}), 400
    location = get_region_by_ip(request.remote_addr)
    quiz_data = generate_and_store_quiz(topic, location)
    if "error" in quiz_data:
        return jsonify({"error": quiz_data["error"]}), quiz_data.get("status", 500)
    return jsonify(quiz_data)

# Path to create or update user information
# @app.route("/submit_user_info", methods=["POST"])
# def submit_user():
#     data = request.json
#     if not data:
#         return jsonify({"error": "No JSON data provided"}), 400
    
#     uid = data["uid"]
#     name = data.get("name", "Guest") #default
#     ip = request.remote_addr
#     region = get_region_by_ip(ip)
#     today = str(date.today())

#     user = User.query.filter_by(uid=uid).first()
#     if user:   #if user exists, update their information
#         user.last_active = today
#         user.region = region
#     else:
#         user = User()
#         user.uid = uid
#         user.name = name
#         user.region = region
#         user.last_active = today
#         user.points = 0
#         user.streak = 0
#         db.session.add(user)

#     db.session.commit()
#     return jsonify({
#         "message": "User information submitted",
#         "uid": user.uid, # Explicitly return the UID
#         "name": user.name,
#         "region": user.region,
#         "last_active": user.last_active,
#         "points": user.points,
#         "streak": user.streak
#     })

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
    
@app.route("/submit_user_info", methods=["POST"])
@cross_origin()
def submit_user_info():
    data = request.get_json()
    uid = data["uid"]
    name = data["username"]

    ip = request.remote_addr
    region = get_region_by_ip(ip)

    if not uid:
        return jsonify({"error": "UID is required"}), 400

    # Check if user exists
    user = User.query.filter_by(uid=uid).first()
    if not user:
        user = User(uid=uid, name=name, region=region, total_points=0, streak=0)
        db.session.add(user)
    else:
        return jsonify({"User already exists"}), 400
    db.session.commit()

    return jsonify({"message": "User info stored", "uid": uid}), 2
    # Update streak and points
    # user.streak += 1
    # user.points += score
    # user.last_active = today_str # Update last_active to today

    # # Add to ScoreLog
    # # ERROR FIX: ScoreLog model has 'time' and 'bonus' which are not in data.
    # # Defaulting them or requiring them. Assuming they are optional for now.
    # log = ScoreLog()
    # log.uid = uid
    # log.score = score
    # log.date = today_str
    # log.time = 0  # Default value
    # log.bonus = 0  # Default value
    # log.streak = user.streak
    # db.session.add(log)

    # db.session.commit()
    # return jsonify({
    #     "message": "Score submitted successfully.",
    #     "uid": uid,
    #     "name": user.name,
    #     "score": score,
    #     "streak": user.streak,
    #     "total_points": user.points
    # })

@app.route("/leaderboard")
def leaderboard(): 
    leader = User.query.order_by(User.total_points.desc()).limit(10).all() # Example: top 10 by points
    return render_template("leaderboard.html", users=leader)

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True, host="127.0.0.1", port=5050)