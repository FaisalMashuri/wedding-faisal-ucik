import Image from "next/image";
import { wedding } from "@/config/wedding";
import { Countdown } from "./Countdown";

type Schedule = { title: string; time: string; location: string };

/** Jarak antar elemen kartu (px CSS, sudah dikonversi dari skala Figma 1080 -> layar 480). */
type CardSpacing = {
  topPad: number; // garis atas kotak -> judul
  titleGap: number; // judul -> jam
  timeToLocationGap?: number; // jam -> label "Location:"
  titleSize: number; // ukuran font judul (px)
};

/** Isi satu kartu acara — kartu putih berdiri sendiri (bukan lagi kotak di background). */
function EventCard({
  e,
  mapUrl,
  spacing,
}: {
  e: Schedule;
  mapUrl?: string;
  spacing: CardSpacing;
}) {
  return (
    <div
      className="mx-auto flex h-[266px] w-[317px] flex-col items-center rounded-[67px] border-4 border-primary bg-white px-8 pb-5 text-secondary"
      style={{ paddingTop: spacing.topPad }}
    >
      <h3
        className="text-center font-script leading-none underline decoration-secondary/50 decoration-1 underline-offset-[6px]"
        style={{ fontSize: spacing.titleSize }}
      >
        {e.title}
      </h3>

      <p
        className="text-center font-sans text-[14px] font-bold"
        style={{ marginTop: spacing.titleGap }}
      >
        At: {e.time}
      </p>

      <p
        className="w-full text-left font-sans text-[14px] font-bold text-primary-dark"
        style={{ marginTop: spacing.timeToLocationGap ?? 12 }}
      >
        Location:
      </p>
      <p className="w-full text-left font-sans text-[14px] leading-relaxed">
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
            className="h-3.5 w-3.5 text-white"
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
          src="/images/bg-save-the-date.webp"
          alt=""
          fill
          unoptimized
          sizes="(max-width: 480px) 100vw, 480px"
          className="object-cover"
        />

        {/* Konten — mengalir di bawah ilustrasi pasangan */}
        <div className="absolute inset-x-0 top-[24%] flex flex-col items-center px-16">
          <Countdown />

          <p className="mt-4 w-full text-center font-sans text-[12px] leading-relaxed text-white/90">
            By the grace of God, we request the honour of your presence at
            the marriage of our children :
          </p>

          <div className="mt-5 w-full">
            <EventCard
              e={akad}
              spacing={{ topPad: 28, titleGap: 29, titleSize: 32 }}
            />
          </div>

          <div className="mt-[43px] w-full">
            <EventCard
              e={reception}
              mapUrl={wedding.mapUrl}
              spacing={{
                topPad: 31,
                titleGap: 8,
                timeToLocationGap: 29,
                titleSize: 28,
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
