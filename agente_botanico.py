#!/usr/bin/env python3
"""
Agente Conversacional Botánico — El Floema
Gemini 2.5 Flash + ChromaDB RAG + MongoDB Atlas + interfaz web
"""

import argparse
import os
import sys
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
    import chromadb
    from sentence_transformers import SentenceTransformer
except ImportError:
    print("Ejecuta: pip install chromadb sentence-transformers")
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
    FLASK_AVAILABLE = True
except ImportError:
    FLASK_AVAILABLE = False

CHROMA_DIR   = Path("biblioteca-cientifica/.chroma_db")
COLLECTION   = "articulos_botanicos"
EMBED_MODEL  = "sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2"
GEMINI_MODEL = "gemini-2.5-flash"
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

_embed_model = None
_chroma_col  = None

def _get_embed_model():
    global _embed_model
    if _embed_model is None:
        _embed_model = SentenceTransformer(EMBED_MODEL)
    return _embed_model

def _get_collection():
    global _chroma_col
    if _chroma_col is None:
        if not CHROMA_DIR.exists():
            raise FileNotFoundError("Indice RAG no encontrado.")
        client = chromadb.PersistentClient(path=str(CHROMA_DIR))
        _chroma_col = client.get_collection(COLLECTION)
    return _chroma_col

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

def _parse_results(results):
    articles = []
    for doc, meta, dist in zip(results["documents"][0], results["metadatas"][0], results["distances"][0]):
        articles.append({
            "similarity": round(1 - dist, 3),
            "title":      meta.get("title", ""),
            "authors":    meta.get("authors", ""),
            "year":       meta.get("year") or "",
            "journal":    meta.get("journal", ""),
            "source":     meta.get("source", ""),
            "plant_key":  meta.get("plant_key", ""),
            "doi":        meta.get("doi", ""),
            "snippet":    doc[:600],
        })
    return articles

