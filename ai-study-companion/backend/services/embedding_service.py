from sentence_transformers import SentenceTransformer

# Load the embedding model only once
model = SentenceTransformer("all-MiniLM-L6-v2")


def generate_embedding(text: str):
    """
    Convert a single text chunk into an embedding vector.
    """

    embedding = model.encode(text)

    return embedding.tolist()


def generate_embeddings(chunks: list[str]):
    """
    Generate embeddings for multiple chunks.
    """

    embeddings = []

    for index, chunk in enumerate(chunks):
        embeddings.append(
            {
                "chunk_index": index,
                "text": chunk,
                "embedding": generate_embedding(chunk)
            }
        )

    return embeddings