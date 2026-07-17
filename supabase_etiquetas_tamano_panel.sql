-- Ejecutar en el SQL Editor de Supabase (formula_etiquetas ya existe, esto solo agrega columnas).

alter table formula_etiquetas add column if not exists font_scale_left numeric not null default 1.0;
alter table formula_etiquetas add column if not exists font_scale_center numeric not null default 1.0;
alter table formula_etiquetas add column if not exists font_scale_right numeric not null default 1.0;
