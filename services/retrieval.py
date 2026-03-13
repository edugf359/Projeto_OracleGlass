from db.supabase_client import supabase
from services.embeddings import generate_embedding

def retrieve_chunks(query: str, chat_id: str, limit: int = 5) -> list[dict]:
    embedding = generate_embedding(query)
    result = supabase.rpc("match_chunks", {
        "query_embedding": embedding,
        "match_chat_id": chat_id,
        "match_count": limit
    }).execute()
    return result.data or []
