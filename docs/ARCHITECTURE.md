# Architecture

## Request flow

```text
Resume PDF/TXT + Job Description
            ↓
Document extraction and size checks
            ↓
PII-aware logging (no raw resume content)
            ↓
Prompt builder + LLM provider
            ↓
JSON parsing + Pydantic validation
            ↓
Assessment response / UI
```

## Module responsibilities

| Module | Responsibility |
|---|---|
| `document_reader.py` | Read PDF/TXT and normalize text. |
| `schemas/assessment.py` | Define and validate the model response. |
| `services/llm_client.py` | Make provider calls; no business logic. |
| `services/assessor.py` | Build prompt, retry safely, validate output. |
| `prompts/resume_assessment.md` | Versioned system prompt. |
| `api.py` | HTTP boundary if/when FastAPI is added. |

## Design rules

- Keep prompts, provider calls, parsing, and UI separate.
- Use Gemini structured output with the Pydantic schema, then validate again locally.
- Never use protected traits or proxies (name, photo, age, gender, ethnicity, religion, disability, nationality, address) in scoring.
- Treat model output as untrusted input. Reject invalid data, do not silently coerce it.
- Store no resumes by default. If storage is later required, define retention and deletion controls first.
