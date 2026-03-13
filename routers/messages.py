from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from db.supabase_client import supabase
from services.retrieval import retrieve_chunks
from services.chat import generate_answer

router = APIRouter()

class MessageCreate(BaseModel):
    content: str

@router.get("/messages/{chat_id}")
def list_messages(chat_id: str):
    result = supabase.table("messages").select("*").eq("chat_id", chat_id).order("created_at").execute()
    return result.data

@router.post("/messages/{chat_id}")
def send_message(chat_id: str, body: MessageCreate):
    supabase.table("messages").insert({
        "chat_id": chat_id,
        "role": "user",
        "content": body.content
    }).execute()

    history_result = supabase.table("messages").select("*").eq("chat_id", chat_id).order("created_at").execute()
    history = history_result.data or []

    chunks = retrieve_chunks(body.content, chat_id)

    if not chunks:
        raise HTTPException(status_code=400, detail="Nenhum documento encontrado neste chat")

    answer = generate_answer(body.content, chunks, history)

    saved = supabase.table("messages").insert({
        "chat_id": chat_id,
        "role": "assistant",
        "content": answer
    }).execute()

    return {
        "message": saved.data[0],
        "sources": chunks
    }
