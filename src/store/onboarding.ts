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
  open: () => void;
  finishLoader: () => void;
  setGuestName: (name: string | null) => void;
};

export const useOnboardingStore = create<OnboardingState>((set) => ({
  opened: false,
  loaderDone: false,
  guestName: null,
  open: () => set({ opened: true }),
  finishLoader: () => set({ loaderDone: true }),
  setGuestName: (name) => set({ guestName: name }),
}));
