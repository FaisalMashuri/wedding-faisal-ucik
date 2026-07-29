import Image from "next/image";
import { wedding } from "@/config/wedding";
import { fluid as fluidBase } from "@/lib/fluid";

// Skala murni proporsional (tanpa floor): layout harus identik dengan frame
// Figma (1080×2921) di semua lebar layar — section di-lock aspect-nya, jadi
// semua ukuran konten wajib menyusut linear bersama lebar.
const fl = (px480: number) => fluidBase(px480, 0);

// Posisi garis timeline (dari kiri, % lebar section) — mengikuti Figma.
const LINE_X = "12.9%";

/** Dua foto polaroid berdampingan, sedikit miring & bertumpuk (ala mock). */
function Polaroids({ photos }: { photos: readonly string[] }) {
  return (
    <div
      className="flex items-start justify-center"
      style={{ marginTop: fl(14) }}
    >
      {/* Sesuai mock: kartu kiri lebih rendah, miring kiri, dan DI ATAS saat
          bertumpuk; kartu kanan lebih tinggi, miring kanan, terselip di
          belakang tepi kanan kartu kiri. */}
      <div
        className="relative z-10 rotate-[-7deg] bg-white shadow-md"
        style={{
          padding: fl(6),
          paddingBottom: fl(20),
          borderRadius: fl(2),
          marginTop: fl(22),
        }}
      >
        <div
          className="relative overflow-hidden"
          style={{ width: fl(175), height: fl(180) }}
        >
          <Image
            src={photos[0]}
            alt=""
            fill
            unoptimized
            sizes="190px"
            className="object-cover"
          />
        </div>
      </div>

      <div
        className="rotate-[3deg] bg-white shadow-md"
        style={{
          padding: fl(6),
          paddingBottom: fl(20),
          borderRadius: fl(2),
          marginLeft: fl(-38),
        }}
      >
        <div
          className="relative overflow-hidden"
          style={{ width: fl(175), height: fl(180) }}
        >
          <Image
            src={photos[1]}
            alt=""
            fill
            unoptimized
            sizes="190px"
            className="object-cover"
          />
        </div>
      </div>
    </div>
  );
}

/**
 * Timeline section — "The Path We Walked Together", layout persis Figma:
 * garis putus-putus emas di kiri, tiap milestone = titik emas + judul emas
 * + tempat (putih) + dua polaroid besar di bawahnya.
 * Background: /images/bg-timeline-2.webp (frame Figma 1080×2921).
 *
 * KNOB edit sendiri: src/config/wedding.ts (`timelineTitle`, `timeline`).
 * Ganti `photos` dengan foto asli tiap milestone.
 */
export function TimelineSection() {
  return (
    <section className="relative flex w-full items-center justify-center overflow-hidden bg-[#30535d]">
      <div className="relative w-full aspect-[1080/2921]">
        <Image
          src="/images/bg-timeline-2.webp"
          alt=""
          fill
          unoptimized
          sizes="(max-width: 480px) 100vw, 480px"
          className="object-cover"
        />

        {/* Judul */}
        <p
          className="absolute inset-x-0 whitespace-pre-line text-center font-sans font-bold leading-tight text-primary"
          style={{ top: "2.8%", fontSize: fl(26) }}
        >
          {wedding.timelineTitle}
        </p>

        {/* Garis timeline putus-putus */}
        <span
          aria-hidden
          className="absolute -translate-x-1/2"
          style={{
            left: LINE_X,
            top: "12%",
            bottom: "5.5%",
            width: fl(2),
            backgroundImage: `repeating-linear-gradient(to bottom, var(--color-primary) 0 ${fl(10)}, transparent ${fl(10)} ${fl(19)})`,
          }}
        />

        {wedding.timeline.map((n, i) => (
          <div
            key={i}
            className="absolute inset-x-0"
            style={{ top: `${n.top}%` }}
          >
            {/* Titik milestone di garis */}
            <span
              className="absolute -translate-x-1/2 rounded-full bg-primary"
              style={{ left: LINE_X, top: fl(3), width: fl(11), height: fl(11) }}
            />

            {/* Judul + tempat, di kanan garis */}
            <div style={{ marginLeft: "19.3%", marginRight: "6%" }}>
              <p
                className="font-sans font-bold leading-tight text-primary"
                style={{ fontSize: fl(15) }}
              >
                {n.title}
              </p>
              <p
                className="font-sans leading-snug text-primary"
                style={{ fontSize: fl(14), marginTop: fl(3), maxWidth: fl(260) }}
              >
                {n.place}
              </p>
            </div>

            {/* Foto polaroid — di area kanan garis */}
            <div style={{ marginLeft: "13%" }}>
              <Polaroids photos={n.photos} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
