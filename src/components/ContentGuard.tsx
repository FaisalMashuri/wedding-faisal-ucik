"use client";

import { useEffect } from "react";

/**
 * Menahan menu klik-kanan dan pintasan devtools di halaman undangan.
 *
 * PENTING — ini bukan pengamanan. Devtools tetap bisa dibuka lewat menu
 * browser, `view-source:` tetap jalan, dan begitu JavaScript dimatikan guard
 * ini ikut hilang. Semua gambar juga tetap bisa diambil dari folder public.
 * Fungsinya sebatas menahan tamu yang iseng klik kanan lalu "Save image as".
 *
 * Sengaja hanya aktif di build produksi: kalau menyala saat `npm run dev`,
 * kita sendiri tidak bisa membuka devtools untuk mengerjakan situs ini.
 * Hapus penjagaan NODE_ENV di bawah kalau memang mau aktif juga di dev.
 */

/** Field yang menu kanannya TIDAK diblokir — tamu perlu tempel & koreksi ejaan. */
const EDITABLE = /^(input|textarea|select)$/i;

function isEditable(el: EventTarget | null) {
  const node = el as HTMLElement | null;
  return !!node && (EDITABLE.test(node.tagName) || node.isContentEditable);
}

export function ContentGuard() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;

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
