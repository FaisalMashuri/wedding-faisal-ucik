"use client";

import { useEffect } from "react";
import Image from "next/image";
import { useOnboardingStore } from "@/store/onboarding";
import { SplashScreen } from "@/components/SplashScreen";
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

export default function Home() {
  const opened = useOnboardingStore((s) => s.opened);
  const open = useOnboardingStore((s) => s.open);
  const guestName = useOnboardingStore((s) => s.guestName);
  const setGuestName = useOnboardingStore((s) => s.setGuestName);

  // Ambil nama tamu dari query param ?to=Nama
  useEffect(() => {
    const to = new URLSearchParams(window.location.search).get("to");
    if (to) setGuestName(to);
  }, [setGuestName]);

  return (
    <main className="relative h-full">
      {/* Loading screen — tampil dulu, lalu fade-out ke onboarding */}
      <SplashScreen />

      {/* Halaman undangan — scrollable, terkunci sampai onboarding dibuka */}
      <div
        className={`no-scrollbar h-full ${opened ? "overflow-y-auto" : "overflow-hidden"}`}
      >
        <HeroSection />
        <CoupleSection />
        <EventSection />
        <TimelineSection />
        <RsvpSection />
        <OutroSection />
      </div>

      {/* Layar onboarding — terangkat ke atas saat dibuka (bukan fade), seperti membuka amplop */}
      <div
        className={`absolute inset-0 z-50 transition-transform duration-[850ms] ease-[cubic-bezier(0.65,0,0.35,1)] ${
          opened ? "pointer-events-none -translate-y-full" : "translate-y-0"
        }`}
      >
        {/* Background foto — zoom perlahan (Ken Burns) */}
        <div className="anim-ken-burns absolute inset-0">
          <Image
            src="/images/Opening_2.webp"
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
          <p
            className="anim-fade-up font-[family-name:var(--font-subrayada)] text-[12px] uppercase tracking-[0.18em] text-primary"
            style={{ animationDelay: "0.5s" }}
          >
            The Wedding Of
          </p>

          <h1
            className="anim-fade-up mt-7 font-serif text-[30px] font-normal leading-[1.1] text-primary drop-shadow-sm"
            style={{ animationDelay: "0.75s" }}
          >
            {wedding.coupleShort}
          </h1>

          {/* Blok tamu — lebar divider mengikuti teks "Kepada Yth." */}
          <div
            className="anim-fade-up flex w-fit flex-col items-center"
            style={{ animationDelay: "1.15s" }}
          >
            <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-primary mt-10">
              Kepada Yth. Bapak/Ibu/Saudara/i
            </p>

            <span className="mb-8 h-px self-stretch bg-white" />

            <p className="font-sans text-[14px] font-bold tracking-wide text-primary">
              {guestName ?? "Bp. Abc Def"}
            </p>

            <span className="mt-8 h-px self-stretch bg-white" />
          </div>

          <p
            className="anim-fade-up font-sans text-[9px] italic text-primary/80"
            style={{ animationDelay: "1.4s" }}
          >
            &bull; Mohon maaf bila ada kesalahan penulisan nama/gelar
          </p>

          <div
            className="anim-fade-up mt-6"
            style={{ animationDelay: "1.6s" }}
          >
            <button
              onClick={open}
              className="anim-glow anim-shine cursor-pointer rounded-lg border border-primary-dark/40 bg-primary px-10 py-2 font-sans text-[10px] font-medium uppercase tracking-[0.15em] text-secondary shadow-lg transition-transform duration-200 ease-out hover:scale-[1.03] active:scale-[0.97]"
            >
              Buka Undangan
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
