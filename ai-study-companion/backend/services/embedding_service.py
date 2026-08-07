from sentence_transformers import SentenceTransformer

# Load the embedding model only once
model = SentenceTransformer("all-MiniLM-L6-v2")


def generate_embedding(text: str):
    """
    Convert a single text chunk into an embedding vector.
    """
    embedding = model.encode(text)
    return embedding.tolist()