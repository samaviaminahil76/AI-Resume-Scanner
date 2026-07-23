from fastapi import APIRouter, UploadFile, File, Form

from backend.services.parser_service import extract_text
from backend.services.ai_service import analyze_resume

router = APIRouter()


@router.post("/upload-analyze")
async def upload_analyze(
    resume: UploadFile = File(...),
    job_description: str = Form(...)
):
    resume_bytes = await resume.read()

    resume_text = extract_text(
        resume.filename,
        resume_bytes
    )

    result = analyze_resume(
        resume_text,
        job_description
    )

    return result