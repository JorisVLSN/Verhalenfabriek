create extension if not exists pgcrypto;

create table if not exists public.stories (
  id uuid primary key,
  child_id text not null,
  title text not null,
  messages jsonb not null default '[]'::jsonb,
  current_phase integer,
  resident_id text,
  source text not null default 'created',
  daily_date_key text,
  daily_signature text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists stories_child_updated_idx
  on public.stories (child_id, updated_at desc);

create unique index if not exists stories_daily_child_date_idx
  on public.stories (child_id, daily_date_key)
  where source = 'courtyard-daily' and daily_date_key is not null;

create table if not exists public.interactions (
  id uuid primary key default gen_random_uuid(),
  child_id text not null,
  resident_id text not null,
  kind text not null check (kind in ('conversation')),
  created_at timestamptz not null default now()
);

create index if not exists interactions_child_resident_idx
  on public.interactions (child_id, resident_id, created_at desc);

create table if not exists public.character_suggestions (
  id uuid primary key default gen_random_uuid(),
  child_id text not null,
  suggested_name text not null,
  species text,
  likes jsonb not null default '[]'::jsonb,
  traits jsonb not null default '[]'::jsonb,
  evidence text not null,
  source_story_id uuid references public.stories(id) on delete cascade,
  status text not null default 'new',
  created_at timestamptz not null default now(),
  unique (child_id, suggested_name, source_story_id)
);

alter table public.stories enable row level security;
alter table public.interactions enable row level security;
alter table public.character_suggestions enable row level security;

-- De app gebruikt uitsluitend de geheime server-sleutel.
-- Voeg hier pas policies toe wanneer de kindprofielen een echte aanmelding krijgen.
