import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface KonuDurumu {
  /** İzlenen adım sayısı / toplam adım */
  ilerleme: number
  /** Quizden alınan en yüksek yüzde */
  puan?: number
  sonZiyaret: number
}

interface IlerlemeStore {
  ogrenci: string
  konular: Record<string, KonuDurumu>
  sonSahneler: string[]
  ogrenciAta: (ad: string) => void
  kaydet: (anahtar: string, veri: Partial<KonuDurumu>) => void
  sahneAc: (sahneId: string) => void
  sifirla: () => void
}

/**
 * Öğrenci ilerlemesi. Şimdilik tarayıcıda (localStorage) tutulur;
 * okul sunucusu devreye girdiğinde aynı arayüz API'ye bağlanacak
 * (bkz. `src/lib/okul.ts` → `senkronizasyon`).
 */
export const useIlerleme = create<IlerlemeStore>()(
  persist(
    (set) => ({
      ogrenci: '',
      konular: {},
      sonSahneler: [],
      ogrenciAta: (ad) => set({ ogrenci: ad }),
      kaydet: (anahtar, veri) =>
        set((s) => {
          const onceki = s.konular[anahtar] ?? { ilerleme: 0, sonZiyaret: 0 }
          return {
            konular: {
              ...s.konular,
              [anahtar]: {
                ...onceki,
                ...veri,
                ilerleme: Math.max(onceki.ilerleme, veri.ilerleme ?? 0),
                puan: Math.max(onceki.puan ?? 0, veri.puan ?? 0) || undefined,
                sonZiyaret: Date.now(),
              },
            },
          }
        }),
      sahneAc: (sahneId) =>
        set((s) => ({
          sonSahneler: [sahneId, ...s.sonSahneler.filter((x) => x !== sahneId)].slice(0, 8),
        })),
      sifirla: () => set({ konular: {}, sonSahneler: [] }),
    }),
    { name: 'kure-ilerleme' },
  ),
)

export const konuAnahtari = (ders: string, sinif: number, konu: string) =>
  `${ders}/${sinif}/${konu}`
