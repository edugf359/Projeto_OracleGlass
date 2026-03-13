from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from db.supabase_client import supabase

router = APIRouter()

class ChatCreate(BaseModel):
    name: str

@router.get("/chats")
def list_chats():
    result = supabase.table("chats").select("*").order("created_at", desc=True).execute()
    return result.data

@router.post("/chats")
def create_chat(body: ChatCreate):
    result = supabase.table("chats").insert({"name": body.name}).execute()
    if not result.data:
        raise HTTPException(status_code=500, detail="Erro ao criar chat")
    return result.data[0]

@router.get("/chats/{chat_id}")
def get_chat(chat_id: str):
    result = supabase.table("chats").select("*, files(*)").eq("id", chat_id).single().execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Chat não encontrado")
    return result.data

@router.delete("/chats/{chat_id}")
def delete_chat(chat_id: str):
    supabase.table("chats").delete().eq("id", chat_id).execute()
    return {"success": True}
