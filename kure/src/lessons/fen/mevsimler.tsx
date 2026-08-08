import { useState } from 'react'
import { Cizgi as Line, Etiket, Nokta, Sahne, type V3 } from '../shared/sahne'
import { Dunya, Gunes } from '../shared/gokcisimleri'
import { Anahtar, Dugme, Duzen, Gosterge, Kaydirac } from '../shared/ui'
import { useZaman } from '../shared/animasyon'
import type { DersModulu, SahneProps } from '../types'

const EGIM = (23.44 * Math.PI) / 180
const YORUNGE = 5.0
const DUNYA_R = 1.15

const AY_GUN = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
const AY_AD = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık']

/** β = 0 → 21 Aralık gün dönümü. */
function tarih(beta: number): string {
  const gun = Math.floor(((beta / (Math.PI * 2)) * 365 + 355) % 365) + 1
  let k = gun
  for (let i = 0; i < 12; i++) {
    if (k <= AY_GUN[i]) return `${k} ${AY_AD[i]}`
    k -= AY_GUN[i]
  }
  return '—'
}

function mevsim(beta: number, kuzey: boolean): string {
  const d = ((beta / (Math.PI * 2)) * 4 + 4) % 4
  const k = d < 0.5 || d >= 3.5 ? 'Kış' : d < 1.5 ? 'İlkbahar' : d < 2.5 ? 'Yaz' : 'Sonbahar'
  if (kuzey) return k
  return { Kış: 'Yaz', İlkbahar: 'Sonbahar', Yaz: 'Kış', Sonbahar: 'İlkbahar' }[k] as string
}

