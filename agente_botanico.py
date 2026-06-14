#!/usr/bin/env python3
"""
Agente Conversacional Botánico — El Floema
Gemini 2.5 Flash + Supabase pgvector RAG + MongoDB Atlas + interfaz web
"""

import argparse
import os
import sys
import traceback
from pathlib import Path
from datetime import datetime, timezone

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

try:
    from google import genai
    from google.genai import types
    import google.auth
    import google.auth.transport.requests
    from google.oauth2 import service_account
except ImportError:
    print("Ejecuta: pip install google-genai google-auth")
    sys.exit(1)

try:
    from supabase import create_client as _supabase_create_client
except ImportError:
    print("Ejecuta: pip install supabase")
    sys.exit(1)

try:
    from pymongo import MongoClient
    from pymongo.server_api import ServerApi
    MONGO_AVAILABLE = True
except ImportError:
    print("MongoDB no disponible. Ejecuta: pip install pymongo")
    MONGO_AVAILABLE = False

try:
    from flask import Flask, request, jsonify, render_template_string, Response
    from flask_cors import CORS
    FLASK_AVAILABLE = True
except ImportError:
    FLASK_AVAILABLE = False

_cache = {}

SUPABASE_URL  = os.environ.get("SUPABASE_URL", "https://powpibehemondwobngxh.supabase.co")
SUPABASE_KEY  = os.environ.get("SUPABASE_KEY", "")
EMBED_MODEL   = "text-embedding-004"
GEMINI_MODEL  = "gemini-2.5-flash"
GCP_PROJECT  = "gen-lang-client-0826649426"
GCP_LOCATION = "us-central1"
TOP_K        = 6
MAX_TOKENS   = 16384
SA_KEY_FILE  = Path("gemini_service_account.json")

MONGO_URI = "mongodb+srv://elfloema:123jaboneS!@cluster0.ymjxhlu.mongodb.net/?appName=Cluster0"
MONGO_DB  = "elfloema"
MONGO_COL = "consultas"

_mongo_collection = None

def get_mongo_collection():
    global _mongo_collection
    if _mongo_collection is None and MONGO_AVAILABLE:
        try:
            client = MongoClient(MONGO_URI, server_api=ServerApi('1'))
            client.admin.command('ping')
            print("MongoDB conectado")
            _mongo_collection = client[MONGO_DB][MONGO_COL]
        except Exception as e:
            print(f"MongoDB no disponible: {e}")
    return _mongo_collection

def save_to_mongo(question, response, articles, session_id="web"):
    col = get_mongo_collection()
    if col is None:
        return
    try:
        col.insert_one({
            "session_id":     session_id,
            "timestamp":      datetime.now(timezone.utc),
            "question":       question,
            "response":       response,
            "sources_count":  len(articles),
            "top_similarity": articles[0]["similarity"] if articles else 0,
            "plants_detected": list({a["plant_key"] for a in articles if a["plant_key"]}),
            "model":          GEMINI_MODEL,
        })
    except Exception as e:
        print(f"Error guardando en MongoDB: {e}")

def get_credentials():
    scopes = ["https://www.googleapis.com/auth/cloud-platform"]
    if SA_KEY_FILE.exists():
        return service_account.Credentials.from_service_account_file(str(SA_KEY_FILE), scopes=scopes)
    try:
        credentials, _ = google.auth.default(scopes=scopes)
        return credentials
    except Exception as e:
        print(f"ERROR credenciales: {e}")
        sys.exit(1)

_gemini_client   = None
_supabase_client = None

def _get_gemini_client():
    global _gemini_client
    if _gemini_client is None:
        credentials = get_credentials()
        _gemini_client = genai.Client(
            vertexai=True,
            project=GCP_PROJECT,
            location=GCP_LOCATION,
            credentials=credentials,
        )
        print(f"Gemini autenticado | modelo: {GEMINI_MODEL}")
    return _gemini_client

def _get_supabase():
    global _supabase_client
    if _supabase_client is None:
        _supabase_client = _supabase_create_client(SUPABASE_URL, SUPABASE_KEY)
    return _supabase_client

_PLANT_ALIASES = {
    "boldo": "boldo", "matico": "matico", "maqui": "maqui",
    "arrayán": "arrayan", "arrayan": "arrayan", "pitra": "pitra",
    "triwe": "triwe", "chilco": "chilco", "milenrama": "milenrama",
    "llantén": "llanten", "llanten": "llanten",
    "rosa mosqueta": "rosa_mosqueta", "bailahuen": "bailahuen",
    "canelo": "canelo", "menta": "menta", "melisa": "melisa",
    "toronjil": "melisa", "paico": "paico", "palqui": "palqui",
}

