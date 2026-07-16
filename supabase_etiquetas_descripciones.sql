-- Ejecutar en el SQL Editor de Supabase (formula_etiquetas ya existe, esto solo agrega columnas).

alter table formula_etiquetas add column if not exists descripcion_catalogo text;
alter table formula_etiquetas add column if not exists descripcion_redes text;
