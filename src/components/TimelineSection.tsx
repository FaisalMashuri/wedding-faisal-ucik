import Image from "next/image";
import { wedding } from "@/config/wedding";

/** Dua foto polaroid bertumpuk & miring. */
function Polaroids({
  photos,
  side,
  top,
}: {
  photos: readonly string[];
  side: "left" | "right";
  top: number;
}) {
  return (
    <div
      className="absolute -translate-y-1/2"
      style={{ top: `${top}%`, [side]: "5%" }}
    >
      <div className="flex">
        <div className="rotate-[-7deg] rounded-[2px] bg-white p-1 shadow-md">
          <div className="relative h-[92px] w-[74px] overflow-hidden">
            <Image
              src={photos[0]}
              alt=""
              fill
              unoptimized
              sizes="80px"
              className="object-cover"
            />
          </div>
        </div>
        <div className="-ml-4 mt-3 rotate-[6deg] rounded-[2px] bg-white p-1 shadow-md">
          <div className="relative h-[92px] w-[74px] overflow-hidden">
            <Image
              src={photos[1]}
              alt=""
              fill
              unoptimized
              sizes="80px"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Timeline section — "The Path We Walked Together".
 * Background: /images/bg-timeline.png (garis tengah x=50%, ornamen,
 * + node "Engagement" tercetak di gambar di ~55%).
 *
 * KNOB edit sendiri: src/config/wedding.ts (`timelineTitle`, `timeline`).
 * Ganti `photos` dengan foto asli tiap milestone.
 */
export function TimelineSection() {
  return (
    <section className="relative flex w-full items-center justify-center overflow-hidden bg-[#30535d]">
      <div className="relative w-full aspect-[9/16]">
        <Image
          src="/images/bg-timeline.webp"
          alt=""
          fill
          unoptimized
          sizes="(max-width: 480px) 100vw, 480px"
          className="object-cover"
        />

        {/* Judul */}
        <p className="absolute inset-x-0 top-[4%] whitespace-pre-line px-10 text-center font-serif text-[22px] font-semibold leading-tight text-primary-light">
          {wedding.timelineTitle}
        </p>

        {wedding.timeline.map((n, i) => (
          <div key={i}>
            <Polaroids
              photos={n.photos}
              side={n.photoSide as "left" | "right"}
              top={n.top}
            />

            {/* Node teks + titik (kalau bukan node bawaan gambar) */}
            {n.title && (
              <div className="absolute inset-x-0" style={{ top: `${n.top}%` }}>
                <span className="absolute left-1/2 top-0 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary ring-2 ring-[#30535d]" />
                <div
                  className={`absolute top-0 w-[44%] -translate-y-1/2 ${
                    n.photoSide === "left"
                      ? "left-[52%] text-left"
                      : "right-[52%] text-right"
                  }`}
                >
                  <p className="font-sans text-[11px] font-bold leading-tight text-primary">
                    {n.title}
                  </p>
                  <p className="mt-0.5 font-sans text-[9.5px] leading-snug text-primary/75">
                    {n.place}
                  </p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
