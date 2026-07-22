/**
 * Ukuran fluid: skala dengan lebar viewport, bukan angka px tetap.
 * `px480` = nilai target pas lebar shell 480px (nilai yang biasa kita pakai
 * sekarang). Di bawah 480px nilainya menyusut proporsional (vw), di atas
 * 480px dia berhenti di `px480` (shell memang di-cap max-w-[480px]).
 * `minRatio` = batas bawah di layar sangat sempit, biar tidak terlalu mepet.
 */
export function fluid(px480: number, minRatio = 0.78): string {
  const vw = (px480 / 480) * 100;
  const min = px480 * minRatio;
  return `clamp(${round(min)}px, ${round(vw, 3)}vw, ${round(px480)}px)`;
}

function round(n: number, digits = 1) {
  const f = 10 ** digits;
  return Math.round(n * f) / f;
}
