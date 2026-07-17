import Groq from "groq-sdk";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";

const MODELO = "llama-3.3-70b-versatile";

const SYSTEM_INSTRUCTION = `Eres el asistente de contenido de El Floema, una marca de cosmética natural artesanal.
Dado el nombre de un producto y su lista de ingredientes (INCI), redacta cuatro textos distintos.

MUY IMPORTANTE — antes de escribir, decide si el producto es realmente un COSMÉTICO TÓPICO (algo que se aplica sobre el cuerpo: piel, cabello, labios, uñas). Una vela, un difusor, un ambientador, un jabón de lavar ropa, un alimento, o cualquier cosa que NO se aplica sobre el cuerpo, NO es un cosmético tópico. Si no lo es, NO inventes modo de uso ni advertencias de aplicación sobre la piel.

Instrucciones:
- "es_cosmetico_topico": true solo si el producto se aplica sobre el cuerpo (piel/cabello/labios/uñas). false para velas, difusores, ambientadores, etc.
- "tipo_producto": qué es el producto realmente, en pocas palabras (ej. "crema facial", "vela aromática", "sérum capilar").
- "modo_uso": instrucciones de uso breves y prácticas (2-4 oraciones), para la etiqueta física. Solo si es_cosmetico_topico es true. Si es false, deja "".
- "advertencias": advertencias de seguridad estándar para cosmética natural (uso externo, evitar contacto con ojos, mantener fuera del alcance de niños, descontinuar si hay irritación), ajustadas si algún ingrediente lo amerita. Solo si es_cosmetico_topico es true. Si es false, deja "".
- "descripcion_catalogo": descripción de catálogo/tienda con copywriting real, no un listado técnico (3-5 oraciones). Abre con el beneficio o la transformación que busca quien lo usa. Nombra 1-3 ingredientes clave y conecta cada uno con lo que le aporta a la persona. Usa lenguaje sensorial y concreto en vez de adjetivos vacíos. Cierra dejando claro para quién es ideal. Tono profesional y persuasivo, sin sonar a infomercial. Si es_cosmetico_topico es false, deja "".
- "descripcion_redes": copy corto para Instagram (2-3 oraciones), tono cercano y evocador. Debe enganchar desde la primera frase y destacar 1-2 ingredientes clave y su beneficio. Sin hashtags, sin emojis. Si es_cosmetico_topico es false, deja "".
- Persuasivo no es lo mismo que exagerado: basa cada afirmación solo en lo que es razonable esperar de los ingredientes dados — no inventes beneficios no respaldados.
- Responde ÚNICAMENTE con un JSON válido, sin texto adicional, con este formato exacto:
{"es_cosmetico_topico": boolean, "tipo_producto": "string", "modo_uso": "string", "advertencias": "string", "descripcion_catalogo": "string", "descripcion_redes": "string"}`;

// Revisor independiente y adversarial: su único trabajo es CAZAR errores graves,
// sobre todo tratar como cosmético algo que no se aplica sobre el cuerpo.
const REVISOR_INSTRUCTION = `Eres un revisor crítico y estricto de etiquetas de cosmética. Te dan un producto, sus ingredientes y un texto de etiqueta generado por otra IA. Tu ÚNICO trabajo es detectar errores graves, especialmente:

1. ¿El producto realmente es un cosmético que se aplica sobre el cuerpo (piel, cabello, labios, uñas)? Si es una vela, difusor, ambientador, alimento, producto de limpieza del hogar, o cualquier cosa que NO se aplica sobre el cuerpo, es un ERROR GRAVE tratarlo como cosmético.
2. ¿El "modo de uso" asume que se aplica sobre el cuerpo cuando el producto no corresponde?
3. ¿Hay propiedades o beneficios inventados que los ingredientes no justifican?

Sé estricto: ante la duda, aprobado=false. Responde ÚNICAMENTE con un JSON válido:
{"aprobado": boolean, "es_cosmetico_topico": boolean, "tipo_producto": "string", "problema": "string"}
- "aprobado": true solo si el texto es correcto y seguro para una etiqueta cosmética.
- "problema": si aprobado es false, explica en una o dos frases claras cuál es el error (ej. "El producto es una vela aromática, no se aplica sobre la piel; el modo de uso y las advertencias cosméticas no corresponden."). Si aprobado es true, deja "".`;

