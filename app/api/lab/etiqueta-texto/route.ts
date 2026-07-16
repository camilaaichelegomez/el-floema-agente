import Groq from "groq-sdk";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";

const SYSTEM_INSTRUCTION = `Eres el asistente de etiquetado de El Floema, una marca de cosmética natural artesanal.
Dado el nombre de un producto y su lista de ingredientes (INCI), redacta el texto de su etiqueta.

Instrucciones:
- "modo_uso": instrucciones de uso breves y prácticas (2-4 oraciones), en español, tono cercano pero profesional.
- "advertencias": advertencias de seguridad estándar para cosmética natural (uso externo, evitar contacto con ojos, mantener fuera del alcance de niños, descontinuar si hay irritación), ajustadas si algún ingrediente lo amerita (ej. aceites esenciales con fotosensibilidad, alérgenos comunes conocidos).
- No inventes propiedades cosméticas ni beneficios que no sean razonables para los ingredientes dados.
- Responde ÚNICAMENTE con un JSON válido, sin texto adicional, con este formato exacto:
{"modo_uso": "string", "advertencias": "string"}`;

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const productName: string | undefined = body?.product_name;
  const ingredientes: string | undefined = body?.ingredientes;

  if (!productName?.trim()) {
    return NextResponse.json({ error: "Falta el nombre del producto." }, { status: 400 });
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "API key de Groq no configurada." }, { status: 500 });
  }

  const mensajeUsuario = `Producto: ${productName}\nIngredientes (INCI): ${ingredientes?.trim() || "sin especificar"}`;

  try {
    const groq = new Groq({ apiKey });
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: SYSTEM_INSTRUCTION },
        { role: "user", content: mensajeUsuario },
      ],
      response_format: { type: "json_object" },
    });
    const raw = completion.choices[0]?.message?.content ?? "{}";
    const parsed = JSON.parse(raw);

    const modoUso = typeof parsed.modo_uso === "string" ? parsed.modo_uso : "";
    const advertencias = typeof parsed.advertencias === "string" ? parsed.advertencias : "";

    if (!modoUso && !advertencias) {
      return NextResponse.json({ error: "El asistente no devolvió un texto válido. Intenta de nuevo." }, { status: 502 });
    }

    return NextResponse.json({ modo_uso: modoUso, advertencias });
  } catch (error) {
    console.error("[lab/etiqueta-texto] groq", error);
    return NextResponse.json({ error: "No pude generar el texto en este momento. Intenta de nuevo." }, { status: 502 });
  }
}
