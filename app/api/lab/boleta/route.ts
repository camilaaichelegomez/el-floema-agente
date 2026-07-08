import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";

const PROMPT = `Esta es una foto de una boleta o factura de compra de insumos para cosmética natural artesanal.
Extrae cada línea de producto comprado. Responde ÚNICAMENTE con un array JSON válido, sin texto adicional, sin markdown, con este formato exacto:
[{"nombre": "...", "cantidad": number, "unidad": "g" | "ml" | "unidad", "precio_total": number}]

Reglas:
- "precio_total" es el precio pagado por esa línea completa, en pesos chilenos (CLP), solo el número, sin puntos ni símbolo de moneda.
- Si la boleta indica el tamaño del producto (ej. "500ml", "1kg"), convierte "cantidad" a la unidad correspondiente en gramos o mililitros (1kg = 1000g).
- Si no puedes leer con certeza algún dato, usa null en ese campo.
- No inventes productos que no aparezcan en la boleta.`;

interface ItemExtraido {
  nombre: string;
  cantidad: number | null;
  unidad: "g" | "ml" | "unidad";
  precio_total: number | null;
}

function normalizarItems(raw: unknown): ItemExtraido[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((it): ItemExtraido | null => {
      if (!it || typeof it !== "object") return null;
      const o = it as Record<string, unknown>;
      const nombre = typeof o.nombre === "string" ? o.nombre.trim() : "";
      if (!nombre) return null;
      const unidad = ["g", "ml", "unidad"].includes(o.unidad as string) ? (o.unidad as ItemExtraido["unidad"]) : "g";
      const cantidad = typeof o.cantidad === "number" ? o.cantidad : null;
      const precio_total = typeof o.precio_total === "number" ? o.precio_total : null;
      return { nombre, cantidad, unidad, precio_total };
    })
    .filter((it): it is ItemExtraido => it !== null);
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
  const imageBase64: string | undefined = body?.imageBase64;
  const mimeType: string | undefined = body?.mimeType;
  const fileName: string = typeof body?.fileName === "string" ? body.fileName : "boleta.jpg";

  if (!imageBase64 || !mimeType) {
    return NextResponse.json({ error: "Falta la imagen." }, { status: 400 });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "API key de Gemini no configurada." }, { status: 500 });
  }

  let items: ItemExtraido[];
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent([
      { inlineData: { mimeType, data: imageBase64 } },
      { text: PROMPT },
    ]);
    const texto = result.response.text();
    const limpio = texto.replace(/```json|```/g, "").trim();
    items = normalizarItems(JSON.parse(limpio));
  } catch (error) {
    console.error("[lab/boleta] gemini", error);
    return NextResponse.json(
      { error: "No pude leer la boleta con claridad. Prueba con una foto más nítida y bien iluminada." },
      { status: 422 }
    );
  }

  if (items.length === 0) {
    return NextResponse.json(
      { error: "No encontré productos legibles en esa foto. Prueba con otra imagen o carga los datos manualmente." },
      { status: 422 }
    );
  }

  const nombreLimpio = fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
  const path = `${user.id}/${Date.now()}-${nombreLimpio}`;
  const buffer = Buffer.from(imageBase64, "base64");

  const { error: uploadError } = await supabase.storage.from("boletas").upload(path, buffer, {
    contentType: mimeType,
    upsert: false,
  });

  if (uploadError) {
    console.error("[lab/boleta] storage", uploadError);
    return NextResponse.json({ error: `No se pudo guardar la foto: ${uploadError.message}` }, { status: 500 });
  }

  return NextResponse.json({ items, fotoBoletaPath: path });
}
