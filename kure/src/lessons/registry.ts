import type { DersModulu } from './types'

import { turevModulu } from './matematik/turev'
import { integralModulu } from './matematik/integral'
import { donelCisimModulu } from './matematik/donel-cisim'
import { birimCemberModulu } from './matematik/birim-cember'
import { pisagorModulu } from './matematik/pisagor'
import { kesirlerModulu } from './matematik/kesirler'
import { fonksiyonGrafikModulu } from './matematik/fonksiyon-grafik'
import { geometrikCisimlerModulu } from './matematik/geometrik-cisimler'

import { egikAtisModulu } from './fizik/egik-atis'
import { sarkacModulu } from './fizik/sarkac'
import { egikDuzlemModulu } from './fizik/egik-duzlem'
import { elektrikAlanModulu } from './fizik/elektrik-alan'
import { mercekModulu } from './fizik/mercek'

import { atomModeliModulu } from './kimya/atom-modeli'
import { molekulGeometriModulu } from './kimya/molekul-geometri'
import { periyodikSistemModulu } from './kimya/periyodik-sistem'

import { hucreModulu } from './biyoloji/hucre'
import { kalpModulu } from './biyoloji/kalp'
import { noronModulu } from './biyoloji/noron'
import { dnaModulu } from './biyoloji/dna'
import { iskeletModulu } from './biyoloji/iskelet'

import { gunesSistemiModulu } from './fen/gunes-sistemi'
import { mevsimlerModulu } from './fen/mevsimler'

/** Tüm 3B ders modülleri. Anahtar, müfredattaki `konu.sahne` değeridir. */
export const MODULLER: DersModulu[] = [
  turevModulu,
  integralModulu,
  donelCisimModulu,
  birimCemberModulu,
  fonksiyonGrafikModulu,
  pisagorModulu,
  geometrikCisimlerModulu,
  kesirlerModulu,
  egikAtisModulu,
  sarkacModulu,
  egikDuzlemModulu,
  elektrikAlanModulu,
  mercekModulu,
  atomModeliModulu,
  molekulGeometriModulu,
  periyodikSistemModulu,
  hucreModulu,
  kalpModulu,
  noronModulu,
  dnaModulu,
  iskeletModulu,
  gunesSistemiModulu,
  mevsimlerModulu,
]

const HARITA = new Map(MODULLER.map((m) => [m.id, m]))

export function modulBul(id?: string): DersModulu | undefined {
  return id ? HARITA.get(id) : undefined
}

export function modulVarMi(id?: string): boolean {
  return !!id && HARITA.has(id)
}
