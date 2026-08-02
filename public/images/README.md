# Images

Semua background di-serve sebagai WebP. File mentah (PNG full-res) disimpan di
`originals/` — folder itu gitignored, jadi tidak ikut ter-commit maupun ter-deploy.

| File | Dipakai di |
| --- | --- |
| `bg-onboard.webp` | layar onboarding — `src/app/page.tsx`, di-preload `EnvelopeLoader` |
| `bg-hero.webp` | `HeroSection` |
| `bg-couple.webp` | `CoupleSection` |
| `bg-save-the-date.webp` | `EventSection` |
| `bg-timeline-3.webp` | `TimelineSection` |
| `bg-rsvp.webp` | `RsvpSection` |
| `bg-outro-fix.webp` | `OutroSection` |
| `row-N.1.webp` / `row-N.2.webp` | foto polaroid timeline, N = urutan milestone |

Ikon situs (favicon, icon, apple-icon) TIDAK di sini — Next.js memakai file
convention di `src/app/`.

Cara mengonversi file baru (sharp sudah tersedia lewat dependensi Next):

```bash
node -e "require('sharp')('sumber.png').resize({width:1080}).webp({quality:86,effort:6}).toFile('public/images/hasil.webp')"
```
