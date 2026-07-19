import Image from "next/image";
import { wedding } from "@/config/wedding";

/** Badge Instagram (pill emas). */
function IgBadge({ handle }: { handle: string }) {
  return (
    <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1 text-[10px] font-semibold text-secondary-dark">
      <svg
        className="h-3 w-3"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        aria-hidden="true"
      >
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
      {handle}
    </span>
  );
}

/** Satu mempelai (nama script + orang tua + IG). */
function Person({
  p,
}: {
  p: { name: string; relation: string; parents: string; ig: string };
}) {
  return (
    <div className="flex flex-col items-center">
      <p className="font-script text-[40px] leading-none text-secondary">
        {p.name}
      </p>
      <p className="mt-2 font-sans text-[11px] text-secondary/80">
        {p.relation}
      </p>
      <p className="max-w-[240px] font-sans text-[12px] font-medium text-secondary">
        {p.parents}
      </p>
      <IgBadge handle={p.ig} />
    </div>
  );
}

/**
 * Couple section — perkenalan mempelai + save the date, full satu layar.
 * Background: /images/bg-event.png (frame 9:16, kotak putih ~10%–90%).
 *
 * KNOB edit sendiri:
 *  • Nama/orang tua/IG/tanggal -> src/config/wedding.ts (`couple`, `saveTheDate`)
 *  • Ukuran nama mempelai      -> text-[40px] pada <p> di komponen Person
 */
export function CoupleSection() {
  const { bride, groom } = wedding.couple;
  const d = wedding.saveTheDate;

  return (
    <section className="relative flex min-h-dvh w-full items-center justify-center overflow-hidden bg-[#30535d]">
      <div className="relative w-full aspect-[9/16]">
        <Image
          src="/images/bg-couple.png"
          alt=""
          fill
          unoptimized
          sizes="(max-width: 480px) 100vw, 480px"
          className="object-cover"
        />

        {/* Konten di dalam kotak putih */}
        <div className="absolute inset-0 flex flex-col items-center justify-start pt-24 px-16 text-center">
          <p className="font-sans text-[16px] font-bold leading-snug text-primary-dark">
            You are Invited to
            <br />
            The Wedding of:
          </p>

          <div className="mt-20">
            <Person p={bride} />
          </div>

          <p className="my-5 font-script text-[34px] leading-none text-secondary">
            &amp;
          </p>

          <Person p={groom} />

          {/* Save the date */}
          <p className="mt-20 font-serif text-[26px] leading-none text-secondary">
            Save the date
          </p>

          <div className="mt-2 flex items-center gap-3 text-secondary">
            <span className="font-sans text-[30px]">{d.day}</span>
            <span className="h-8 w-px bg-secondary/40" />
            <span className="font-sans text-[30px] font-bold leading-none">
              {d.date}
            </span>
            <span className="h-8 w-px bg-secondary/40" />
            <span className="font-sans text-[30px]">{d.month}</span>
          </div>

          <p className="mt-1.5 font-sans text-[14px] font-bold text-secondary">
            {d.year} at 09.30 a.m
          </p>
        </div>
      </div>
    </section>
  );
}
