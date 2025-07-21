from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class QuestionPool(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    topic = db.Column(db.String(100))
    question = db.Column(db.String(500))
    options = db.Column(db.PickleType)  # stores list
    answer = db.Column(db.String(100))

class Quiz(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.String, primary_key=True)
    topic = db.Column(db.String(100))
    questions = db.Column(db.PickleType)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    uid = db.Column(db.String, primary_key=True)
    name = db.Column(db.String(100))
    region = db.Column(db.String(50))
    last_active = db.Column(db.String)
    points = db.Column(db.Integer, default=0)
    streak = db.Column(db.Integer, default=0)

class ScoreLog(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    uid = db.Column(db.String)
    score = db.Column(db.Integer)
    time = db.Column(db.Integer)
    bouns = db.Column(db.Integer)
    streak = db.Column(db.Integer)