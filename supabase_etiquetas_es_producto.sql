-- Ejecutar en el SQL Editor de Supabase (formula_etiquetas ya existe, esto solo agrega una columna).
--
-- Marca cuáles fórmulas se muestran en la sección "Productos" del Lab.
-- Por defecto false: la lista de Productos parte vacía y tú vas eligiendo cuáles
-- aparecen ("Añadir a productos" desde Preparadas, o quitándolas desde Productos).

alter table formula_etiquetas add column if not exists es_producto boolean not null default false;
