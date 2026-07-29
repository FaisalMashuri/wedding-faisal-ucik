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

  // Timeline — layout mengikuti frame Figma 1080×2921 (bg-timeline-2.webp).
  // top = posisi vertikal milestone (% tinggi section).
  // Ganti path foto di `photos` (2 foto per milestone) dengan foto asli.
  timelineTitle: "The Path\nWe Walked Together",
  timeline: [
    {
      title: "Introduction session : 2021",
      place: "Kampus merdeka by Kemendikbudristek",
      top: 13,
      photos: ["/images/bg-onboard.webp", "/images/bg-onboard.webp"],
    },
    {
      title: "Engagement : 15 May 2026",
      place: "Kopi Kebun Jatisari Semarang",
      top: 41.5,
      photos: ["/images/bg-onboard.webp", "/images/bg-onboard.webp"],
    },
    {
      title: "Wedding : 05 Sept 2026",
      place: "Balai Desa Tamanrejo, Limbangan, Kendal",
      top: 68.5,
      photos: ["/images/bg-onboard.webp", "/images/bg-onboard.webp"],
    },
  ],

  // Penutup (Outro section). Background bg-outro-fix.webp bersih tanpa teks;
  // disclaimer dirender sebagai teks HTML (gampang diedit di sini).
  outro: {
    couple: "Ucik & Faisal",
    message:
      "Suatu kebahagiaan dan kehormatan bagi kami, apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu kepada kami.",
    disclaimer:
      "** Tanpa mengurangi rasa hormat, kami menginformasikan bahwa kami tidak menerima amplop ataupun tanda kasih. Doa restu Anda adalah hadiah terindah bagi kami",
  },
} as const;
