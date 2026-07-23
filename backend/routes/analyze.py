from fastapi import APIRouter

from backend.models.request_models import ResumeRequest
from backend.services.ai_service import analyze_resume

router = APIRouter()


@router.post("/analyze")
def analyze(request: ResumeRequest):
    return analyze_resume(
        request.resume_text,
        request.job_description,
    )