import Image from "next/image";
import { wedding } from "@/config/wedding";
import { fluid as fluidBase } from "@/lib/fluid";

// Skala murni proporsional (tanpa floor minRatio): konten section ini harus
// selalu presisi di dalam kotak putih yang tercetak di bg-couple.webp —
// gambar menyusut linear dengan lebar layar, jadi semua ukuran/jarak konten
// wajib ikut linear juga agar tata letak identik dengan referensi di semua
// jenis layar.
const fluid = (px480: number) => fluidBase(px480, 0);

/** Badge Instagram (pill emas) — jadi link kalau ada handle-nya. */
function IgBadge({ handle }: { handle: string }) {
  const content = (
    <>
      <svg
        className="h-6 w-6 shrink-0"
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
    </>
  );

  const style = {
    marginTop: fluid(8),
    gap: fluid(6),
    paddingLeft: fluid(8),
    paddingRight: fluid(16),
    paddingTop: fluid(3),
    paddingBottom: fluid(3),
    fontSize: fluid(12),
  };

  if (handle === "-") {
    return (
      <span
        className="inline-flex items-center rounded-full bg-primary text-white"
        style={style}
      >
        {content}
      </span>
    );
  }

  return (
    <a
      href={`https://www.instagram.com/${handle}/`}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center rounded-full bg-primary text-white outline-none"
      style={{ ...style, WebkitTapHighlightColor: "transparent" }}
    >
      {content}
    </a>
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
      <p
        className="font-script leading-none text-secondary"
        style={{ fontSize: fluid(44) }}
      >
        {p.name}
      </p>
      <p
        className="font-sans text-secondary/80"
        style={{ marginTop: fluid(8), fontSize: fluid(12) }}
      >
        {p.relation}
      </p>
      <p
        className="font-sans text-secondary"
        style={{ maxWidth: fluid(240), fontSize: fluid(12) }}
      >
        {p.parents}
      </p>
      <IgBadge handle={p.ig} />
    </div>
  );
}

/**
 * Couple section — perkenalan mempelai + save the date, full satu layar.
 * Background: /images/bg-couple.webp (frame 9:16, kotak putih ~10%–90%).
 *
 * KNOB edit sendiri:
 *  • Nama/orang tua/IG/tanggal -> src/config/wedding.ts (`couple`, `saveTheDate`)
 *  • Ukuran nama mempelai      -> lewat fluid() di komponen Person
 */
export function CoupleSection() {
  const { bride, groom } = wedding.couple;
  const d = wedding.saveTheDate;

  return (
    <section className="relative flex w-full items-center justify-center overflow-hidden bg-[#30535d]">
      <div className="relative w-full aspect-[9/16]">
        <Image
          src="/images/bg-couple.webp"
          alt=""
          fill
          unoptimized
          sizes="(max-width: 480px) 100vw, 480px"
          className="object-cover"
        />

        {/* Konten di dalam kotak putih */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-start text-center"
          style={{ paddingTop: fluid(132), paddingLeft: fluid(32), paddingRight: fluid(32) }}
        >
          <p
            className="font-sans font-bold leading-snug text-primary-dark"
            style={{ fontSize: fluid(21) }}
          >
            You are Invited to
            <br />
            The Wedding of:
          </p>

          <div style={{ marginTop: fluid(40) }}>
            <Person p={bride} />
          </div>

          <p
            className="font-script leading-none text-secondary"
            style={{ fontSize: fluid(34), marginTop: fluid(12), marginBottom: fluid(12) }}
          >
            &amp;
          </p>

          <div style={{ marginBottom: fluid(40) }}>
            <Person p={groom} />
          </div>

          {/* Save the date — polos, ketebalan regular (sama seperti Sat/Sept) */}
          <p
            className="font-serif leading-none text-secondary"
            style={{ fontSize: fluid(20), marginTop: fluid(16) }}
          >
            Save the date
          </p>

          {/* Baris tanggal ala mock: font besar, pembatas emas tipis tinggi,
              dan gap dihitung agar bentang total (teks 145.3 + pembatas 2 +
              4 gap) pas sama bentang nama "Faisal Mashuri" (215.3px) */}
          <div
            className="flex items-center text-secondary"
            style={{ marginTop: fluid(8), gap: fluid(17) }}
          >
            <span style={{ fontSize: fluid(28) }}>{d.day}</span>
            <span
              className="bg-primary"
              style={{ width: 1, height: fluid(38) }}
            />
            <span
              className="font-bold leading-none"
              style={{ fontSize: fluid(28) }}
            >
              {d.date}
            </span>
            <span
              className="bg-primary"
              style={{ width: 1, height: fluid(38) }}
            />
            <span style={{ fontSize: fluid(28) }}>{d.month}</span>
          </div>

          <p
            className="font-sans font-bold text-secondary"
            style={{ fontSize: fluid(15), marginTop: fluid(6) }}
          >
            {d.year} at 09:30 a.m
          </p>
        </div>
      </div>
    </section>
  );
}
