"use client";

import { useEffect, useRef, useState } from "react";
import { wedding } from "@/config/wedding";
import { fluid } from "@/lib/fluid";
import { INK, INK_MUTED, INK_RED, PAPER } from "@/lib/envelope-theme";
import type { Track } from "@/lib/tracks";

/*
  Popup pemilihan lagu — tampil di atas layar loader amplop selagi aset
  disiapkan. Gayanya mengikuti surat di dalam amplop (kertas krem, mesin tik,
  garis pos udara) supaya terasa satu kesatuan dengan loader.

  Aturan mainnya:
  - Pilihan ditampilkan sebagai NOMOR saja ("Lagu 1", "Lagu 2", ...), bukan
    judul lagunya. Nomor = urutan entri di `wedding.tracks`, jadi mengubah
    urutan di config otomatis mengubah nomor di sini.
  - SATU ketuk = pilih + tutup. Item menyala sebentar sebagai konfirmasi
    sebelum kartunya larut, jadi tamu tetap melihat pilihannya "diterima".
  - Tidak bisa ditutup tanpa memilih — loader memang menunggu jawaban ini.
  - `onPick` dipanggil SEGERA saat diketuk (bukan setelah animasi tutup)
    supaya unduhan lagunya mulai lebih awal.
*/

const ENTER_MS = 20; // jeda 1 frame-ish sebelum transisi masuk dinyalakan
const CONFIRM_MS = 240; // lama item menyala setelah diketuk
const LEAVE_MS = 320; // lama kartu memudar sebelum dilepas dari DOM

export function SongPicker({ onPick }: { onPick: (track: Track) => void }) {
  const [entered, setEntered] = useState(false);
  const [pickedId, setPickedId] = useState<string | null>(null);
  const [leaving, setLeaving] = useState(false);
  const [unmounted, setUnmounted] = useState(false);
  const firstRef = useRef<HTMLButtonElement>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const t = setTimeout(() => {
      setEntered(true);
      firstRef.current?.focus();
    }, ENTER_MS);
    const list = timers.current;
    list.push(t);
    return () => list.forEach(clearTimeout);
  }, []);

  function handlePick(track: Track) {
    if (pickedId) return; // ketukan kedua diabaikan
    setPickedId(track.id);
    onPick(track);
    timers.current.push(
      setTimeout(() => setLeaving(true), CONFIRM_MS),
      setTimeout(() => setUnmounted(true), CONFIRM_MS + LEAVE_MS)
    );
  }

  if (unmounted) return null;

  const visible = entered && !leaving;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="song-picker-title"
      className="absolute inset-0 z-10 grid place-items-center px-5"
      style={{
        background: "rgba(11, 26, 31, 0.72)",
        backdropFilter: "blur(2px)",
        opacity: visible ? 1 : 0,
        transition: `opacity ${LEAVE_MS}ms ease`,
        pointerEvents: leaving ? "none" : "auto",
      }}
    >
      <div
        className="w-[min(320px,86vw)] overflow-hidden rounded-[6px] shadow-[0_18px_40px_-12px_rgba(0,0,0,0.55)]"
        style={{
          background: PAPER,
          transform: visible ? "translateY(0) scale(1)" : "translateY(14px) scale(0.97)",
          transition: `transform ${LEAVE_MS}ms cubic-bezier(0.22, 1, 0.36, 1), opacity ${LEAVE_MS}ms ease`,
          opacity: visible ? 1 : 0,
        }}
      >
        {/* Garis pos udara — penanda visual yang sama dengan amplopnya */}
        <div className="env-airmail-stripe h-[7px] w-full opacity-90" />

        <div style={{ padding: `${fluid(18)} ${fluid(18)} ${fluid(6)}` }}>
          <p
            id="song-picker-title"
            className="font-[family-name:var(--font-courier)] uppercase"
            style={{
              color: INK_RED,
              fontSize: fluid(10),
              letterSpacing: "0.24em",
            }}
          >
            Lagu Pengiring
          </p>
          <p
            className="font-[family-name:var(--font-courier)]"
            style={{
              color: INK_MUTED,
              fontSize: fluid(10.5),
              marginTop: fluid(7),
              lineHeight: 1.5,
            }}
          >
            Pilih satu untuk mengiringi undangan ini.
          </p>
        </div>

        {/* Pilihan lagu — kisi 2 kolom, cukup nomornya saja. Delapan lagu muat
            dalam satu layar tanpa perlu di-scroll. */}
        <div
          className="grid grid-cols-2"
          style={{
            gap: fluid(8),
            padding: `${fluid(12)} ${fluid(18)} ${fluid(18)}`,
          }}
        >
          {wedding.tracks.map((track, i) => {
            const isPicked = pickedId === track.id;
            return (
              <button
                key={track.id}
                ref={i === 0 ? firstRef : undefined}
                type="button"
                onClick={() => handlePick(track)}
                aria-label={`Lagu ${i + 1}`}
                className="song-option flex cursor-pointer items-center justify-center rounded-[4px] outline-none transition-colors duration-150"
                style={{
                  gap: fluid(6),
                  // 13 -> tinggi tombol ~46px di 480 dan masih ~38px di layar
                  // 390; cukup nyaman untuk jempol tanpa membuat kartu tinggi.
                  paddingTop: fluid(13),
                  paddingBottom: fluid(13),
                  border: `1px ${isPicked ? "solid" : "dashed"} ${
                    isPicked ? INK_RED : "rgba(107,100,85,0.42)"
                  }`,
                  background: isPicked ? "rgba(178,58,46,0.12)" : "transparent",
                }}
              >
                <span
                  className="font-[family-name:var(--font-courier)] uppercase"
                  style={{
                    color: INK_MUTED,
                    fontSize: fluid(9),
                    letterSpacing: "0.18em",
                  }}
                >
                  Lagu
                </span>
                <span
                  className="font-[family-name:var(--font-cormorant)] leading-none"
                  style={{
                    color: isPicked ? INK_RED : INK,
                    fontSize: fluid(21),
                    // Cormorant default-nya angka old-style (tingginya
                    // naik-turun) — pakai lining supaya 1..8 rata.
                    fontVariantNumeric: "lining-nums",
                  }}
                >
                  {i + 1}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
