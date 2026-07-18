-- Ejecutar en el SQL Editor de Supabase.
-- Faltaba la policy de UPDATE en "preparaciones": por eso guardar la nota de una
-- preparacion fallaba en silencio (RLS bloqueaba el update, 0 filas afectadas,
-- sin error). Esto habilita actualizar solo las propias filas.

create policy "preparaciones_update_own"
  on preparaciones for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
