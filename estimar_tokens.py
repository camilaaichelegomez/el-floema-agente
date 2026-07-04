import sys
sys.path.insert(0, ".")

SYSTEM_PROMPT_BELLEZA = "Eres Floema, asesora de belleza botanica de El Floema. Eres experta en rutinas de cuidado de piel y cabello con plantas nativas, cosmetica natural, yoga facial, masaje facial, drenaje linfatico y como la alimentacion afecta la piel. Hablas en espanol con tono calido y cientifico. No das diagnosticos medicos ni recetas de tratamientos solo orientacion cosmetica y de bienestar."

# Artículo típico tal como lo produce format_context()
articulo = (
    "[1] pubmed | sensitive_skin_natural_cosmetics | sim:0.471\n"
    "    Autor A, Autor B (2022). Titulo largo del articulo sobre piel sensible y cosmetica natural. Journal of Cosmetic Science. DOI: 10.xxxx/xxxxx\n"
    "    Titulo del articulo | Abstract con hasta 600 chars de contenido sobre piel sensible, ingredientes naturales, botanicos, barreras cutaneas, irritacion y tratamientos recomendados para pieles reactivas.\n\n"
)

context = articulo * 6
question = "piel sensible"
prompt = f"PREGUNTA: {question}\n\nEVIDENCIA CIENTIFICA:\n{context}\n\nResponde integrando la evidencia cuando sea relevante, citando con [N]."

sys_tok    = len(SYSTEM_PROMPT_BELLEZA) // 4
ctx_tok    = len(context) // 4
prompt_tok = len(prompt) // 4
total      = sys_tok + prompt_tok

print(f"system_prompt : {len(SYSTEM_PROMPT_BELLEZA):>6} chars  ~{sys_tok:>4} tokens")
print(f"rag_context   : {len(context):>6} chars  ~{ctx_tok:>4} tokens  (6 articulos)")
print(f"prompt_body   : {len(prompt):>6} chars  ~{prompt_tok:>4} tokens")
print(f"─────────────────────────────────────────")
print(f"TOTAL INPUT   :               ~{total:>4} tokens")
print(f"max_output    :                800 tokens")
print(f"GRAND TOTAL   :              ~{total+800:>4} tokens")
