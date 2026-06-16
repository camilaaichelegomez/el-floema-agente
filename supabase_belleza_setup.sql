-- Tabla para artículos de belleza científica
create table if not exists articulos_belleza (
  id         bigserial primary key,
  title      text,
  authors    text,
  year       text,
  journal    text,
  source     text,
  plant_key  text,   -- aquí guarda el topic_key (ej: gut_skin_axis_diet)
  doi        text,
  snippet    text,
  embedding  vector(768)  -- text-embedding-004 genera 768 dims
);

-- Función RPC de búsqueda semántica para belleza
create or replace function buscar_articulos_belleza(
  query_embedding vector(768),
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
  from articulos_belleza
  order by embedding <=> query_embedding
  limit match_count;
$$;

-- Índice HNSW para búsquedas rápidas (cosine distance)
create index if not exists articulos_belleza_embedding_hnsw
  on articulos_belleza
  using hnsw (embedding vector_cosine_ops);
