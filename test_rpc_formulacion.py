import os, sys
from supabase import create_client
import google.generativeai as genai

genai.configure(api_key=os.environ.get("GEMINI_API_KEY", ""))

url = "https://powpibehemondwobngxh.supabase.co"
key = os.environ["SUPABASE_KEY"]
sb  = create_client(url, key)

result    = genai.embed_content(model="models/text-embedding-004", content="emulsionante para crema con karite")
embedding = result["embedding"]
print("Embedding dims:", len(embedding))

try:
    res = sb.rpc("buscar_articulos_formulacion", {
        "query_embedding": embedding,
        "match_count": 6,
    }).execute()
    print("Resultados:", len(res.data))
    if res.data:
        print("Primer resultado:", res.data[0]["title"])
        print("Similarity:", res.data[0]["similarity"])
except Exception as e:
    import traceback
    print("ERROR:", e)
    traceback.print_exc()
