from fastapi import APIRouter, UploadFile, File

from backend.services.parser_service import extract_text
from backend.services.ai_service import analyze_resume

router = APIRouter()


@router.post("/upload-analyze")
async def upload_analyze(
    resume: UploadFile = File(...),
    job_description: UploadFile = File(...)
):

    resume_bytes = await resume.read()
    job_bytes = await job_description.read()

    resume_text = extract_text(
        resume.filename,
        resume_bytes
    )

    job_text = extract_text(
        job_description.filename,
        job_bytes
    )

    result = analyze_resume(
        resume_text,
        job_text
    )

    return result