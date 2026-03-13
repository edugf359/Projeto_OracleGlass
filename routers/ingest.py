from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from db.supabase_client import supabase
from services.hash import generate_hash
from services.parse import extract_text
from services.chunk import split_into_chunks
from services.embeddings import generate_embeddings

router = APIRouter()

@router.post("/ingest")
async def ingest_file(file: UploadFile = File(...), chat_id: str = Form(...)):
    data = await file.read()
    file_hash = generate_hash(data)

    existing = supabase.table("files").select("id").eq("hash", file_hash).eq("chat_id", chat_id).execute()
    if existing.data:
        return {"cached": True, "file_id": existing.data[0]["id"]}

    text = extract_text(data, file.content_type or "")
    if not text.strip():
        raise HTTPException(status_code=400, detail="Não foi possível extrair texto do arquivo")

    chunks = split_into_chunks(text)
    embeddings = generate_embeddings(chunks)

    file_result = supabase.table("files").insert({
        "chat_id": chat_id,
        "name": file.filename,
        "hash": file_hash
    }).execute()

    file_id = file_result.data[0]["id"]

    rows = [
        {"file_id": file_id, "chat_id": chat_id, "content": chunk, "embedding": emb}
        for chunk, emb in zip(chunks, embeddings)
    ]
    supabase.table("chunks").insert(rows).execute()

    return {"cached": False, "file_id": file_id, "chunks": len(chunks)}
