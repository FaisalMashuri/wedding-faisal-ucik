import type { Metadata, Viewport } from "next";
import { Alice, Montserrat, Beau_Rivage, Alike_Angular } from "next/font/google";
import localFont from "next/font/local";
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

export const metadata: Metadata = {
  title: "The Wedding Of",
  description: "Undangan pernikahan",
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
      className={`${alice.variable} ${montserrat.variable} ${beauRivage.variable} ${montserratSubrayada.variable} ${alikeAngular.variable} h-full antialiased`}
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
      </body>
    </html>
  );
}
