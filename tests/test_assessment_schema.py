import pytest
from pydantic import ValidationError

from resume_scanner.schemas.assessment import Assessment


def test_accepts_valid_assessment():
    result = Assessment(
        match_score=72,
        score_rationale="The resume explicitly shows Python and API experience.",
        matched_requirements=[{"requirement": "Python", "resume_evidence": "Built Python data pipelines."}],
        missing_requirements=["FastAPI"],
        suggestions=["Move Python projects near the top.", "Add outcomes to the data-pipeline bullet."],
        limitations=["The resume does not describe the depth of API experience."],
    )
    assert result.match_score == 72


def test_rejects_out_of_range_score():
    with pytest.raises(ValidationError):
        Assessment(
            match_score=101,
            score_rationale="x",
            suggestions=["a", "b"],
        )