interface Generado {
  es_cosmetico_topico: boolean;
  tipo_producto: string;
  modo_uso: string;
  advertencias: string;
  descripcion_catalogo: string;
  descripcion_redes: string;
}

interface Revision {
  aprobado: boolean;
  es_cosmetico_topico: boolean;
  tipo_producto: string;
  problema: string;
}

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
  const groq = new Groq({ apiKey });

  // ── Etapa 1: generar ──
  let generado: Generado;
  try {
    const completion = await groq.chat.completions.create({
      model: MODELO,
      messages: [
        { role: "system", content: SYSTEM_INSTRUCTION },
        { role: "user", content: mensajeUsuario },
      ],
      response_format: { type: "json_object" },
    });
    const parsed = JSON.parse(completion.choices[0]?.message?.content ?? "{}");
    const texto = (campo: string) => (typeof parsed[campo] === "string" ? parsed[campo] : "");
    generado = {
      es_cosmetico_topico: parsed.es_cosmetico_topico !== false, // por defecto true si no vino
      tipo_producto: texto("tipo_producto"),
      modo_uso: texto("modo_uso"),
      advertencias: texto("advertencias"),
      descripcion_catalogo: texto("descripcion_catalogo"),
      descripcion_redes: texto("descripcion_redes"),
    };
  } catch (error) {
    console.error("[lab/etiqueta-texto] generar", error);
    return NextResponse.json({ error: "No pude generar el texto en este momento. Intenta de nuevo." }, { status: 502 });
  }

  // ── Etapa 2: verificar (revisor independiente) ──
  // Si esta llamada falla, caemos a la clasificación de la etapa 1 (no bloqueamos el uso normal).
  let revision: Revision = {
    aprobado: generado.es_cosmetico_topico,
    es_cosmetico_topico: generado.es_cosmetico_topico,
    tipo_producto: generado.tipo_producto,
    problema: generado.es_cosmetico_topico
      ? ""
      : `El producto no parece un cosmético que se aplique sobre el cuerpo (parece: ${generado.tipo_producto || "otro tipo de producto"}).`,
  };

  try {
    const textoParaRevisar = `${mensajeUsuario}
Tipo de producto (según generador): ${generado.tipo_producto || "sin especificar"}
Modo de uso generado: ${generado.modo_uso || "(vacío)"}
Advertencias generadas: ${generado.advertencias || "(vacío)"}
Descripción de catálogo: ${generado.descripcion_catalogo || "(vacío)"}`;

    const rev = await groq.chat.completions.create({
      model: MODELO,
      messages: [
        { role: "system", content: REVISOR_INSTRUCTION },
        { role: "user", content: textoParaRevisar },
      ],
      response_format: { type: "json_object" },
    });
    const parsedRev = JSON.parse(rev.choices[0]?.message?.content ?? "{}");
    const esTopico = parsedRev.es_cosmetico_topico !== false && generado.es_cosmetico_topico;
    revision = {
      aprobado: parsedRev.aprobado === true && esTopico,
      es_cosmetico_topico: esTopico,
      tipo_producto: typeof parsedRev.tipo_producto === "string" && parsedRev.tipo_producto ? parsedRev.tipo_producto : generado.tipo_producto,
      problema: typeof parsedRev.problema === "string" ? parsedRev.problema : "",
    };
  } catch (error) {
    // No abortamos: usamos la clasificación de la etapa 1 ya cargada en `revision`.
    console.error("[lab/etiqueta-texto] verificar", error);
  }

  // Si el filtro no aprueba, NO devolvemos los textos de aplicación (para no rellenar
  // "aplicar sobre la piel" en algo que no es cosmético). Devolvemos solo la alerta.
  if (!revision.aprobado) {
    return NextResponse.json({
      modo_uso: "",
      advertencias: "",
      descripcion_catalogo: "",
      descripcion_redes: "",
      revision,
    });
  }

  return NextResponse.json({
    modo_uso: generado.modo_uso,
    advertencias: generado.advertencias,
    descripcion_catalogo: generado.descripcion_catalogo,
    descripcion_redes: generado.descripcion_redes,
    revision,
  });
}
