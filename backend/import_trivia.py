from models import db, QuestionPool

def store_questions_to_db(questions):
    for item in questions:
        q = QuestionPool(
            topic=item["topic"],
            question=item["question"],
            options=item["options"],
            answer=item["answer"]
        )
        if len(item["options"]) == 4 and item["answer"] in item["options"]:
            db.session.add(q)
    db.session.commit()

# questions = generate_questions_from_gemini(topic="Coffee")
# store_questions_to_db(questions)
