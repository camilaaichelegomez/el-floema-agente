-- Grimorio de Tareas — ejecutar en el SQL Editor de Supabase (mismo proyecto que ya usa el Lab).
--
-- Se aparta de la politica "acceso total" del spec original: este Lab ya tiene login
-- (auth.uid()) y todo lo demas (inventario, formulas, formulas de preparacion) esta
-- protegido por RLS scoped al usuario. Dejar estas dos tablas con "using (true)" seria
-- el unico lugar del proyecto donde cualquiera con la anon key (publica en el bundle
-- del navegador) podria leer/editar/borrar tareas y notas de cualquiera. Se usa el
-- mismo patron user_id + auth.uid() que ya usa "formulas_guardadas".

create table if not exists floema_tareas (
  id        uuid primary key default gen_random_uuid(),
  user_id   uuid not null references auth.users(id) default auth.uid(),
  titulo    text not null,
  tipo      text not null check (tipo in ('receta','tarea')),
  urgencia  text not null check (urgencia in ('urgente','normal')),
  tiempo    text,
  hecha     boolean not null default false,
  nota      text default '',
  creada    timestamptz not null default now()
);

create table if not exists floema_notas (
  id      uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) default auth.uid(),
  texto   text not null,
  creada  timestamptz not null default now()
);

alter table floema_tareas enable row level security;
alter table floema_notas enable row level security;

create policy "floema_tareas_select_own" on floema_tareas for select using (auth.uid() = user_id);
create policy "floema_tareas_insert_own" on floema_tareas for insert with check (auth.uid() = user_id);
create policy "floema_tareas_update_own" on floema_tareas for update using (auth.uid() = user_id);
create policy "floema_tareas_delete_own" on floema_tareas for delete using (auth.uid() = user_id);

create policy "floema_notas_select_own" on floema_notas for select using (auth.uid() = user_id);
create policy "floema_notas_insert_own" on floema_notas for insert with check (auth.uid() = user_id);
create policy "floema_notas_update_own" on floema_notas for update using (auth.uid() = user_id);
create policy "floema_notas_delete_own" on floema_notas for delete using (auth.uid() = user_id);