def _detect_plant_key(query):
    q = query.lower()
    for alias, key in _PLANT_ALIASES.items():
        if alias in q:
            return key
    return None

def _row_to_article(row):
    return {
        "similarity": round(float(row.get("similarity", 0)), 3),
        "title":      row.get("title", ""),
        "authors":    row.get("authors", ""),
        "year":       row.get("year") or "",
        "journal":    row.get("journal", ""),
        "source":     row.get("source", ""),
        "plant_key":  row.get("plant_key", ""),
        "doi":        row.get("doi", ""),
        "snippet":    row.get("snippet", ""),
    }

def search_articles(query, top_k=TOP_K):
    try:
        result    = _get_gemini_client().models.embed_content(
            model=EMBED_MODEL,
            contents=query,
        )
        embedding = result.embeddings[0].values
        client    = _get_supabase()
        plant_key = _detect_plant_key(query)

        # Request extra results so we can prioritize plant_key matches client-side
        fetch_count = top_k * 2 if plant_key else top_k
        res = client.rpc("buscar_articulos", {
            "query_embedding": embedding,
            "match_count": fetch_count,
        }).execute()

        seen     = set()
        priority = []
        rest     = []
        for row in res.data:
            a = _row_to_article(row)
            if a["title"] in seen:
                continue
            seen.add(a["title"])
            if plant_key and a["plant_key"] == plant_key:
                priority.append(a)
            else:
                rest.append(a)

        return (priority + rest)[:top_k]
    except Exception as e:
        print(f"Supabase no disponible: {e}")
        return []

def format_context(articles):
    lines = []
    for i, a in enumerate(articles, 1):
        cita = f"{a['authors']} ({a['year']}). {a['title']}."
        if a["journal"]:
            cita += f" {a['journal']}."
        if a["doi"]:
            cita += f" DOI: {a['doi']}"
        lines.append(f"[{i}] {a['source']} | {a['plant_key']} | sim:{a['similarity']}\n    {cita}\n    {a['snippet']}\n")
    return "\n".join(lines)

SYSTEM_PROMPT = """Eres un guía de medicina integrativa y botánica para El Floema, una plataforma de conocimiento sobre plantas medicinales y salud holística. Tu misión es EDUCAR — no solo decir qué hacer, sino explicar el PORQUÉ detrás de cada recomendación, para que la persona comprenda su cuerpo y tome decisiones informadas.

Tu conocimiento integra de forma profunda:

1. FITOTERAPIA OCCIDENTAL: Para cada planta menciona sus componentes activos principales (ej: silimarina en cardo mariano, curcumina en cúrcuma) y explica el mecanismo de acción específico (ej: "la silimarina inhibe la peroxidación lipídica en los hepatocitos, protegiendo las membranas celulares del daño oxidativo"). Cuando sea posible, cita la evidencia científica disponible [N].

2. MEDICINA TRADICIONAL CHINA (MTC): Explica el órgano desde la visión energética china (ej: el hígado almacena la sangre y regula el flujo de Qi; su emoción asociada es la ira). Menciona el meridiano correspondiente y 2-3 puntos de acupresión específicos con su localización y por qué estimularlos ayuda (ej: "LV3 Taichong, en el dorso del pie entre el 1° y 2° metatarsiano — mueve el Qi estancado del hígado y calma la mente").

3. AYURVEDA: Explica desde los doshas (ej: el hígado se relaciona con Pitta — fuego y transformación). Menciona hierbas ayurvédicas relevantes con su rasayana (efecto rejuvenecedor) y su acción específica. Recomienda hábitos alimentarios desde la visión ayurvédica (ej: "evitar alimentos muy picantes o fritos que agravan Pitta").

4. YOGA Y MOVIMIENTO: Recomienda 2-3 posturas (asanas) específicas y explica el mecanismo fisiológico por el que ayudan (ej: "las torsiones como Ardha Matsyendrasana comprimen y liberan el hígado y el páncreas, estimulando la circulación sanguínea y linfática en esa zona"). Menciona también pranayamas o prácticas de respiración cuando sean relevantes.

5. HÁBITOS INTEGRALES: Recomienda hábitos desde las tres visiones:
   - Occidental: alimentación basada en evidencia, suplementación, ritmos circadianos
   - MTC: horarios de los meridianos (ej: el hígado es más activo entre 1-3am), emociones a trabajar
   - Ayurveda: rutinas diarias (dinacharya), alimentos según dosha, estaciones

6. SINERGIAS: Cuando menciones varias plantas, explica cómo se potencian entre sí y en qué orden o combinación tienen más sentido.

ESTRUCTURA DE RESPUESTA:
Organiza siempre la respuesta en secciones claras:
🌿 Comprende tu [órgano/sistema] — fisiología breve
🌱 Plantas que pueden ayudar — con componentes activos y mecanismo
☯️ Visión de la Medicina Tradicional China
🪷 Visión Ayurvédica  
🧘 Movimiento y Yoga
🌅 Hábitos integrales
✨ Sinergias y cómo potenciar

REGLAS OBLIGATORIAS:
- SIEMPRE explica el PORQUÉ de cada recomendación — este es el valor diferencial
- Usa lenguaje orientativo: "se ha observado...", "desde la MTC se considera...", "en la tradición ayurvédica se sugiere..."
- Advierte claramente cuando el tema requiera consultar un profesional de salud
- Cita fuentes científicas con [N] cuando corresponda
- Responde en español, con tono cálido, educativo y riguroso — como un médico integrativo que enseña, no que prescribe
- Máximo 800 palabras para dar respuestas completas y ricas"""

