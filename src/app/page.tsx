"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useOnboardingStore } from "@/store/onboarding";
import { gsap, useGSAP, ensureGsap, ScrollTrigger, EASE } from "@/lib/gsap";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { EnvelopeLoader } from "@/components/EnvelopeLoader";
import { HeroSection } from "@/components/HeroSection";
import { CoupleSection } from "@/components/CoupleSection";
import { EventSection } from "@/components/EventSection";
import { TimelineSection } from "@/components/TimelineSection";
import { RsvpSection } from "@/components/RsvpSection";
import { OutroSection } from "@/components/OutroSection";
import { wedding } from "@/config/wedding";

/*
  Ukuran font onboarding (diperhalus agar lebih aesthetic):
  - "THE WEDDING OF" : Montserrat Subrayada  12px
  - Nama pasangan    : Alice                 46px
  - "Kepada Yth."    : Montserrat            11px
  - Nama tamu        : Montserrat            18px
*/

/* Jeda masuk tiap elemen onboarding, dipertahankan persis dari versi CSS-nya. */
const ONBOARD_DELAYS = [0.5, 0.75, 1.15, 1.4, 1.6];

export default function Home() {
  const opened = useOnboardingStore((s) => s.opened);
  const loaderDone = useOnboardingStore((s) => s.loaderDone);
  const open = useOnboardingStore((s) => s.open);
  const guestName = useOnboardingStore((s) => s.guestName);
  const setGuestName = useOnboardingStore((s) => s.setGuestName);

  // Ambil nama tamu dari query param ?to=Nama
  useEffect(() => {
    const to = new URLSearchParams(window.location.search).get("to");
    if (to) setGuestName(to);
  }, [setGuestName]);

  // Backsound: baru dimuat & diputar saat tamu menekan "Buka Undangan".
  // `play()` WAJIB dipanggil sinkron di dalam handler klik — itu satu-satunya
  // saat browser (terutama iOS Safari) mengizinkan audio berbunyi.
  const audioRef = useRef<HTMLAudioElement>(null);

  // JANGAN ubah jadi handler Motion/GSAP, jangan bungkus dalam callback
  // animasi, jangan sisipkan await sebelum play(): satu-satunya saat browser
  // (terutama iOS Safari) mengizinkan audio berbunyi adalah di dalam tugas
  // gestur pengguna itu sendiri.
  function handleOpen() {
    open();
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = 0.6;
    // Kalau tetap ditolak browser, undangan harus tetap terbuka normal.
    audio.play().catch(() => {});
  }

  // Section undangan berat (banyak gambar besar) baru di-mount SETELAH loader
  // amplop selesai — supaya hydration + decode gambarnya tidak berebut main
  // thread dengan animasi amplop. Dipasang saat browser senggang agar tidak
  // menghantam frame animasi dissolve.
  const [sectionsReady, setSectionsReady] = useState(false);
  useEffect(() => {
    if (!loaderDone || sectionsReady) return;
    const mount = () => setSectionsReady(true);
    if ("requestIdleCallback" in window) {
      const id = requestIdleCallback(mount, { timeout: 2000 });
      return () => cancelIdleCallback(id);
    }
    const t = setTimeout(mount, 1200); // fallback Safari lama
    return () => clearTimeout(t);
  }, [loaderDone, sectionsReady]);

  // Entrance onboarding — dulu animasi CSS yang dijeda paksa lewat
  // `.anims-paused` selama loader tampil. Hack itu tidak pernah bisa menahan
  // GSAP (dia menyetel animation-play-state, yang hanya berlaku untuk
  // @keyframes), jadi sekarang digantikan gating eksplisit pada `loaderDone`.
  //
  // Sebelum loaderDone, elemen sengaja dibiarkan apa adanya: loader amplop
  // menutupi seluruh layar (z-60, gradien pekat), dan useGSAP jalan di layout
  // effect sehingga gsap.set mendarat sebelum paint — tidak pernah ada frame
  // di mana elemen terlihat sementara amplopnya sudah lenyap.
  const overlayRef = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const root = overlayRef.current;
      if (!root || !loaderDone) return;
      ensureGsap();
      const items = Array.from(
        root.querySelectorAll<HTMLElement>(".js-onboard")
      );
      if (!items.length) return;

      const mm = gsap.matchMedia();
      // Kalau tamu memilih "kurangi gerak", blok ini tidak pernah jalan dan
      // elemen langsung tampil di posisi normalnya.
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.set(items, { opacity: 0, y: 24 });
        items.forEach((el, i) => {
          gsap.to(el, {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: EASE,
            delay: ONBOARD_DELAYS[i] ?? 1.6,
          });
        });
      });
      return () => mm.revert();
    },
    { dependencies: [loaderDone] }
  );

  // ScrollTrigger mengukur posisi saat dibuat. Dua hal membuat ukuran itu basi:
  // section baru di-mount belakangan (tinggi container melonjak), dan
  // EventSection tidak dikunci aspect-ratio sehingga tingginya bergeser saat
  // font selesai swap. Ukur ulang setelah keduanya beres.
  useEffect(() => {
    if (!sectionsReady) return;
    let done = false;
    const refresh = () => {
      if (!done) ScrollTrigger.refresh();
    };
    document.fonts?.ready.then(refresh);
    const t = setTimeout(refresh, 1500); // jaga-jaga kalau fonts.ready tak pernah selesai
    return () => {
      done = true;
      clearTimeout(t);
    };
  }, [sectionsReady]);

  return (
    <main className="relative h-full">
      {/* Amplop loading — terbuka lalu menghilang, mengungkap onboarding di baliknya */}
      <EnvelopeLoader />

      {/* Backsound — preload="none" karena file-nya sudah dihangatkan ke cache
          di layar loader; elemen ini cukup ambil dari sana saat diputar. */}
      <audio ref={audioRef} src={wedding.backsound} loop preload="none" />

      {/* Halaman undangan — scrollable, terkunci sampai onboarding dibuka.
          `id` dipakai ScrollTrigger sebagai `scroller`: yang bergerak di sini
          div ini, bukan window (shell-nya h-dvh overflow-hidden). */}
      <div
        id="invite-scroll"
        className={`no-scrollbar h-full ${opened ? "overflow-y-auto" : "overflow-hidden"}`}
      >
        {/* MotionProvider hanya membungkus section, bukan seluruh halaman:
            chunk fitur Motion baru mulai diunduh saat blok ini mount — yaitu
            setelah loader amplop selesai — jadi nol beban di jalur kritis.
            Loader & onboarding murni GSAP/CSS, tidak butuh Motion. */}
        {sectionsReady && (
          <MotionProvider>
            <HeroSection />
            <CoupleSection />
            <EventSection />
            <TimelineSection />
            <RsvpSection />
            <OutroSection />
          </MotionProvider>
        )}
      </div>

      {/* Layar onboarding — terangkat ke atas saat dibuka (bukan fade), seperti membuka amplop.
          Animasi CSS-nya dijeda selama loader amplop tampil (hemat main thread,
          dan entrance-nya jadi terlihat saat reveal). */}
      <div
        ref={overlayRef}
        className={`absolute inset-0 z-50 transition-transform duration-[850ms] ease-[cubic-bezier(0.65,0,0.35,1)] ${
          opened ? "pointer-events-none -translate-y-full" : "translate-y-0"
        }`}
      >
        {/* Background foto — zoom perlahan (Ken Burns). Class-nya baru dipasang
            setelah loader selesai supaya animasinya mulai dari nol saat
            terlihat, bukan sudah separuh jalan di balik amplop. */}
        <div
          className={`absolute inset-0 ${loaderDone ? "anim-ken-burns" : ""}`}
        >
          <Image
            src="/images/bg-onboard.webp"
            alt="Foto pasangan"
            fill
            priority
            unoptimized
            sizes="(max-width: 480px) 100vw, 480px"
            className="object-cover"
          />
        </div>

        {/* Konten onboarding */}
        <div className="relative flex h-full flex-col items-center justify-end px-8 pb-10 text-center text-white">
          <p className="js-onboard font-[family-name:var(--font-subrayada)] text-[12px] uppercase tracking-[0.18em] text-primary">
            The Wedding Of
          </p>

          <h1 className="js-onboard mt-7 font-serif text-[30px] font-normal leading-[1.1] text-primary drop-shadow-sm">
            {wedding.coupleShort}
          </h1>

          {/* Blok tamu — lebar divider mengikuti teks "Kepada Yth." */}
          <div className="js-onboard flex w-fit flex-col items-center">
            <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-primary mt-10">
              Kepada Yth. Bapak/Ibu/Saudara/i
            </p>

            <span className="mb-8 h-px self-stretch bg-white" />

            <p className="font-sans text-[14px] font-bold tracking-wide text-primary">
              {guestName ?? "Bp. Abc Def"}
            </p>

            <span className="mt-8 h-px self-stretch bg-white" />
          </div>

          <p className="js-onboard font-sans text-[9px] italic text-primary/80">
            &bull; Mohon maaf bila ada kesalahan penulisan nama/gelar
          </p>

          <div className="js-onboard mt-6">
            <button
              onClick={handleOpen}
              className={`cursor-pointer rounded-lg border border-primary-dark/40 bg-primary px-10 py-2 font-sans text-[10px] font-medium uppercase tracking-[0.15em] text-secondary shadow-lg transition-transform duration-200 ease-out hover:scale-[1.03] active:scale-[0.97] ${
                loaderDone ? "anim-glow anim-shine" : ""
              }`}
            >
              Buka Undangan
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
