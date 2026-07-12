# Security and Fairness Requirements

Resumes contain sensitive personal data. This tool must be used as a candidate-assistance and recruiter-support tool, never as the sole basis for employment decisions.

## Required controls

- Obtain consent before upload and disclose that text is sent to the selected AI provider.
- Do not log raw resumes, job descriptions, API keys, or model prompts containing personal data.
- Do not retain uploads/results unless a retention period and delete flow are implemented.
- Restrict accepted file types and enforce file-size/text-length limits.
- Keep API keys in environment variables or a secret manager; rotate exposed keys immediately.

## Scoring boundaries

Assess only job-relevant skills, experience, education/certifications when relevant, and explicit job requirements. Ignore and do not infer protected or sensitive attributes, including names, photos, age, gender, race/ethnicity, religion, disability, marital/family status, nationality, home address, or graduation dates used as an age proxy.

Every score must include evidence from the supplied resume/JD, and suggestions must be framed as improvements to truthful presentation—not instructions to fabricate qualifications.