def ask_gemini(question, articles, history):
    context = format_context(articles) if articles else "(Sin articulos relevantes)"
    history_block = ""
    for turn in history[-4:]:
        history_block += f"Usuario: {turn['user']}\nAgente: {turn['assistant']}\n"
    prompt = f"HISTORIAL:\n{history_block}\nPREGUNTA: {question}\n\nEVIDENCIA CIENTIFICA:\n{context}\n\nResponde integrando la evidencia, citando con [N]."
    try:
        response = _get_gemini_client().models.generate_content(
            model=GEMINI_MODEL,
            contents=prompt,
            config=types.GenerateContentConfig(
                system_instruction=SYSTEM_PROMPT,
                max_output_tokens=MAX_TOKENS,
                temperature=0.7,
            ),
        )
        return response.text.strip()
    except Exception as e:
        return f"[Error Gemini: {e}]"

HTML_PAGE = '''<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>El Floema — Agente Botánico</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Crimson+Text:ital,wght@0,400;0,600;1,400;1,600&display=swap');
  * { margin:0; padding:0; box-sizing:border-box; }

  body {
    background: #030a04;
    color: #d4c5a0;
    font-family: 'Crimson Text', Georgia, serif;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow-x: hidden;
  }

  /* Fondo bosque */
  .bg-forest {
    position: fixed;
    inset: 0;
    background-image: url('/bosque-plantas.jpg');
    background-size: cover;
    background-position: center;
    background-attachment: fixed;
    z-index: 0;
  }
  .bg-overlay {
    position: fixed;
    inset: 0;
    background: linear-gradient(
      to bottom,
      rgba(3,10,4,0.82) 0%,
      rgba(3,10,4,0.70) 30%,
      rgba(3,10,4,0.78) 70%,
      rgba(3,10,4,0.95) 100%
    );
    z-index: 1;
  }

  /* Partículas flotantes */
  .particles { position:fixed; inset:0; z-index:2; pointer-events:none; overflow:hidden; }
  .particle {
    position: absolute;
    width: 3px; height: 3px;
    background: radial-gradient(circle, #c8a050, transparent);
    border-radius: 50%;
    animation: floatUp linear infinite;
    opacity: 0;
  }
  @keyframes floatUp {
    0%   { transform: translateY(100vh) translateX(0) scale(0); opacity:0; }
    10%  { opacity: 0.6; }
    90%  { opacity: 0.3; }
    100% { transform: translateY(-10vh) translateX(40px) scale(1.5); opacity:0; }
  }

  /* Todo el contenido sobre el fondo */
  header, .chat-wrapper, .suggestions, .loading, .input-wrapper, .footer-note {
    position: relative;
    z-index: 10;
  }

  /* Header */
  header {
    width: 100%;
    text-align: center;
    padding: 50px 20px 36px;
    border-bottom: 1px solid rgba(200,160,80,0.25);
    background: linear-gradient(to bottom, rgba(3,10,4,0.6), transparent);
  }

  /* Ornamento SVG floral superior */
  .floral-top {
    display: block;
    margin: 0 auto 20px;
    width: 280px;
    opacity: 0.7;
    animation: fadeInDown 1.2s ease forwards;
  }

  @keyframes fadeInDown {
    from { opacity:0; transform: translateY(-20px); }
    to   { opacity:0.7; transform: translateY(0); }
  }

  header h1 {
    font-family: 'Cinzel', serif;
    color: #c8a050;
    font-size: 4rem;
    letter-spacing: 0.2em;
    font-weight: 700;
    text-shadow:
      0 0 60px rgba(200,160,80,0.5),
      0 0 20px rgba(200,160,80,0.3),
      0 2px 4px rgba(0,0,0,0.9);
    animation: glowIn 1.5s ease forwards;
    margin-bottom: 8px;
  }

  @keyframes glowIn {
    from { opacity:0; text-shadow: none; }
    to   { opacity:1; text-shadow: 0 0 60px rgba(200,160,80,0.5), 0 0 20px rgba(200,160,80,0.3); }
  }

  .header-divider {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    margin: 14px auto;
    max-width: 400px;
  }
  .header-divider::before, .header-divider::after {
    content: '';
    flex: 1;
    height: 1px;
    background: linear-gradient(to right, transparent, #c8a050, transparent);
  }
  .header-divider span { color: #c8a050; font-size: 0.9rem; }

  header p {
    color: #9ab89a;
    font-style: italic;
    font-size: 1.1rem;
    letter-spacing: 0.04em;
    text-shadow: 0 1px 3px rgba(0,0,0,0.8);
  }
  .header-tagline {
    margin-top: 14px;
    color: #c8a050;
    font-size: 0.8rem;
    letter-spacing: 0.3em;
    text-transform: uppercase;
    opacity: 0.7;
  }

  /* Ornamento floral SVG lateral */
  .floral-corner {
    position: fixed;
    opacity: 0.12;
    z-index: 3;
    pointer-events: none;
  }
  .floral-corner.tl { top: 0; left: 0; transform: rotate(0deg); width: 220px; }
  .floral-corner.tr { top: 0; right: 0; transform: rotate(90deg); width: 220px; }
  .floral-corner.bl { bottom: 0; left: 0; transform: rotate(270deg); width: 180px; }
  .floral-corner.br { bottom: 0; right: 0; transform: rotate(180deg); width: 180px; }

  /* Chat */
  .chat-wrapper {
    width: 100%;
    max-width: 880px;
    flex: 1;
    padding: 0 20px;
  }
  .chat-container {
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding: 32px 0;
    min-height: 300px;
  }

  /* Bienvenida */
  .welcome {
    text-align: center;
    padding: 50px 20px;
    animation: fadeIn 1s ease 0.5s both;
  }
  .welcome-icon { font-size: 3.5rem; display: block; margin-bottom: 16px; }
  .welcome h2 {
    font-family: 'Cinzel', serif;
    color: #c8a050;
    font-size: 1.5rem;
    font-weight: 400;
    margin-bottom: 14px;
    text-shadow: 0 0 20px rgba(200,160,80,0.3);
  }
  .welcome p {
    color: #8aaa8a;
    font-style: italic;
    font-size: 1.1rem;
    line-height: 1.8;
    max-width: 520px;
    margin: 0 auto;
  }

  /* Mensajes */
  @keyframes fadeIn {
    from { opacity:0; transform: translateY(10px); }
    to   { opacity:1; transform: translateY(0); }
  }

  .message {
    padding: 22px 26px;
    line-height: 1.85;
    font-size: 1.08rem;
    position: relative;
    animation: fadeIn 0.4s ease;
    border-radius: 2px;
  }

  .message.user {
    background: linear-gradient(135deg, rgba(26,46,26,0.9), rgba(20,36,20,0.9));
    border: 1px solid rgba(200,160,80,0.35);
    border-left: 3px solid #c8a050;
    align-self: flex-end;
    max-width: 78%;
    backdrop-filter: blur(8px);
    box-shadow: 0 4px 24px rgba(0,0,0,0.5), inset 0 1px 0 rgba(200,160,80,0.1);
  }
  .message.user::after {
    content: '✦';
    position: absolute;
    top: -9px; right: 20px;
    color: #c8a050;
    font-size: 0.75rem;
    background: rgba(3,10,4,0.9);
    padding: 0 6px;
  }

  .message.agent {
    background: linear-gradient(135deg, rgba(10,18,12,0.92), rgba(8,12,20,0.92));
    border: 1px solid rgba(122,74,138,0.3);
    border-left: 3px solid #7a4a8a;
    align-self: flex-start;
    max-width: 96%;
    backdrop-filter: blur(8px);
    box-shadow: 0 4px 24px rgba(0,0,0,0.5), inset 0 1px 0 rgba(122,74,138,0.1);
  }
  .message.agent::after {
    content: '⬡';
    position: absolute;
    top: -9px; left: 20px;
    color: #7a4a8a;
    font-size: 0.75rem;
    background: rgba(3,10,4,0.9);
    padding: 0 6px;
  }

  .message.agent h3 {
    font-family: 'Cinzel', serif;
    color: #c8a050;
    font-size: 0.95rem;
    margin: 18px 0 8px;
    font-weight: 600;
    letter-spacing: 0.05em;
    text-shadow: 0 0 10px rgba(200,160,80,0.2);
  }
  .message.agent h3:first-child { margin-top: 0; }
  .message.agent strong { color: #d4b870; }
  .message.agent em { color: #9ab89a; }
  .message.agent ul { margin: 8px 0 8px 18px; }
  .message.agent li { margin-bottom: 5px; }
  .message.agent hr {
    border: none;
    border-top: 1px solid rgba(200,160,80,0.15);
    margin: 16px 0;
  }

  .sources {
    margin-top: 14px;
    padding-top: 10px;
    border-top: 1px solid rgba(200,160,80,0.12);
    font-size: 0.82rem;
    color: #5a7a5a;
    font-style: italic;
  }

  /* Sugerencias */
  .suggestions {
    text-align: center;
    padding: 8px 20px 16px;
    width: 100%;
    max-width: 880px;
  }
  .suggestions-label {
    font-size: 0.72rem;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    color: #3a5a3a;
    margin-bottom: 10px;
  }
  .tag {
    display: inline-block;
    background: rgba(10,20,10,0.7);
    border: 1px solid rgba(200,160,80,0.2);
    border-radius: 20px;
    padding: 6px 16px;
    margin: 4px;
    font-size: 0.88rem;
    cursor: pointer;
    color: #7a9a7a;
    transition: all 0.25s;
    font-family: 'Crimson Text', serif;
    font-style: italic;
    backdrop-filter: blur(4px);
  }
  .tag:hover {
    border-color: #c8a050;
    color: #c8a050;
    background: rgba(200,160,80,0.08);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(200,160,80,0.15);
  }

  /* Loading */
  .loading {
    display: none;
    text-align: center;
    color: #5a7a5a;
    font-style: italic;
    padding: 10px 20px;
    font-size: 0.95rem;
    width: 100%;
    max-width: 880px;
  }
  .loading.visible { display: block; }

  /* Input */
  .input-wrapper {
    width: 100%;
    max-width: 880px;
    padding: 10px 20px 36px;
  }

  /* Marco dorado decorativo */
  .input-frame {
    position: relative;
    padding: 2px;
    background: linear-gradient(135deg, rgba(200,160,80,0.4), rgba(122,74,138,0.3), rgba(200,160,80,0.4));
    border-radius: 4px;
  }
  .input-frame::before {
    content: '❧';
    position: absolute;
    left: -24px; top: 50%;
    transform: translateY(-50%);
    color: #c8a050;
    font-size: 1.2rem;
    opacity: 0.5;
  }
  .input-frame::after {
    content: '❧';
    position: absolute;
    right: -24px; top: 50%;
    transform: translateY(-50%) scaleX(-1);
    color: #c8a050;
    font-size: 1.2rem;
    opacity: 0.5;
  }

  .input-container {
    display: flex;
    gap: 0;
    background: rgba(5,15,6,0.95);
    border-radius: 3px;
    padding: 4px 4px 4px 18px;
    backdrop-filter: blur(12px);
  }

  textarea {
    flex: 1;
    background: transparent;
    border: none;
    color: #d4c5a0;
    font-family: 'Crimson Text', serif;
    font-size: 1.1rem;
    padding: 14px 0;
    resize: none;
    height: 54px;
    outline: none;
    line-height: 1.5;
  }
  textarea::placeholder { color: #3a5a3a; font-style: italic; }

  button {
    background: linear-gradient(135deg, #1a3a1a, #2a1a3a);
    border: none;
    border-left: 1px solid rgba(200,160,80,0.3);
    color: #c8a050;
    font-family: 'Cinzel', serif;
    font-size: 0.82rem;
    padding: 0 28px;
    border-radius: 0 2px 2px 0;
    cursor: pointer;
    letter-spacing: 0.12em;
    transition: all 0.2s;
    white-space: nowrap;
  }
  button:hover {
    background: linear-gradient(135deg, #2a4a2a, #3a2a4a);
    color: #e0b860;
    box-shadow: inset 0 0 20px rgba(200,160,80,0.1);
  }
  button:disabled { opacity: 0.35; cursor: not-allowed; }

  .footer-note {
    text-align: center;
    color: #2a4a2a;
    font-size: 0.78rem;
    padding-bottom: 24px;
    font-style: italic;
    position: relative;
    z-index: 10;
  }
</style>
</head>
<body>

<!-- Fondo -->
<div class="bg-forest"></div>
<div class="bg-overlay"></div>

<!-- Partículas doradas -->
<div class="particles" id="particles"></div>

<!-- Ornamentos florales en esquinas -->
<svg class="floral-corner tl" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" fill="none">
  <path d="M10,10 Q60,10 60,60 Q60,110 110,110" stroke="#c8a050" stroke-width="1.5"/>
  <path d="M10,30 Q40,30 50,60 Q60,90 90,100" stroke="#c8a050" stroke-width="1"/>
  <circle cx="60" cy="60" r="4" fill="#c8a050" opacity="0.8"/>
  <circle cx="110" cy="110" r="3" fill="#c8a050" opacity="0.6"/>
  <path d="M55,55 Q65,45 75,55 Q65,65 55,55Z" fill="#c8a050" opacity="0.5"/>
  <path d="M25,15 Q35,5 45,15 Q35,25 25,15Z" fill="#c8a050" opacity="0.4"/>
  <path d="M105,105 Q115,95 125,105 Q115,115 105,105Z" fill="#c8a050" opacity="0.4"/>
  <circle cx="30" cy="30" r="2" fill="#c8a050" opacity="0.4"/>
  <circle cx="80" cy="80" r="2" fill="#c8a050" opacity="0.4"/>
</svg>

<svg class="floral-corner tr" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" fill="none">
  <path d="M10,10 Q60,10 60,60 Q60,110 110,110" stroke="#c8a050" stroke-width="1.5"/>
  <path d="M10,30 Q40,30 50,60 Q60,90 90,100" stroke="#c8a050" stroke-width="1"/>
  <circle cx="60" cy="60" r="4" fill="#c8a050" opacity="0.8"/>
  <circle cx="110" cy="110" r="3" fill="#c8a050" opacity="0.6"/>
  <path d="M55,55 Q65,45 75,55 Q65,65 55,55Z" fill="#c8a050" opacity="0.5"/>
</svg>

<svg class="floral-corner bl" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" fill="none">
  <path d="M10,10 Q60,10 60,60 Q60,110 110,110" stroke="#c8a050" stroke-width="1.5"/>
  <circle cx="60" cy="60" r="4" fill="#c8a050" opacity="0.8"/>
  <path d="M55,55 Q65,45 75,55 Q65,65 55,55Z" fill="#c8a050" opacity="0.5"/>
</svg>

<svg class="floral-corner br" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" fill="none">
  <path d="M10,10 Q60,10 60,60 Q60,110 110,110" stroke="#c8a050" stroke-width="1.5"/>
  <circle cx="60" cy="60" r="4" fill="#c8a050" opacity="0.8"/>
  <path d="M55,55 Q65,45 75,55 Q65,65 55,55Z" fill="#c8a050" opacity="0.5"/>
</svg>

<!-- Header -->
<header>
  <!-- Ornamento floral SVG en header -->
  <svg class="floral-top" viewBox="0 0 280 60" xmlns="http://www.w3.org/2000/svg" fill="none">
    <path d="M140,30 Q120,10 100,20 Q80,30 90,50 Q100,60 120,50 Q130,45 140,30Z" stroke="#c8a050" stroke-width="1" fill="rgba(200,160,80,0.05)"/>
    <path d="M140,30 Q160,10 180,20 Q200,30 190,50 Q180,60 160,50 Q150,45 140,30Z" stroke="#c8a050" stroke-width="1" fill="rgba(200,160,80,0.05)"/>
    <circle cx="140" cy="30" r="4" fill="#c8a050" opacity="0.8"/>
    <circle cx="90" cy="45" r="2.5" fill="#c8a050" opacity="0.5"/>
    <circle cx="190" cy="45" r="2.5" fill="#c8a050" opacity="0.5"/>
    <path d="M20,30 L115,30" stroke="#c8a050" stroke-width="0.8" opacity="0.4"/>
    <path d="M165,30 L260,30" stroke="#c8a050" stroke-width="0.8" opacity="0.4"/>
    <path d="M20,30 Q10,20 5,30 Q10,40 20,30Z" fill="#c8a050" opacity="0.4"/>
    <path d="M260,30 Q270,20 275,30 Q270,40 260,30Z" fill="#c8a050" opacity="0.4"/>
    <circle cx="50" cy="30" r="1.5" fill="#c8a050" opacity="0.3"/>
    <circle cx="230" cy="30" r="1.5" fill="#c8a050" opacity="0.3"/>
  </svg>

  <h1>El Floema</h1>
  <div class="header-divider"><span>✦</span></div>
  <p>Agente Botánico · Fitoterapia · Ayurveda · Medicina Tradicional China · Yoga</p>
  <div class="header-tagline">Con ciencia, mi magia despierta</div>
</header>

<div class="chat-wrapper">
  <div class="chat-container" id="chat">
    <div class="welcome">
      <span class="welcome-icon">🌿</span>
      <h2>Bienvenida al Grimorio Botánico</h2>
      <p>Pregúntame sobre plantas, órganos, sistemas del cuerpo o prácticas de bienestar. Integro 6.020 artículos científicos con la sabiduría del Ayurveda, la Medicina Tradicional China y el Yoga.</p>
    </div>
  </div>
</div>

<div class="suggestions">
  <div class="suggestions-label">✦ Consultas frecuentes ✦</div>
  <span class="tag" onclick="setQ('Como depurar el higado de forma integral?')">🫀 Hígado</span>
  <span class="tag" onclick="setQ('Plantas para el estres y la ansiedad')">🧠 Estrés</span>
  <span class="tag" onclick="setQ('Propiedades del maqui chileno')">🫐 Maqui</span>
  <span class="tag" onclick="setQ('Como mejorar la digestion con plantas y yoga')">🌱 Digestión</span>
  <span class="tag" onclick="setQ('Plantas antiinflamatorias del bosque valdiviano')">🌳 Inflamación</span>
  <span class="tag" onclick="setQ('Para que sirve el matico y como usarlo')">🍃 Matico</span>
  <span class="tag" onclick="setQ('Como mejorar el sueno con plantas medicinales')">🌙 Sueño</span>
  <span class="tag" onclick="setQ('Posturas de yoga para el sistema digestivo')">🧘 Yoga</span>
</div>

<div class="loading" id="loading">🌿 Consultando la biblioteca botánica...</div>

<div class="input-wrapper">
  <div class="input-frame">
    <div class="input-container">
      <textarea id="input" placeholder="Pregunta sobre una planta, un órgano, un síntoma..."></textarea>
      <button onclick="sendMessage()" id="btn">Consultar</button>
    </div>
  </div>
</div>

<div class="footer-note">6.020 artículos científicos · Bosque Valdiviano, Chile</div>

<script src="/static/app.js"></script>
<script>
// Partículas doradas
const container = document.getElementById('particles');
for (let i = 0; i < 25; i++) {
  const p = document.createElement('div');
  p.className = 'particle';
  p.style.cssText = `
    left: ${Math.random()*100}%;
    width: ${Math.random()*3+1}px;
    height: ${Math.random()*3+1}px;
    animation-delay: ${Math.random()*15}s;
    animation-duration: ${Math.random()*20+15}s;
    opacity: ${Math.random()*0.4+0.1};
  `;
  container.appendChild(p);
}
</script>
</body>
</html>'''

