import Image from "next/image";
import { wedding } from "@/config/wedding";

/**
 * Hero section — layar pembuka undangan, full satu layar (h-dvh).
 * Background: /images/bg-hero.png (frame 9:16 dengan foto + ornamen).
 * Gambar ditampilkan utuh (tidak di-crop/zoom); area kosong section
 * memakai warna tepi gambar (#E8E8E0) agar menyatu.
 */
export function HeroSection() {
  return (
    <section className="relative flex min-h-dvh w-full items-center justify-center overflow-hidden bg-[#e8e8e0]">
      {/* Kotak dikunci rasio 9:16 = rasio asli gambar (diukur dari lebar),
          jadi gambar tampil utuh & teks bisa diposisikan akurat relatif
          terhadap area putih di desain. */}
      <div className="relative w-full aspect-[9/16]">
        <Image
          src="/images/bg-hero.png"
          alt="Foto pasangan"
          fill
          priority
          unoptimized
          sizes="(max-width: 480px) 100vw, 480px"
          className="object-cover"
        />

        {/* ================= KONTEN AREA PUTIH — knob untuk edit sendiri =========
            Batas kotak putih background: 43%–71.8% tinggi gambar.
            • Geser SELURUH blok naik/turun  -> ubah `top-[48%]`
            • Ukuran "F & U"                  -> ubah text-[34px] pada <p> inisial
            • Ukuran huruf kutipan            -> ubah text-[8px] pada <p> kutipan
            • Jumlah baris kutipan            -> ubah max-w-[180px] (kecil = baris lbh banyak)
            • Ukuran "QS. Ar-Rum ..."         -> ubah text-[15px] pada <p> sumber
            • Teks kutipan/sumber/inisial     -> di src/config/wedding.ts
            ===================================================================== */}
        <div className="absolute inset-x-0 top-[48%] px-2 text-secondary">
          {/* Inisial pasangan — Alice */}
          <p className="text-center font-serif text-[34px] tracking-[0.15em]">
            {wedding.initials}
          </p>

          {/* Kutipan — Montserrat (max-w mengatur jumlah baris) */}
          <p className="mx-auto mt-3 max-w-[180px] font-sans text-[8.5px] font-bold leading-[1.6]">
            "{wedding.quote}"
          </p>

          {/* Sumber kutipan — script */}
          <p className="mt-8 text-right font-script text-[15px] leading-none text-secondary/90 mr-16">
            {wedding.quoteSource}
          </p>
        </div>
      </div>
    </section>
  );
}
