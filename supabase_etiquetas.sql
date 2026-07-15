-- Sistema de etiquetas — ejecutar en el SQL Editor de Supabase (mismo proyecto del Lab).
--
-- Guarda los campos de etiqueta propios de cada formula (modo de uso, INCI,
-- advertencias, tamano fisico, etc.) que no viven en "formulas". Un producto real
-- (nombre, lote) se sigue leyendo de "formulas"/"formula_items"; esta tabla es solo
-- el complemento especifico de la etiqueta impresa, para poder editarlo sin tocar
-- la receta de produccion.

create table if not exists formula_etiquetas (
  id             uuid primary key default gen_random_uuid(),
  formula_id     bigint not null references formulas(id) on delete cascade,
  user_id        uuid not null references auth.users(id) default auth.uid(),
  subtitle       text,
  category_line  text,
  modo_uso       text,
  ingredientes   text, -- INCI corregido a mano; si es null se autogenera desde formula_items
  advertencias   text,
  storage_note   text,
  social         text default '@elfloema',
  fabricante     text default 'Fabricante: El Floema · La Unión, Región de Los Ríos, Chile.',
  vencimiento    text,
  tamano         text,
  width_mm       numeric not null default 150,
  font_scale     numeric not null default 1.0,
  actualizada    timestamptz not null default now(),
  unique (formula_id)
);

alter table formula_etiquetas enable row level security;

create policy "formula_etiquetas_select_own" on formula_etiquetas for select using (auth.uid() = user_id);
create policy "formula_etiquetas_insert_own" on formula_etiquetas for insert with check (auth.uid() = user_id);
create policy "formula_etiquetas_update_own" on formula_etiquetas for update using (auth.uid() = user_id);
create policy "formula_etiquetas_delete_own" on formula_etiquetas for delete using (auth.uid() = user_id);
