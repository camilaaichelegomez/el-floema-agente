# 🌿 El Floema — Plataforma de Cosmética Botánica con IA

El Floema es una plataforma de cosmética botánica con dos agentes de inteligencia artificial que integran evidencia científica, fitoterapia y formulación natural con plantas nativas de Chile.

## 🏆 Hackathon H0 Hack Zero Stack

Proyecto participante del **H0 Hack Zero Stack** con integración de **AWS DynamoDB** para persistencia de conversaciones de los agentes IA.

**#H0Hackathon**

## ✨ Agentes IA

### 🌱 Agente Botánico (`/consulta`)
Responde preguntas sobre plantas medicinales integrando fitoterapia occidental, Ayurveda y Medicina Tradicional China, con respaldo de **7.613 artículos científicos** de PubMed, Semantic Scholar y Europe PMC. Usa RAG (Retrieval-Augmented Generation) con ChromaDB para citar fuentes en cada respuesta.

### 💧 Agente de Belleza (`/belleza`)
Especializado en formulación cosmética natural: elige activos vegetales, proporciones y métodos de extracción para sérum, aceites, cremas y rituales de cuidado. Backend en Render (`/ask-belleza`).

## 🛠️ Stack Técnico

| Capa | Tecnología |
|------|-----------|
| Frontend | Next.js 16 · App Router · TypeScript · Tailwind CSS |
| Deploy frontend | Vercel |
| Backend agente botánico | Python · Flask · Render |
| Backend agente de belleza | Python · Flask · Render |
| Modelo de lenguaje | Gemini 2.5 Flash (Google Vertex AI) |
| RAG / búsqueda semántica | ChromaDB + sentence-transformers |
| **Persistencia de chats** | **AWS DynamoDB** |
| Base de datos estructurada | Supabase (PostgreSQL) |
| Biblioteca científica | 7.613 artículos (PubMed, Semantic Scholar, Europe PMC) |

## 🗄️ Integración AWS DynamoDB

Cada mensaje del usuario y cada respuesta del agente se persisten automáticamente en DynamoDB.

**Tabla:** `conversaciones-el-floema`  
**Partition key:** `session_id` (UUID generado en el browser)  
**Sort key:** `timestamp` (ISO 8601)

```json
{
  "session_id": "a3f8c2d1-9b4e-4f7a-…",
  "timestamp": "2026-06-26T14:32:11.204Z",
  "rol": "agente",
  "texto": "El matico contiene flavonoides y taninos con actividad antiinflamatoria…",
  "pregunta": "¿Qué propiedades tiene el matico para la piel?",
  "fuentes": [{ "plant_key": "matico", "similarity": 0.87 }]
}
```

La integración vive en los Route Handlers de Next.js (`app/api/consulta/route.ts` y `app/api/belleza/route.ts`) usando `@aws-sdk/client-dynamodb` y `@aws-sdk/lib-dynamodb`.

## 📄 Páginas

| Ruta | Descripción |
|------|-------------|
| `/` | Página principal |
| `/consulta` | Chat con el agente botánico |
| `/belleza` | Chat con el agente de cosmética |
| `/demo` | Recorrido visual del proyecto (hackathon) |
| `/blog` | Bitácora / blog |
| `/blog/h0-hackathon` | Artículo sobre el stack técnico |
| `/biblioteca` | Biblioteca científica |
| `/plantas` | Catálogo de plantas |
| `/formulas` | Formulaciones guardadas |

## 🚀 Variables de entorno

```env
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_REGION=...
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

## 🌱 Sobre El Floema

El Floema es una marca chilena de cosmética botánica ubicada en el bosque valdiviano del sur de Chile. La fundadora cosecha, destila y macera plantas nativas — triwe, arrayán, maqui, matico — integrando etnobotánica mapuche con fitoquímica moderna.

Este agente es la columna vertebral del conocimiento de la marca: un asistente científico que conecta la sabiduría tradicional con la evidencia revisada por pares.

## ⚠️ Disclaimer

El agente proporciona información educativa. Consulta siempre a un profesional de la salud antes de usar plantas medicinales.

## 📄 Licencia

MIT
