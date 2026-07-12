"""Schema contract for a resume assessment response."""

from pydantic import BaseModel, Field


class MatchedRequirement(BaseModel):
    requirement: str = Field(min_length=1, max_length=300)
    resume_evidence: str = Field(min_length=1, max_length=600)


class Assessment(BaseModel):
    match_score: int = Field(ge=0, le=100)
    score_rationale: str = Field(min_length=1, max_length=800)
    matched_requirements: list[MatchedRequirement] = Field(default_factory=list, max_length=6)
    missing_requirements: list[str] = Field(default_factory=list, max_length=10)
    suggestions: list[str] = Field(min_length=2, max_length=4)
    limitations: list[str] = Field(default_factory=list, max_length=4)
