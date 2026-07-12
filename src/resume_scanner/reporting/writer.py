"""Write a completed assessment as machine-readable JSON and human-readable Markdown."""

import json
import re
from datetime import datetime, timezone
from pathlib import Path

from resume_scanner.schemas.assessment import Assessment


def write_assessment_reports(
    assessment: Assessment,
    *,
    resume_path: str | Path,
    job_description_path: str | Path,
    model_name: str,
    output_dir: str | Path = "data/outputs",
) -> tuple[Path, Path]:
    """Persist one assessment in JSON and Markdown using the same collision-safe report name."""
    output_path = Path(output_dir)
    output_path.mkdir(parents=True, exist_ok=True)

    generated_at = datetime.now(timezone.utc).replace(microsecond=0).isoformat()
    report_stem = _report_stem(resume_path, generated_at)
    payload = {
        "metadata": {
            "generated_at": generated_at,
            "model": model_name,
            "resume_file": Path(resume_path).name,
            "job_description_file": Path(job_description_path).name,
        },
        "assessment": assessment.model_dump(),
    }

    json_path = output_path / f"{report_stem}.json"
    markdown_path = output_path / f"{report_stem}.md"
    _write_text(json_path, json.dumps(payload, indent=2, ensure_ascii=False) + "\n")
    _write_text(markdown_path, _render_markdown(payload))
    return json_path, markdown_path


def _report_stem(resume_path: str | Path, generated_at: str) -> str:
    safe_name = re.sub(r"[^a-zA-Z0-9_-]+", "_", Path(resume_path).stem).strip("_") or "resume"
    timestamp = generated_at.replace("+00:00", "Z").replace("-", "").replace(":", "")
    return f"assessment_{safe_name}_{timestamp}"


def _write_text(path: Path, content: str) -> None:
    """Use replace-on-completion so a partially written report is never published."""
    temporary_path = path.with_suffix(f"{path.suffix}.tmp")
    temporary_path.write_text(content, encoding="utf-8")
    temporary_path.replace(path)


def _clean_text(value: str) -> str:
    return " ".join(value.split())


def _render_markdown(payload: dict) -> str:
    metadata = payload["metadata"]
    assessment = payload["assessment"]
    lines = [
        "# Resume Assessment Report",
        "",
        f"- **Generated (UTC):** {_clean_text(metadata['generated_at'])}",
        f"- **Model:** {_clean_text(metadata['model'])}",
        f"- **Resume:** {_clean_text(metadata['resume_file'])}",
        f"- **Job description:** {_clean_text(metadata['job_description_file'])}",
        "",
        "## Match Score",
        "",
        f"**{assessment['match_score']}/100** — {_clean_text(assessment['score_rationale'])}",
        "",
        "## Matched Requirements",
        "",
    ]

    if assessment["matched_requirements"]:
        for item in assessment["matched_requirements"]:
            lines.extend([
                f"- **{_clean_text(item['requirement'])}**",
                f"  - Evidence: {_clean_text(item['resume_evidence'])}",
            ])
    else:
        lines.append("- No explicit matched requirements were identified.")

    lines.extend(["", "## Missing Requirements", ""])
    lines.extend(f"- {_clean_text(item)}" for item in assessment["missing_requirements"] or ["No explicit gaps identified."])

    lines.extend(["", "## Truthful Improvement Suggestions", ""])
    lines.extend(f"- {_clean_text(item)}" for item in assessment["suggestions"])

    lines.extend(["", "## Limitations", ""])
    lines.extend(f"- {_clean_text(item)}" for item in assessment["limitations"] or ["No material limitations identified from the supplied text."])
    lines.extend(["", "---", "", "This report is decision support only and must not be the sole basis for an employment decision.", ""])
    return "\n".join(lines)
