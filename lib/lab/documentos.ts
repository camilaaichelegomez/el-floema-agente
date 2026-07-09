import * as XLSX from "xlsx";
import mammoth from "mammoth";

export const TIPOS_PDF = new Set(["application/pdf"]);
export const TIPOS_EXCEL = new Set([
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-excel",
]);
export const TIPOS_WORD = new Set(["application/vnd.openxmlformats-officedocument.wordprocessingml.document"]);

export function excelATexto(buffer: Buffer): string {
  const libro = XLSX.read(buffer, { type: "buffer" });
  return libro.SheetNames.map((nombre) => {
    const csv = XLSX.utils.sheet_to_csv(libro.Sheets[nombre]);
    return `Hoja "${nombre}":\n${csv}`;
  }).join("\n\n");
}

export async function wordATexto(buffer: Buffer): Promise<string> {
  const { value } = await mammoth.extractRawText({ buffer });
  return value;
}

function extraerArrayJson(texto: string): unknown {
  const limpio = texto.replace(/```json|```/g, "").trim();
  try {
    return JSON.parse(limpio);
  } catch {
    const inicio = limpio.indexOf("[");
    const fin = limpio.lastIndexOf("]");
    if (inicio === -1 || fin === -1 || fin < inicio) {
      throw new Error("La respuesta no contenía un array JSON reconocible.");
    }
    return JSON.parse(limpio.slice(inicio, fin + 1));
  }
}

/**
 * Gemini ocasionalmente devuelve una respuesta vacía, cortada o con texto
 * fuera del JSON pedido. Reintentar una vez suele resolverlo sin que la
 * usuaria tenga que volver a subir el archivo a mano.
 */
export async function generarArrayJsonConReintento(generar: () => Promise<string>, intentos = 2): Promise<unknown> {
  let ultimoError: unknown;
  for (let intento = 0; intento < intentos; intento++) {
    try {
      const texto = await generar();
      return extraerArrayJson(texto);
    } catch (error) {
      ultimoError = error;
    }
  }
  throw ultimoError;
}
