from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers.upload import router as upload_router
from routers.chat import router as chat_router

app = FastAPI(
    title="AI Study Companion API",
    version="1.0.0"
)

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

app.include_router(upload_router)
app.include_router(chat_router)


@app.get("/")
def home():
    return {
        "message": "AI Study Companion Backend is Running!"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }