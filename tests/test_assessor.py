from types import SimpleNamespace

from resume_scanner.config import Settings
from resume_scanner.schemas.assessment import Assessment
from resume_scanner.services.assessor import ResumeAssessor


class FakeClient:
    def __init__(self, responses):
        self.responses = iter(responses)
        self.calls = []
        self.beta = SimpleNamespace(chat=SimpleNamespace(completions=SimpleNamespace(parse=self.parse)))

    def parse(self, **kwargs):
        self.calls.append(kwargs)
        content = next(self.responses)
        try:
            parsed = Assessment.model_validate_json(content)
        except ValueError:
            parsed = None
        return SimpleNamespace(choices=[SimpleNamespace(message=SimpleNamespace(parsed=parsed))])


def settings() -> Settings:
    return Settings(
        gemini_api_key="test-key",
        model_name="gemini-3-flash-preview",
        max_input_chars=30_000,
        max_retries=2,
        retry_base_delay_seconds=0.001,
        max_output_tokens=1_200,
    )


def test_assessor_returns_validated_assessment():
    client = FakeClient([
        '''{"match_score":72,"score_rationale":"Python is explicitly listed.","matched_requirements":[{"requirement":"Python","resume_evidence":"Skills: Python"}],"missing_requirements":["FastAPI"],"suggestions":["Move Python projects higher.","Add measurable outcomes."],"limitations":["Project depth is not stated."]}'''
    ])

    assessment = ResumeAssessor(client, settings(), sleep=lambda _: None).assess("Skills: Python", "Need Python and FastAPI")

    assert assessment.match_score == 72
    assert client.calls[0]["model"] == "gemini-3-flash-preview"
    assert "<resume>" in client.calls[0]["messages"][1]["content"]
    assert client.calls[0]["response_format"] is Assessment


def test_assessor_retries_invalid_json_once():
    client = FakeClient([
        "not json",
        '''{"match_score":50,"score_rationale":"Some skills match.","matched_requirements":[],"missing_requirements":[],"suggestions":["Clarify projects.","Add tools used."],"limitations":[]}''',
    ])

    assessment = ResumeAssessor(client, settings(), sleep=lambda _: None).assess("resume", "job")

    assert assessment.match_score == 50
    assert len(client.calls) == 2
