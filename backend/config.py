import os
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
APP_ENV = os.getenv("APP_ENV")
MODEL_NAME = "gemini-3.5-flash"

MAX_INPUT_CHARS = int(os.getenv("MAX_INPUT_CHARS", "30000"))
MAX_OUTPUT_TOKENS = int(os.getenv("MAX_OUTPUT_TOKENS", "2400"))
MAX_RETRIES = int(os.getenv("MAX_RETRIES", "4"))
RETRY_BASE_DELAY_SECONDS = int(os.getenv("RETRY_BASE_DELAY_SECONDS", "2"))