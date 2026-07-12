# AI Resume Scanner

An AI-assisted resume-to-job-description matcher. It extracts resume text, compares it against a job description, and returns a structured, explainable assessment.

## What it should do

- Accept a PDF or text resume and a job description.
- Extract text locally and send only the necessary text to the model.
- Return validated JSON: match score, matched and missing skills, evidence, and actionable suggestions.
- Clearly state that it is decision support, not an automated hiring decision.

## Project layout

```text
AI Resume Scanner/
├── src/resume_scanner/       # Application code
│   ├── prompts/              # Versioned LLM prompts
│   └── schemas/              # Pydantic output contracts
├── tests/                    # Unit and integration tests
├── data/
│   ├── samples/              # Safe, fictional test fixtures
│   ├── uploads/              # Ignored local uploads
│   └── outputs/              # Ignored local results
├── docs/                     # Product, architecture, and security notes
├── .env.example              # Environment variable template
└── pyproject.toml              # Dependencies and package settings
```

## Quick start

1. Create a virtual environment: `python -m venv .venv`
2. Activate it in PowerShell: `.\.venv\Scripts\Activate.ps1`
3. Install the app and development dependencies: `pip install -e ".[dev]"`
4. Copy `.env.example` to `.env`, then add your own key.
5. Run the included fictional sample:
   `python -m resume_scanner.cli data/samples/sample_resume.txt data/samples/sample_job_description.txt`

Replace those paths with your actual resume and job-description files when ready. Both PDF and UTF-8 TXT files are supported.

Every successful scan writes two files to `data/outputs/`:

- `assessment_<resume>_<timestamp>.json` — structured data for an API, dashboard, or database.
- `assessment_<resume>_<timestamp>.md` — a readable report for a person.

Use `--output-dir <path>` to save reports elsewhere.

The default model is `gemini-3-flash-preview` (Gemini 3 Flash). Override `MODEL_NAME` only when you deliberately choose a different supported Gemini model.

## Build order

Follow [docs/IMPLEMENTATION_PLAN.md](docs/IMPLEMENTATION_PLAN.md). Start by implementing `src/resume_scanner/schemas/assessment.py`, then the document reader and LLM service. Do not connect a UI until the schema validation and tests pass.

## Security note

A credential was previously embedded in the demo script. It has been removed from the source. Revoke/rotate that key in the provider console before continuing. Keep credentials only in `.env` or a secrets manager.
