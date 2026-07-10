import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import {
  TIPOS_PDF,
  TIPOS_EXCEL,
  TIPOS_WORD,
  excelATexto,
  wordATexto,
  generarArrayJsonConReintento,
} from "@/lib/lab/documentos";

const PROMPT = `Este es un documento de compra (foto, PDF, planilla Excel o Word) de insumos para cosmética natural artesanal: una boleta o factura.
Extrae cada línea de producto comprado. Responde ÚNICAMENTE con un array JSON válido, sin texto adicional, sin markdown, con este formato exacto:
[{"nombre": "...", "cantidad": number, "unidad": "g" | "ml" | "unidad", "precio_total": number}]

Reglas:
- "precio_total" es el precio pagado por esa línea completa, en pesos chilenos (CLP), solo el número, sin puntos ni símbolo de moneda.
- Si el documento indica el tamaño del producto (ej. "500ml", "1kg"), convierte "cantidad" a la unidad correspondiente en gramos o mililitros (1kg = 1000g).
- Si no puedes leer con certeza algún dato, usa null en ese campo.
- No inventes productos que no aparezcan en el documento.`;

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
  const fileName: string = typeof body?.fileName === "string" ? body.fileName : "boleta";

  if (!imageBase64 || !mimeType) {
    return NextResponse.json({ error: "Falta el archivo." }, { status: 400 });
  }

  // Vercel rechaza cuerpos >4.5 MB antes de llegar aca; este limite da un error claro en cualquier entorno.
  if (typeof imageBase64 !== "string" || imageBase64.length > 8_000_000) {
    return NextResponse.json(
      { error: "El archivo es muy pesado (max. ~5 MB). Prueba con una foto mas liviana o un PDF/Excel." },
      { status: 413 }
    );
  }

  const esImagen = mimeType.startsWith("image/");
  const esPdf = TIPOS_PDF.has(mimeType);
  const esExcel = TIPOS_EXCEL.has(mimeType);
  const esWord = TIPOS_WORD.has(mimeType);

  if (!esImagen && !esPdf && !esExcel && !esWord) {
    return NextResponse.json(
      { error: "Formato no soportado. Sube una foto, un PDF, un Excel (.xlsx) o un Word (.docx)." },
      { status: 400 }
    );
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "API key de Gemini no configurada." }, { status: 500 });
  }

  const buffer = Buffer.from(imageBase64, "base64");

  let items: ItemExtraido[];
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    let textoDocumento: string | null = null;
    if (!esImagen && !esPdf) {
      textoDocumento = esExcel ? excelATexto(buffer) : await wordATexto(buffer);
      if (!textoDocumento.trim()) {
        return NextResponse.json(
          { error: "El archivo no tiene contenido legible. Prueba con otro archivo." },
          { status: 422 }
        );
      }
    }

    const parsed = await generarArrayJsonConReintento(async () => {
      const result =
        esImagen || esPdf
          ? await model.generateContent([{ inlineData: { mimeType, data: imageBase64 } }, { text: PROMPT }])
          : await model.generateContent([`${PROMPT}\n\nContenido del documento:\n\n${textoDocumento}`]);
      return result.response.text();
    });

    items = normalizarItems(parsed);
  } catch (error) {
    console.error("[lab/boleta] extraccion", error);
    return NextResponse.json(
      { error: "No pude leer el documento con claridad. Prueba con otro archivo o carga los datos manualmente." },
      { status: 422 }
    );
  }

  if (items.length === 0) {
    return NextResponse.json(
      { error: "No encontré productos legibles en ese documento. Prueba con otro archivo o carga los datos manualmente." },
      { status: 422 }
    );
  }

  const nombreLimpio = fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
  const path = `${user.id}/${Date.now()}-${nombreLimpio}`;

  const { error: uploadError } = await supabase.storage.from("boletas").upload(path, buffer, {
    contentType: mimeType,
    upsert: false,
  });

  if (uploadError) {
    console.error("[lab/boleta] storage", uploadError);
    return NextResponse.json({ error: `No se pudo guardar el archivo: ${uploadError.message}` }, { status: 500 });
  }

  return NextResponse.json({ items, fotoBoletaPath: path });
}
