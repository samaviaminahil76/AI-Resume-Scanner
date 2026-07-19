def build_resume_prompt(
    resume_text: str,
    job_description: str,
) -> str:
    return f"""
You are an expert ATS Resume Reviewer.

Your task is to compare the resume against the job description.

Evaluate:

- Technical skills
- Soft skills
- Experience
- Education
- Certifications
- ATS keyword coverage

Return ONLY valid JSON.

Required JSON format:

{{
    "match_score": 0,
    "strengths": [],
    "missing_keywords": [],
    "suggestions": [],
    "summary": ""
}}

Resume:
{resume_text}

Job Description:
{job_description}
"""