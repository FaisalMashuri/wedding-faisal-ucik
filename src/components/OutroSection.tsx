import Image from "next/image";
import { wedding } from "@/config/wedding";

/**
 * Outro section — penutup, full satu layar.
 * Background: /images/bg-outro.png (kolase foto + disclaimer amplop tercetak
 * di bagian bawah gambar).
 *
 * KNOB edit sendiri: src/config/wedding.ts (`outro`).
 */
export function OutroSection() {
  const { couple, message } = wedding.outro;

  return (
    <section className="relative flex w-full items-center justify-center overflow-hidden bg-[#414341]">
      <div className="relative w-full aspect-[9/16]">
        <Image
          src="/images/bg-outro.webp"
          alt="Foto pasangan"
          fill
          unoptimized
          sizes="(max-width: 480px) 100vw, 480px"
          className="object-cover"
        />

        {/* Konten — di tengah container */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-12 text-center text-white">
          <h2 className="font-serif text-[30px] leading-none drop-shadow">
            {couple}
          </h2>

          <p className="mt-5 max-w-[290px] font-serif text-[15px] leading-relaxed text-white/90">
            {message}
          </p>
        </div>
      </div>
    </section>
  );
}
