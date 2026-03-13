from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from dotenv import load_dotenv

from routers import chats, messages, ingest

load_dotenv()

app = FastAPI(title="OracleGlass AI Chat")

app.include_router(chats.router, prefix="/api")
app.include_router(messages.router, prefix="/api")
app.include_router(ingest.router, prefix="/api")

app.mount("/static", StaticFiles(directory="static"), name="static")

@app.get("/")
def index():
    return FileResponse("static/index.html")

@app.get("/new")
def new_chat():
    return FileResponse("static/new_chat.html")

@app.get("/chat/{chat_id}")
def chat_page(chat_id: str):
    return FileResponse("static/chat.html")