function MevsimlerSahne({ adim }: SahneProps) {
  const [oynat, setOynat] = useState(true)
  const [elle, setElle] = useState(0)
  const [enlem, setEnlem] = useState(39)
  const [egimVar, setEgimVar] = useState(true)
  const [t] = useZaman(oynat, 0.3)

  const beta = oynat ? t % (Math.PI * 2) : elle
  const egim = egimVar ? EGIM : 0
  const dekl = -egim * Math.cos(beta)
  const deklD = (dekl * 180) / Math.PI
  const phi = (enlem * Math.PI) / 180

  const ogleAcisi = 90 - Math.abs(enlem - deklD)
  const cosH = -Math.tan(phi) * Math.tan(dekl)
  const gunduz = cosH <= -1 ? 24 : cosH >= 1 ? 0 : (2 * Math.acos(cosH) * 12) / Math.PI

  const D: V3 = [YORUNGE * Math.cos(beta), 0, YORUNGE * Math.sin(beta)]

  const yorunge: V3[] = Array.from({ length: 161 }, (_, i) => {
    const u = (i / 160) * Math.PI * 2
    return [YORUNGE * Math.cos(u), 0, YORUNGE * Math.sin(u)]
  })

  const donumler = [
    { b: 0, ad: '21 Aralık' },
    { b: Math.PI / 2, ad: '21 Mart' },
    { b: Math.PI, ad: '21 Haziran' },
    { b: (3 * Math.PI) / 2, ad: '23 Eylül' },
  ]

  // Güneş'ten Dünya'ya paralel ışın demeti
  const yon: V3 = [-Math.cos(beta), 0, -Math.sin(beta)]
  const dik: V3 = [-yon[2], 0, yon[0]]
  const isinlar: V3[][] = Array.from({ length: 11 }, (_, i) => {
    const o = (i - 5) * 0.3
    const yuk = (i % 2 ? 0.5 : -0.5) * 0.6
    const bas: V3 = [D[0] - yon[0] * 3.4 + dik[0] * o, yuk, D[2] - yon[2] * 3.4 + dik[2] * o]
    const son: V3 = [D[0] - yon[0] * 1.35 + dik[0] * o, yuk, D[2] - yon[2] * 1.35 + dik[2] * o]
    return [bas, son]
  })

  /** Dünya'nın eğik ekseni etrafındaki enlem çemberi. */
  const enlemCemberi = (lat: number): V3[] => {
    const la = (lat * Math.PI) / 180
    const r = DUNYA_R * 1.008 * Math.cos(la)
    const h = DUNYA_R * 1.008 * Math.sin(la)
    return Array.from({ length: 73 }, (_, i) => {
      const u = (i / 72) * Math.PI * 2
      const x = r * Math.cos(u) * Math.cos(egim) - h * Math.sin(egim)
      const y = r * Math.cos(u) * Math.sin(egim) + h * Math.cos(egim)
      return [D[0] + x, y, D[2] + r * Math.sin(u)]
    })
  }

  const eksenUcu = (s: number): V3 => [D[0] - Math.sin(egim) * s, Math.cos(egim) * s, D[2]]

  return (
    <Duzen
      gosterge={
        <Gosterge
          baslik="gökbilim verileri"
          satirlar={[
            { ad: 'tarih', deger: tarih(beta), renk: '#b45309' },
            { ad: 'kuzey yarım küre', deger: mevsim(beta, true), renk: '#0369a1' },
            { ad: 'güney yarım küre', deger: mevsim(beta, false), renk: '#be185d' },
            { ad: 'ışınlar dik geliyor', deger: `${deklD.toFixed(1)}° enlemine`, renk: '#0f766e' },
            { ad: `${enlem}° öğle açısı`, deger: `${ogleAcisi.toFixed(1)}°`, renk: '#15803d' },
            { ad: 'gündüz süresi', deger: `${gunduz.toFixed(1)} saat` },
          ]}
        />
      }
      kontrol={
        <>
          <Dugme onClick={() => setOynat(!oynat)} aktif={oynat} boyut="sm">
            {oynat ? '⏸ durdur' : '▶ yılı oynat'}
          </Dugme>
          <Kaydirac
            etiket="yıl içindeki konum"
            deger={elle}
            min={0}
            max={Math.PI * 2}
            onChange={(v) => {
              setElle(v)
              setOynat(false)
            }}
            basamak={2}
            renk="#b45309"
          />
          <Kaydirac
            etiket="enlem"
            deger={enlem}
            min={-66}
            max={66}
            adim={1}
            basamak={0}
            onChange={setEnlem}
            birim="°"
            renk="#15803d"
          />
          <div className="flex flex-wrap gap-1.5">
            {donumler.map((d) => (
              <Dugme
                key={d.b}
                boyut="sm"
                onClick={() => {
                  setElle(d.b)
                  setOynat(false)
                }}
              >
                {d.ad}
              </Dugme>
            ))}
          </div>
          {adim >= 4 && (
            <Anahtar etiket="eksen eğikliği açık" deger={egimVar} onChange={setEgimVar} renk="#be185d" />
          )}
        </>
      }
      sahne={
        <Sahne kamera={[-2.6, 7.2, 13.5]} fov={40} zemin="yok" uzay maxUzaklik={46} minUzaklik={3}>
          <Gunes konum={[0, 0, 0]} r={1.15} isik={430} hale={5.4} />
          <Etiket konum={[0, 2, 0]} koyu kucuk>
            Güneş
          </Etiket>

          <Line points={yorunge} color="#2a3450" lineWidth={1} />

          {donumler.map((d) => (
            <group key={d.b}>
              <Nokta konum={[YORUNGE * Math.cos(d.b), 0, YORUNGE * Math.sin(d.b)]} renk="#54607d" r={0.07} />
              <Etiket
                konum={[YORUNGE * 1.24 * Math.cos(d.b), 0, YORUNGE * 1.24 * Math.sin(d.b)]}
                koyu
                kucuk
              >
                {d.ad}
              </Etiket>
            </group>
          ))}

          {adim >= 2 &&
            isinlar.map((s, i) => (
              <Line key={i} points={s} color="#ffd479" lineWidth={1.1} transparent opacity={0.55} />
            ))}

          <Dunya konum={D} r={DUNYA_R} egim={egim} />

          {adim >= 1 && (
            <>
              <Line points={[eksenUcu(-1.9), eksenUcu(1.9)]} color="#ff5d8f" lineWidth={2.6} />
              <Etiket konum={eksenUcu(2.2)} koyu kucuk>
                dönme ekseni · {egimVar ? '23,5° eğik' : 'dik (0°)'}
              </Etiket>
              <Line points={enlemCemberi(0)} color="#ffffff" lineWidth={1.6} transparent opacity={0.7} />
              <Line points={enlemCemberi(enlem)} color="#5ce08b" lineWidth={2.4} />
              <Line points={enlemCemberi(deklD)} color="#ffd479" lineWidth={2} transparent opacity={0.9} />
            </>
          )}

          {adim >= 3 && (
            <Etiket konum={[D[0], -2.5, D[2]]} koyu>
              {ogleAcisi > 70
                ? 'ışınlar dike yakın → enerji küçük alana düşer → YAZ'
                : ogleAcisi < 35
                  ? 'ışınlar eğik → enerji geniş alana yayılır → KIŞ'
                  : 'ışınlar orta açıyla geliyor → ılıman mevsim'}
            </Etiket>
          )}
          {adim >= 4 && !egimVar && (
            <Etiket konum={[0, 4.4, 0]} koyu>
              eksen dik olsaydı ışınlar yıl boyunca aynı açıyla gelirdi — MEVSİM OLMAZDI
            </Etiket>
          )}
        </Sahne>
      }
    />
  )
}

