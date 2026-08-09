import { create } from "zustand";

type OnboardingState = {
  /** Apakah undangan sudah dibuka oleh tamu. */
  opened: boolean;
  /**
   * Apakah loader amplop sudah selesai. Selama false, animasi CSS layar
   * onboarding dijeda agar tidak berebut main thread dengan animasi amplop.
   */
  loaderDone: boolean;
  /** Nama tamu (biasanya dari query param ?to=). */
  guestName: string | null;
  /**
   * Lagu pengiring pilihan tamu (`id` dari `wedding.tracks`). `null` = belum
   * memilih — selama itu loader amplop menahan diri tidak membuka.
   * Ini satu-satunya sumber kebenaran lagu: loader memakainya untuk mengunduh
   * lagu yang benar, `page.tsx` memakainya sebagai `src` elemen <audio>.
   */
  trackId: string | null;
  open: () => void;
  finishLoader: () => void;
  setGuestName: (name: string | null) => void;
  setTrack: (id: string) => void;
};

export const useOnboardingStore = create<OnboardingState>((set) => ({
  opened: false,
  loaderDone: false,
  guestName: null,
  trackId: null,
  open: () => set({ opened: true }),
  finishLoader: () => set({ loaderDone: true }),
  setGuestName: (name) => set({ guestName: name }),
  setTrack: (id) => set({ trackId: id }),
}));
