"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useOnboardingStore } from "@/store/onboarding";
import { wedding } from "@/config/wedding";

/*
  Loading screen sebelum onboarding — amplop pos udara vintage
  (transkrip setia dari referensi HTML yang disetujui).
  - Amplop 400×258 diskalakan lewat var --s agar muat di shell 480px.
  - Progres = yang paling lambat antara aset asli dan waktu minimum;
    batas maksimum menjaga tamu berkoneksi lambat.
  - Saat siap: segel lilin menyusut, flap terbuka (rotateX), flap turun
    ke belakang, surat naik, lalu surat "memuai" jadi lembar penuh yang
    larut ke layar onboarding di baliknya.
*/

gsap.registerPlugin(useGSAP);

// Latar teal brand (identik dengan body di layout.tsx) — amplopnya sendiri
// tetap memakai palet vintage airmail dari referensi.
const TEAL_GRADIENT =
  "radial-gradient(130% 90% at 50% -10%, #4a7883 0%, #2c515b 42%, #16292f 100%)";
const ENV_BACK = "linear-gradient(160deg, #F0E9DA, #E3D8C3)";
const ENV_FRONT = "linear-gradient(170deg, #F0E9DA, #E3D8C3)";
const ENV_FLAP = "linear-gradient(180deg, #F0E9DA, #E3D8C3)";
const PAPER = "#F3EDE1"; // warna surat = warna cover saat memuai
const SEAL_GRADIENT =
  "radial-gradient(circle at 34% 30%, #C9483A, #8E2318 70%)";

// Tanggal "05 · 09 · 2026" diturunkan dari config (jangan hardcode).
const [datePart] = wedding.dateISO.split("T"); // "2026-09-05"
const [yyyy, mm, dd] = datePart.split("-");
const dateDots = `${dd} · ${mm} · ${yyyy}`;

const GUEST_FALLBACK = "Tamu Undangan";

const MIN_LOADER_MS = 2600; // loader minimal tampil selama ini
const MAX_LOADER_MS = 9000; // pengaman: aset lambat tidak boleh menahan tamu

const ASSET_SOURCES = ["/images/Opening_2.webp"]; // background onboarding

function preload(src: string) {
  return new Promise<void>((resolve) => {
    const img = new window.Image();
    img.onload = () => resolve();
    img.onerror = () => resolve(); // gagal muat tidak boleh menggantung loader
    img.src = src;
  });
}

