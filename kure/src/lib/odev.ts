import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { BANKA, dogruMu, soruBul } from '../soru/banka'

export interface Odev {
  id: string
  baslik: string
  ders: string
  sinif: number
  ogretmen: string
  /** ISO tarih */
  sonTarih: string
  aciklama: string
  soruIdler: string[]
}

export interface OdevSonucu {
  cevaplar: Record<string, string>
  teslim: boolean
  puan: number
  tarih: number
  /** Kaç kez denendi */
  deneme: number
}

/** Okul sunucusu gelene kadar örnek ödevler burada tanımlıdır. */
const HAZIR_ODEVLER: Odev[] = [
  {
    id: 'od-mat-12-1',
    baslik: 'Türev ve İntegral — Hafta 1',
    ders: 'matematik',
    sinif: 12,
    ogretmen: 'Matematik Zümresi',
    sonTarih: '2026-09-19',
    aciklama:
      'Türevin geometrik anlamı ve belirli integral. Yanlış yaptığın soruların çözümünü adım adım inceleyip ilgili 3B derse dön.',
    soruIdler: ['mat-tur-1', 'mat-tur-2', 'mat-int-1', 'mat-int-2'],
  },
  {
    id: 'od-fiz-11-1',
    baslik: 'Kuvvet ve Hareket — Atışlar ve Eğik Düzlem',
    ders: 'fizik',
    sinif: 11,
    ogretmen: 'Fizik Zümresi',
    sonTarih: '2026-09-22',
    aciklama: 'Hareketin bileşenlere ayrılması ve serbest cisim diyagramı.',
    soruIdler: ['fiz-atis-1', 'fiz-atis-2', 'fiz-egik-1', 'fiz-ele-1'],
  },
  {
    id: 'od-fen-8-1',
    baslik: 'Dünya ve Evren — Mevsimler ve Ay',
    ders: 'fen',
    sinif: 8,
    ogretmen: 'Fen Bilimleri Zümresi',
    sonTarih: '2026-09-20',
    aciklama: 'Yaygın yanılgıları hedefleyen sorular. Cevabı bulamazsan önce 3B dersi izle.',
    soruIdler: ['fen-mev-1', 'fen-ay-1'],
  },
  {
    id: 'od-biy-11-1',
    baslik: 'Sistemler — Dolaşım ve Sinir',
    ders: 'biyoloji',
    sinif: 11,
    ogretmen: 'Biyoloji Zümresi',
    sonTarih: '2026-09-25',
    aciklama: 'Kavram yanılgılarını ayıklamaya yönelik dört soru.',
    soruIdler: ['biy-kalp-1', 'biy-nor-1', 'biy-huc-1', 'biy-dna-1'],
  },
  {
    id: 'od-mat-8-1',
    baslik: 'Geometri ve Kesirler Tekrarı',
    ders: 'matematik',
    sinif: 8,
    ogretmen: 'Matematik Zümresi',
    sonTarih: '2026-09-18',
    aciklama: 'Pisagor bağıntısı, kesirlerde toplama ve katı cisimlerin hacmi.',
    soruIdler: ['mat-pis-1', 'mat-kes-1', 'mat-geo-1'],
  },
]

interface OdevStore {
  ozelOdevler: Odev[]
  sonuclar: Record<string, OdevSonucu>
  odevEkle: (o: Odev) => void
  odevSil: (id: string) => void
  cevapVer: (odevId: string, soruId: string, cevap: string) => void
  teslimEt: (odevId: string) => void
  yenidenDene: (odevId: string) => void
}

export const useOdev = create<OdevStore>()(
  persist(
    (set) => ({
      ozelOdevler: [],
      sonuclar: {},
      odevEkle: (o) => set((s) => ({ ozelOdevler: [o, ...s.ozelOdevler] })),
      odevSil: (id) => set((s) => ({ ozelOdevler: s.ozelOdevler.filter((x) => x.id !== id) })),
      cevapVer: (odevId, soruId, cevap) =>
        set((s) => {
          const onceki = s.sonuclar[odevId] ?? {
            cevaplar: {},
            teslim: false,
            puan: 0,
            tarih: 0,
            deneme: 0,
          }
          if (onceki.teslim) return s
          return {
            sonuclar: {
              ...s.sonuclar,
              [odevId]: { ...onceki, cevaplar: { ...onceki.cevaplar, [soruId]: cevap } },
            },
          }
        }),
      teslimEt: (odevId) =>
        set((s) => {
          const odev = [...HAZIR_ODEVLER, ...s.ozelOdevler].find((o) => o.id === odevId)
          const onceki = s.sonuclar[odevId]
          if (!odev || !onceki) return s
          const dogruSayisi = odev.soruIdler.filter((sid) => {
            const soru = soruBul(sid)
            return soru && dogruMu(soru, onceki.cevaplar[sid] ?? '')
          }).length
          return {
            sonuclar: {
              ...s.sonuclar,
              [odevId]: {
                ...onceki,
                teslim: true,
                puan: Math.round((dogruSayisi / odev.soruIdler.length) * 100),
                tarih: Date.now(),
                deneme: onceki.deneme + 1,
              },
            },
          }
        }),
      yenidenDene: (odevId) =>
        set((s) => {
          const onceki = s.sonuclar[odevId]
          if (!onceki) return s
          return {
            sonuclar: {
              ...s.sonuclar,
              [odevId]: { ...onceki, teslim: false, cevaplar: {} },
            },
          }
        }),
    }),
    { name: 'kure-odev' },
  ),
)

export function tumOdevler(ozel: Odev[]): Odev[] {
  return [...ozel, ...HAZIR_ODEVLER]
}

export const HAZIR = HAZIR_ODEVLER

/** Öğretmen panelinde ödev oluştururken kullanılabilecek soru listesi. */
export const SECILEBILIR_SORULAR = BANKA
