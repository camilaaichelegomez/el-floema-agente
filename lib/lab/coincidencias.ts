export function normalizarTexto(texto: string): string {
  return texto
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

/**
 * Busca, entre `items`, el que mejor coincide con `nombre` ignorando
 * mayúsculas/minúsculas y tildes (ej. "Manteca de Karité" === "manteca de karite"),
 * para evitar crear duplicados cuando la IA o la usuaria escriben el mismo
 * ingrediente con variaciones menores.
 */
export function adivinarCoincidencia<T extends { ingrediente: string }>(nombre: string, items: T[]): T | null {
  const n = normalizarTexto(nombre);
  if (!n) return null;
  return (
    items.find((i) => {
      const io = normalizarTexto(i.ingrediente);
      return n.includes(io) || io.includes(n);
    }) ?? null
  );
}
