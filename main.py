from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import traceback

from routers import chats, messages, ingest

load_dotenv()

app = FastAPI(title="OracleGlass AI Chat", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    traceback.print_exc()
    return JSONResponse(status_code=500, content={"detail": str(exc)})

app.include_router(chats.router, prefix="/api")
app.include_router(messages.router, prefix="/api")
app.include_router(ingest.router, prefix="/api")

@app.get("/health")
def health():
    return {"status": "ok"}

@app.get("/")
def index():
    return FileResponse("static/index.html")

@app.get("/new")
def new_chat():
    return FileResponse("static/new_chat.html")

@app.get("/chat/{chat_id}")
def chat_page(chat_id: str):
    return FileResponse("static/chat.html")

app.mount("/static", StaticFiles(directory="static"), name="static")