create extension if not exists vector;

create table chats (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz default now()
);

create table messages (
  id uuid primary key default gen_random_uuid(),
  chat_id uuid references chats(id) on delete cascade,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  created_at timestamptz default now()
);

create table files (
  id uuid primary key default gen_random_uuid(),
  chat_id uuid references chats(id) on delete cascade,
  name text not null,
  hash text not null,
  created_at timestamptz default now()
);

create table chunks (
  id uuid primary key default gen_random_uuid(),
  file_id uuid references files(id) on delete cascade,
  chat_id uuid references chats(id) on delete cascade,
  content text not null,
  embedding vector(1536),
  created_at timestamptz default now()
);

create index on chunks using ivfflat (embedding vector_cosine_ops) with (lists = 100);

create or replace function match_chunks(
  query_embedding vector(1536),
  match_chat_id uuid,
  match_count int default 5
)
returns table (
  id uuid,
  content text,
  file_id uuid,
  similarity float
)
language sql stable
as $$
  select
    chunks.id,
    chunks.content,
    chunks.file_id,
    1 - (chunks.embedding <=> query_embedding) as similarity
  from chunks
  where chunks.chat_id = match_chat_id
  order by chunks.embedding <=> query_embedding
  limit match_count;
$$;
