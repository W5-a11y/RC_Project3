from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class QuestionPool(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    topic = db.Column(db.String(100))
    question = db.Column(db.String(500))
    options = db.Column(db.PickleType)  # stores list
    answer = db.Column(db.String(100))

class Quiz(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    date = db.Column(db.String(100))
    topic = db.Column(db.String(100))
    location = db.Column(db.String(100))
    questions = db.Column(db.PickleType)

class User(db.Model):
    uid = db.Column(db.String, primary_key=True)
    name = db.Column(db.String)
    region = db.Column(db.String)
    total_points = db.Column(db.Integer, default=0)
    streak = db.Column(db.Integer, default=0)

class ScoreLog(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    uid = db.Column(db.String(100))
    score = db.Column(db.Integer)
    date = db.Column(db.String(100))
    time = db.Column(db.Integer)
    bonus = db.Column(db.Integer)  # Fixed typo from 'bouns'
    streak = db.Column(db.Integer)