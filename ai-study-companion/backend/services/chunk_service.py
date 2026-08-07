def chunk_text(text: str, chunk_size: int = 400):
    """
    Splits text into meaningful chunks.
    Approximation:
    1 token ≈ 4 characters, so 400 tokens ≈ 1600 characters.
    """

    paragraphs = [
        p.strip()
        for p in text.split("\n")
        if p.strip()
    ]

    chunks = []
    current_chunk = ""

    max_characters = chunk_size * 4

    for paragraph in paragraphs:

        if len(current_chunk) + len(paragraph) <= max_characters:
            current_chunk += paragraph + "\n"

        else:
            if current_chunk:
                chunks.append(current_chunk.strip())

            current_chunk = paragraph + "\n"

    if current_chunk:
        chunks.append(current_chunk.strip())

    return chunks