CHUNK_SIZE = 500
OVERLAP = 50

def split_into_chunks(text: str) -> list[str]:
    words = text.split()
    chunks = []
    start = 0
    while start < len(words):
        end = min(start + CHUNK_SIZE, len(words))
        chunk = " ".join(words[start:end])
        if len(chunk.strip()) > 20:
            chunks.append(chunk)
        start += CHUNK_SIZE - OVERLAP
    return chunks
