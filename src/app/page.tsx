"use client";

import { useEffect } from "react";
import Image from "next/image";
import { useOnboardingStore } from "@/store/onboarding";
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
      {/* Halaman undangan — scrollable, terkunci sampai onboarding dibuka */}
      <div
        className={`h-full ${opened ? "overflow-y-auto" : "overflow-hidden"}`}
      >
        <HeroSection />
        <CoupleSection />
        <EventSection />
        <TimelineSection />
        <RsvpSection />
        <OutroSection />
      </div>

      {/* Layar onboarding */}
      <div
        className={`absolute inset-0 z-50 transition-opacity duration-700 ${
          opened ? "pointer-events-none opacity-0" : "opacity-100"
        }`}
      >
        {/* Background foto — zoom perlahan (Ken Burns) */}
        <div className="anim-ken-burns absolute inset-0">
          <Image
            src="/images/bg-onboard.png"
            alt="Foto pasangan"
            fill
            priority
            unoptimized
            sizes="(max-width: 480px) 100vw, 480px"
            className="object-cover"
          />
        </div>

        {/* Overlay gradient: foto di atas, membaur ke teal di bawah */}
        <div className="anim-overlay absolute inset-0 bg-gradient-to-b from-black/25 via-secondary/40 to-secondary" />

        {/* Konten onboarding */}
        <div className="relative flex h-full flex-col items-center justify-end px-8 pb-10 text-center text-white">
          <p
            className="anim-fade-up font-[family-name:var(--font-subrayada)] text-[12px] uppercase tracking-[0.18em] text-primary"
            style={{ animationDelay: "0.5s" }}
          >
            The Wedding Of
          </p>

          <h1
            className="anim-fade-up mt-2 font-serif text-[46px] font-normal leading-[1.1] text-white drop-shadow-sm"
            style={{ animationDelay: "0.75s" }}
          >
            {wedding.coupleShort}
          </h1>

          {/* Blok tamu — lebar divider mengikuti teks "Kepada Yth." */}
          <div
            className="anim-fade-up mt-7 flex w-fit flex-col items-center"
            style={{ animationDelay: "1.15s" }}
          >
            <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
              Kepada Yth. Bapak/Ibu/Saudara/i
            </p>

            <span className="my-3.5 h-px self-stretch bg-white" />

            <p className="font-sans text-[18px] font-bold tracking-wide text-primary">
              {guestName ?? "Bp. Abc Def"}
            </p>

            <span className="my-3.5 h-px self-stretch bg-white" />
          </div>

          <p
            className="anim-fade-up mt-1.5 font-sans text-[10px] italic text-primary/80"
            style={{ animationDelay: "1.4s" }}
          >
            &bull; Mohon maaf bila ada kesalahan penulisan nama/gelar
          </p>

          <div
            className="anim-fade-up mt-6 w-full"
            style={{ animationDelay: "1.6s" }}
          >
            <button
              onClick={open}
              className="anim-glow w-full rounded-md bg-primary py-3 font-sans text-[13px] font-medium uppercase tracking-[0.15em] text-secondary-dark shadow-lg transition hover:bg-primary-dark"
            >
              Buka Undangan
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
