import Image from "next/image";
import { wedding } from "@/config/wedding";
import { Countdown } from "./Countdown";

type Schedule = { title: string; time: string; location: string };

/** Isi satu kartu acara — kartu putih berdiri sendiri (bukan lagi kotak di background). */
function EventCard({ e, mapUrl }: { e: Schedule; mapUrl?: string }) {
  return (
    <div className="flex w-full flex-col items-center rounded-[28px] border-2 border-primary bg-white px-6 py-7 text-secondary">
      <h3 className="text-center font-script text-[26px] leading-none underline decoration-secondary/50 decoration-1 underline-offset-[6px]">
        {e.title}
      </h3>

      <p className="mt-4 text-center font-sans text-[12px] font-bold">
        At: {e.time}
      </p>

      <p className="mt-4 font-sans text-[12px] font-bold text-primary-dark">
        Location:
      </p>
      <p className="text-center font-sans text-[12px] leading-relaxed">
        {e.location}
      </p>

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
 * Event section — countdown + detail acara (2 kartu), lebih panjang dari section lain.
 * Background: /images/bg-save-the-date.png (frame ~1080x2510, ilustrasi pasangan di atas,
 * area teal polos di tengah-bawah untuk konten).
 *
 * KNOB edit sendiri: isi acara & link map -> src/config/wedding.ts (`schedule`, `mapUrl`)
 */
export function EventSection() {
  const [akad, reception] = wedding.schedule;

  return (
    <section className="relative flex w-full items-center justify-center overflow-hidden bg-[#30535d]">
      <div className="relative w-full aspect-[1080/2515]">
        <Image
          src="/images/bg-save-the-date.png"
          alt=""
          fill
          unoptimized
          sizes="(max-width: 480px) 100vw, 480px"
          className="object-cover"
        />

        {/* Konten — mengalir di bawah ilustrasi pasangan */}
        <div className="absolute inset-x-0 top-[24%] flex flex-col items-center px-8">
          <Countdown />

          <p className="mt-6 w-full text-center font-sans text-[14px] leading-relaxed text-white/90 font-bold">
            By the grace of God, we request the honour of your presence at
            the marriage of our children :
          </p>

          <div className="mt-7 w-full">
            <EventCard e={akad} />
          </div>

          <div className="mt-6 w-full">
            <EventCard e={reception} mapUrl={wedding.mapUrl} />
          </div>
        </div>
      </div>
    </section>
  );
}
