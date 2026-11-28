/**
 * Format angka ke mata uang Rupiah (tanpa desimal).
 *
 * @param {number|string|null|undefined} value
 * @returns {string}
 */
export function formatRupiah(value) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);
}

/**
 * Format tanggal ke format Indonesia ringkas (contoh: 28 Nov 2026).
 *
 * @param {string|Date|null|undefined} value
 * @returns {string}
 */
export function formatDate(value) {
  if (!value) return '-';
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);

  return date.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

/**
 * Format tanggal dan waktu ke format Indonesia (contoh: 28 Nov 2026, 14.30).
 *
 * @param {string|Date|null|undefined} value
 * @returns {string}
 */
export function formatDateTime(value) {
  if (!value) return '-';
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);

  return date.toLocaleString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Hitung status stok obat berdasarkan stok total dan stok minimum.
 * Tidak pernah mengasumsikan data kosong sebagai 'Aman'.
 *
 * @param {object} obat
 * @returns {'Aman'|'Menipis'|'Habis'|'Tidak Diketahui'}
 */
export function getMedicineStockStatus(obat) {
  const rawStock = obat?.stok_total ?? obat?.stok;
  if (rawStock === null || rawStock === undefined || Number.isNaN(Number(rawStock))) {
    return 'Tidak Diketahui';
  }

  const stok = Number(rawStock);
  const minimum = Number(obat?.stok_minimum ?? 0);

  if (stok <= 0) {
    return 'Habis';
  }

  if (minimum > 0 && stok <= minimum) {
    return 'Menipis';
  }

  return 'Aman';
}

/**
 * Hitung status batch berdasarkan tanggal kedaluwarsa dan sisa stok.
 *
 * @param {object} batch
 * @returns {'Kedaluwarsa'|'Habis'|'Menipis'|'Aman'|'Tidak Diketahui'}
 */
export function getBatchStockStatus(batch) {
  if (!batch) return 'Tidak Diketahui';

  if (batch.expired_date) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const exp = new Date(batch.expired_date);
    if (!Number.isNaN(exp.getTime())) {
      exp.setHours(0, 0, 0, 0);
      if (exp < today) {
        return 'Kedaluwarsa';
      }
    }
  }

  const rawSisa = batch.jumlah_sisa;
  if (rawSisa === null || rawSisa === undefined || Number.isNaN(Number(rawSisa))) {
    return 'Tidak Diketahui';
  }

  const sisa = Number(rawSisa);
  const awal = Number(batch.jumlah_awal ?? 0);

  if (sisa <= 0) {
    return 'Habis';
  }

  if (awal > 0 && sisa <= awal / 2) {
    return 'Menipis';
  }

  return 'Aman';
}

/**
 * Kelas background baris tabel sesuai status stok (Part 11.2).
 *
 * @param {string} status
 * @returns {string}
 */
export function getStockRowClassName(status) {
  switch (status) {
    case 'Menipis':
      return 'bg-amber-50/80 hover:bg-amber-100/70';
    case 'Habis':
      return 'bg-red-50/80 hover:bg-red-100/70';
    case 'Kedaluwarsa':
      return 'bg-orange-50/80 hover:bg-orange-100/70';
    case 'Aman':
    default:
      return 'bg-white hover:bg-mediva-page/60';
  }
}
