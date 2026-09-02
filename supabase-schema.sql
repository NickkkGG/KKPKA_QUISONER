-- Jalankan sekali di Supabase SQL Editor.
-- Skrip ini aman dijalankan pada database baru maupun tabel yang sudah ada.

create table if not exists public.responden (
  id uuid default gen_random_uuid() primary key,
  nama text not null,
  npm text,
  email text,
  usia integer,
  jenjang text,
  prodi text not null,
  answers jsonb not null,
  skala_depresi integer not null,
  interpretasi_depresi text not null,
  skala_kecemasan integer not null,
  interpretasi_kecemasan text not null,
  skala_stress integer not null,
  interpretasi_stress text not null,
  created_at timestamptz default now()
);

alter table public.responden
  add column if not exists npm text,
  add column if not exists email text,
  add column if not exists usia integer,
  add column if not exists jenjang text;

create index if not exists responden_created_at_idx
  on public.responden (created_at desc);

alter table public.responden enable row level security;

drop policy if exists "anon insert only" on public.responden;
create policy "anon insert only"
  on public.responden
  for insert to anon
  with check (true);
