import google.generativeai as genai
from dotenv import load_dotenv
import os
import json
from datetime import datetime
import re

load_dotenv()

genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
model = genai.GenerativeModel("gemini-2.5-flash")


def generate_quiz(topic, location):
    today = datetime.now().strftime("%Y-%m-%d")
    prompt = f"""
        Generate 5 trivia questions about {topic}. 
        Each question should have 4 answer choices with only 1 correct answer from the options. All the questions should be related to the topic.
        It doesn't have to be specific to {location} but it needs to be common knowledge for the residents of {location}. For example, if the location is California and topic is history, the question can be about the state, the country, or world history taught by schools in California.
        All questions should be easy and basic enough for 10-15 year olds to answer. Make sure the answer choices are in different positions in the array.
        Output format:
        [
        {{
            "question": "What is the capital of United States?",
            "options": ["Los Angeles", "New York City", "Chicago", "Washington D.C."],
            "answer": "Washington D.C."
        }},
        ...
        ]
        """
    response = model.generate_content(prompt)

    raw = response.text
    print(raw)
    match = re.search(r'\[.*\]', raw, re.DOTALL)
    if match:
        json_str = match.group(0)
        quiz_data = json.loads(json_str)
    else:
        print("No JSON array found in the response.")

    output = {
        "date": today,
        "topic": topic,
        "location": location,
        "questions": quiz_data
    }

    return output

