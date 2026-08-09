// Data undangan terpusat — dipakai di semua section.
export const wedding = {
  groom: "Faisal",
  bride: "Ucik",
  coupleShort: "Ucik & Faisal",
  // Inisial pasangan (ditampilkan di hero)
  initials: "U & F",
  // Tanggal acara (dipakai countdown)
  dateLong: "Sabtu, 05 September 2026",
  dateISO: "2026-09-05T07:00:00+07:00",
  // Kutipan di hero
  quote:
    "And one of His signs is that He created for you spouses from among yourselves so that you may find comfort in them. And He has placed between you compassion and mercy. Surely in this are signs for people who reflect.",
  quoteSource: "QS. Ar-Rum ayat 21",

  // Pilihan backsound — ditawarkan ke tamu lewat popup di layar loader.
  // Urutan di sini = urutan di popup, dan entri PERTAMA dipakai sebagai
  // default untuk tamu ber-`prefers-reduced-motion` (loader dilewati seketika
  // jadi popup tidak sempat tampil).
  // Tambah/hapus lagu cukup di sini — file taruh di public/audio/.
  tracks: [
    {
      id: "perfect-violin",
      title: "Perfect",
      by: "Ed Sheeran · Violin cover",
      src: "/audio/perfect-violin.mp3",
    },
    {
      id: "perfect-sax",
      title: "Perfect",
      by: "Ed Sheeran · Saxophone cover",
      src: "/audio/perfect-sax.mp3",
    },
    {
      id: "cant-help-falling-violin",
      title: "Can't Help Falling In Love",
      by: "Elvis Presley · Violin cover",
      src: "/audio/cant-help-falling-violin.mp3",
    },
    {
      id: "cant-help-falling-sax",
      title: "Can't Help Falling In Love",
      by: "Elvis Presley · Saxophone cover",
      src: "/audio/cant-help-falling-sax.mp3",
    },
    {
      id: "until-i-found-you-violin",
      title: "Until I Found You",
      by: "Stephen Sanchez · Violin cover",
      src: "/audio/until-i-found-you-violin.mp3",
    },
    // TODO: tiga file di bawah asalnya `videoplayback*.m4a` — tidak punya tag
    // judul sama sekali. Ganti `title`/`by`-nya kalau sudah tahu lagunya
    // (cukup di sini, komponen tidak perlu disentuh).
    {
      id: "instrumental-1",
      title: "Instrumental 1",
      by: "Belum berjudul",
      src: "/audio/instrumental-1.m4a",
    },
    {
      id: "instrumental-2",
      title: "Instrumental 2",
      by: "Belum berjudul",
      src: "/audio/instrumental-2.m4a",
    },
    {
      id: "instrumental-3",
      title: "Instrumental 3",
      by: "Belum berjudul",
      src: "/audio/instrumental-3.m4a",
    },
  ],

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

  // Timeline — layout mengikuti frame Figma 1080×2921 (bg-timeline-3.webp).
  // top = posisi vertikal milestone (% tinggi section).
  // Ganti path foto di `photos` (2 foto per milestone) dengan foto asli.
  timelineTitle: "The Path\nWe Walked Together",
  timeline: [
    {
      title: "Introduction session : 2021",
      place: "Kampus merdeka by Kemendikbudristek",
      top: 13,
      photos: ["/images/row-1.1.webp", "/images/row-1.2.webp"],
    },
    {
      title: "Engagement : 15 May 2026",
      place: "Kopi Kebun Jatisari Semarang",
      top: 41.5,
      photos: ["/images/row-2.1.webp", "/images/row-2.2.webp"],
    },
    {
      title: "Wedding : 05 Sept 2026",
      place: "Balai Desa Tamanrejo, Limbangan, Kendal",
      top: 68.5,
      photos: ["/images/row-3.1.webp", "/images/row-3.2.webp"],
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
