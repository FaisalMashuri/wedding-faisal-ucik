// Data undangan terpusat — dipakai di semua section.
export const wedding = {
  groom: "Faisal",
  bride: "Ucik",
  coupleShort: "Ucik & Faisal",
  // Inisial pasangan (ditampilkan di hero)
  initials: "F & U",
  // Tanggal acara (dipakai countdown)
  dateLong: "Sabtu, 05 September 2026",
  dateISO: "2026-09-05T07:00:00+07:00",
  // Kutipan di hero
  quote:
    "And one of His signs is that He created for you spouses from among yourselves so that you may find comfort in them. And He has placed between you compassion and mercy. Surely in this are signs for people who reflect.",
  quoteSource: "QS. Ar-Rum ayat 21",

  // Perkenalan mempelai (Event section)
  couple: {
    bride: {
      name: "Ucik Faruqo Heni",
      relation: "The daughter of",
      parents: "Bp. Muh Romin and Ibu Siti Rodhiyah",
      ig: "ufh_22",
    },
    groom: {
      name: "Faisal Mashuri",
      relation: "The son of",
      parents: "Bp. Abdul Syukur and Ibu Untung Rahayu S. (Almh)",
      ig: "-",
    },
  },

  // Save the date (Couple section)
  saveTheDate: { day: "Sat", date: "05", month: "Sept", year: "2026" },

  // Jadwal acara (Event section — 2 kartu)
  schedule: [
    {
      title: "Akad Nikah",
      time: "07.00 a.m",
      location: "Balai Desa Tamanrejo - Limbangan - Kendal - Jateng",
    },
    {
      title: "Reception",
      time: "09.30 a.m - 12.00 p.m",
      location: "Balai Desa Tamanrejo - Limbangan - Kendal - Jateng",
    },
  ],
  // Link tombol Google Map
  mapUrl:
    "https://www.google.com/maps/search/?api=1&query=Balai+Desa+Tamanrejo+Limbangan+Kendal",

  // Timeline (node "Engagement" sudah tercetak di bg-timeline.png).
  timelineTitle: "The Path\nWe Walked Together",
  // top = posisi vertikal (%), photoSide = sisi foto (teks di sisi berlawanan).
  // Ganti path foto di `photos` (2 foto per milestone) dengan foto asli.
  timeline: [
    {
      title: "Introduction session : 2021",
      place: "kampus merdeka by Kemendikbudristek",
      top: 28,
      photoSide: "left",
      photos: ["/images/bg-onboard.png", "/images/bg-onboard.png"],
    },
    {
      // Engagement: teks tercetak di gambar, hanya foto yang dioverlay
      title: null,
      place: null,
      top: 55,
      photoSide: "right",
      photos: ["/images/bg-onboard.png", "/images/bg-onboard.png"],
    },
    {
      title: "Wedding : 05 Sept 2026",
      place: "Balai Desa Tamanrejo, Limbangan, Kendal",
      top: 80,
      photoSide: "left",
      photos: ["/images/bg-onboard.png", "/images/bg-onboard.png"],
    },
  ],

  // Penutup (Outro section) — disclaimer amplop tercetak di bg-outro.png.
  outro: {
    couple: "Ucik & Faisal",
    message:
      "Suatu kebahagiaan dan kehormatan bagi kami, apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu kepada kami.",
  },
} as const;
