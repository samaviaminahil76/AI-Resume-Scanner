def chunk_text(text: str, chunk_size: int = 500):
    """
    Splits text into chunks of approximately chunk_size characters.
    """

    paragraphs = text.split("\n")

    chunks = []
    current_chunk = ""

    for paragraph in paragraphs:
        if len(current_chunk) + len(paragraph) < chunk_size:
            current_chunk += paragraph + "\n"
        else:
            if current_chunk.strip():
                chunks.append(current_chunk.strip())
            current_chunk = paragraph + "\n"

    if current_chunk.strip():
        chunks.append(current_chunk.strip())

    return chunks