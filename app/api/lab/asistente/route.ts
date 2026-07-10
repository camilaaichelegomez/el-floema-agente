import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";

interface MensajeChat {
  role: "user" | "model";
  content: string;
}

function construirContextoInventario(
  items: Array<{ ingrediente: string; cantidad: number; unidad: string; costo_unitario: number | null }>
): string {
  if (items.length === 0) {
    return "La usuaria todavía no tiene ingredientes cargados en su inventario.";
  }
  return items
    .map((it) => {
      const costo = it.costo_unitario !== null ? `, costo unitario ~$${Math.round(it.costo_unitario)} CLP/${it.unidad}` : "";
      return `- ${it.ingrediente}: ${it.cantidad} ${it.unidad} disponibles${costo}`;
    })
    .join("\n");
}

function construirSystemInstruction(contextoInventario: string): string {
  return `Eres el asistente de formulación del Lab de El Floema, una marca de cosmética natural artesanal. Ayudas a la formuladora a diseñar y ajustar fórmulas de cosmética natural.

Este es el inventario actual de la usuaria:
${contextoInventario}

Instrucciones:
- Prioriza usar ingredientes que ya están en el inventario de arriba, para que no tenga que comprar de más.
- Si la fórmula necesita un ingrediente que no está en el inventario, dilo explícitamente.
- Responde siempre en español, de forma cercana y profesional, sin inventar propiedades cosméticas que no sean razonables.
- Cuando la usuaria pida explícitamente guardar, finalizar o confirmar una fórmula, agrega al final de tu respuesta (después de tu explicación normal) un bloque de código con el lenguaje "formula" que contenga ÚNICAMENTE un JSON válido con este formato exacto:
\`\`\`formula
{"nombre": "string", "categoria": "string o null", "descripcion": "string o null", "ph_objetivo": "string o null", "rinde_gramos": number o null, "unidades": number o null, "pasos": "string o null", "items": [{"ingrediente": "string", "gramos": number, "porcentaje": number o null, "fase": "string o null"}]}
\`\`\`
- "pasos" es el procedimiento de elaboración paso a paso (no solo las cantidades), como un solo texto con cada paso en una línea numerada (ej. "1. Fundir la fase oleosa...\\n2. Agregar la fase acuosa...").
- No incluyas ese bloque "formula" en mensajes normales de conversación, solo cuando corresponda guardar una fórmula.`;
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
  const mensajes: MensajeChat[] | undefined = body?.messages;

  if (!mensajes || !Array.isArray(mensajes) || mensajes.length === 0) {
    return NextResponse.json({ error: "Falta el mensaje." }, { status: 400 });
  }

  // Limita tamaño y forma de la conversación para no quemar cuota de Gemini con payloads anómalos.
  const MAX_MENSAJES = 40;
  const MAX_LARGO_MENSAJE = 6_000;
  const mensajesValidos = mensajes.every(
    (m) =>
      m &&
      typeof m === "object" &&
      (m.role === "user" || m.role === "model") &&
      typeof m.content === "string" &&
      m.content.length <= MAX_LARGO_MENSAJE
  );
  if (!mensajesValidos || mensajes.length > MAX_MENSAJES || mensajes[mensajes.length - 1].role !== "user") {
    return NextResponse.json({ error: "La conversación es demasiado larga o tiene un formato inválido." }, { status: 400 });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "API key de Gemini no configurada." }, { status: 500 });
  }

  const { data: inventario } = await supabase
    .from("inventario_con_costo")
    .select("ingrediente, cantidad, unidad, costo_unitario")
    .order("ingrediente", { ascending: true });

  const contextoInventario = construirContextoInventario(inventario ?? []);
  const systemInstruction = construirSystemInstruction(contextoInventario);

  const historial = mensajes.slice(0, -1).map((m) => ({ role: m.role, parts: [{ text: m.content }] }));
  const ultimoMensaje = mensajes[mensajes.length - 1];

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash", systemInstruction });
    const chat = model.startChat({ history: historial });
    const result = await chat.sendMessage(ultimoMensaje.content);
    const reply = result.response.text();

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("[lab/asistente] gemini", error);
    return NextResponse.json({ error: "No pude responder en este momento. Intenta de nuevo." }, { status: 502 });
  }
}
