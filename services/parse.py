from PyPDF2 import PdfReader
from docx import Document
import io

def extract_text(data: bytes, content_type: str) -> str:
    if "pdf" in content_type:
        reader = PdfReader(io.BytesIO(data))
        return "\n".join(page.extract_text() or "" for page in reader.pages)

    if "word" in content_type or content_type.endswith("docx"):
        doc = Document(io.BytesIO(data))
        return "\n".join(p.text for p in doc.paragraphs)

    return data.decode("utf-8", errors="ignore")
