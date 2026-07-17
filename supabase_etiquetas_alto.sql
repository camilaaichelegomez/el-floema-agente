-- Ejecutar en el SQL Editor de Supabase (formula_etiquetas ya existe, esto solo agrega una columna).
-- alto_mm = 0 significa "alto automatico" (proporcion del arte). Un valor > 0 fija el alto.

alter table formula_etiquetas add column if not exists alto_mm numeric not null default 0;
