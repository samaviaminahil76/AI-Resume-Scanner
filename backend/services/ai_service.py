from google import genai

from backend.config import (
    GEMINI_API_KEY,
    MODEL_NAME,
)
client = genai.Client(
    api_key=GEMINI_API_KEY
)

def analyze_resume(
    resume_text: str,
    job_description: str,
):
    """
    Analyze a resume against a job description using Gemini AI.
    """

    prompt = f"""
You are an expert ATS Resume Reviewer.

Compare the following resume with the job description.

Resume:
{resume_text}

Job Description:
{job_description}

Return your answer in this format:

Match Score: <0-100>

Strengths:
- ...

Missing Skills:
- ...

Suggestions:
- ...
"""

    try:

        response = client.models.generate_content(
            model=MODEL_NAME,
            contents=prompt,
        )

        return {
            "success": True,
            "feedback": response.text,
        }

    except Exception as error:

        return {
            "success": False,
            "error": str(error),
        }