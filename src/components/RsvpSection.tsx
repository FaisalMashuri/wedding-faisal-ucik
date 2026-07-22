"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { useOnboardingStore } from "@/store/onboarding";

type Wish = { name: string; message: string };

// Contoh ucapan (tampil sebelum ada data Supabase / sebagai fallback).
const SAMPLE: Wish[] = [
  {
    name: "Budi Santoso",
    message:
      "Selamat menempuh hidup baru! Semoga menjadi keluarga yang sakinah, mawaddah, warahmah. Bahagia selalu ya kalian berdua.",
  },
  {
    name: "Siti Aminah",
    message:
      "Barakallahu lakuma wa baraka alaikuma. Semoga pernikahan kalian penuh berkah dan langgeng sampai kakek nenek.",
  },
  {
    name: "Rizky Pratama",
    message:
      "Turut berbahagia atas pernikahan kalian. Semoga selalu diberi kemudahan dalam membina rumah tangga. Aamiin.",
  },
  {
    name: "Dewi Lestari",
    message:
      "Congratulations! Semoga menjadi pasangan yang saling melengkapi, saling menguatkan, dan selalu dalam lindungan-Nya.",
  },
  {
    name: "Ahmad Fauzi",
    message:
      "Selamat ya Faisal & Ucik! Akhirnya sah juga. Semoga cepat dikaruniai keturunan yang sholeh dan sholehah.",
  },
  {
    name: "Nur Halimah",
    message:
      "Semoga bahtera rumah tangga kalian selalu diliputi cinta dan kesabaran. Selamat berbahagia, teman!",
  },
  {
    name: "Andi Wijaya",
    message:
      "Wishing you a lifetime of love and happiness. Semoga menjadi keluarga yang harmonis dan penuh tawa. Barakallah!",
  },
];

/**
 * RSVP & Wishes — form konfirmasi + daftar ucapan (guestbook).
 * Background: /images/bg-rsvp.webp (kanvas cream, ornamen daun).
 * Submit & baca -> tabel `rsvp` di Supabase (lihat supabase/rsvp.sql).
 */
export function RsvpSection() {
  const guestName = useOnboardingStore((s) => s.guestName);
  const [name, setName] = useState(guestName ?? "");
  const [attendance, setAttendance] = useState<"hadir" | "tidak_hadir">(
    "hadir"
  );
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [wishes, setWishes] = useState<Wish[]>(SAMPLE);

  // Ikuti nama tamu dari onboarding (?to=) begitu tersedia.
  useEffect(() => {
    if (guestName) setName(guestName);
  }, [guestName]);

  // Ambil ucapan yang sudah ada
  useEffect(() => {
    supabase
      .from("rsvp")
      .select("name, message")
      .not("message", "is", null)
      .order("created_at", { ascending: false })
      .limit(30)
      .then(({ data }) => {
        if (data && data.length) setWishes(data as Wish[]);
      });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setSending(true);
    const row = {
      name: name.trim(),
      attendance,
      message: message.trim() || null,
    };
    const { error } = await supabase.from("rsvp").insert(row);
    setSending(false);
    if (!error && row.message) {
      setWishes((w) => [{ name: row.name, message: row.message! }, ...w]);
    }
    setName(guestName ?? "");
    setMessage("");
  }

  const label = "font-sans text-[12px] font-semibold text-secondary";
  const field =
    "w-full rounded-lg bg-white px-3 py-2 font-sans text-[12px] text-secondary placeholder:text-secondary/40 focus:outline-none";

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

          {/* Kartu form (compact) */}
          <form
            onSubmit={handleSubmit}
            className="mt-3 flex shrink-0 flex-col gap-2 rounded-xl bg-primary/85 p-3.5 shadow-sm"
          >
            <div className="flex flex-col gap-1">
              <span className={label}>Name</span>
              <input
                className={`${field} disabled:cursor-not-allowed disabled:opacity-100`}
                placeholder="Nama Undangan"
                value={name}
                disabled
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <span className={label}>Confirmation</span>
              <select
                className={`${field} w-32`}
                value={attendance}
                onChange={(e) =>
                  setAttendance(e.target.value as "hadir" | "tidak_hadir")
                }
              >
                <option value="hadir">Hadir</option>
                <option value="tidak_hadir">Tidak Hadir</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <span className={label}>Wishes</span>
              <textarea
                className={`${field} h-16 resize-none`}
                placeholder="Tulis harapan Anda disini..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={sending}
              className="self-end rounded-lg bg-white px-5 py-1.5 font-sans text-[12px] font-medium text-secondary transition hover:bg-white/80 disabled:opacity-60"
            >
              {sending ? "..." : "Send"}
            </button>
          </form>

          {/* Daftar ucapan — scroll internal, tidak melebihi frame */}
          <div className="no-scrollbar mt-3 flex min-h-0 flex-1 flex-col gap-2.5 overflow-y-auto pr-1">
            {wishes.map((w, i) => (
              <div key={i} className="shrink-0 rounded-xl bg-white p-3 shadow-sm">
                <p className="font-sans text-[13px] font-bold text-secondary">
                  {w.name}
                </p>
                <span className="mt-1 block h-px w-20 bg-primary" />
                <p className="mt-1.5 font-sans text-[10px] leading-relaxed text-secondary/70">
                  {w.message}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
