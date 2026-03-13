import os
from openai import OpenAI

client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))

def generate_answer(question: str, chunks: list[dict], history: list[dict]) -> str:
    context = "\n\n---\n\n".join(c["content"] for c in chunks)

    system_prompt = f"""Você é um assistente que responde perguntas com base nos documentos fornecidos.
Use apenas as informações do contexto abaixo para responder.
Se a resposta não estiver no contexto, diga isso claramente.

Contexto dos documentos:
{context}"""

    messages = [{"role": "system", "content": system_prompt}]

    for msg in history[-10:]:
        messages.append({"role": msg["role"], "content": msg["content"]})

    messages.append({"role": "user", "content": question})

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=messages,
        temperature=0.2
    )
    return response.choices[0].message.content or ""
