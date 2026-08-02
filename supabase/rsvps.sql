-- Tabel RSVP — jalankan di Supabase SQL editor.
--
-- Tabel `rsvps` SUDAH ada di project (DDL di bawah = kondisi sekarang).
-- Yang BELUM ada adalah policy INSERT untuk pengunjung anonim; tanpa itu
-- setiap submit dari undangan ditolak dengan:
--   "new row violates row-level security policy for table rsvps"
-- Jadi bagian yang benar-benar perlu dijalankan adalah blok POLICY di bawah.

create table if not exists public.rsvps (
  id bigserial primary key,
  name varchar(100) not null,
  -- Perhatikan huruf kapitalnya: 'Hadir' / 'Tidak Hadir'.
  -- Nilai ini dipakai apa adanya oleh <option value> di RsvpSection.tsx —
  -- kalau salah satu diubah, yang lain WAJIB ikut diubah.
  attendance varchar(20) not null check (attendance in ('Hadir', 'Tidak Hadir')),
  message text,
  created_at timestamp default current_timestamp
);

alter table public.rsvps enable row level security;

-- Tamu (anon) boleh mengirim RSVP.
drop policy if exists "anyone can insert rsvps" on public.rsvps;
create policy "anyone can insert rsvps"
  on public.rsvps for insert
  to anon, authenticated
  with check (true);

-- Tamu boleh membaca ucapan untuk ditampilkan di halaman.
-- (Select sudah jalan di project; aman dijalankan ulang.)
drop policy if exists "anyone can read rsvps" on public.rsvps;
create policy "anyone can read rsvps"
  on public.rsvps for select
  to anon, authenticated
  using (true);

-- Sengaja TIDAK ada policy update/delete: tamu tidak boleh mengubah atau
-- menghapus ucapan orang lain. Kelola lewat dashboard Supabase.

-- ---------------------------------------------------------------------------
-- Batas panjang ucapan — DISARANKAN.
--
-- Kolom `message` bertipe TEXT tanpa batas. Publishable key memang boleh
-- tampil di browser, jadi siapa pun bisa memanggil REST API Supabase langsung
-- tanpa lewat form kita; `maxLength` di textarea hanya berlaku untuk tamu
-- normal. Constraint di bawah ini yang benar-benar menahan kiriman raksasa.
alter table public.rsvps drop constraint if exists rsvps_message_len;
alter table public.rsvps
  add constraint rsvps_message_len check (message is null or length(message) <= 500);
