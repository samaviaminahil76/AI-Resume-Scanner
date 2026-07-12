"""Command-line entry point for local, consented resume assessments."""

import argparse
import sys

from resume_scanner.config import ConfigurationError, Settings
from resume_scanner.document_reader import DocumentError, read_document
from resume_scanner.reporting.writer import write_assessment_reports
from resume_scanner.services.assessor import AssessmentError, ResumeAssessor
from resume_scanner.services.llm_client import create_gemini_client


def main() -> int:
    parser = argparse.ArgumentParser(description="AI-assisted resume-to-job-description feedback")
    parser.add_argument("resume", help="Path to a PDF or UTF-8 TXT resume")
    parser.add_argument("job_description", help="Path to a PDF or UTF-8 TXT job description")
    parser.add_argument(
        "--output-dir",
        default="data/outputs",
        help="Directory where JSON and Markdown reports are saved (default: data/outputs)",
    )
    args = parser.parse_args()

    try:
        settings = Settings.from_environment()
        resume = read_document(args.resume, max_chars=settings.max_input_chars)
        job_description = read_document(args.job_description, max_chars=settings.max_input_chars)
        assessment = ResumeAssessor(create_gemini_client(settings), settings).assess(resume, job_description)
        json_path, markdown_path = write_assessment_reports(
            assessment,
            resume_path=args.resume,
            job_description_path=args.job_description,
            model_name=settings.model_name,
            output_dir=args.output_dir,
        )
    except (ConfigurationError, DocumentError, AssessmentError) as error:
        print(f"Error: {error}", file=sys.stderr)
        return 1

    print(f"Assessment complete: {assessment.match_score}/100")
    print(f"JSON report: {json_path}")
    print(f"Markdown report: {markdown_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
