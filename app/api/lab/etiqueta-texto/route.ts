import Groq from "groq-sdk";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";

const SYSTEM_INSTRUCTION = `Eres el asistente de contenido de El Floema, una marca de cosmética natural artesanal.
Dado el nombre de un producto y su lista de ingredientes (INCI), redacta cuatro textos distintos.

Instrucciones:
- "modo_uso": instrucciones de uso breves y prácticas (2-4 oraciones), para la etiqueta física. Tono cercano pero profesional.
- "advertencias": advertencias de seguridad estándar para cosmética natural (uso externo, evitar contacto con ojos, mantener fuera del alcance de niños, descontinuar si hay irritación), ajustadas si algún ingrediente lo amerita (ej. aceites esenciales con fotosensibilidad, alérgenos comunes conocidos). Para la etiqueta física.
- "descripcion_catalogo": descripción del producto para catálogo/tienda (3-5 oraciones): qué hace, qué propiedades aportan sus ingredientes principales, para qué tipo de piel/cabello o necesidad es ideal, qué puede esperar quien lo usa. Tono profesional y descriptivo, sin exagerar beneficios.
- "descripcion_redes": copy corto para redes sociales (Instagram), 2-3 oraciones, tono cercano y evocador (estética "bruja científica": botánica + evidencia), destacando 1-2 ingredientes clave y su propiedad más relevante. Sin hashtags, sin emojis.
- Basa las propiedades solo en lo que es razonable esperar de los ingredientes dados — no inventes beneficios no respaldados.
- Responde ÚNICAMENTE con un JSON válido, sin texto adicional, con este formato exacto:
{"modo_uso": "string", "advertencias": "string", "descripcion_catalogo": "string", "descripcion_redes": "string"}`;

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

    const texto = (campo: string) => (typeof parsed[campo] === "string" ? parsed[campo] : "");
    const resultado = {
      modo_uso: texto("modo_uso"),
      advertencias: texto("advertencias"),
      descripcion_catalogo: texto("descripcion_catalogo"),
      descripcion_redes: texto("descripcion_redes"),
    };

    if (!Object.values(resultado).some(Boolean)) {
      return NextResponse.json({ error: "El asistente no devolvió un texto válido. Intenta de nuevo." }, { status: 502 });
    }

    return NextResponse.json(resultado);
  } catch (error) {
    console.error("[lab/etiqueta-texto] groq", error);
    return NextResponse.json({ error: "No pude generar el texto en este momento. Intenta de nuevo." }, { status: 502 });
  }
}
