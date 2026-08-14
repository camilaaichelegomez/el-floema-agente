import Groq from "groq-sdk";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";

const MODELO = "llama-3.3-70b-versatile";

const SYSTEM_INSTRUCTION = `Eres, a la vez, COPYWRITER experto en cosmética y COSMETÓLOGA formuladora de El Floema, una marca chilena de cosmética natural artesanal. Escribes textos que combinan rigor (conoces la función real de cada ingrediente cosmético) con seducción (dan ganas de usar el producto).

Dado el nombre de un producto y su lista de ingredientes, redactas los textos de su ficha.

PASO 0 — FILTRO. Antes de escribir decide si es un COSMÉTICO TÓPICO (se aplica sobre el cuerpo: piel, cabello, labios, uñas). Una vela, difusor, ambientador, jabón de lavar ropa, alimento, o cualquier cosa que NO se aplica sobre el cuerpo NO es cosmético tópico. Si no lo es: es_cosmetico_topico=false y deja modo_uso, advertencias, descripcion_catalogo y descripcion_redes en "".

CÓMO ESCRIBIR (lo más importante — los textos deben ser RICOS, específicos y deseables, NUNCA genéricos):

De cada ingrediente relevante conoces DOS funciones y debes usar ambas:
- Función EN LA PIEL: el beneficio para quien lo usa (hidrata, calma, regula el sebo, ilumina, empareja el tono, repara la barrera, antioxidante, suaviza, etc.).
- Función EN LA FÓRMULA: su rol técnico (tensioactivo suave, humectante, emoliente, emulsionante, base acuosa/hidrolato, conservante, espesante, regulador de pH, etc.).

PROHIBIDO: adjetivos vacíos sin sustento ("increíble", "mágico", "el mejor"), frases de relleno, listar ingredientes sin explicar para qué sirven, repetir la misma idea con otras palabras, sonar a infomercial.
OBLIGADO: lenguaje sensorial y concreto (textura, sensación en la piel, aroma, cómo queda la piel después), beneficios creíbles y específicos.

CAMPOS:
- "tipo_producto": qué es realmente, en pocas palabras (ej. "syndet facial líquido", "crema de manos", "sérum capilar").
- "modo_uso": 2-4 oraciones prácticas y específicas al tipo de producto (no genéricas). Solo si es cosmético tópico.
- "advertencias": seguridad estándar de cosmética natural (uso externo, evitar contacto con los ojos, mantener fuera del alcance de niños, suspender si hay irritación), ajustadas según los ingredientes. Solo si es cosmético tópico.
- "descripcion_catalogo": para la tienda/catálogo, 6-9 oraciones, así:
   1) Abre con la transformación o el momento de uso: qué resuelve, qué se siente.
   2) Describe la experiencia sensorial (textura, aroma, cómo queda la piel).
   3) Incluye un bloque que empiece con "Ingredientes y para qué sirven:" y liste los 3-5 ingredientes clave, cada uno con su función EN LA PIEL y EN LA FÓRMULA, en frases cortas (ej. "Hidrolato de triwe — calma y aporta frescor; en la fórmula es la base acuosa aromática.").
   4) Cierra dejando claro para quién es ideal y una invitación cálida a usarlo.
- "descripcion_redes": Instagram, 3-4 oraciones: gancho potente en la primera frase (una emoción, un resultado, una pregunta), 2-3 ingredientes estrella con su beneficio para la piel, y un cierre que dé ganas de probarlo. Sin hashtags ni emojis.

HONESTIDAD: persuasivo NO es exagerado. Basa cada afirmación en lo que es razonable esperar de estos ingredientes. Nada de promesas médicas ni falsas ("borra arrugas", "cura", "elimina"). En un producto de enjuague, los activos y el hidrolato aportan de forma suave — dilo con matices, no exageres.

EJEMPLO del NIVEL esperado (NO copies el contenido, copia el nivel de detalle):
POBRE: "Crema hidratante natural con ingredientes de calidad que nutre tu piel y la deja suave. Ideal para todo tipo de piel."
EXCELENTE: "Se funde al primer toque y deja la piel flexible, sin película grasa, con un aroma herbal tenue que se disipa en segundos. Ingredientes y para qué sirven: Manteca de karité — nutre y refuerza la barrera cutánea; en la fórmula aporta cuerpo y untuosidad. Niacinamida — regula el brillo y empareja el tono; además estabiliza la textura. Glicerina — atrae agua a la piel y evita la tirantez. Ideal para pieles que amanecen tirantes y buscan confort real, no solo una capa que se siente encima."

Responde ÚNICAMENTE con un JSON válido, sin texto adicional, con este formato exacto:
{"es_cosmetico_topico": boolean, "tipo_producto": "string", "modo_uso": "string", "advertencias": "string", "descripcion_catalogo": "string", "descripcion_redes": "string"}`;

// Revisor independiente y adversarial: su único trabajo es CAZAR errores graves,
// sobre todo tratar como cosmético algo que no se aplica sobre el cuerpo.
const REVISOR_INSTRUCTION = `Eres un revisor crítico y estricto de etiquetas de cosmética. Te dan un producto, sus ingredientes y un texto de etiqueta generado por otra IA. Tu ÚNICO trabajo es detectar errores graves, especialmente:

1. ¿El producto realmente es un cosmético que se aplica sobre el cuerpo (piel, cabello, labios, uñas)? Si es una vela, difusor, ambientador, alimento, producto de limpieza del hogar, o cualquier cosa que NO se aplica sobre el cuerpo, es un ERROR GRAVE tratarlo como cosmético.
2. ¿El "modo de uso" asume que se aplica sobre el cuerpo cuando el producto no corresponde?
3. ¿Hay promesas MÉDICAS o claramente FALSAS (ej. "cura", "elimina arrugas", "trata el acné", "regenera la piel", cualquier claim de enfermedad)? Un copy detallado y sensorial que describe funciones razonables de los ingredientes es CORRECTO y NO es motivo de rechazo — solo rechaza afirmaciones médicas o falsas.

Sé estricto SOLO con los puntos 1, 2 y 3 anteriores; no rechaces por estilo ni por ser descriptivo. Responde ÚNICAMENTE con un JSON válido:
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
      temperature: 0.75,
      max_tokens: 1900,
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
