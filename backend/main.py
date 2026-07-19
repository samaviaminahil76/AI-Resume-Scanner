from fastapi import FastAPI, HTTPException

from backend.routes.analyze import router as analyze_router
from backend.utils.validators import validate_job_description
from backend.routes import upload


app = FastAPI(
    title="AI Resume Scanner API",
    description="Backend API for AI-powered Resume Analysis",
    version="1.0.0",
)


@app.get("/", tags=["Home"])
def home():
    """
    Root endpoint to verify the API is running.
    """
    return {
        "message": "Welcome to the AI Resume Scanner API",
        "status": "running",
        "version": "1.0.0",
    }


@app.get("/health", tags=["Health"])
def health_check():
    """
    Health check endpoint.
    Used for monitoring and deployment verification.
    """
    return {
        "status": "healthy",
    }


@app.post("/test-validator", tags=["Testing"])
def test_validator(data: dict):
    """
    Temporary endpoint used to test
    job description validation.

    This endpoint will be removed after
    integrating validation into the main
    analysis workflow.
    """

    try:
        cleaned_text = validate_job_description(
            data["job_description"]
        )

        return {
            "success": True,
            "message": "Validation successful.",
            "cleaned_text": cleaned_text,
            "character_count": len(cleaned_text),
            "word_count": len(cleaned_text.split()),
        }

    except KeyError:
        raise HTTPException(
            status_code=400,
            detail="Missing 'job_description' field.",
        )

    except ValueError as error:
        raise HTTPException(
            status_code=400,
            detail=str(error),
        )


# Register API routes
app.include_router(analyze_router)
app.include_router(upload.router)