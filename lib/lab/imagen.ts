/**
 * Las fotos de celular suelen pesar 3-8 MB; en base64 crecen un 33% y superan
 * el límite de cuerpo de request de Vercel (~4.5 MB), con lo que la subida
 * falla antes de llegar a nuestra API. Redimensionamos en el navegador antes
 * de subir: para leer texto de una boleta no se necesita más resolución.
 */
export async function comprimirImagenSiHaceFalta(
  file: File,
  maxBytes = 2_500_000,
  maxLado = 1800
): Promise<File> {
  if (!file.type.startsWith("image/") || file.size <= maxBytes) return file;

  try {
    const bitmap = await createImageBitmap(file);
    const escala = Math.min(1, maxLado / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(bitmap.width * escala));
    canvas.height = Math.max(1, Math.round(bitmap.height * escala));
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    const blob: Blob | null = await new Promise((res) => canvas.toBlob(res, "image/jpeg", 0.82));
    if (!blob || blob.size >= file.size) return file;
    return new File([blob], file.name.replace(/\.[^.]+$/, "") + ".jpg", { type: "image/jpeg" });
  } catch {
    // Formato que el navegador no puede decodificar (ej. HEIC): se sube tal cual.
    return file;
  }
}
