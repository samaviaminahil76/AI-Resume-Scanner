from backend.models.response_models import ResumeAnalysisResponse


sample = ResumeAnalysisResponse(
    match_score=90,
    strengths=["Python", "FastAPI"],
    missing_keywords=["AWS"],
    suggestions=["Learn AWS"],
    summary="Excellent candidate."
)

print(sample.model_dump())