JS_CODE = r"""
let history = [];

function setQ(text) {
  document.getElementById('input').value = text;
  document.getElementById('input').focus();
}

document.getElementById('input').addEventListener('keydown', function(e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

function addMessage(text, role, sources) {
  const chat = document.getElementById('chat');
  const welcome = chat.querySelector('.welcome');
  if (welcome) welcome.remove();
  const div = document.createElement('div');
  div.className = 'message ' + role;
  let html = text
    .replace(/^#{1,3} (.+)$/gm, '<h3>$1</h3>')
    .replace(/[*][*](.*?)[*][*]/g, '<strong>$1</strong>')
    .replace(/[*](.*?)[*]/g, '<em>$1</em>')
    .replace(/^[-] (.+)$/gm, '<li>$1</li>')
    .replace(/\n\n/g, '<br><br>')
    .replace(/\n/g, '<br>')
    .replace(/---/g, '<hr>');
  div.innerHTML = html;
  if (sources) {
    const s = document.createElement('div');
    s.className = 'sources';
    s.textContent = sources;
    div.appendChild(s);
  }
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

async function sendMessage() {
  const input = document.getElementById('input');
  const btn = document.getElementById('btn');
  const loading = document.getElementById('loading');
  const question = input.value.trim();
  if (!question) return;
  addMessage(question, 'user', null);
  input.value = '';
  btn.disabled = true;
  loading.classList.add('visible');
  try {
    console.log('Enviando consulta a /ask...');
    const res = await fetch('/ask', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ question: question, history: history })
    });
    const data = await res.json();
    const sources = data.sources_count ? data.sources_count + ' articulos · similitud: ' + data.top_similarity : null;
    addMessage(data.response, 'agent', sources);
    history.push({ user: question, assistant: data.response });
    if (history.length > 10) history = history.slice(-10);
  } catch(e) {
    console.log('Error:', e);
    addMessage('Error al conectar. Intenta de nuevo.', 'agent', null);
  } finally {
    btn.disabled = false;
    loading.classList.remove('visible');
  }
}
"""

