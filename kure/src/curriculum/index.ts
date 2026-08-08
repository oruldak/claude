import type { Ders, Kademe, Konu, SinifProgrami, Unite } from '../lib/types'
import { KADEME_SINIFLARI, slug } from '../lib/types'
import { matematik } from './matematik'
import { fenBilimleri } from './fen'
import { fizik } from './fizik'
import { kimya } from './kimya'
import { biyoloji } from './biyoloji'
import {
  cografya,
  edebiyat,
  hayatBilgisi,
  ingilizce,
  sosyalBilgiler,
  tarih,
  turkce,
} from './diger'

/** Platformdaki tüm dersler. Sıra, arayüzdeki gösterim sırasıdır. */
export const DERSLER: Ders[] = [
  matematik,
  fenBilimleri,
  fizik,
  kimya,
  biyoloji,
  turkce,
  hayatBilgisi,
  sosyalBilgiler,
  edebiyat,
  tarih,
  cografya,
  ingilizce,
]

export function dersBul(kod: string): Ders | undefined {
  return DERSLER.find((d) => d.kod === kod)
}

export function sinifProgrami(ders: Ders, sinif: number): SinifProgrami | undefined {
  return ders.siniflar.find((s) => s.sinif === sinif)
}

/** Bir kademede fiilen programı bulunan dersler. */
export function kademeDersleri(kademe: Kademe): Ders[] {
  const siniflar = KADEME_SINIFLARI[kademe]
  return DERSLER.filter(
    (d) => d.kademeler.includes(kademe) && d.siniflar.some((s) => siniflar.includes(s.sinif)),
  )
}

export function dersSiniflari(ders: Ders, kademe?: Kademe): number[] {
  const izin = kademe ? KADEME_SINIFLARI[kademe] : null
  return ders.siniflar
    .map((s) => s.sinif)
    .filter((s) => !izin || izin.includes(s))
    .sort((a, b) => a - b)
}

export interface KonuKonumu {
  ders: Ders
  sinif: number
  unite: Unite
  konu: Konu
}

/** Tüm müfredattaki konuları düz liste hâlinde dolaşır. */
export function* tumKonular(): Generator<KonuKonumu> {
  for (const ders of DERSLER) {
    for (const sp of ders.siniflar) {
      for (const unite of sp.uniteler) {
        for (const konu of unite.konular) {
          yield { ders, sinif: sp.sinif, unite, konu }
        }
      }
    }
  }
}

/** Belirli bir 3B sahneyi kullanan tüm konular. */
export function sahneKonulari(sahneId: string): KonuKonumu[] {
  return [...tumKonular()].filter((k) => k.konu.sahne === sahneId)
}

export function konuBul(
  dersKod: string,
  sinif: number,
  konuId: string,
): KonuKonumu | undefined {
  const ders = dersBul(dersKod)
  if (!ders) return undefined
  const sp = sinifProgrami(ders, sinif)
  if (!sp) return undefined
  for (const unite of sp.uniteler) {
    const konu = unite.konular.find((k) => k.id === konuId)
    if (konu) return { ders, sinif, unite, konu }
  }
  return undefined
}

/** Türkçe karakterlere duyarsız basit arama. */
export function ara(sorgu: string, limit = 40): KonuKonumu[] {
  const q = slug(sorgu)
  if (q.length < 2) return []
  const parcalar = q.split('-').filter(Boolean)
  const sonuc: { skor: number; konum: KonuKonumu }[] = []

  for (const konum of tumKonular()) {
    const metin = slug(
      `${konum.konu.ad} ${konum.unite.ad} ${konum.ders.ad} ${konum.konu.kazanimlar.join(' ')}`,
    )
    let skor = 0
    for (const p of parcalar) {
      if (!metin.includes(p)) {
        skor = -1
        break
      }
      skor += slug(konum.konu.ad).includes(p) ? 3 : 1
    }
    if (skor > 0) {
      if (konum.konu.sahne) skor += 2
      sonuc.push({ skor, konum })
    }
  }
  return sonuc
    .sort((a, b) => b.skor - a.skor)
    .slice(0, limit)
    .map((s) => s.konum)
}

/** Müfredat istatistikleri — ana sayfada gösterilir. */
export function istatistikler() {
  let konu = 0
  let kazanim = 0
  const sahneler = new Set<string>()
  for (const k of tumKonular()) {
    konu++
    kazanim += k.konu.kazanimlar.length
    if (k.konu.sahne) sahneler.add(k.konu.sahne)
  }
  return { ders: DERSLER.length, konu, kazanim, sahne: sahneler.size }
}

export { matematik, fenBilimleri, fizik, kimya, biyoloji }
