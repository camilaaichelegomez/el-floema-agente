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
