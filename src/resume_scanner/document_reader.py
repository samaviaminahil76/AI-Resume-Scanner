"""Safe, local extraction for supported resume and job-description documents."""

from pathlib import Path

from pypdf import PdfReader

SUPPORTED_SUFFIXES = {".pdf", ".txt"}


class DocumentError(ValueError):
    """Raised when a supplied document cannot safely be processed."""


def read_document(path: str | Path, *, max_chars: int) -> str:
    """Extract non-empty PDF or UTF-8 text without sending files to the provider."""
    document_path = Path(path)
    if not document_path.is_file():
        raise DocumentError("The supplied document was not found.")
    if document_path.suffix.lower() not in SUPPORTED_SUFFIXES:
        raise DocumentError("Only PDF and TXT documents are supported.")

    try:
        if document_path.suffix.lower() == ".pdf":
            text = "\n".join(page.extract_text() or "" for page in PdfReader(document_path).pages)
        else:
            text = document_path.read_text(encoding="utf-8")
    except Exception as error:
        raise DocumentError("The document could not be read. Ensure it is a valid, unprotected file.") from error

    normalized = "\n".join(line.strip() for line in text.splitlines() if line.strip()).strip()
    if not normalized:
        raise DocumentError("No readable text was found in the document.")
    if len(normalized) > max_chars:
        raise DocumentError(f"Document text exceeds the {max_chars:,}-character limit.")
    return normalized
