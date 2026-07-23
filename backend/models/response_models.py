from pydantic import BaseModel, Field


class ResumeAnalysisResponse(BaseModel):
    """
    Structured response returned by Gemini.
    """

    match_score: int = Field(
        ge=0,
        le=100,
    )

    strengths: list[str]

    missing_keywords: list[str]

    suggestions: list[str]

    summary: str