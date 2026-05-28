-- Jalankan di Supabase SQL Editor

create table responden (
  id uuid default gen_random_uuid() primary key,
  nama text not null,
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

-- Hanya admin (service role) yang bisa baca, anon hanya bisa insert
alter table responden enable row level security;

create policy "anon insert only" on responden
  for insert to anon with check (true);

create policy "admin read" on responden
  for select using (auth.role() = 'service_role');
