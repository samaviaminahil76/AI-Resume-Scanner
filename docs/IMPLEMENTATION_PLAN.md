# Implementation Plan

## 1. Foundation

- [ ] Create `Assessment` and nested Pydantic schemas.
- [ ] Add PDF/TXT extraction with file type, size, and empty-text checks.
- [ ] Load configuration from environment variables only.
- [ ] Add unit tests for validation and document extraction.

## 2. AI assessment

- [ ] Load the versioned prompt from `src/resume_scanner/prompts/`.
- [ ] Send resume/JD text with clear delimiters.
- [ ] Request JSON only and validate against `Assessment`.
- [ ] Retry `429`/transient `5xx` failures with bounded exponential backoff and jitter; never retry `400`/`401`/`403` errors.
- [ ] Return a safe error to the user without exposing provider details.

## 3. Product surface

- [ ] Add a small FastAPI endpoint or Streamlit UI.
- [ ] Show the score as guidance with evidence and limitations.
- [ ] Add explicit consent before file upload.
- [ ] Add deletion/retention behavior before persisting any files.

## 4. Quality gate

- [ ] Test strong, partial, and weak fictional resumes.
- [ ] Test malformed model responses and provider timeouts.
- [ ] Confirm protected traits do not affect output.
- [ ] Run `pytest` and manually inspect outputs before demoing.
