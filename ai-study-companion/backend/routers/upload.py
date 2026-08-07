from fastapi import APIRouter, UploadFile, File, HTTPException
from services.pdf_service import extract_text_from_pdf
import os
import shutil

router = APIRouter()

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


@router.post("/upload")
async def upload_document(file: UploadFile = File(...)):

    if not file.filename.endswith(".pdf"):
        raise HTTPException(
            status_code=400,
            detail="Only PDF files are supported currently"
        )

    file_path = os.path.join(UPLOAD_FOLDER, file.filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    extracted_text = extract_text_from_pdf(file_path)

    return {
        "message": "Document uploaded successfully",
        "filename": file.filename,
        "characters": len(extracted_text),
        "preview": extracted_text[:500]
    }