"use client";

import { useRef } from "react";
import Image from "next/image";
import { wedding } from "@/config/wedding";
import { fluid as fluidBase } from "@/lib/fluid";
import {
  gsap,
  useGSAP,
  ensureGsap,
  getScroller,
  REVEAL_START,
  EASE,
  EASE_SETTLE,
  RISE,
} from "@/lib/gsap";

// Skala murni proporsional (tanpa floor): layout harus identik dengan frame
// Figma (1080×2921) di semua lebar layar — section di-lock aspect-nya, jadi
// semua ukuran konten wajib menyusut linear bersama lebar.
const fl = (px480: number) => fluidBase(px480, 0);

// Posisi garis timeline (dari kiri, % lebar section) — mengikuti Figma.
const LINE_X = "12.9%";

/* ---- Gaya per pasangan polaroid (per milestone, sesuai Figma) ----
   Tiap kartu: rotate = derajat kemiringan, top = geser turun (px skala 480),
   onTop = kartu ini yang menutupi saat bertumpuk.
   overlap = seberapa jauh kartu kanan menindih/menyelip ke kiri (px negatif).

   `rotate` sengaja ANGKA, bukan class Tailwind: kemiringannya dianimasikan
   GSAP (kartu mendarat ke posisi miringnya). Tailwind v4 memancarkan properti
   `rotate` yang berdiri sendiri sedangkan GSAP menulis `transform`, dan
   keduanya DIJUMLAHKAN — kalau class-nya dibiarkan, hasil akhirnya jadi dua
   kali lipat (mis. -12deg, bukan -6deg). */
type CardStyle = { rotate: number; top?: number; onTop?: boolean };
type PairStyle = { left: CardStyle; right: CardStyle; overlap: number };

const PAIR_STYLES: readonly PairStyle[] = [
  // 1 — Introduction: kemiringan hampir simetris, kiri lebih rendah,
  //     kartu KIRI yang menimpa kanan, dua kartu saling menindih rapat.
  {
    left: { rotate: -6, top: 20, onTop: true },
    right: { rotate: 6 },
    overlap: -40,
  },
  // 2 — Engagement: miring berlawanan (kiri -5deg, kanan +7deg), kartu KIRI
  //     yang menimpa kanan, overlap tipis. `top` kanan mengimbangi bounding box
  //     rotasi yang lebih besar supaya ujung atas kedua kartu rata.
  {
    left: { rotate: -5, onTop: true },
    right: { rotate: 7, top: 18 },
    overlap: -25,
  },
  // 3 — Wedding: sama persis dengan pasangan 2.
  {
    left: { rotate: -5, onTop: true },
    right: { rotate: 7, top: 18 },
    overlap: -25,
  },
];

/** Satu kartu polaroid. `dir` = arah datangnya saat masuk layar (-1 kiri, +1 kanan). */
function PolaroidCard({
  src,
  card,
  overlap,
  dir,
}: {
  src: string;
  card: CardStyle;
  overlap?: number;
  dir: -1 | 1;
}) {
  return (
    <div
      className={`js-polaroid ${card.onTop ? "relative z-10" : ""} bg-white shadow-md`}
      data-rotate={card.rotate}
      data-dir={dir}
      style={{
        // Kemiringan ditulis sebagai `transform`, BUKAN properti `rotate`
        // (atau class Tailwind), supaya GSAP menulis ke properti yang sama
        // dan nilainya tidak berlipat. Ini juga posisi istirahat yang benar
        // kalau tamu menyalakan "kurangi gerak" dan GSAP tidak pernah jalan.
        transform: `rotate(${card.rotate}deg)`,
        padding: fl(6),
        paddingBottom: fl(20),
        borderRadius: fl(2),
        marginTop: card.top !== undefined ? fl(card.top) : undefined,
        marginLeft: overlap !== undefined ? fl(overlap) : undefined,
      }}
    >
      <div
        className="relative overflow-hidden"
        style={{ width: fl(175), height: fl(180) }}
      >
        <Image
          src={src}
          alt=""
          fill
          unoptimized
          sizes="190px"
          className="object-cover"
        />
      </div>
    </div>
  );
}

