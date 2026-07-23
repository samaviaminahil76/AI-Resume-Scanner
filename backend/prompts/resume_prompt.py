def build_resume_prompt(
    resume_text: str,
    job_description: str,
) -> str:
    return f"""
You are an expert ATS (Applicant Tracking System) Resume Reviewer.

Your task is to compare the candidate's resume with the job description and evaluate how well they match.

Evaluate the following:

- Technical skills
- Soft skills
- Work experience
- Education
- Certifications
- ATS keyword coverage

Instructions:

- Return ONLY valid JSON.
- Do not include markdown.
- Do not wrap the response in triple backticks.
- Do not include any explanation before or after the JSON.
- Ensure the JSON is valid and can be parsed directly.

Required JSON format:

{{
    "match_score": 0,
    "ats_rating": "Poor | Fair | Good | Excellent",
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