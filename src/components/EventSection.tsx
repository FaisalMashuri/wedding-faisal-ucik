import Image from "next/image";
import { wedding } from "@/config/wedding";
import { Countdown } from "./Countdown";

type Schedule = { title: string; time: string; location: string };

/** Isi satu kartu acara. */
function EventCard({ e, mapUrl }: { e: Schedule; mapUrl?: string }) {
  return (
    <div className="flex flex-col px-[19%] text-secondary">
      <h3 className="text-center font-script text-[26px] leading-none underline decoration-secondary/50 decoration-1 underline-offset-[6px]">
        {e.title}
      </h3>

      <p className="mt-4 text-center font-sans text-[12px] font-bold">
        At: {e.time}
      </p>

      <p className="mt-4 font-sans text-[12px] font-bold text-primary-dark">
        Location:
      </p>
      <p className="font-sans text-[12px] leading-relaxed">{e.location}</p>

      {mapUrl && (
        <a
          href={mapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-1.5 self-center rounded-full bg-primary px-4 py-1.5 text-[12px] font-medium text-secondary-dark"
        >
          <svg
            className="h-3.5 w-3.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <path d="M21 10c0 7-9 12-9 12s-9-5-9-12a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          Google Map
        </a>
      )}
    </div>
  );
}

/**
 * Event section — detail acara (2 kartu) + countdown, full satu layar.
 * Background: /images/bg-event2.png (frame 9:16, 2 kotak putih).
 * Kotak atas  : 4%–34%    -> Akad
 * Kotak bawah : 38.5%–72% -> Reception (+ tombol Google Map)
 * Countdown   : area teal ~73%
 *
 * KNOB edit sendiri: isi acara & link map -> src/config/wedding.ts (`schedule`, `mapUrl`)
 */
export function EventSection() {
  const [akad, reception] = wedding.schedule;

  return (
    <section className="relative flex min-h-dvh w-full items-center justify-center overflow-hidden bg-[#30535d]">
      <div className="relative w-full aspect-[9/16]">
        <Image
          src="/images/bg-event2.png"
          alt=""
          fill
          unoptimized
          sizes="(max-width: 480px) 100vw, 480px"
          className="object-cover"
        />

        {/* Kartu atas — Akad (kotak 4%–34%) */}
        <div className="absolute inset-x-0 top-[4%] flex h-[30%] items-center justify-center">
          <EventCard e={akad} />
        </div>

        {/* Kartu bawah — Reception (kotak 38.5%–72%) */}
        <div className="absolute inset-x-0 top-[38.5%] flex h-[33.5%] items-center justify-center">
          <EventCard e={reception} mapUrl={wedding.mapUrl} />
        </div>

        {/* Countdown (area teal bawah) */}
        <div className="absolute inset-x-0 top-[74%] flex justify-center">
          <Countdown />
        </div>
      </div>
    </section>
  );
}