export const mevsimlerModulu: DersModulu = {
  id: 'mevsimler',
  baslik: 'Mevsimler Neden Oluşur?',
  altBaslik:
    'Gerçek Dünya uydu görüntüsü üzerinde: ışınların geliş açısı, gündüz süresi ve eksen eğikliği.',
  ders: 'fen',
  seviye: '4. / 8. Sınıf',
  sure: 15,
  etiketler: ['eksen eğikliği', 'dolanma', 'ışın açısı', 'gündüz süresi'],
  Sahne: MevsimlerSahne,
  adimlar: [
    {
      baslik: 'Dünya nasıl hareket ediyor?',
      metin:
        'Dünya aynı anda iki hareket yapar: kendi ekseni etrafında 24 saatte bir DÖNER (gece–gündüz) ve Güneş çevresinde 365 günde bir DOLANIR (yıl). Sahnedeki Dünya gerçek uydu görüntüsüyle kaplı; gündüz ile geceyi ayıran sınırı boya değil, Güneş ışığının kendisi çiziyor. Ama tek başına dolanmak mevsim yapmaya yetmez.',
    },
    {
      baslik: 'Peki mevsimi ne yaratıyor? — 23,5°',
      metin:
        'Dünya\'nın dönme ekseni (pembe çizgi) yörünge düzlemine dik değil, 23,5° eğiktir. Daha önemlisi bu eğiklik uzayda hep AYNI yöne bakar; Dünya yörüngede ilerlerken eksen yön değiştirmez. Sonuç: yılın bir yarısında kuzey yarım küre Güneş\'e doğru, diğer yarısında ondan uzağa eğik kalır.',
    },
    {
      baslik: 'Bu eğiklik nasıl sıcaklık farkına dönüşüyor?',
      metin:
        'Güneş çok uzakta olduğu için ışınlar Dünya\'ya paralel gelir. Eğik eksen yüzünden bu paralel ışınlar bir yarım küreye dike yakın, diğerine yayvan çarpar. Yeşil çember senin seçtiğin enlemi, sarı çember ışınların o an tam dik geldiği enlemi gösterir. Enlem kaydıracını oynat; öğle açısının ölçüm panelinde nasıl değiştiğine bak.',
    },
    {
      baslik: 'Dört mevsim ve gündüz süresi',
      metin:
        'Işınlar dike yakın geldiğinde aynı enerji küçük bir alana düşer, hava ısınır ve gündüz uzar → YAZ. Yayvan geldiğinde enerji geniş alana yayılır → KIŞ. Dönüm noktası düğmeleriyle 21 Aralık, 21 Mart, 21 Haziran ve 23 Eylül\'ü karşılaştır. Ekinokslarda ışınlar Ekvator\'a dik gelir; her yerde gece ve gündüz 12\'şer saattir.',
    },
    {
      baslik: 'Kanıt: eğikliği kapatalım',
      metin:
        'Yaygın yanılgı "yazın Güneş\'e daha yakınız" der. Oysa Dünya, kuzeyde kış olan Ocak ayında Güneş\'e EN YAKIN konumdadır ve aynı anda iki yarım kürede zıt mevsimler yaşanır. Kesin kanıt için anahtarı kapat: eksen dikleşince ışın açısı yıl boyunca sabitlenir ve mevsim ortadan kalkar.',
    },
  ],
  ispat: {
    baslik: 'Işın açısı ile enerji yoğunluğu arasındaki bağıntı',
    giris:
      'Aynı ışık demeti yüzeye eğik geldiğinde daha büyük bir alana yayılır. Yayıldığı alan büyüdükçe birim alana düşen enerji azalır.',
    satirlar: [
      { tex: 'A_{\\text{eğik}}=\\frac{A_{\\text{dik}}}{\\sin h}', not: 'h: ışınların yatayla yaptığı açı' },
      { tex: 'I = \\frac{P}{A_{\\text{eğik}}} = I_0 \\sin h', not: 'Birim alana düşen güç' },
      { tex: 'h_{\\text{öğle}} = 90^{\\circ}-|\\varphi-\\delta|', not: 'φ enlem, δ ışınların dik geldiği enlem' },
      {
        tex: '\\delta(t) = -\\varepsilon\\cos\\!\\left(\\tfrac{2\\pi t}{365}\\right),\\quad \\varepsilon = 23{,}44^{\\circ}',
        not: 'δ, eksen eğikliği kadar salınır',
      },
      { tex: '\\cos H = -\\tan\\varphi\\,\\tan\\delta', not: 'Gündüz süresinin yarı açısı' },
      {
        tex: '\\varepsilon = 0 \\;\\Rightarrow\\; \\delta \\equiv 0 \\;\\Rightarrow\\; h,\\,H \\text{ yıl boyunca sabit}',
        not: 'Eğiklik yoksa mevsim de yok',
      },
    ],
    sonuc: 'Mevsimin nedeni uzaklık değil, 23,44° eksen eğikliğidir.',
  },
  sorular: [
    {
      soru: 'Mevsimlerin oluşmasının temel nedeni nedir?',
      secenekler: [
        'Dünya’nın Güneş’e uzaklığının değişmesi',
        'Dünya’nın ekseninin 23,5° eğik olması',
        'Güneş’in yaydığı enerjinin değişmesi',
        'Ay’ın çekim etkisi',
      ],
      dogru: 1,
      aciklama:
        'Eksen eğikliği ışınların geliş açısını ve gündüz süresini yıl boyunca değiştirir. Uzaklık değişimi yalnızca %3 civarındadır ve mevsimleri açıklamaz.',
    },
    {
      soru: 'Kuzey yarım kürede yaz yaşanırken güney yarım kürede hangi mevsim yaşanır?',
      secenekler: ['Yaz', 'Kış', 'İlkbahar', 'Sonbahar'],
      dogru: 1,
      aciklama:
        'Mevsimler iki yarım kürede daima zıttır. Uzaklık ikisi için de aynı olduğuna göre farkı yaratan şey ışınların geliş açısıdır.',
    },
    {
      soru: '21 Mart ve 23 Eylül tarihlerinde ne olur?',
      secenekler: [
        'Işınlar Yengeç dönencesine dik gelir',
        'Gece ve gündüz her yerde eşitlenir',
        'Kutuplarda 24 saat gündüz olur',
        'Dünya Güneş’e en yakın konumdadır',
      ],
      dogru: 1,
      aciklama:
        'Ekinokslarda δ = 0 olur; ışınlar Ekvator’a dik gelir ve gündüz süresi her enlemde 12 saattir.',
    },
    {
      soru: 'Işınlar bir bölgeye daha eğik geldiğinde ne olur?',
      secenekler: [
        'Aynı enerji daha küçük alana düşer, hava ısınır',
        'Aynı enerji daha geniş alana yayılır, hava az ısınır',
        'Gelen toplam enerji miktarı artar',
        'Gündüz süresi uzar',
      ],
      dogru: 1,
      aciklama: 'I = I₀·sin h bağıntısına göre açı küçüldükçe birim alana düşen enerji azalır.',
    },
  ],
}
