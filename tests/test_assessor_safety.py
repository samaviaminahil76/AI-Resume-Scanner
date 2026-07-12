from resume_scanner.schemas.assessment import Assessment
from resume_scanner.services.assessor import ResumeAssessor


def test_removes_model_speculation_about_date_status():
    assessment = Assessment(
        match_score=80,
        score_rationale="Relevant technical skills are present.",
        suggestions=["Add measurable outcomes.", "Clarify project ownership."],
        limitations=[
            "The resume contains dates that appear to be in the future.",
            "The resume does not state the scale of the projects.",
        ],
    )

    safe_assessment = ResumeAssessor._remove_unsupported_date_claims(assessment)

    assert safe_assessment.limitations == ["The resume does not state the scale of the projects."]