def create_app():
    app = Flask(__name__)
    CORS(app)

    @app.route("/")
    def index():
        return render_template_string(HTML_PAGE)

    @app.route("/static/app.js")
    def serve_js():
        return Response(JS_CODE, mimetype='application/javascript')

    @app.route("/ask", methods=["POST"])
    def ask():
        try:
            data     = request.get_json()
            question = data.get("question", "").strip()
            history  = data.get("history", [])
            if not question:
                return jsonify({"error": "Pregunta vacia"}), 400
            cache_key = question.strip().lower()
            if cache_key in _cache:
                return jsonify(_cache[cache_key])
            articles = search_articles(question)
            response = ask_gemini(question, articles, history)
            result = {
                "response":       response,
                "sources_count":  len(articles),
                "top_similarity": articles[0]["similarity"] if articles else 0,
            }
            _cache[cache_key] = result
            save_to_mongo(question, response, articles, session_id="web")
            return jsonify(result)
        except Exception as e:
            print("ERROR EN /ask:", traceback.format_exc())
            return jsonify({"error": str(e)}), 500

    @app.route("/health")
    def health():
        col = get_mongo_collection()
        return jsonify({
            "status":  "ok",
            "model":   GEMINI_MODEL,
            "mongodb": col is not None,
        })

    @app.route("/logo.png")
    def serve_logo():
        import os
        from flask import send_file
        path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "logo.jpg")
        return send_file(path, mimetype="image/png")

    @app.route("/bruja.webp")
    def serve_bruja():
        import os
        from flask import send_file
        import glob
        folder = os.path.dirname(os.path.abspath(__file__))
        matches = glob.glob(os.path.join(folder, "Gemini_Generated_Image*"))
        if matches:
            return send_file(matches[0])
        return "not found", 404

    return app

