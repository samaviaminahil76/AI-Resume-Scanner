from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from services.chat_service import answer_question

router = APIRouter()


class Question(BaseModel):
    question: str


@router.post("/ask")
async def ask_question(data: Question):
    try:
        result = answer_question(data.question)

        return {
            "question": data.question,
            "answer": result["answer"],
            "sources": result["sources"]
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )