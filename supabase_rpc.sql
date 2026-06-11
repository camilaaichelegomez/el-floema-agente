-- Habilitar extensión pgvector (si no está activa)
create extension if not exists vector;

-- Crear función RPC para búsqueda semántica
create or replace function buscar_articulos(
  query_embedding vector(384),
  match_count     int default 6
)
returns table (
  id         bigint,
  title      text,
  authors    text,
  year       text,
  journal    text,
  source     text,
  plant_key  text,
  doi        text,
  snippet    text,
  similarity float
)
language sql stable
as $$
  select
    id,
    title,
    authors,
    year,
    journal,
    source,
    plant_key,
    doi,
    snippet,
    1 - (embedding <=> query_embedding) as similarity
  from articulos_botanicos
  order by embedding <=> query_embedding
  limit match_count;
$$;

-- Índice HNSW para búsquedas rápidas (cosine distance)
create index if not exists articulos_embedding_hnsw
  on articulos_botanicos
  using hnsw (embedding vector_cosine_ops);
