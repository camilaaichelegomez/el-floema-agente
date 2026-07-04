"""
MongoDB Atlas — El Floema
Persistencia asíncrona para conversaciones del agente botánico.

Requiere: pip install motor
Variables de entorno: MONGODB_URI, MONGODB_DB (default: el-floema)
"""
from __future__ import annotations
import os
from datetime import datetime, timezone

MONGODB_URI = os.getenv("MONGODB_URI", "")
MONGODB_DB  = os.getenv("MONGODB_DB", "el-floema")

_client = None
_db     = None


def _get_db():
    global _client, _db
    if not MONGODB_URI:
        return None
    if _db is None:
        try:
            import motor.motor_asyncio as motor
            _client = motor.AsyncIOMotorClient(MONGODB_URI)
            _db = _client[MONGODB_DB]
        except ImportError:
            print("[MongoDB] motor no instalado — ejecuta: pip install motor")
            return None
    return _db


def _now() -> datetime:
    return datetime.now(timezone.utc)


async def guardar_mensaje(
    session_id: str,
    pregunta: str,
    respuesta: str,
    fuentes: list[dict],
) -> None:
    """Persiste un intercambio usuario↔agente en la colección conversaciones."""
    db = _get_db()
    if db is None:
        return
    ahora = _now()
    nuevos = [
        {"rol": "usuario", "contenido": pregunta,  "timestamp": ahora},
        {"rol": "agente",  "contenido": respuesta, "fuentes": fuentes, "timestamp": ahora},
    ]
    await db["conversaciones"].update_one(
        {"session_id": session_id},
        {
            "$setOnInsert": {
                "session_id": session_id,
                "titulo": pregunta[:60],
                "creado_at": ahora,
            },
            "$set":  {"actualizado_at": ahora},
            "$push": {"mensajes": {"$each": nuevos}},
        },
        upsert=True,
    )
