import pytest

from resume_scanner.document_reader import DocumentError, read_document


def test_reads_and_normalizes_utf8_text(tmp_path):
    document = tmp_path / "resume.txt"
    document.write_text("  Python developer  \n\n  Built APIs  ", encoding="utf-8")

    assert read_document(document, max_chars=100) == "Python developer\nBuilt APIs"


def test_rejects_unsupported_file_type(tmp_path):
    document = tmp_path / "resume.docx"
    document.write_text("not a docx", encoding="utf-8")

    with pytest.raises(DocumentError, match="Only PDF and TXT"):
        read_document(document, max_chars=100)


def test_rejects_oversized_text(tmp_path):
    document = tmp_path / "resume.txt"
    document.write_text("a" * 11, encoding="utf-8")

    with pytest.raises(DocumentError, match="10-character"):
        read_document(document, max_chars=10)
