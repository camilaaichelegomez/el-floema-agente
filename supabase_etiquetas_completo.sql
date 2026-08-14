-- Ejecutar en el SQL Editor de Supabase (proyecto de producción, el que usa Vercel).
--
-- Garantiza que la tabla formula_etiquetas tenga TODAS las columnas que el editor
-- de etiquetas guarda. Es idempotente: "add column if not exists" no rompe nada si
-- la columna ya está. Corre este bloque completo de una vez.
--
-- Si "Guardar" en la etiqueta no guardaba, era porque a la base de producción le
-- faltaba alguna de estas columnas (forma, alto, posición/tamaño por panel, etc.).

-- Texto de la etiqueta
alter table formula_etiquetas add column if not exists subtitle              text;
alter table formula_etiquetas add column if not exists category_line         text;
alter table formula_etiquetas add column if not exists modo_uso              text;
alter table formula_etiquetas add column if not exists ingredientes          text;
alter table formula_etiquetas add column if not exists advertencias          text;
alter table formula_etiquetas add column if not exists storage_note          text;
alter table formula_etiquetas add column if not exists social                text default '@elfloema';
alter table formula_etiquetas add column if not exists fabricante            text;
alter table formula_etiquetas add column if not exists vencimiento           text;
alter table formula_etiquetas add column if not exists tamano                text;

-- Descripciones para catálogo y redes
alter table formula_etiquetas add column if not exists descripcion_catalogo  text;
alter table formula_etiquetas add column if not exists descripcion_redes     text;

-- Forma y dimensiones físicas
alter table formula_etiquetas add column if not exists forma                 text    not null default 'rectangular';
alter table formula_etiquetas add column if not exists width_mm              numeric not null default 150;
alter table formula_etiquetas add column if not exists alto_mm               numeric not null default 0;
alter table formula_etiquetas add column if not exists font_scale            numeric not null default 1.0;

-- Ajustes de posición por panel
alter table formula_etiquetas add column if not exists offset_left_mm        numeric not null default 0;
alter table formula_etiquetas add column if not exists offset_center_mm      numeric not null default 0;
alter table formula_etiquetas add column if not exists offset_right_mm       numeric not null default 0;

-- Ajustes de tamaño de letra por panel
alter table formula_etiquetas add column if not exists font_scale_left       numeric not null default 1.0;
alter table formula_etiquetas add column if not exists font_scale_center     numeric not null default 1.0;
alter table formula_etiquetas add column if not exists font_scale_right      numeric not null default 1.0;

-- Marca de "es producto" (para la sección Productos)
alter table formula_etiquetas add column if not exists es_producto           boolean not null default false;

-- Marca de tiempo de la última edición
alter table formula_etiquetas add column if not exists actualizada           timestamptz not null default now();
