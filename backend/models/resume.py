from pydantic import BaseModel

class ResumeRequest(BaseModel):
    resume_text: str
    job_description: str