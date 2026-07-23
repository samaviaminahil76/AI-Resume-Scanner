import json
import time

from google import genai

from backend.config import (
    GEMINI_API_KEY,
    MODEL_NAME,
    MAX_RETRIES,
    RETRY_BASE_DELAY_SECONDS,
)

from backend.models.response_models import (
    ResumeAnalysisResponse,
)

from backend.prompts.resume_prompt import (
    build_resume_prompt,
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

    prompt = build_resume_prompt(
        resume_text=resume_text,
        job_description=job_description,
    )

    last_error = None

    for attempt in range(1, MAX_RETRIES + 1):

        try:
            response = client.models.generate_content(
                model=MODEL_NAME,
                contents=prompt,
            )

            feedback = json.loads(response.text)

            validated_feedback = ResumeAnalysisResponse(
                **feedback
            )

            return {
                "success": True,
                "feedback": validated_feedback.model_dump(),
            }

        except json.JSONDecodeError:
            last_error = (
                f"Attempt {attempt}: Gemini returned invalid JSON."
            )

        except Exception as error:
            last_error = (
                f"Attempt {attempt}: {str(error)}"
            )

        # Wait before retrying (except after the last attempt)
        if attempt < MAX_RETRIES:
            time.sleep(RETRY_BASE_DELAY_SECONDS)

    return {
        "success": False,
        "error": last_error,
    }