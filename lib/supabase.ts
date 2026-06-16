import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

// ── Types ──────────────────────────────────────────────────────────────────────

export type Categoria =
  | "Formulaciones"
  | "Investigación"
  | "Del Predio"
  | "Ciencia"
  | "Reflexiones";

export interface Post {
  id: string;
  slug: string;
  titulo: string;
  contenido: string;
  categoria: Categoria;
  imagen_url: string | null;
  tags: string[];
  publicado: boolean;
  created_at: string;
}

// ── SQL para crear la tabla en Supabase Dashboard ─────────────────────────────
//
// Ejecutar en: Supabase Dashboard → SQL Editor
//
// create table posts (
//   id uuid default gen_random_uuid() primary key,
//   slug text unique not null,
//   titulo text not null,
//   contenido text not null,
//   categoria text not null check (categoria in (
//     'Formulaciones', 'Investigación', 'Del Predio', 'Ciencia', 'Reflexiones'
//   )),
//   imagen_url text,
//   tags text[] default '{}',
//   publicado boolean default false,
//   created_at timestamp with time zone default timezone('utc', now())
// );
//
// alter table posts enable row level security;
//
// create policy "Lectura pública de posts publicados" on posts
//   for select using (publicado = true);
