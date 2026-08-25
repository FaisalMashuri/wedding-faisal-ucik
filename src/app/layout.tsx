import type { Metadata, Viewport } from "next";
import {
  Alice,
  Montserrat,
  Beau_Rivage,
  Alike_Angular,
  Courier_Prime,
  Cormorant_Garamond,
} from "next/font/google";
import localFont from "next/font/local";
import { Analytics } from "@vercel/analytics/next";
import { wedding } from "@/config/wedding";
import "./globals.css";

// Montserrat Subrayada (underline bawaan) — dari file lokal
const montserratSubrayada = localFont({
  variable: "--font-montserrat-subrayada",
  src: [
    {
      path: "../fonts/MontserratSubrayada-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/MontserratSubrayada-Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
});

// Serif — untuk heading
const alice = Alice({
  variable: "--font-alice",
  subsets: ["latin"],
  weight: "400",
});

// Sans — untuk body / UI
const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

// Script — untuk aksen (nama pasangan, dsb.)
const beauRivage = Beau_Rivage({
  variable: "--font-beau-rivage",
  subsets: ["latin"],
  weight: "400",
});

// Serif angka — untuk countdown counter
const alikeAngular = Alike_Angular({
  variable: "--font-alike",
  subsets: ["latin"],
  weight: "400",
});

// Mono typewriter — untuk loader amplop (gaya pos udara vintage)
const courierPrime = Courier_Prime({
  variable: "--font-courier",
  subsets: ["latin"],
  weight: ["400", "700"],
});

// Display serif — untuk nama di loader amplop
const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const siteTitle = `The Wedding Of ${wedding.coupleShort}`;
const siteDescription =
  `Undangan Pernikahan ${wedding.coupleShort}. Simak detail acara, lokasi, ` +
  `waktu, dan kisah cinta kami. Mohon doa restu serta kehadiran Anda di hari ` +
  `bahagia kami.`;

export const metadata: Metadata = {
  /**
   * WAJIB ada begitu metadata memakai path relatif (og:image di bawah lewat
   * konvensi file `opengraph-image.png`): di Next 16 path relatif tanpa
   * metadataBase itu error saat build, bukan sekadar peringatan. Scraper
   * WhatsApp/Facebook juga hanya mau URL absolut.
   *
   * Selalu tunjuk URL produksi, termasuk saat deploy preview — kartu preview
   * yang tersebar di WhatsApp harus menunjuk ke domain yang benar.
   */
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://wedding-faisal-ucik.vercel.app"
  ),
  title: siteTitle,
  description: siteDescription,
  /**
   * Kartu preview saat tautan disebar (WhatsApp, Telegram, dsb.).
   *
   * Gambarnya diambil otomatis dari `src/app/opengraph-image.png` — konvensi
   * file Next, yang sekaligus memancarkan og:image:width/height/type. File itu
   * PNG dan BUKAN WebP karena dua alasan: konvensi ini cuma menerima
   * jpg/jpeg/png/gif, dan scraper WhatsApp kerap gagal merender WebP.
   * Latarnya juga sudah di-flatten ke cream — icon.png aslinya transparan, dan
   * transparansi biasanya jadi kotak hitam di kartu preview.
   *
   * Tanpa blok ini halaman tidak memancarkan og:* sama sekali; yang muncul di
   * iPhone selama ini cuma apple-icon.png, hasil fallback khas iOS yang tidak
   * dimiliki WhatsApp Android maupun WhatsApp Web.
   */
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "/",
    siteName: siteTitle,
    title: siteTitle,
    description: siteDescription,
  },
  formatDetection: {
    telephone: false,
    address: false,
    email: false,
  },
};

// Kunci rendering ke ukuran perangkat mobile
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${alice.variable} ${montserrat.variable} ${beauRivage.variable} ${montserratSubrayada.variable} ${alikeAngular.variable} ${courierPrime.variable} ${cormorantGaramond.variable} h-full antialiased`}
    >
      <body
        className="min-h-full flex justify-center"
        style={{
          background:
            "radial-gradient(130% 90% at 50% -10%, #4a7883 0%, #2c515b 42%, #16292f 100%)",
        }}
      >
        {/* Shell mobile-first: undangan selalu selebar layar HP, terpusat di desktop */}
        <div className="relative flex h-dvh w-full max-w-[480px] flex-col overflow-hidden bg-cream shadow-2xl ring-1 ring-white/10">
          {children}
        </div>
        <Analytics />
      </body>
    </html>
  );
}
