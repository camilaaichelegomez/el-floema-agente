#!/usr/bin/env python3
"""
Servidor FastAPI para el Agente Botánico — El Floema
Expone POST /consulta para el frontend Next.js.

Uso:
    python api_botanico.py
    # Escucha en http://localhost:8001
"""
import sys
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from agente_botanico import (
    get_credentials,
    search_articles,
    ask_gemini,
    GCP_PROJECT,
    GCP_LOCATION,
    GEMINI_MODEL,
)
from google import genai
import mongodb_botanico

_client: genai.Client | None = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    global _client
    credentials = get_credentials()
    _client = genai.Client(
        vertexai=True,
        project=GCP_PROJECT,
        location=GCP_LOCATION,
        credentials=credentials,
    )
    print(f"Agente botánico listo — modelo: {GEMINI_MODEL}")
    yield


app = FastAPI(title="Agente Botánico El Floema", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)


class ConsultaRequest(BaseModel):
    pregunta: str
    historial: list[dict] = []
    session_id: str = ""


class Fuente(BaseModel):
    title: str
    source: str
    plant_key: str
    similarity: float
    doi: str = ""
    url: str = ""
    year: str | int = ""


class ConsultaResponse(BaseModel):
    respuesta: str
    fuentes: list[Fuente]
    session_id: str = ""


@app.post("/consulta", response_model=ConsultaResponse)
async def consulta(req: ConsultaRequest):
    if not req.pregunta.strip():
        raise HTTPException(status_code=400, detail="La pregunta no puede estar vacía.")

    articles = search_articles(req.pregunta)
    respuesta = ask_gemini(_client, req.pregunta, articles, req.historial)

    fuentes = [
        Fuente(
            title=a["title"],
            source=a["source"],
            plant_key=a["plant_key"],
            similarity=a["similarity"],
            doi=a.get("doi", ""),
            url=a.get("url", ""),
            year=a.get("year", ""),
        )
        for a in articles[:4]
    ]

    if req.session_id:
        fuentes_dict = [f.model_dump() for f in fuentes]
        await mongodb_botanico.guardar_mensaje(
            req.session_id, req.pregunta, respuesta, fuentes_dict
        )

    return ConsultaResponse(respuesta=respuesta, fuentes=fuentes, session_id=req.session_id)


@app.get("/health")
async def health():
    return {"status": "ok", "modelo": GEMINI_MODEL}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001, log_level="info")
