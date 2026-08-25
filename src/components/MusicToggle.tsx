"use client";

import { useEffect, useState, type RefObject } from "react";
import { fluid } from "@/lib/fluid";

type Props = {
  /** Elemen <audio> backsound yang hidup di halaman undangan. */
  audioRef: RefObject<HTMLAudioElement | null>;
  /** Tombol baru muncul setelah tamu menekan "Buka Undangan". */
  visible: boolean;
};

/**
 * Tombol mengambang untuk membisukan / menghidupkan backsound.
 *
 * Yang di-toggle adalah play/pause, bukan properti `muted`: kalau cuma
 * di-mute, lagunya tetap jalan di latar (boros data & baterai) dan saat
 * dinyalakan lagi tamu masuk di tengah lagu.
 *
 * Statusnya TIDAK disimpan di state sendiri lewat tebakan — dia ikut event
 * `play`/`pause` elemen audio. Itu penting karena play() bisa ditolak browser
 * (autoplay policy) saat undangan dibuka; ikon harus jujur menampilkan bahwa
 * lagunya memang tidak berbunyi, sehingga tombol ini sekaligus jadi jalan
 * keluar untuk menyalakannya secara manual.
 */
export function MusicToggle({ audioRef, visible }: Props) {
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const sync = () => setPlaying(!audio.paused);
    sync(); // audio bisa sudah diputar handler "Buka Undangan" sebelum efek ini jalan
    audio.addEventListener("play", sync);
    audio.addEventListener("pause", sync);
    audio.addEventListener("ended", sync);
    return () => {
      audio.removeEventListener("play", sync);
      audio.removeEventListener("pause", sync);
      audio.removeEventListener("ended", sync);
    };
  }, [audioRef]);

  function toggle() {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio.volume = 0.6;
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  }

  const size = fluid(40);

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={playing ? "Matikan musik" : "Nyalakan musik"}
      aria-pressed={playing}
      // Disembunyikan dari tab order selagi layar onboarding masih menutupi
      // halaman, biar fokus keyboard tidak nyangkut di tombol tak terlihat.
      tabIndex={visible ? 0 : -1}
      className={`absolute z-40 grid cursor-pointer place-items-center rounded-full border border-primary/40 bg-secondary/85 text-primary shadow-lg backdrop-blur-sm transition-[opacity,transform] duration-500 ease-out active:scale-95 ${
        visible
          ? "pointer-events-auto opacity-100"
          : "pointer-events-none translate-y-2 opacity-0"
      }`}
      style={{
        width: size,
        height: size,
        right: fluid(16),
        bottom: `calc(${fluid(16)} + env(safe-area-inset-bottom, 0px))`,
      }}
    >
      {playing ? <SpeakerOnIcon /> : <SpeakerOffIcon />}
    </button>
  );
}

/* Ikon dibuat manual (proyek ini tidak memakai library ikon). viewBox 24
   dengan stroke 1.8 supaya bobot garisnya senada dengan teks di undangan. */

const ICON_PROPS = {
  width: "58%",
  height: "58%",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
} as const;

/** Badan speaker — dipakai bersama oleh kedua varian ikon. */
const SPEAKER_BODY = "M4 9.5h3.2L12 5.5v13L7.2 14.5H4z";

function SpeakerOnIcon() {
  return (
    <svg {...ICON_PROPS}>
      <path d={SPEAKER_BODY} />
      <path d="M15.5 9.2a4 4 0 0 1 0 5.6" />
      <path d="M18.2 6.8a7.5 7.5 0 0 1 0 10.4" />
    </svg>
  );
}

function SpeakerOffIcon() {
  return (
    <svg {...ICON_PROPS}>
      <path d={SPEAKER_BODY} />
      <path d="M16 10l4 4" />
      <path d="M20 10l-4 4" />
    </svg>
  );
}
