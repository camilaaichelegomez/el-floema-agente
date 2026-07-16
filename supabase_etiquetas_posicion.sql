-- Ejecutar en el SQL Editor de Supabase (formula_etiquetas ya existe, esto solo agrega columnas).

alter table formula_etiquetas add column if not exists offset_left_mm numeric not null default 0;
alter table formula_etiquetas add column if not exists offset_center_mm numeric not null default 0;
alter table formula_etiquetas add column if not exists offset_right_mm numeric not null default 0;
