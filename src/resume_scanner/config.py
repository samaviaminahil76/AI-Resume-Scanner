"""Application configuration loaded from environment variables."""

from dataclasses import dataclass
from os import getenv

from dotenv import load_dotenv


class ConfigurationError(ValueError):
    """Raised when required application configuration is missing or invalid."""


def _positive_int(name: str, default: int) -> int:
    value = int(getenv(name, str(default)))
    if value < 1:
        raise ConfigurationError(f"{name} must be at least 1.")
    return value


@dataclass(frozen=True)
class Settings:
    gemini_api_key: str
    model_name: str
    max_input_chars: int
    max_retries: int
    retry_base_delay_seconds: float
    max_output_tokens: int

    @classmethod
    def from_environment(cls) -> "Settings":
        load_dotenv()
        api_key = getenv("GEMINI_API_KEY", "").strip()
        if not api_key or api_key == "replace_with_your_key":
            raise ConfigurationError("GEMINI_API_KEY is required. Add it to .env or your environment.")

        retry_delay = float(getenv("RETRY_BASE_DELAY_SECONDS", "2"))
        if retry_delay <= 0:
            raise ConfigurationError("RETRY_BASE_DELAY_SECONDS must be greater than 0.")

        return cls(
            gemini_api_key=api_key,
            model_name=getenv("MODEL_NAME", "gemini-3-flash-preview"),
            max_input_chars=_positive_int("MAX_INPUT_CHARS", 30_000),
            max_retries=_positive_int("MAX_RETRIES", 4),
            retry_base_delay_seconds=retry_delay,
            max_output_tokens=_positive_int("MAX_OUTPUT_TOKENS", 2_400),
        )
