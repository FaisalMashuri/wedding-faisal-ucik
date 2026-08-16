"use client";

import Image from "next/image";
import { wedding } from "@/config/wedding";
import { fluid } from "@/lib/fluid";
import { useReveal, REVEAL } from "@/hooks/useReveal";

/**
 * Outro section — penutup, full satu layar.
 * Background: /images/bg-outro-fix.webp (kolase foto, bersih tanpa teks;
 * file mentah full-res di public/images/originals/).
 *
 * KNOB edit sendiri: src/config/wedding.ts (`outro`).
 */
export function OutroSection() {
  const { couple, message, disclaimer } = wedding.outro;
  const scope = useReveal<HTMLElement>();

  return (
    <section
      ref={scope}
      className="relative flex w-full items-center justify-center overflow-hidden bg-[#414341]"
    >
      <div className="relative w-full aspect-[9/16]">
        <Image
          src="/images/bg-outro-fix.webp"
          alt="Foto pasangan"
          fill
          unoptimized
          sizes="(max-width: 480px) 100vw, 480px"
          className="object-cover"
        />

        {/* Konten — di tengah container */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-8 text-center text-white">
          <h2 className={`${REVEAL} font-serif text-[30px] leading-none drop-shadow`}>
            {couple}
          </h2>

          {/* Sans besar, wrap alami — ukuran & lebar blok mengikuti mock
              (~21px, blok 365px, 5 baris). fontSize & maxWidth diskalakan
              rasio sama, jadi pola pemenggalan barisnya identik di semua
              lebar layar. */}
          <p
            className={`${REVEAL} font-sans leading-relaxed text-white/90 drop-shadow`}
            style={{
              marginTop: fluid(20),
              fontSize: fluid(21, 0.7),
              maxWidth: fluid(365, 0.7),
            }}
          >
            {message}
          </p>
        </div>

        {/* Disclaimer amplop — teks HTML di bawah, gaya mengikuti mock
            (sans bold, rata kiri, nempel bawah, drop-shadow biar terbaca). */}
        {/* REVEAL langsung di elemennya — jangan dibungkus: dia `absolute`
            dengan left/right/bottom, pembungkus ber-transform akan jadi
            containing block-nya dan menggeser posisinya. */}
        <p
          className={`${REVEAL} absolute font-sans font-bold leading-snug text-white drop-shadow`}
          style={{
            left: fluid(24),
            right: fluid(24),
            bottom: fluid(18),
            fontSize: fluid(14, 0.72),
          }}
        >
          {disclaimer}
        </p>
      </div>
    </section>
  );
}
