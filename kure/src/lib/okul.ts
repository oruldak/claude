/**
 * Okul (multi-tenant) katmanı.
 *
 * Hedef mimari: her okul kendi alt alan adından (ör. `atlas.kure.app`) ya da
 * kendi sunucusundan yayınlanır. Uygulama açılışta alt alan adına bakarak
 * okulun profilini yükler; marka, tema rengi, açık kademeler ve giriş paneli
 * buna göre şekillenir.
 *
 * Bugün profiller statik olarak tanımlıdır. Sunucu tarafı hazır olduğunda
 * `okuluYukle` fonksiyonunun içi `GET /api/okul/:kod` çağrısıyla değiştirilir;
 * arayüzün geri kalanı değişmez.
 */

import type { Kademe } from './types'

export interface OkulProfili {
  kod: string
  ad: string
  kisaAd: string
  slogan: string
  vurgu: string
  kademeler: Kademe[]
  /** Okula özel açılan modüller; boşsa tümü açıktır. */
  acikDersler?: string[]
  iletisim?: { site?: string; telefon?: string }
}

export const VARSAYILAN_OKUL: OkulProfili = {
  kod: 'demo',
  ad: 'Küre Demo Okulu',
  kisaAd: 'Küre',
  slogan: 'Ezberlemeden, görerek öğren.',
  vurgu: '#38e1c6',
  kademeler: ['ilkokul', 'ortaokul', 'lise'],
}

const OKULLAR: Record<string, OkulProfili> = {
  demo: VARSAYILAN_OKUL,
}

/** Alt alan adından okul kodunu çıkarır (ör. atlas.kure.app → "atlas"). */
export function okulKodu(): string {
  if (typeof window === 'undefined') return 'demo'
  const parcalar = window.location.hostname.split('.')
  const olasi = parcalar.length > 2 ? parcalar[0] : ''
  if (olasi && olasi !== 'www' && OKULLAR[olasi]) return olasi
  const url = new URLSearchParams(window.location.search).get('okul')
  return url && OKULLAR[url] ? url : 'demo'
}

export function okuluYukle(kod = okulKodu()): OkulProfili {
  return OKULLAR[kod] ?? VARSAYILAN_OKUL
}

/**
 * İlerleme senkronizasyonu için sözleşme. Okul sunucusu devreye girdiğinde
 * bu arayüzü uygulayan bir HTTP istemcisi bağlanacaktır.
 */
export interface Senkronizasyon {
  gonder(ogrenciId: string, konular: Record<string, unknown>): Promise<void>
  al(ogrenciId: string): Promise<Record<string, unknown>>
}