def search_articles(query, top_k=TOP_K):
    model      = _get_embed_model()
    collection = _get_collection()
    total      = collection.count()
    embedding  = model.encode([query]).tolist()
    plant_key  = _detect_plant_key(query)
    seen       = set()
    articles   = []
    if plant_key:
        try:
            res = collection.query(
                query_embeddings=embedding,
                n_results=min(top_k // 2 + 1, total),
                include=["documents", "metadatas", "distances"],
                where={"plant_key": {"$eq": plant_key}},
            )
            for a in _parse_results(res):
                if a["title"] not in seen:
                    seen.add(a["title"])
                    articles.append(a)
        except Exception:
            pass
    remaining = top_k - len(articles)
    if remaining > 0:
        res = collection.query(
            query_embeddings=embedding,
            n_results=min(top_k * 2, total),
            include=["documents", "metadatas", "distances"],
        )
        for a in _parse_results(res):
            if a["title"] not in seen and len(articles) < top_k:
                seen.add(a["title"])
                articles.append(a)
    return articles

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

def ask_gemini(client, question, articles, history):
    context = format_context(articles) if articles else "(Sin articulos relevantes)"
    history_block = ""
    for turn in history[-4:]:
        history_block += f"Usuario: {turn['user']}\nAgente: {turn['assistant']}\n"
    prompt = f"HISTORIAL:\n{history_block}\nPREGUNTA: {question}\n\nEVIDENCIA CIENTIFICA:\n{context}\n\nResponde integrando la evidencia, citando con [N]."
    try:
        response = client.models.generate_content(
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
<title>El Floema — Agente Botanico</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600&family=Crimson+Text:ital,wght@0,400;0,600;1,400&display=swap');
  * { margin:0; padding:0; box-sizing:border-box; }
  body { background:#0a1a0d; color:#d4c5a0; font-family:'Crimson Text',Georgia,serif; min-height:100vh; display:flex; flex-direction:column; align-items:center; }
  header { text-align:center; padding:40px 20px 20px; border-bottom:1px solid #2a4a2a; width:100%; }
  header h1 { font-family:'Cinzel',serif; color:#c8a050; font-size:2.2rem; letter-spacing:0.1em; }
  header p { color:#7a9a7a; font-style:italic; margin-top:8px; font-size:1.05rem; }
  .chat-container { width:100%; max-width:780px; flex:1; padding:24px 20px; display:flex; flex-direction:column; gap:16px; }
  .message { padding:16px 20px; border-radius:8px; line-height:1.7; font-size:1.05rem; }
  .message.user { background:#1a2e1a; border-left:3px solid #c8a050; align-self:flex-end; max-width:85%; }
  .message.agent { background:#111f13; border-left:3px solid #7a4a8a; align-self:flex-start; max-width:92%; }
  .message.agent .sources { margin-top:10px; font-size:0.85rem; color:#7a9a7a; font-style:italic; }
  .input-area { width:100%; max-width:780px; padding:16px 20px 32px; display:flex; gap:12px; }
  textarea { flex:1; background:#111f13; border:1px solid #2a4a2a; border-radius:8px; color:#d4c5a0; font-family:'Crimson Text',serif; font-size:1.05rem; padding:12px 16px; resize:none; height:56px; outline:none; }
  textarea:focus { border-color:#c8a050; }
  button { background:#1a3a1a; border:1px solid #c8a050; color:#c8a050; font-family:'Cinzel',serif; font-size:0.9rem; padding:0 24px; border-radius:8px; cursor:pointer; }
  button:hover { background:#2a4a2a; }
  button:disabled { opacity:0.5; cursor:not-allowed; }
  .loading { display:none; color:#7a9a7a; font-style:italic; padding:8px 20px; font-size:0.95rem; }
  .loading.visible { display:block; }
  .welcome { text-align:center; color:#5a7a5a; font-style:italic; padding:40px 20px; font-size:1.1rem; }
  .tag { display:inline-block; background:#1a2e1a; border:1px solid #2a4a2a; border-radius:20px; padding:4px 14px; margin:4px; font-size:0.88rem; cursor:pointer; color:#9ab89a; }
  .tag:hover { border-color:#c8a050; color:#c8a050; }
  .suggestions { text-align:center; padding:0 20px 16px; }
</style>
</head>
<body>
<header>
  <h1>El Floema</h1>
  <p>Agente Botanico · Fitoterapia · Ayurveda · Medicina Tradicional China</p>
</header>
<div class="chat-container" id="chat">
  <div class="welcome">Preguntame sobre plantas medicinales del bosque valdiviano y del mundo.<br>Integro evidencia cientifica con sabiduria ancestral.</div>
</div>
<div class="suggestions">
  <span class="tag" onclick="setQ('Para que sirve el matico?')">Matico</span>
  <span class="tag" onclick="setQ('Plantas para el estres')">Estres</span>
  <span class="tag" onclick="setQ('Que es el maqui y sus propiedades?')">Maqui</span>
  <span class="tag" onclick="setQ('Plantas antiinflamatorias nativas')">Antiinflamatorias</span>
  <span class="tag" onclick="setQ('Como usar el boldo?')">Boldo</span>
</div>
<div class="loading" id="loading">Consultando la biblioteca botanica...</div>
<div class="input-area">
  <textarea id="input" placeholder="Pregunta sobre plantas medicinales..."></textarea>
  <button onclick="sendMessage()" id="btn">Consultar</button>
</div>
<script src="/static/app.js"></script>
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
  div.innerHTML = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>');
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
    addMessage('Error al conectar. Intenta de nuevo.', 'agent', null);
  } finally {
    btn.disabled = false;
    loading.classList.remove('visible');
  }
}
"""

def create_app(gemini_client):
    app = Flask(__name__)

    @app.route("/")
    def index():
        return render_template_string(HTML_PAGE)

    @app.route("/static/app.js")
    def serve_js():
        return Response(JS_CODE, mimetype='application/javascript')

    @app.route("/ask", methods=["POST"])
    def ask():
        data     = request.get_json()
        question = data.get("question", "").strip()
        history  = data.get("history", [])
        if not question:
            return jsonify({"error": "Pregunta vacia"}), 400
        articles = search_articles(question)
        response = ask_gemini(gemini_client, question, articles, history)
        save_to_mongo(question, response, articles, session_id="web")
        return jsonify({
            "response":       response,
            "sources_count":  len(articles),
            "top_similarity": articles[0]["similarity"] if articles else 0,
        })

    @app.route("/health")
    def health():
        col = get_mongo_collection()
        return jsonify({
            "status":  "ok",
            "model":   GEMINI_MODEL,
            "mongodb": col is not None,
        })

    return app

def chat_loop(client):
    print("\nAgente Botanico El Floema")
    print(f"Modelo: {GEMINI_MODEL} | RAG: {_get_collection().count()} articulos\n")
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
        response = ask_gemini(client, user_input, articles, history)
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

    credentials = get_credentials()
    print(f"Autenticado | modelo: {GEMINI_MODEL}")

    client = genai.Client(
        vertexai=True,
        project=GCP_PROJECT,
        location=GCP_LOCATION,
        credentials=credentials,
    )

    get_mongo_collection()

    if args.web:
        if not FLASK_AVAILABLE:
            print("Flask no instalado. Ejecuta: pip install flask")
            sys.exit(1)
        app = create_app(client)
        print(f"\nInterfaz web en http://localhost:{args.port}\n")
        app.run(host="0.0.0.0", port=args.port, debug=False)
    elif args.question:
        articles = search_articles(args.question)
        response = ask_gemini(client, args.question, articles, [])
        print(response)
        save_to_mongo(args.question, response, articles)
    else:
        chat_loop(client)

if __name__ == "__main__":
    main()
