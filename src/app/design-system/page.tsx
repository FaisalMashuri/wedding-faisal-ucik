import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Design System",
};

const colors = [
  { name: "primary", hex: "#D6CC89", cls: "bg-primary", text: "text-on-primary" },
  { name: "primary-light", hex: "#E7E0B6", cls: "bg-primary-light", text: "text-on-primary" },
  { name: "primary-dark", hex: "#B8AC5F", cls: "bg-primary-dark", text: "text-on-primary" },
  { name: "secondary", hex: "#3C6874", cls: "bg-secondary", text: "text-on-secondary" },
  { name: "secondary-light", hex: "#5A8894", cls: "bg-secondary-light", text: "text-on-secondary" },
  { name: "secondary-dark", hex: "#294A53", cls: "bg-secondary-dark", text: "text-on-secondary" },
  { name: "cream", hex: "#F7F4EA", cls: "bg-cream", text: "text-ink" },
  { name: "ink", hex: "#2A2E2E", cls: "bg-ink", text: "text-cream" },
];

export default function DesignSystemPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <p className="font-script text-5xl text-secondary">Design System</p>
      <p className="mt-2 font-sans text-sm text-muted">
        Wedding — palette &amp; typography tokens
      </p>

      {/* Warna */}
      <h2 className="mt-12 font-serif text-2xl text-ink">Colors</h2>
      <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {colors.map((c) => (
          <div
            key={c.name}
            className={`${c.cls} ${c.text} flex h-28 flex-col justify-end rounded-xl border border-black/5 p-3`}
          >
            <span className="font-sans text-xs font-medium">{c.name}</span>
            <span className="font-sans text-[11px] opacity-70">{c.hex}</span>
          </div>
        ))}
      </div>

      {/* Tipografi */}
      <h2 className="mt-12 font-serif text-2xl text-ink">Typography</h2>
      <div className="mt-4 space-y-6">
        <div>
          <p className="font-sans text-xs uppercase tracking-widest text-muted">
            font-script · Beau Rivage
          </p>
          <p className="font-script text-5xl text-secondary">Faisal &amp; Pasangan</p>
        </div>
        <div>
          <p className="font-sans text-xs uppercase tracking-widest text-muted">
            font-serif · Alice
          </p>
          <p className="font-serif text-3xl text-ink">The Wedding Of</p>
        </div>
        <div>
          <p className="font-sans text-xs uppercase tracking-widest text-muted">
            font-sans · Montserrat
          </p>
          <p className="font-sans text-base text-ink">
            Dengan memohon rahmat dan ridho Allah SWT, kami mengundang
            Bapak/Ibu/Saudara/i untuk hadir di acara pernikahan kami.
          </p>
        </div>
      </div>

      {/* Buttons */}
      <h2 className="mt-12 font-serif text-2xl text-ink">Buttons</h2>
      <div className="mt-4 flex flex-wrap gap-3">
        <button className="rounded-full bg-primary px-6 py-3 font-sans text-sm font-medium text-on-primary transition hover:bg-primary-dark">
          Primary
        </button>
        <button className="rounded-full bg-secondary px-6 py-3 font-sans text-sm font-medium text-on-secondary transition hover:bg-secondary-dark">
          Secondary
        </button>
        <button className="rounded-full border border-secondary px-6 py-3 font-sans text-sm font-medium text-secondary transition hover:bg-secondary hover:text-on-secondary">
          Outline
        </button>
      </div>
    </main>
  );
}
