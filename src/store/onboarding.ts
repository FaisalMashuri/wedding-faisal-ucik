import { create } from "zustand";

type OnboardingState = {
  /** Apakah undangan sudah dibuka oleh tamu. */
  opened: boolean;
  /** Nama tamu (biasanya dari query param ?to=). */
  guestName: string | null;
  open: () => void;
  setGuestName: (name: string | null) => void;
};

export const useOnboardingStore = create<OnboardingState>((set) => ({
  opened: false,
  guestName: null,
  open: () => set({ opened: true }),
  setGuestName: (name) => set({ guestName: name }),
}));
