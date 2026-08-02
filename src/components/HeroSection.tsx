import Image from "next/image";
import { wedding } from "@/config/wedding";

/**
 * Hero section — layar pembuka undangan, full satu layar (h-dvh).
 * Background: /images/bg-hero.webp (frame 9:16 dengan foto + ornamen).
 * Gambar ditampilkan utuh (tidak di-crop/zoom); area kosong section
 * memakai warna tepi gambar (#E8E8E0) agar menyatu.
 */
export function HeroSection() {
  return (
    <section className="relative flex w-full items-center justify-center overflow-hidden bg-[#e8e8e0]">
      {/* Kotak dikunci rasio 9:16 = rasio asli gambar (diukur dari lebar),
          jadi gambar tampil utuh & teks bisa diposisikan akurat relatif
          terhadap area putih di desain. */}
      <div className="relative w-full aspect-[9/16]">
        <Image
          src="/images/bg-hero.webp"
          alt="Foto pasangan"
          fill
          priority
          unoptimized
          sizes="(max-width: 480px) 100vw, 480px"
          className="object-cover"
        />

        {/* ================= KONTEN AREA PUTIH — knob untuk edit sendiri =========
            Batas kotak putih background: 43%–71.8% tinggi gambar.
            • Geser SELURUH blok naik/turun  -> ubah `top-[50.5%]`
            • Ukuran "U & F"                  -> ubah text-[28px] pada <p> inisial
            • Jarak inisial ke kutipan        -> ubah mt-[30px] pada <p> kutipan
            • Ukuran huruf kutipan            -> ubah text-[12px] pada <p> kutipan
            • Jumlah baris kutipan            -> ubah max-w-[247px] (kecil = baris lbh banyak)
            • Ukuran "QS. Ar-Rum ..."         -> ubah text-[15px] pada <p> sumber
            • Teks kutipan/sumber/inisial     -> di src/config/wedding.ts
            ===================================================================== */}
        {/* translate-x kecil: area putih di background sedikit ke kanan dari
            tengah frame, jadi blok teks ikut digeser agar pas di tengahnya. */}
        <div className="absolute inset-x-0 top-[50.5%] translate-x-[5px] px-2 text-secondary">
          {/* Inisial pasangan — Alice */}
          <p className="text-center font-serif text-[28px] tracking-[0.05em]">
            {wedding.initials}
          </p>

          {/* Kutipan — Montserrat, rata kanan-kiri.
              max-w 247px + text 12px = 7 baris, sama persis dgn desain. */}
          <p className="mx-auto mt-[30px] max-w-[247px] text-justify font-sans text-[12px] font-bold leading-[1.25]">
            &ldquo;{wedding.quote}&rdquo;
          </p>

          {/* Sumber kutipan — script */}
          <p className="mt-3 mr-[100px] text-right font-script text-[15px] leading-none text-secondary/90">
            {wedding.quoteSource}
          </p>
        </div>
      </div>
    </section>
  );
}
