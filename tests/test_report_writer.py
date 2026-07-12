import json

from resume_scanner.reporting.writer import write_assessment_reports
from resume_scanner.schemas.assessment import Assessment


def test_writes_json_and_markdown_reports(tmp_path):
    assessment = Assessment(
        match_score=82,
        score_rationale="The resume explicitly shows Python experience.",
        matched_requirements=[{"requirement": "Python", "resume_evidence": "Built Python APIs."}],
        missing_requirements=["FastAPI"],
        suggestions=["Add project outcomes.", "Clarify API ownership."],
        limitations=["Project scale is not stated."],
    )

    json_path, markdown_path = write_assessment_reports(
        assessment,
        resume_path="candidate_resume.pdf",
        job_description_path="ai_engineer.txt",
        model_name="gemini-3-flash-preview",
        output_dir=tmp_path,
    )

    assert json_path.exists()
    assert markdown_path.exists()
    assert json.loads(json_path.read_text(encoding="utf-8"))["assessment"]["match_score"] == 82
    assert "# Resume Assessment Report" in markdown_path.read_text(encoding="utf-8")
