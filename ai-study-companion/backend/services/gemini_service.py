import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

model = genai.GenerativeModel("models/gemini-3.6-flash")


def ask_gemini(question, context):
    prompt = f"""
You are an AI Study Companion.

Use ONLY the context below to answer.

Context:
{context}

Question:
{question}

Answer:
"""

    response = model.generate_content(prompt)

    return response.text