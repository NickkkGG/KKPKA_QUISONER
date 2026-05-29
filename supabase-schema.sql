-- Jalankan di Supabase SQL Editor
-- Jika tabel sudah ada, gunakan ALTER TABLE:

ALTER TABLE responden
  ADD COLUMN IF NOT EXISTS npm text,
  ADD COLUMN IF NOT EXISTS email text,
  ADD COLUMN IF NOT EXISTS usia integer,
  ADD COLUMN IF NOT EXISTS jenjang text;

-- Jika belum ada tabel sama sekali, buat baru:
/*
create table responden (
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

alter table responden enable row level security;
create policy "anon insert only" on responden for insert to anon with check (true);
*/
