from qdrant_client.models import PointStruct
from services.embedding_service import generate_embedding
from services.qdrant_service import create_collection, COLLECTION_NAME


def store_chunks(chunks):
    client = create_collection()

    points = []

    for i, chunk in enumerate(chunks):
        embedding = generate_embedding(chunk)

        points.append(
            PointStruct(
                id=i,
                vector=embedding,
                payload={
                    "text": chunk
                }
            )
        )

    client.upsert(
        collection_name=COLLECTION_NAME,
        points=points
    )

    return len(points)