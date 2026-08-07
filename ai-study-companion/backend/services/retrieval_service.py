from services.embedding_service import generate_embedding
from services.qdrant_service import create_collection, COLLECTION_NAME


def retrieve_chunks(query: str, limit: int = 3):
    """
    Retrieve the most relevant chunks from Qdrant.
    """

    client = create_collection()

    query_vector = generate_embedding(query)

    response = client.query_points(
        collection_name=COLLECTION_NAME,
        query=query_vector,
        limit=limit,
    )

    return [
        {
            "text": point.payload.get("text", ""),
            "score": point.score,
        }
        for point in response.points
    ]