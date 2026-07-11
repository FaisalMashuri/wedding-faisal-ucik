-- Jalankan di Supabase SQL editor untuk membuat tabel RSVP.
create table if not exists public.rsvp (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  attendance text not null check (attendance in ('hadir', 'tidak_hadir')),
  guests int not null default 1,
  message text,
  created_at timestamptz not null default now()
);

-- Aktifkan Row Level Security
alter table public.rsvp enable row level security;

-- Izinkan siapa saja (anon) menambah RSVP
create policy "anyone can insert rsvp"
  on public.rsvp for insert
  to anon
  with check (true);

-- Izinkan siapa saja membaca ucapan (untuk ditampilkan di halaman)
create policy "anyone can read rsvp"
  on public.rsvp for select
  to anon
  using (true);
