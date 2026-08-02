"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { fluid } from "@/lib/fluid";
import { useOnboardingStore } from "@/store/onboarding";

type Wish = { id: number; name: string; message: string };

/** Batas panjang ucapan — dipakai di textarea maxLength dan saat submit. */
const MESSAGE_MAX = 500;

/**
 * Bersihkan teks dari tamu sebelum dikirim/ditampilkan.
 *
 * Ini BUKAN pertahanan terhadap XSS — React sudah meng-escape semua teks yang
 * dirender sebagai child (tidak ada `dangerouslySetInnerHTML` di proyek ini),
 * jadi `<script>` sekalipun hanya tampil sebagai tulisan biasa. Fungsi ini
 * hanya merapikan: buang karakter kontrol & zero-width (trik penyamaran teks),
 * rapatkan baris kosong beruntun, lalu potong sesuai batas kolom.
 */
function cleanText(input: string, max: number) {
  return (
    input
      // karakter kontrol (kecuali newline & tab) + DEL
      .replace(/[\u0000-\u0008\u000B-\u001F\u007F]/g, "")
      // zero-width & pengatur arah teks (bidi override)
      .replace(/[\u200B-\u200F\u202A-\u202E\u2060\uFEFF]/g, "")
      .replace(/\n{3,}/g, "\n\n")
      .trim()
      .slice(0, max)
  );
}

/** Jumlah ucapan yang diambil per putaran infinite scroll. */
const PAGE_SIZE = 8;

/**
 * RSVP & Wishes — form konfirmasi + daftar ucapan (guestbook).
 * Background: /images/bg-rsvp.webp (kanvas cream, ornamen daun).
 * Submit & baca -> tabel `rsvps` di Supabase (lihat supabase/rsvps.sql).
 */
