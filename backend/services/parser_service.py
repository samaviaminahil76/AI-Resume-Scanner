from io import BytesIO
from pathlib import Path

from pypdf import PdfReader
from docx import Document


def extract_pdf_text(file_bytes: bytes) -> str:
    """
    Extract text from a PDF file.
    """

    reader = PdfReader(BytesIO(file_bytes))

    text = ""

    for page in reader.pages:
        page_text = page.extract_text()

        if page_text:
            text += page_text + "\n"

    return text.strip()


def extract_docx_text(file_bytes: bytes) -> str:
    """
    Extract text from a DOCX file.
    """

    document = Document(BytesIO(file_bytes))

    text = "\n".join(
        paragraph.text
        for paragraph in document.paragraphs
    )

    return text.strip()


def extract_txt_text(file_bytes: bytes) -> str:
    """
    Extract text from a TXT file.
    """

    return file_bytes.decode("utf-8").strip()


def extract_text(filename: str, file_bytes: bytes) -> str:
    """
    Detect the file type and call the correct parser.
    """

    extension = Path(filename).suffix.lower()

    if extension == ".pdf":
        return extract_pdf_text(file_bytes)

    if extension == ".docx":
        return extract_docx_text(file_bytes)

    if extension == ".txt":
        return extract_txt_text(file_bytes)

    raise ValueError(
        f"Unsupported file type: {extension}"
    )