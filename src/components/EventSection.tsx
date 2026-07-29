import Image from "next/image";
import { wedding } from "@/config/wedding";
import { Countdown } from "./Countdown";
import { fluid } from "@/lib/fluid";

type Schedule = { title: string; time: string; location: string };

/** Jarak antar elemen kartu (nilai di skala 480px, dijadikan fluid lewat `fluid()`). */
type CardSpacing = {
  topPad: number; // garis atas kotak -> judul
  titleGap: number; // judul -> jam
  timeToLocationGap?: number; // jam -> label "Location:"
  titleSize: number; // ukuran font judul
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
      className="mx-auto flex w-full max-w-[300px] flex-col items-center border-primary bg-white text-secondary"
      style={{
        minHeight: fluid(284),
        borderRadius: fluid(67),
        borderWidth: 4,
        borderStyle: "solid",
        paddingLeft: fluid(32),
        paddingRight: fluid(32),
        paddingBottom: fluid(20),
        paddingTop: fluid(spacing.topPad),
      }}
    >
      <h3
        className="text-center font-script leading-none underline decoration-secondary/50 decoration-1 underline-offset-[6px]"
        style={{ fontSize: fluid(spacing.titleSize) }}
      >
        {e.title}
      </h3>

      <p
        className="text-center font-sans font-bold"
        style={{ fontSize: fluid(14), marginTop: fluid(spacing.titleGap) }}
      >
        At: {e.time}
      </p>

      <p
        className="w-full text-left font-sans font-bold text-primary-dark"
        style={{
          fontSize: fluid(14),
          marginTop: fluid(spacing.timeToLocationGap ?? 12),
        }}
      >
        Location:
      </p>
      <p
        className="w-full text-left font-sans leading-relaxed"
        style={{ fontSize: fluid(14) }}
      >
        {e.location}
      </p>

      {mapUrl && (
        <a
          href={mapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center self-center rounded-full bg-primary font-medium text-secondary-dark"
          style={{
            marginTop: fluid(16),
            gap: fluid(6),
            paddingLeft: fluid(16),
            paddingRight: fluid(16),
            paddingTop: fluid(6),
            paddingBottom: fluid(6),
            fontSize: fluid(12),
          }}
        >
          <svg
            className="h-3.5 w-3.5 shrink-0 text-white"
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
 * Background: /images/bg-save-the-date.webp (ilustrasi pasangan di ~24% atas,
 * pola berulang di sisanya). Tinggi section sekarang mengikuti konten (bukan
 * aspect-ratio tetap) supaya tidak pernah terpotong walau kartu tumbuh lebih
 * tinggi di layar sempit; gambar dipasang `object-top` + `fill` jadi ilustrasi
 * di atas selalu utuh dan sisanya (pola polos) ikut memanjang/terpotong halus.
 *
 * KNOB edit sendiri: isi acara & link map -> src/config/wedding.ts (`schedule`, `mapUrl`)
 */
export function EventSection() {
  const [akad, reception] = wedding.schedule;

  return (
    <section className="relative flex w-full items-center justify-center overflow-hidden bg-[#30535d]">
      <div className="relative w-full" style={{ minHeight: fluid(280) }}>
        <Image
          src="/images/bg-save-the-date.webp"
          alt=""
          fill
          unoptimized
          sizes="(max-width: 480px) 100vw, 480px"
          className="object-cover object-top"
        />

        {/* Konten — mengalir normal di bawah ilustrasi (bukan absolute lagi) */}
        <div
          className="relative flex flex-col items-center"
          style={{
            paddingTop: fluid(268),
            paddingLeft: fluid(32),
            paddingRight: fluid(32),
            paddingBottom: fluid(40),
          }}
        >
          <Countdown />

          <p
            className="w-full text-center font-sans leading-relaxed text-white/90"
            style={{ fontSize: fluid(12), marginTop: fluid(16) }}
          >
            By the grace of God, we request the honour of your presence at
            the marriage of our children :
          </p>

          <div className="w-full" style={{ marginTop: fluid(20) }}>
            <EventCard
              e={akad}
              spacing={{ topPad: 28, titleGap: 29, titleSize: 32 }}
            />
          </div>

          <div className="w-full" style={{ marginTop: fluid(43) }}>
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
