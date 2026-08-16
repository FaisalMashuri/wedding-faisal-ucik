"use client";

import { useEffect } from "react";

/**
 * Menahan menu klik-kanan (termasuk entri "Inspect element") dan pintasan
 * devtools di halaman undangan. Aktif di dev maupun produksi.
 *
 * PENTING — ini bukan pengamanan. Menutup menu kanan memang menghapus jalur
 * "Inspect element", tapi devtools tetap bisa dibuka dari menu browser,
 * `view-source:` tetap jalan, di Firefox Shift+klik-kanan sengaja menembus
 * handler halaman, dan begitu JavaScript dimatikan guard ini hilang sama
 * sekali. Semua gambar juga tetap bisa diambil dari folder public. Fungsinya
 * sebatas menahan tamu yang iseng klik kanan lalu "Save image as".
 *
 * PINTU DARURAT — buka `?inspect=1` sekali untuk mematikan guard di perangkat
 * ini (disimpan di localStorage, bertahan antar kunjungan), `?inspect=0` untuk
 * menyalakannya lagi. Tanpa ini kita ikut terkunci saat menggarap situsnya.
 */
const BYPASS_KEY = "wedding:inspect";

/** Field yang menu kanannya TIDAK diblokir — tamu perlu tempel & koreksi ejaan. */
const EDITABLE = /^(input|textarea|select)$/i;

function isEditable(el: EventTarget | null) {
  const node = el as HTMLElement | null;
  return !!node && (EDITABLE.test(node.tagName) || node.isContentEditable);
}

/** Baca (dan perbarui) status pintu darurat dari query param + localStorage. */
function bypassEnabled() {
  try {
    const q = new URLSearchParams(window.location.search).get("inspect");
    if (q === "1") localStorage.setItem(BYPASS_KEY, "1");
    if (q === "0") localStorage.removeItem(BYPASS_KEY);
    return localStorage.getItem(BYPASS_KEY) === "1";
    // Mode penyamaran memblokir localStorage — anggap saja guard menyala.
  } catch {
    return false;
  }
}

export function ContentGuard() {
  useEffect(() => {
    if (bypassEnabled()) return;

    // Di ponsel, padanan klik kanan adalah tahan-lama — dan itu juga memicu
    // event contextmenu, jadi tertangani di sini. iOS Safari perlu tambahan
    // `-webkit-touch-callout` di globals.css.
    const onContextMenu = (e: MouseEvent) => {
      if (isEditable(e.target)) return;
      e.preventDefault();
    };

    const onKeyDown = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      const inspect = k === "i" || k === "j" || k === "c";
      const blocked =
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && inspect) || // Windows/Linux
        (e.metaKey && e.altKey && (inspect || k === "u")) || // macOS
        (e.ctrlKey && k === "u"); // lihat sumber halaman
      if (blocked) e.preventDefault();
    };

    document.addEventListener("contextmenu", onContextMenu);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("contextmenu", onContextMenu);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  return null;
}
