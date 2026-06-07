-- VeridIA — schema Supabase (Postgres).
-- Rode no SQL Editor do Supabase. A coluna `data` guarda a submissão completa
-- (VeridiaSubmission) como JSONB para flexibilidade no MVP; colunas derivadas
-- aceleram o backoffice e relatórios.

create extension if not exists "pgcrypto";

create table if not exists submissions (
  id              text primary key,
  status          text not null default 'em_andamento',
  current_step    int  not null default 1,
  car_number      text,
  property_name   text,
  municipality    text,
  state           text,
  total_area_ha   numeric,
  readiness_score int,
  result_status   text,
  data            jsonb not null,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists submissions_status_idx on submissions (status);
create index if not exists submissions_updated_idx on submissions (updated_at desc);

-- Documentos enviados (Etapa 6). Arquivos vão para o Storage bucket "documents".
create table if not exists submission_documents (
  id             uuid primary key default gen_random_uuid(),
  submission_id  text not null references submissions (id) on delete cascade,
  type           text not null,
  file_name      text not null,
  file_path      text,
  extracted_data jsonb,
  confirmed      boolean not null default false,
  created_at     timestamptz not null default now()
);

-- Notas e ações do especialista (backoffice, PRD 02 §16).
create table if not exists expert_reviews (
  id             uuid primary key default gen_random_uuid(),
  submission_id  text not null references submissions (id) on delete cascade,
  action         text not null,
  note           text,
  score_override int,
  created_at     timestamptz not null default now()
);

create index if not exists expert_reviews_sub_idx on expert_reviews (submission_id);
