from services.retrieval_service import retrieve_chunks
from services.gemini_service import ask_gemini


def answer_question(question: str):
    """
    Retrieve relevant study material and generate
    an answer using Gemini.
    """

    chunks = retrieve_chunks(question)

    context = "\n\n".join(
        chunk["text"]
        for chunk in chunks
    )

    answer = ask_gemini(question, context)

    return {
        "answer": answer,
        "sources": chunks
    }