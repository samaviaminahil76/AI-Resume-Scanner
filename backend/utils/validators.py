import re

MAX_JOB_DESCRIPTION_CHARS = 30000
MIN_JOB_DESCRIPTION_CHARS = 50


def validate_job_description(text: str) -> str:
    """
    Validate and normalize a job description.

    Returns:
        Cleaned job description.

    Raises:
        ValueError: If the input is invalid.
    """

    if text is None:
        raise ValueError("Job description is required.")

    # Remove leading/trailing whitespace
    text = text.strip()

    if not text:
        raise ValueError("Job description cannot be empty.")

    # Replace multiple spaces/tabs with a single space
    text = re.sub(r"[ \t]+", " ", text)

    # Replace 3+ blank lines with a maximum of 2
    text = re.sub(r"\n{3,}", "\n\n", text)

    if len(text) < MIN_JOB_DESCRIPTION_CHARS:
        raise ValueError(
            f"Job description must be at least {MIN_JOB_DESCRIPTION_CHARS} characters."
        )

    if len(text) > MAX_JOB_DESCRIPTION_CHARS:
        raise ValueError(
            f"Job description exceeds the maximum limit of {MAX_JOB_DESCRIPTION_CHARS} characters."
        )

    return text