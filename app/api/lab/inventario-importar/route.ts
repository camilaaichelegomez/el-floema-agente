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

const PROMPT = `Este es un documento (foto, PDF, planilla Excel o Word) con una lista de insumos de cosmética natural artesanal: un inventario o listado de stock, no necesariamente una boleta de compra.
Extrae cada ingrediente/insumo de la lista. Responde ÚNICAMENTE con un array JSON válido, sin texto adicional, sin markdown, con este formato exacto:
[{"nombre": "...", "categoria": string | null, "cantidad": number, "unidad": "g" | "ml" | "unidad", "proveedor": string | null}]

Reglas:
- "cantidad" es el stock actual de ese insumo, no una cantidad comprada.
- Si el documento indica el tamaño en otra unidad (ej. "500ml", "1kg"), convierte "cantidad" a gramos o mililitros (1kg = 1000g).
- Si no puedes leer con certeza algún dato, usa null en ese campo (excepto "nombre" y "cantidad", que son obligatorios).
- No inventes insumos que no aparezcan en el documento.`;

interface ItemInventarioExtraido {
  nombre: string;
  categoria: string | null;
  cantidad: number | null;
  unidad: "g" | "ml" | "unidad";
  proveedor: string | null;
}

function normalizarItems(raw: unknown): ItemInventarioExtraido[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((it): ItemInventarioExtraido | null => {
      if (!it || typeof it !== "object") return null;
      const o = it as Record<string, unknown>;
      const nombre = typeof o.nombre === "string" ? o.nombre.trim() : "";
      if (!nombre) return null;
      const unidad = ["g", "ml", "unidad"].includes(o.unidad as string) ? (o.unidad as ItemInventarioExtraido["unidad"]) : "g";
      const cantidad = typeof o.cantidad === "number" ? o.cantidad : null;
      const categoria = typeof o.categoria === "string" && o.categoria.trim() ? o.categoria.trim() : null;
      const proveedor = typeof o.proveedor === "string" && o.proveedor.trim() ? o.proveedor.trim() : null;
      return { nombre, categoria, cantidad, unidad, proveedor };
    })
    .filter((it): it is ItemInventarioExtraido => it !== null);
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

  let items: ItemInventarioExtraido[];
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
    console.error("[lab/inventario-importar] extraccion", error);
    return NextResponse.json(
      { error: "No pude leer el documento con claridad. Prueba con otro archivo o carga los datos manualmente." },
      { status: 422 }
    );
  }

  if (items.length === 0) {
    return NextResponse.json(
      { error: "No encontré insumos legibles en ese documento. Prueba con otro archivo o carga los datos manualmente." },
      { status: 422 }
    );
  }

  return NextResponse.json({ items });
}