export function EnvelopeLoader() {
  const guestName = useOnboardingStore((s) => s.guestName);

  const [visible, setVisible] = useState(true);
  const [phase, setPhase] = useState<"idle" | "opening">("idle");

  const rootRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const shadowRef = useRef<HTMLDivElement>(null);
  const letterRef = useRef<HTMLDivElement>(null);
  const flapRef = useRef<HTMLDivElement>(null);
  const sealRef = useRef<HTMLDivElement>(null);
  const statusBoxRef = useRef<HTMLDivElement>(null);
  const statusTextRef = useRef<HTMLParagraphElement>(null);
  const barFillRef = useRef<HTMLSpanElement>(null);
  const pctRef = useRef<HTMLParagraphElement>(null);
  const coverRef = useRef<HTMLDivElement>(null);
  const idleTweenRef = useRef<gsap.core.Tween | null>(null);

  // ---- Skala amplop mengikuti lebar shell (maks 480px) ----
  // Harus dipanggil SEBELUM GSAP menyentuh wrap: GSAP menulis ulang inline
  // transform (membekukan skala saat itu), jadi --s wajib sudah terpasang.
  function fitEnvelope() {
    const w = rootRef.current?.clientWidth ?? window.innerWidth;
    const s = Math.min(1, (w - 44) / 400);
    wrapRef.current?.style.setProperty("--s", s.toFixed(3));
  }

  useEffect(() => {
    window.addEventListener("resize", fitEnvelope);
    return () => window.removeEventListener("resize", fitEnvelope);
  }, []);

  // ---- Progres: aset asli vs waktu minimum (ditulis langsung ke DOM) ----
  useEffect(() => {
    // Hormati preferensi kurangi-gerak: langsung ke onboarding tanpa teater
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const skip = setTimeout(() => {
        useOnboardingStore.getState().finishLoader();
        setVisible(false);
      }, 0);
      return () => clearTimeout(skip);
    }

    let assetRatio = ASSET_SOURCES.length ? 0 : 1;
    let done = 0;
    ASSET_SOURCES.forEach((src) => {
      preload(src).then(() => {
        done += 1;
        assetRatio = done / ASSET_SOURCES.length;
      });
    });

    const startAt = Date.now();
    let opened = false;
    let shownPct = 0; // nilai yang DITAMPILKAN — meluncur halus ke target

    // Pakai gsap.ticker (bukan rAF sendiri) agar seirama dengan animasi.
    const tick = () => {
      const elapsed = Date.now() - startAt;
      if (elapsed > MAX_LOADER_MS) assetRatio = 1;

      const target =
        Math.min(assetRatio, elapsed / MIN_LOADER_MS) * 100;

      // Lerp ke target: kalau main thread sempat macet (hydration, decode
      // gambar), bar mengejar dengan mulus alih-alih teleport (mis. 9%→50%).
      shownPct += (target - shownPct) * 0.14;
      if (target - shownPct < 0.4) shownPct = target;

      const pct = Math.round(shownPct);
      if (barFillRef.current) barFillRef.current.style.width = `${pct}%`;
      if (pctRef.current) pctRef.current.textContent = `${pct}%`;
      if (pct > 55 && pct < 100 && statusTextRef.current) {
        statusTextRef.current.textContent = "Hampir siap";
      }

      if (shownPct >= 100 && !opened) {
        opened = true;
        if (statusTextRef.current) {
          statusTextRef.current.textContent = "Silakan dibuka";
        }
        gsap.ticker.remove(tick);
        setPhase("opening");
      }
    };

    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  }, []);

  // ---- Surat memuai jadi lembar penuh, lalu larut ke onboarding ----
  function expandToPage() {
    const letterEl = letterRef.current;
    const rootEl = rootRef.current;
    const coverEl = coverRef.current;
    if (!letterEl || !rootEl || !coverEl) {
      useOnboardingStore.getState().finishLoader();
      setVisible(false);
      return;
    }

    const r = letterEl.getBoundingClientRect();
    const rootRect = rootEl.getBoundingClientRect();

    gsap.set(coverEl, {
      display: "block",
      x: r.left - rootRect.left,
      y: r.top - rootRect.top,
      scaleX: r.width / rootRect.width,
      scaleY: r.height / rootRect.height,
    });

    gsap
      .timeline()
      .to(
        coverEl,
        { x: 0, y: 0, scaleX: 1, scaleY: 1, duration: 0.9, ease: "power3.inOut" },
        0
      )
      .to(letterEl, { opacity: 0, duration: 0.35 }, 0.1)
      .to(wrapRef.current, { opacity: 0, y: 30, duration: 0.6 }, 0)
      // "Unlock" onboarding di 0.75 seperti referensi: animasi CSS-nya baru
      // mulai jalan di sini, lalu ikut terlihat saat cover larut.
      .call(() => useOnboardingStore.getState().finishLoader(), undefined, 0.75)
      .to(rootEl, { opacity: 0, duration: 0.5 }, 1.3)
      .call(() => setVisible(false));
  }

  useGSAP(
    () => {
      if (phase === "idle") {
        fitEnvelope();
        // Keadaan awal (y:16, opacity:0) sudah di-bake di inline style JSX
        // agar paint pertama (sebelum hydration) tidak memperlihatkan amplop
        // utuh sekejap lalu menghilang — penyebab "patah" di awal.
        gsap.to(wrapRef.current, {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: "power2.out",
        });
        idleTweenRef.current = gsap.to(wrapRef.current, {
          y: -6,
          duration: 2.1,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
          delay: 0.9,
        });
        return;
      }

      // phase === "opening" — amplop terbuka sendiri
      idleTweenRef.current?.kill();

      gsap
        .timeline({ defaults: { ease: "power2.out" } })
        .to(wrapRef.current, { y: 0, duration: 0.3 }, 0)
        .to(
          sealRef.current,
          { scale: 0, opacity: 0, duration: 0.3, ease: "back.in(2)" },
          0.1
        )
        .to(
          flapRef.current,
          { rotateX: -172, duration: 0.75, ease: "power2.inOut" },
          0.15
        )
        .set(flapRef.current, { zIndex: 0 }, 0.52)
        .to(
          shadowRef.current,
          { scaleX: 1.12, opacity: 0.55, duration: 0.9 },
          0.15
        )
        .to(letterRef.current, { y: -184, duration: 0.85, ease: "power3.out" }, 0.65)
        .to(statusBoxRef.current, { opacity: 0, duration: 0.4 }, 0.65)
        .call(expandToPage, undefined, 1.45);
    },
    { scope: rootRef, dependencies: [phase] }
  );

  if (!visible) return null;

  return (
    <div
      ref={rootRef}
      className="absolute inset-0 z-[60] flex flex-col items-center justify-center overflow-hidden"
      style={{ background: TEAL_GRADIENT }}
    >
      {/* env-wrap — diskalakan agar amplop 400px muat di layar sempit */}
      <div
        ref={wrapRef}
        style={{
          // Mulai tersembunyi sejak SSR — GSAP menganimasikan masuk dari sini.
          opacity: 0,
          transform: "translateY(16px) scale(var(--s, 1))",
          marginBottom: "calc(-30px - (1 - var(--s, 1)) * 100px)",
        }}
      >
        <div className="relative h-[258px] w-[400px] [perspective:1500px]">
          {/* Bayangan di bawah amplop */}
          <div
            ref={shadowRef}
            className="env-under-shadow absolute bottom-[-24px] left-[7%] right-[7%] z-0 h-[32px] opacity-40"
          />

          {/* Panel belakang */}
          <div
            className="absolute inset-0 z-[1] rounded-[5px]"
            style={{ background: ENV_BACK }}
          />

          {/* Surat di dalam amplop */}
          <div
            ref={letterRef}
            className="absolute left-[15px] right-[15px] top-[22px] z-[2] h-[226px] rounded-[3px] px-[26px] pt-[30px] text-center text-[#22201C] shadow-[0_2px_10px_rgba(0,0,0,0.18)]"
            style={{ background: PAPER }}
          >
            <p className="mb-[14px] font-[family-name:var(--font-courier)] text-[10px] uppercase tracking-[0.26em] text-[#B23A2E]">
              Undangan Pernikahan
            </p>
            <p className="mb-[10px] font-[family-name:var(--font-cormorant)] text-[34px] font-light leading-[1.15]">
              {wedding.coupleShort}
            </p>
            <p className="font-[family-name:var(--font-courier)] text-[11px] tracking-[0.18em] text-[#6B6455]">
              {dateDots}
            </p>
          </div>

          {/* Muka amplop (kantong) + garis pos udara */}
          <div
            className="env-front-clip absolute inset-0 z-[3] rounded-[5px]"
            style={{ background: ENV_FRONT }}
          >
            <div className="env-airmail-stripe absolute bottom-[13px] left-[14px] right-[14px] h-[8px] opacity-90" />
          </div>

          {/* Nama tamu di muka amplop */}
          <div className="absolute bottom-[44px] left-[30px] z-[4] text-left text-[#6B6455]">
            <p className="mb-[3px] font-[family-name:var(--font-courier)] text-[10px] uppercase tracking-[0.16em]">
              Kepada Yth.
            </p>
            <p className="max-w-[225px] font-[family-name:var(--font-cormorant)] text-[26px] font-semibold leading-[1.2] text-[#22201C]">
              {guestName ?? GUEST_FALLBACK}
            </p>
            <p className="mt-[5px] font-[family-name:var(--font-courier)] text-[10px] tracking-[0.12em] opacity-75">
              di tempat
            </p>
          </div>

          {/* Perangko */}
          <div
            className="absolute right-[26px] top-[54px] z-[4] grid h-[70px] w-[56px] rotate-[4deg] place-items-center border-[3px] border-[#FBF7EE] shadow-[0_1px_4px_rgba(0,0,0,0.25)]"
            style={{ background: "linear-gradient(150deg, #D8E2DC, #BCCBC4)" }}
          >
            <b className="font-[family-name:var(--font-courier)] text-[23px] text-[#2A4A7B]">
              &amp;
            </b>
          </div>

          {/* Cap pos */}
          <div className="absolute right-[58px] top-[94px] z-[5] grid h-[68px] w-[68px] rotate-[-12deg] place-items-center rounded-full border-2 border-[#B23A2E] text-center font-[family-name:var(--font-courier)] text-[9px] tracking-[0.08em] text-[#B23A2E] opacity-40">
            <span>
              {dd}·{mm}
              <br />
              {yyyy}
            </span>
          </div>

          {/* Flap — rotateX membuka, lalu diturunkan ke belakang surat */}
          <div
            ref={flapRef}
            className="env-flap-clip absolute left-0 top-0 z-[6] h-[55%] w-full origin-[50%_0%] will-change-transform"
            style={{ background: ENV_FLAP }}
          />

          {/* Segel lilin */}
          <div
            ref={sealRef}
            className="absolute left-1/2 top-[112px] z-[7] ml-[-25px] grid h-[50px] w-[50px] place-items-center rounded-full font-[family-name:var(--font-courier)] text-[18px] font-bold text-[#F4D9C9]"
            style={{
              background: SEAL_GRADIENT,
              boxShadow:
                "0 2px 6px rgba(0,0,0,0.35), inset 0 0 0 2px rgba(244,217,201,0.28)",
            }}
          >
            U&amp;F
          </div>
        </div>
      </div>

      {/* Status memuat */}
      <div ref={statusBoxRef} className="mt-[62px] w-[min(280px,72vw)] text-center">
        <p
          ref={statusTextRef}
          role="status"
          aria-live="polite"
          className="mb-[12px] font-[family-name:var(--font-courier)] text-[11px] uppercase tracking-[0.2em] text-[#8FAFA6]"
        >
          Menyiapkan aset
        </p>
        <div className="h-[2px] w-full overflow-hidden rounded-[2px] bg-[rgba(240,233,218,0.18)]">
          <span
            ref={barFillRef}
            className="block h-full w-0"
            style={{ background: "linear-gradient(90deg, #B23A2E, #E6C77A)" }}
          />
        </div>
        <p
          ref={pctRef}
          className="mt-[10px] font-[family-name:var(--font-courier)] text-[11px] tracking-[0.14em] text-[#6E8C84]"
        >
          0%
        </p>
      </div>

      {/* Lembar penyambung — surat memuai jadi halaman (FLIP, transform saja) */}
      <div
        ref={coverRef}
        className="absolute inset-0 hidden origin-top-left"
        style={{ background: PAPER }}
      />
    </div>
  );
}