/** Dua foto polaroid berdampingan — komposisinya beda tiap milestone. */
function Polaroids({
  photos,
  pair,
}: {
  photos: readonly string[];
  pair: PairStyle;
}) {
  return (
    <div
      className="flex items-start justify-center"
      style={{ marginTop: fl(14) }}
    >
      <PolaroidCard src={photos[0]} card={pair.left} dir={-1} />
      <PolaroidCard
        src={photos[1]}
        card={pair.right}
        overlap={pair.overlap}
        dir={1}
      />
    </div>
  );
}

/**
 * Timeline section — "The Path We Walked Together", layout persis Figma:
 * garis putus-putus emas di kiri, tiap milestone = titik emas + judul emas
 * + tempat (putih) + dua polaroid besar di bawahnya.
 * Background: /images/bg-timeline-3.webp (frame Figma 1080×2921).
 *
 * KNOB edit sendiri: src/config/wedding.ts (`timelineTitle`, `timeline`).
 * Ganti `photos` dengan foto asli tiap milestone.
 */
export function TimelineSection() {
  const scope = useRef<HTMLElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLParagraphElement>(null);
  const lineRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const root = scope.current;
      const frame = frameRef.current;
      const line = lineRef.current;
      const title = titleRef.current;
      if (!root || !frame || !line || !title) return;
      ensureGsap();
      const scroller = getScroller() ?? undefined;

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        /* Seluruh isi timeline di-SCRUB, bukan sekali-jalan.
           Progres animasinya diikat ke posisi scroll: digulir setengah, ia
           berhenti di setengah dan bertahan di situ; digulir naik, ia mundur
           proporsional. Ini beda dari empat section lain yang sengaja tetap
           sekali-jalan — di sini gerakannya jadi seirama dengan garis emas
           yang memang sudah scrub sejak awal.

           `end` menentukan sepanjang berapa guliran animasi itu terbentang;
           makin jauh dari `start`, makin lambat dan makin terasa "ketahan". */
        gsap.set(title, { opacity: 0, y: RISE });
        gsap.to(title, {
          opacity: 1,
          y: 0,
          ease: EASE,
          scrollTrigger: {
            trigger: title,
            scroller,
            start: REVEAL_START,
            end: "top 62%",
            scrub: true,
          },
        });

        // Garis emas menggambar dirinya seiring scroll. `scrub` sengaja: ini
        // penunjuk progres, wajar ikut maju-mundur bersama guliran tamu.
        // originY atas — tanpa itu garis tumbuh dari tengah ke dua arah.
        gsap.set(line, { scaleY: 0, transformOrigin: "50% 0%" });
        gsap.to(line, {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: frame,
            scroller,
            // Frame ini ~2,7x tinggi layar. `end: "bottom bottom"` membuat
            // garis tuntas saat baru dua pertiga perjalanan; "bottom 65%"
            // menahannya sampai milestone terakhir benar-benar di layar.
            start: "top 70%",
            end: "bottom 65%",
            scrub: true,
          },
        });

        // Frame timeline tingginya ~2,7x layar, jadi pemicunya PER milestone.
        // Kalau dipasang per section, ketiganya menyala serempak saat yang
        // pertama masuk layar dan efeknya hilang.
        root.querySelectorAll<HTMLElement>(".js-milestone").forEach((ms) => {
          // `el` menentukan APA yang dipakai sebagai patokan: polaroid ada
          // ratusan piksel di bawah judul milestone, jadi dia harus memicu
          // dari kotaknya sendiri, bukan dari ujung atas milestone.
          const scrub = (el: Element, end: string) => ({
            trigger: el,
            scroller,
            start: REVEAL_START,
            end,
            scrub: true,
          });

          const text = ms.querySelector<HTMLElement>(".js-ms-text");
          const dot = ms.querySelector<HTMLElement>(".js-dot");

          // Titik & blok teks sebaris, jadi satu timeline saja dengan patokan
          // blok teks — keduanya bergerak bersamaan mengikuti guliran.
          if (text && dot) {
            gsap.set(dot, { scale: 0.3, opacity: 0 });
            gsap.set(text, { opacity: 0, y: RISE });
            gsap
              .timeline({ scrollTrigger: scrub(text, "top 60%") })
              .to(dot, { scale: 1, opacity: 1, ease: EASE, duration: 1 }, 0)
              .to(text, { opacity: 1, y: 0, ease: EASE, duration: 1 }, 0.2);
          }

          // Polaroid meluncur dari sisinya lalu MENDARAT di kemiringan Figma:
          // rotate 0 -> nilai aslinya, jadi kartunya terasa "diletakkan".
          // Patokannya kotak polaroid itu sendiri — letaknya jauh di bawah
          // judul milestone, jadi kalau ikut memicu dari milestone dia sudah
          // selesai beranimasi sebelum sempat terlihat.
          //
          // Satu timeline untuk sepasang kartu: offset 0.35 memberi rasa
          // berurutan yang, karena di-scrub, ikut maju-mundur bersama guliran
          // alih-alih berjalan sendiri memakai jam.
          const pair = ms.querySelector<HTMLElement>(".js-polaroids");
          const cards = [...ms.querySelectorAll<HTMLElement>(".js-polaroid")];
          if (pair && cards.length) {
            const tlCards = gsap.timeline({
              scrollTrigger: scrub(pair, "top 48%"),
            });
            cards.forEach((card, i) => {
              const rot = Number(card.dataset.rotate ?? 0);
              const dir = Number(card.dataset.dir ?? -1);
              gsap.set(card, { opacity: 0, x: 26 * dir, rotate: 0 });
              tlCards.to(
                card,
                {
                  opacity: 1,
                  x: 0,
                  rotate: rot,
                  ease: EASE_SETTLE,
                  duration: 1,
                },
                i * 0.35
              );
            });
          }
        });
      });

      return () => mm.revert();
    },
    { scope }
  );

  return (
    <section
      ref={scope}
      className="relative flex w-full items-center justify-center overflow-hidden bg-[#30535d]"
    >
      <div ref={frameRef} className="relative w-full aspect-[1080/2921]">
        <Image
          src="/images/bg-timeline-3.webp"
          alt=""
          fill
          unoptimized
          sizes="(max-width: 480px) 100vw, 480px"
          className="object-cover"
        />

        {/* Judul */}
        <p
          ref={titleRef}
          className="absolute inset-x-0 whitespace-pre-line text-center font-sans font-bold leading-tight text-primary"
          style={{ top: "2.8%", fontSize: fl(26) }}
        >
          {wedding.timelineTitle}
        </p>

        {/* Garis timeline putus-putus. `-translate-x-1/2` itu properti
            `translate` tersendiri di Tailwind v4, jadi tetap berlaku
            berdampingan dengan `transform: scaleY()` yang ditulis GSAP —
            garis tidak bergeser dari LINE_X saat menggambar. */}
        <span
          ref={lineRef}
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
          // Pembungkus milestone hanya dipakai sebagai PEMICU ScrollTrigger,
          // stylenya tidak pernah disentuh: dia jangkar koordinat `top: n.top%`.
          <div
            key={i}
            className="js-milestone absolute inset-x-0"
            style={{ top: `${n.top}%` }}
          >
            {/* Titik milestone di garis */}
            <span
              className="js-dot absolute -translate-x-1/2 rounded-full bg-primary"
              style={{ left: LINE_X, top: fl(3), width: fl(11), height: fl(11) }}
            />

            {/* Judul + tempat, di kanan garis */}
            <div
              className="js-ms-text"
              style={{ marginLeft: "19.3%", marginRight: "6%" }}
            >
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

            {/* Foto polaroid — di area kanan garis, gaya per milestone */}
            <div className="js-polaroids" style={{ marginLeft: "13%" }}>
              <Polaroids
                photos={n.photos}
                pair={PAIR_STYLES[i] ?? PAIR_STYLES[0]}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
