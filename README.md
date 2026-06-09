# 🌿 El Floema — Botanical AI Agent

An intelligent botanical agent that answers questions about medicinal plants by integrating **Western phytotherapy**, **Ayurveda**, and **Traditional Chinese Medicine**, powered by scientific evidence from a library of 5,683 peer-reviewed articles.

## 🏆 Hackathon Track: MongoDB

Built for the **Google Cloud Rapid Agent Hackathon** using:
- **Gemini 2.5 Flash** via Google Cloud Vertex AI
- **Google Cloud Agent Builder** (RAG with ChromaDB)
- **MongoDB Atlas** MCP server for storing and retrieving consultation history

## ✨ Features

- 🔍 **RAG-powered search** across 5,683 scientific articles (PubMed, Semantic Scholar, Europe PMC)
- 🌿 **Multi-tradition integration**: Western phytotherapy + Ayurveda + Traditional Chinese Medicine
- 💾 **MongoDB Atlas** stores every consultation with metadata (plant detected, similarity score, timestamp)
- 🌐 **Web interface** with dark botanical aesthetic
- ⚠️ **Safety-first**: always recommends consulting a health professional
- 🗣️ **Conversational memory**: maintains context across a session

## 🛠️ Tech Stack

| Component | Technology |
|-----------|-----------|
| AI Model | Gemini 2.5 Flash (Vertex AI) |
| RAG | ChromaDB + sentence-transformers |
| Database | MongoDB Atlas |
| Backend | Python + Flask |
| Scientific Library | 5,683 articles (PubMed, Semantic Scholar, Europe PMC) |

## 🚀 Setup & Run

### Prerequisites
- Python 3.10+
- Google Cloud account with Vertex AI enabled
- MongoDB Atlas account (free tier works)
- `gemini_service_account.json` (Google Cloud service account)

### Installation

```bash
git clone https://github.com/camilaaichelegomez/elfloema.git
cd elfloema
pip install google-genai google-auth chromadb sentence-transformers pymongo flask
```

### Build the scientific index (first time only)

```bash
python rag_biblioteca.py --build
```

### Run the web agent

```bash
python agente_botanico.py --web
```

Open `http://localhost:5000` in your browser.

### Run in terminal mode

```bash
python agente_botanico.py
```

## 📊 MongoDB Integration

Every consultation is stored in MongoDB Atlas with:
```json
{
  "session_id": "web",
  "timestamp": "2026-06-09T...",
  "question": "What can I take for inflammation?",
  "response": "...",
  "sources_count": 6,
  "top_similarity": 0.412,
  "plants_detected": ["matico", "maqui"],
  "model": "gemini-2.5-flash"
}
```

## 🌱 About El Floema

El Floema is a Chilean botanical cosmetics brand based in the Valdivian rainforest of southern Chile. The founder harvests, distills, and macerates native plants — triwe, arrayán, maqui, matico — integrating ancestral Mapuche ethnobotany with modern phytochemistry.

This agent is the knowledge backbone of the brand: a scientific witch's assistant that bridges traditional wisdom and peer-reviewed evidence.

## ⚠️ Disclaimer

This agent provides educational information only. Always consult a qualified healthcare professional before using medicinal plants.

## 📄 License

MIT License — see [LICENSE](LICENSE)
