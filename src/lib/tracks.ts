import { wedding } from "@/config/wedding";

export type Track = (typeof wedding.tracks)[number];

/**
 * Lagu default: entri pertama di `wedding.tracks`. Dipakai hanya untuk tamu
 * ber-`prefers-reduced-motion` — jalur itu melewati loader seketika sehingga
 * popup pemilihan tidak sempat tampil. Tamu lain SELALU memilih sendiri.
 */
export const DEFAULT_TRACK: Track = wedding.tracks[0];

/** Cari lagu dari id yang tersimpan di store. `null` kalau belum memilih. */
export function findTrack(id: string | null): Track | null {
  if (!id) return null;
  return wedding.tracks.find((t) => t.id === id) ?? null;
}
