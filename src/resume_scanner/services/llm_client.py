"""Gemini provider boundary using the Gemini OpenAI-compatible endpoint."""

from openai import OpenAI

from resume_scanner.config import Settings

GEMINI_OPENAI_BASE_URL = "https://generativelanguage.googleapis.com/v1beta/openai/"


def create_gemini_client(settings: Settings) -> OpenAI:
    return OpenAI(api_key=settings.gemini_api_key, base_url=GEMINI_OPENAI_BASE_URL)