def chat_loop():
    print("\nAgente Botanico El Floema")
    print(f"Modelo: {GEMINI_MODEL}\n")
    history = []
    while True:
        try:
            user_input = input("Tu pregunta: ").strip()
        except (EOFError, KeyboardInterrupt):
            print("\nHasta pronto.")
            break
        if not user_input:
            continue
        if user_input.lower() in ("salir", "exit", "quit", "q"):
            print("Hasta pronto.")
            break
        print("\nBuscando en la biblioteca...")
        articles = search_articles(user_input)
        print(f"Consultando {GEMINI_MODEL}...\n")
        response = ask_gemini(user_input, articles, history)
        print("-" * 60)
        print(response)
        print("-" * 60)
        if articles:
            print(f"\n[Fuentes: {len(articles)} articulos | Top similitud: {articles[0]['similarity']:.3f}]")
        print()
        save_to_mongo(user_input, response, articles, session_id="terminal")
        history.append({"user": user_input, "assistant": response})

def main():
    parser = argparse.ArgumentParser(description="Agente Botanico El Floema")
    parser.add_argument("question", nargs="?", help="Pregunta directa")
    parser.add_argument("--web", action="store_true", help="Iniciar interfaz web en localhost:5000")
    parser.add_argument("--port", type=int, default=5000)
    args = parser.parse_args()

    if args.web:
        if not FLASK_AVAILABLE:
            print("Flask no instalado. Ejecuta: pip install flask")
            sys.exit(1)
        app = create_app()
        port = int(os.environ.get("PORT", args.port))
        print(f"Interfaz web en http://localhost:{port}")
        app.run(host="0.0.0.0", port=port, debug=False)
    elif args.question:
        articles = search_articles(args.question)
        response = ask_gemini(args.question, articles, [])
        print(response)
        save_to_mongo(args.question, response, articles)
    else:
        chat_loop()

if __name__ == "__main__":
    main()
