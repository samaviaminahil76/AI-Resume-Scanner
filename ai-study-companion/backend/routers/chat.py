from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from services.retrieval_service import retrieve_chunks
from services.gemini_service import ask_gemini

router = APIRouter()


class Question(BaseModel):
    question: str


@router.post("/ask")
async def ask_question(data: Question):
    try:
        chunks = retrieve_chunks(data.question)

        context = "\n\n".join(chunks)

        answer = ask_gemini(data.question, context)

        return {
            "question": data.question,
            "answer": answer,
            "sources": chunks
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))