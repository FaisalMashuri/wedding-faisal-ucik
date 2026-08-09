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
      <div
        className="relative w-full aspect-[9/16]"
        // Jadikan kotak ini "container" supaya isinya bisa diukur dgn cqw
        // (1cqw = 1% lebar kotak), bukan px mati. Lihat --px di bawah.
        style={{ containerType: "inline-size" }}
      >
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

            SEMUA ukuran di blok ini memakai `var(--px)` = 1 px pada desain
            selebar 480px. Karena --px ikut lebar kotak (100cqw/480), teks
            mengecil/membesar PERSIS seproporsional gambar — jadi posisinya
            tetap di dalam area putih di layar sempit maupun lebar.
            Angka di dalam calc() = ukuran px versi desain 480px, jadi tetap
            enak dibaca/diubah:
            • Geser SELURUH blok naik/turun  -> ubah `top-[50.5%]`
            • Ukuran "U & F"                  -> ubah angka 28 pada <p> inisial
            • Jarak inisial ke kutipan        -> ubah angka 30 pada mt <p> kutipan
            • Ukuran huruf kutipan            -> ubah angka 12 pada <p> kutipan
            • Jumlah baris kutipan            -> ubah angka 247 pada max-w (kecil = baris lbh banyak)
            • Ukuran "QS. Ar-Rum ..."         -> ubah angka 15 pada <p> sumber
            • Teks kutipan/sumber/inisial     -> di src/config/wedding.ts
            ===================================================================== */}
        {/* translate-x kecil: area putih di background sedikit ke kanan dari
            tengah frame, jadi blok teks ikut digeser agar pas di tengahnya. */}
        <div className="absolute inset-x-0 top-[50.5%] [--px:calc(100cqw/480)] translate-x-[calc(5*var(--px))] px-[calc(8*var(--px))] text-secondary">
          {/* Inisial pasangan — Alice */}
          <p className="text-center font-serif text-[calc(28*var(--px))] tracking-[0.05em]">
            {wedding.initials}
          </p>

          {/* Kutipan — Montserrat, rata kanan-kiri.
              max-w 247 + text 12 (skala desain) = 7 baris, sama persis dgn desain. */}
          <p className="mx-auto mt-[calc(30*var(--px))] max-w-[calc(247*var(--px))] text-justify font-sans text-[calc(12*var(--px))] font-bold leading-[1.25]">
            &ldquo;{wedding.quote}&rdquo;
          </p>

          {/* Sumber kutipan — script */}
          <p className="mt-[calc(12*var(--px))] mr-[calc(100*var(--px))] text-right font-script text-[calc(15*var(--px))] leading-none text-secondary/90">
            {wedding.quoteSource}
          </p>
        </div>
      </div>
    </section>
  );
}
