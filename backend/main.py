from fastapi import FastAPI

from backend.routes.analyze import router as analyze_router


app = FastAPI(
    title="AI Resume Scanner API",
    description="Backend API for AI Resume Scanner",
    version="1.0.0"
)


@app.get("/")
def home():
    return {
        "message": "AI Resume Scanner Backend Running"
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy"
    }


app.include_router(analyze_router)
