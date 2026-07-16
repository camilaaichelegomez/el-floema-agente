-- Ejecutar en el SQL Editor de Supabase.
-- 1) Notas en preparaciones (para dejar comentarios/observaciones de cada preparacion).
-- 2) formula_id en floema_tareas (para poder agregar una formula directo como tarea a preparar).

alter table preparaciones add column if not exists notas text;

alter table floema_tareas
  add column if not exists formula_id bigint references formulas(id) on delete set null;
