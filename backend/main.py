from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from backend.routes.analyze import router as analyze_router
from backend.routes import upload
from backend.utils.validators import validate_job_description

app = FastAPI(
    title="AI Resume Scanner API",
    description="Backend API for AI-powered Resume Analysis",
    version="1.0.0",
)

# Allow Next.js frontend to communicate with FastAPI
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
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
    """
    return {
        "status": "healthy",
    }


@app.post("/test-validator", tags=["Testing"])
def test_validator(data: dict):
    """
    Temporary endpoint used to test
    job description validation.
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