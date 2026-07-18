-- Ejecutar en el SQL Editor de Supabase (formula_etiquetas ya existe, esto solo agrega una columna).
-- forma: 'rectangular' (etiqueta de 3 paneles, por defecto) o 'redonda' (medallon).

alter table formula_etiquetas add column if not exists forma text not null default 'rectangular';