export function RsvpSection() {
  const guestName = useOnboardingStore((s) => s.guestName);
  // Input nama disabled dan selalu mengikuti nama tamu (?to=) — cukup
  // diturunkan langsung dari store, tidak perlu state + effect sinkronisasi.
  const name = guestName ?? "";
  const [attendance, setAttendance] = useState<"Hadir" | "Tidak Hadir">(
    "Hadir"
  );
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  // Hasil submit terakhir — tamu harus tahu ucapannya benar-benar terkirim
  // atau gagal, jangan diam-diam saja.
  const [status, setStatus] = useState<
    { kind: "ok" | "error"; text: string } | null
  >(null);

  // ---- Daftar ucapan: murni dari tabel `rsvps`, dimuat bertahap ----
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [listState, setListState] = useState<"loading" | "ready" | "error">(
    "loading"
  );
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  // Ref (bukan state) supaya loadPage tidak perlu dibuat ulang tiap render —
  // observer di bawah cukup dipasang sekali.
  const busyRef = useRef(false);
  const offsetRef = useRef(0);
  const listRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  /**
   * Ambil satu halaman ucapan lalu tulis ke state.
   * Sengaja TIDAK memanggil setState sebelum `await` pertama supaya aman
   * dipanggil langsung dari dalam useEffect (tidak memicu cascading render).
   */
  const loadPage = useCallback(async (reset = false) => {
    if (busyRef.current) return;
    busyRef.current = true;
    const from = reset ? 0 : offsetRef.current;

    const { data, error } = await supabase
      .from("rsvps")
      .select("id, name, message")
      .not("message", "is", null)
      .order("created_at", { ascending: false })
      .range(from, from + PAGE_SIZE - 1);

    busyRef.current = false;
    setLoadingMore(false);

    if (error) {
      console.error("Gagal memuat ucapan:", error.message);
      setListState("error");
      return;
    }

    const rows = (data ?? []) as Wish[];
    offsetRef.current = from + rows.length;
    setHasMore(rows.length === PAGE_SIZE);
    setListState("ready");
    setWishes((prev) => {
      const base = reset ? [] : prev;
      // Saring id yang sudah ada: kalau ada ucapan baru masuk di antara dua
      // permintaan, offset bergeser dan baris bisa terambil dua kali.
      const seen = new Set(base.map((w) => w.id));
      return [...base, ...rows.filter((r) => !seen.has(r.id))];
    });
  }, []);

  /** Pemicu halaman berikutnya — dipakai observer & event scroll. */
  const loadMore = useCallback(() => {
    if (busyRef.current) return;
    setLoadingMore(true);
    loadPage();
  }, [loadPage]);

  useEffect(() => {
    loadPage(true);
  }, [loadPage]);

  // Infinite scroll: sentinel di ujung daftar; root-nya kotak daftar itu
  // sendiri karena yang discroll bukan window, tapi div ber-overflow.
  useEffect(() => {
    const target = sentinelRef.current;
    const root = listRef.current;
    if (!target || !root || !hasMore) return;

    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore();
      },
      { root, rootMargin: "120px" }
    );
    io.observe(target);
    return () => io.disconnect();
  }, [loadMore, hasMore, wishes.length]);

  // Cadangan: sebagian WebView lama (dan konteks otomasi) tidak menjalankan
  // IntersectionObserver dengan andal. `busyRef` di loadPage menjaga agar
  // dua pemicu ini tidak pernah mengambil halaman yang sama dua kali.
  function handleListScroll(e: React.UIEvent<HTMLDivElement>) {
    if (!hasMore) return;
    const el = e.currentTarget;
    if (el.scrollHeight - el.scrollTop - el.clientHeight < 120) loadMore();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (sending) return;
    if (!name.trim()) {
      setStatus({
        kind: "error",
        text: "Nama tamu belum terisi. Buka undangan lewat tautan pribadimu.",
      });
      return;
    }
    setSending(true);
    setStatus(null);
    const row = {
      // Panjang dipotong mengikuti kolomnya (name VARCHAR(100)) supaya insert
      // tidak gagal total gara-gara ?to= yang kepanjangan.
      name: cleanText(name, 100),
      attendance,
      message: cleanText(message, MESSAGE_MAX) || null,
    };
    const { error } = await supabase.from("rsvps").insert(row);
    setSending(false);

    if (error) {
      console.error("Gagal mengirim RSVP:", error.message);
      setStatus({ kind: "error", text: "Gagal mengirim. Coba lagi ya." });
      return;
    }

    setMessage("");
    setStatus({ kind: "ok", text: "Terima kasih, konfirmasimu sudah masuk." });
    // Muat ulang dari halaman pertama, jangan menyisipkan baris buatan sendiri:
    // dengan begitu yang tampil benar-benar isi tabel (termasuk id aslinya).
    if (row.message) loadPage(true);
  }

  // Ukuran form dibuat fluid: section ini dikunci rasio 9:16, jadi isinya
  // harus menyusut bersama lebar layar (kalau px tetap, di layar sempit form
  // jadi terlalu besar dan daftar ucapan tergencet).
  const label = "font-sans font-medium text-secondary";
  // Warna placeholder TIDAK ditaruh di sini: kalau dua util `placeholder:*`
  // bertemu di satu elemen, yang menang ditentukan urutan CSS-nya, bukan
  // urutan class. Jadi tiap field menyetel warnanya sendiri.
  const field =
    "w-full bg-white font-sans text-secondary focus:outline-none";
  const fieldBox = {
    height: fluid(36),
    borderRadius: "9999px",
    paddingLeft: fluid(18),
    paddingRight: fluid(18),
    fontSize: fluid(13),
  } as const;

  return (
    <section className="relative flex w-full items-center justify-center overflow-hidden bg-[#e8e8e0]">
      <div className="relative w-full aspect-[9/16]">
        <Image
          src="/images/bg-rsvp.webp"
          alt=""
          fill
          unoptimized
          sizes="(max-width: 480px) 100vw, 480px"
          className="object-cover"
        />

        {/* Konten memenuhi frame; daftar ucapan scroll internal */}
        <div className="absolute inset-0 flex flex-col px-5 py-6">
          <h2 className="text-center font-serif text-[26px] text-secondary">
            RSVP &amp; Wishes
          </h2>

          {/* Kartu form — kotak olive bergaris tepi emas, field putih pill */}
          <form
            onSubmit={handleSubmit}
            className="mt-3 flex shrink-0 flex-col border border-primary-dark/70 bg-primary/85 shadow-sm"
            style={{
              borderRadius: fluid(18),
              padding: fluid(24),
              gap: fluid(25),
            }}
          >
            <div className="flex flex-col" style={{ gap: fluid(2) }}>
              <span className={label} style={{ fontSize: fluid(14) }}>
                Name
              </span>
              <input
                className={`${field} placeholder:text-primary-dark disabled:cursor-not-allowed disabled:opacity-100`}
                style={fieldBox}
                placeholder="Nama Undangan"
                value={name}
                disabled
                required
              />
            </div>

            <div className="flex flex-col" style={{ gap: fluid(2) }}>
              <span className={label} style={{ fontSize: fluid(14) }}>
                Confirmation
              </span>
              {/* Panah bawaan browser disembunyikan, diganti segitiga teal */}
              <div className="relative" style={{ width: fluid(158) }}>
                <select
                  className={`${field} appearance-none`}
                  style={{ ...fieldBox, paddingRight: fluid(38) }}
                  value={attendance}
                  onChange={(e) =>
                    setAttendance(e.target.value as "Hadir" | "Tidak Hadir")
                  }
                >
                  {/* value HARUS sama persis dengan CHECK constraint di
                      tabel rsvps: 'Hadir' / 'Tidak Hadir'. */}
                  <option value="Hadir">Hadir</option>
                  <option value="Tidak Hadir">Tidak Hadir</option>
                </select>
                <svg
                  aria-hidden
                  viewBox="0 0 12 8"
                  className="pointer-events-none absolute top-1/2 -translate-y-1/2 text-secondary"
                  style={{ right: fluid(15), width: fluid(13) }}
                  fill="currentColor"
                >
                  <path d="M0 0h12L6 8z" />
                </svg>
              </div>
            </div>

            <div className="flex flex-col mt-5" style={{ gap: fluid(2) }}>
              <span className={label} style={{ fontSize: fluid(14) }}>
                Wishes
              </span>
              <textarea
                className={`${field} resize-none placeholder:text-secondary/40`}
                style={{
                  height: fluid(100),
                  borderRadius: fluid(22),
                  paddingLeft: fluid(18),
                  paddingRight: fluid(18),
                  paddingTop: fluid(12),
                  paddingBottom: fluid(12),
                  fontSize: fluid(13),
                }}
                placeholder="Tulis harapan Anda disini..."
                maxLength={MESSAGE_MAX}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>

            {/* Baris tombol: pesan hasil kirim di kiri, tombol tetap di kanan
                supaya tinggi kartu tidak berubah saat pesan muncul. */}
            <div
              className="flex items-center justify-end"
              style={{
                // margin negatif: jarak tombol ke textarea lebih rapat
                // daripada jarak antar grup field.
                marginTop: fluid(-14),
                gap: fluid(10),
              }}
            >
              {status && (
                <p
                  role="status"
                  aria-live="polite"
                  className={`flex-1 text-left font-sans leading-snug ${
                    status.kind === "ok" ? "text-secondary" : "text-[#8e2318]"
                  }`}
                  style={{ fontSize: fluid(11) }}
                >
                  {status.text}
                </p>
              )}
              <button
                type="submit"
                disabled={sending}
                className="shrink-0 bg-white font-sans text-secondary transition hover:bg-white/80 disabled:opacity-60"
                style={{
                  width: fluid(112),
                  height: fluid(34),
                  borderRadius: fluid(10),
                  fontSize: fluid(14),
                }}
              >
                {sending ? "..." : "Send"}
              </button>
            </div>
          </form>

          {/* Daftar ucapan — isi tabel `rsvps`, scroll internal + infinite */}
          <div
            ref={listRef}
            onScroll={handleListScroll}
            className="no-scrollbar mt-3 flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto pr-1 pt-8"
          >
            {wishes.map((w) => (
              <div key={w.id} className="shrink-0 rounded-xl bg-white p-3 shadow-sm">
                <p className="font-sans text-[13px] font-bold text-secondary">
                  {w.name}
                </p>
                <span className="mt-1 block h-px w-20 bg-primary" />
                <p className="mt-1.5 whitespace-pre-line font-sans text-[10px] leading-relaxed text-secondary/70">
                  {w.message}
                </p>
              </div>
            ))}

            {/* Sentinel infinite scroll — memicu muat halaman berikutnya.
                Tiga titik memantul bergantian; motion-safe agar mati sendiri
                kalau tamu menyalakan "kurangi gerak" di perangkatnya. */}
            {hasMore && wishes.length > 0 && (
              <div
                ref={sentinelRef}
                className="flex shrink-0 items-center justify-center gap-1.5 py-3"
                aria-live="polite"
                aria-busy={loadingMore}
              >
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className={`block h-1.5 w-1.5 rounded-full bg-secondary/60 transition-opacity duration-300 motion-safe:animate-bounce ${
                      loadingMore ? "opacity-100" : "opacity-30"
                    }`}
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
                <span className="sr-only">
                  {loadingMore ? "Memuat ucapan lainnya" : "Gulir untuk memuat lagi"}
                </span>
              </div>
            )}

            {listState !== "loading" && wishes.length === 0 && (
              <p className="px-2 text-center font-sans text-[11px] leading-relaxed text-secondary/60">
                {listState === "error"
                  ? "Ucapan gagal dimuat. Coba muat ulang halaman."
                  : "Belum ada ucapan. Jadilah yang pertama menuliskannya."}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
