"""Load prompt assets without relying on the process working directory."""

from importlib.resources import files


def load_resume_assessment_prompt() -> str:
    return files("resume_scanner.prompts").joinpath("resume_assessment.md").read_text(encoding="utf-8")
