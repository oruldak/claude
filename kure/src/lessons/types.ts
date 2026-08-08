import type { ComponentType } from 'react'

/** Sahne bileşenine geçilen tek prop: anlatımın kaçıncı adımında olduğumuz. */
export interface SahneProps {
  adim: number
}

export interface Adim {
  baslik: string
  metin: string
}

export interface IspatSatiri {
  /** LaTeX satırı */
  tex?: string
  /** Satırın altına düşülen açıklama */
  not?: string
}

export interface Ispat {
  baslik: string
  giris?: string
  satirlar: IspatSatiri[]
  sonuc?: string
}

export interface Soru {
  soru: string
  secenekler: string[]
  dogru: number
  aciklama: string
}

export interface DersModulu {
  id: string
  baslik: string
  altBaslik: string
  /** Bağlı olduğu ders kodu (renk ve rozet için) */
  ders: string
  seviye: string
  /** Tahmini süre (dakika) */
  sure: number
  etiketler: string[]
  Sahne: ComponentType<SahneProps>
  adimlar: Adim[]
  ispat?: Ispat
  sorular: Soru[]
}
