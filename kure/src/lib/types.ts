/**
 * Müfredat veri modeli.
 *
 * Hiyerarşi:  Kademe → Ders → Sınıf → Ünite/Tema → Konu → Kazanım
 * Her konu, isteğe bağlı olarak bir 3B ders modülüne (`sahne`) bağlanır.
 */

export type Kademe = 'ilkokul' | 'ortaokul' | 'lise'

export interface Konu {
  /** Slug — URL'de ve ilerleme kaydında kullanılır */
  id: string
  ad: string
  /** MEB kazanım cümleleri (sadeleştirilmiş) */
  kazanimlar: string[]
  /** Varsa bağlı 3B/animasyonlu ders modülünün kimliği */
  sahne?: string
}

export interface Unite {
  id: string
  ad: string
  /** Programda önerilen ders saati */
  sure?: number
  konular: Konu[]
}

export interface SinifProgrami {
  sinif: number
  uniteler: Unite[]
}

export interface Ders {
  kod: string
  ad: string
  kademeler: Kademe[]
  /** Tailwind uyumlu vurgu rengi (hex) */
  renk: string
  ikon: string
  ozet: string
  siniflar: SinifProgrami[]
}

export const KADEME_ADI: Record<Kademe, string> = {
  ilkokul: 'İlkokul',
  ortaokul: 'Ortaokul',
  lise: 'Lise',
}

export const KADEME_SINIFLARI: Record<Kademe, number[]> = {
  ilkokul: [1, 2, 3, 4],
  ortaokul: [5, 6, 7, 8],
  lise: [9, 10, 11, 12],
}

export function sinifKademesi(sinif: number): Kademe {
  if (sinif <= 4) return 'ilkokul'
  if (sinif <= 8) return 'ortaokul'
  return 'lise'
}

/* ---------------------------------------------------------------- *
 *  Müfredat yazımını kısaltan yardımcılar
 * ---------------------------------------------------------------- */

export function slug(metin: string): string {
  const harita: Record<string, string> = {
    ç: 'c', Ç: 'c', ğ: 'g', Ğ: 'g', ı: 'i', İ: 'i',
    ö: 'o', Ö: 'o', ş: 's', Ş: 's', ü: 'u', Ü: 'u',
  }
  return metin
    .replace(/[çÇğĞıİöÖşŞüÜ]/g, (h) => harita[h] ?? h)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)
}

/** Konu tanımı için kısa yazım: [ad, kazanımlar, sahneId?] */
export type KonuGirdi = [ad: string, kazanimlar: string[], sahne?: string]

export function U(ad: string, konular: KonuGirdi[], sure?: number): Unite {
  return {
    id: slug(ad),
    ad,
    sure,
    konular: konular.map(([kad, kazanimlar, sahne]) => ({
      id: slug(kad),
      ad: kad,
      kazanimlar,
      sahne,
    })),
  }
}

export function S(sinif: number, uniteler: Unite[]): SinifProgrami {
  return { sinif, uniteler }
}
