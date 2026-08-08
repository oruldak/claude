import { useState } from 'react'
import { Cizgi as Line, Etiket, Nokta, Sahne, type V3 } from '../shared/sahne'
import { Anahtar, Dugme, Duzen, Gosterge, Kaydirac } from '../shared/ui'
import { useZaman } from '../shared/animasyon'
import type { DersModulu, SahneProps } from '../types'

const EGIM = (23.44 * Math.PI) / 180
const YORUNGE = 6.2
const DUNYA_R = 0.95

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
  const kuzeyMevsim = d < 0.5 || d >= 3.5 ? 'Kış' : d < 1.5 ? 'İlkbahar' : d < 2.5 ? 'Yaz' : 'Sonbahar'
  if (kuzey) return kuzeyMevsim
  return { Kış: 'Yaz', İlkbahar: 'Sonbahar', Yaz: 'Kış', Sonbahar: 'İlkbahar' }[kuzeyMevsim] as string
}

function MevsimlerSahne({ adim }: SahneProps) {
  const [oynat, setOynat] = useState(true)
  const [elle, setElle] = useState(0)
  const [enlem, setEnlem] = useState(39)
  const [egimVar, setEgimVar] = useState(true)
  const [t] = useZaman(oynat, 0.35)

  const beta = oynat ? (t % (Math.PI * 2)) : elle
  const egim = egimVar ? EGIM : 0
  const dekl = -egim * Math.cos(beta) // güneş ışınlarının dik geldiği enlem (radyan)
  const deklD = (dekl * 180) / Math.PI
  const phi = (enlem * Math.PI) / 180

  const ogleAcisi = 90 - Math.abs(enlem - deklD)
  const cosH = -Math.tan(phi) * Math.tan(dekl)
  const gunduz = cosH <= -1 ? 24 : cosH >= 1 ? 0 : (2 * Math.acos(cosH) * 12) / Math.PI

  const D: V3 = [YORUNGE * Math.cos(beta), 0, YORUNGE * Math.sin(beta)]
  // Eksen uzayda sabit yönlüdür (mevsimlerin nedeni budur)
  const eksen: V3 = [Math.sin(egim), Math.cos(egim), 0]
  const eksenUc = (s: number): V3 => [D[0] + eksen[0] * s, D[1] + eksen[1] * s, D[2] + eksen[2] * s]

  const yorungeNoktalari: V3[] = Array.from({ length: 129 }, (_, i) => {
    const u = (i / 128) * Math.PI * 2
    return [YORUNGE * Math.cos(u), 0, YORUNGE * Math.sin(u)]
  })

  const donumler = [
    { b: 0, ad: '21 Aralık — Kuzeyde kış' },
    { b: Math.PI / 2, ad: '21 Mart — Ekinoks' },
    { b: Math.PI, ad: '21 Haziran — Kuzeyde yaz' },
    { b: (3 * Math.PI) / 2, ad: '23 Eylül — Ekinoks' },
  ]

  // Işınlar: Güneş'ten Dünya'ya paralel demet
  const isinlar: V3[][] = Array.from({ length: 9 }, (_, i) => {
    const o = (i - 4) * 0.32
    const yon = [-Math.cos(beta), 0, -Math.sin(beta)]
    const dik: V3 = [-yon[2], 0, yon[0]]
    const bas: V3 = [D[0] - yon[0] * 2.6 + dik[0] * o, o * 0.75, D[2] - yon[2] * 2.6 + dik[2] * o]
    const son: V3 = [D[0] - yon[0] * 1.05 + dik[0] * o, o * 0.75, D[2] - yon[2] * 1.05 + dik[2] * o]
    return [bas, son]
  })

  return (
    <Duzen
      gosterge={
        <Gosterge
          satirlar={[
            { ad: 'tarih', deger: tarih(beta), renk: '#ffb454' },
            { ad: 'kuzey yarım küre', deger: mevsim(beta, true), renk: '#7dd3fc' },
            { ad: 'güney yarım küre', deger: mevsim(beta, false), renk: '#f472b6' },
            { ad: 'ışınların dik geldiği enlem', deger: `${deklD.toFixed(1)}°`, renk: '#38e1c6' },
            { ad: `${enlem}° enleminde öğle açısı`, deger: `${ogleAcisi.toFixed(1)}°`, renk: '#4ade80' },
            { ad: 'gündüz süresi', deger: `${gunduz.toFixed(1)} saat` },
            { ad: 'Güneş’e uzaklık', deger: 'yıl boyunca ≈ sabit (%3 değişir)', renk: '#94a3b8' },
          ]}
        />
      }
      kontrol={
        <>
          <Dugme onClick={() => setOynat(!oynat)} aktif={oynat} boyut="sm">
            {oynat ? '⏸ durdur' : '▶ oynat'}
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
            renk="#ffb454"
          />
          <Kaydirac etiket="enlem" deger={enlem} min={-66} max={66} adim={1} basamak={0} onChange={setEnlem} birim="°" renk="#4ade80" />
          {adim >= 4 && <Anahtar etiket="eksen eğikliği" deger={egimVar} onChange={setEgimVar} renk="#f472b6" />}
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
                {d.ad.split(' — ')[0]}
              </Dugme>
            ))}
          </div>
        </>
      }
      sahne={
        <Sahne kamera={[0, 9, 12]} izgara={false} uzay maxUzaklik={44} minUzaklik={3}>
          {/* Güneş */}
          <pointLight position={[0, 0, 0]} intensity={420} distance={0} decay={2} color="#fff3d6" />
          <mesh>
            <sphereGeometry args={[1.15, 40, 32]} />
            <meshBasicMaterial color="#ffcf5c" />
          </mesh>
          <Etiket konum={[0, 1.7, 0]} renk="#ffcf5c" kucuk>
            Güneş
          </Etiket>

          {/* Yörünge */}
          <Line points={yorungeNoktalari} color="#1c2a48" lineWidth={1.4} />
          {donumler.map((d) => (
            <group key={d.b}>
              <Nokta konum={[YORUNGE * Math.cos(d.b), 0, YORUNGE * Math.sin(d.b)]} renk="#334867" r={0.09} />
              <Etiket
                konum={[YORUNGE * 1.28 * Math.cos(d.b), 0, YORUNGE * 1.28 * Math.sin(d.b)]}
                renk="#64748b"
                kucuk
              >
                {d.ad}
              </Etiket>
            </group>
          ))}

          {/* Işın demeti */}
          {adim >= 2 &&
            isinlar.map((s, i) => (
              <Line key={i} points={s} color="#ffd479" lineWidth={1.2} transparent opacity={0.6} />
            ))}

          {/* Dünya */}
          <mesh position={D}>
            <sphereGeometry args={[DUNYA_R, 48, 32]} />
            <meshStandardMaterial color="#2f6fd0" roughness={0.9} />
          </mesh>

          {/* Dönme ekseni */}
          {adim >= 1 && (
            <>
              <Line points={[eksenUc(-1.7), eksenUc(1.7)]} color="#f472b6" lineWidth={2.4} />
              <Etiket konum={eksenUc(2.05)} renk="#f472b6" kucuk>
                eksen {egimVar ? '23,5° eğik' : 'dik (0°)'}
              </Etiket>
            </>
          )}

          {/* Ekvator ve seçili enlem çemberi */}
          {adim >= 1 &&
            [
              { lat: 0, renk: '#e2e8f0', ad: 'Ekvator' },
              { lat: enlem, renk: '#4ade80', ad: `${enlem}° enlemi` },
              { lat: deklD, renk: '#38e1c6', ad: 'ışınların dik geldiği yer' },
            ].map((c, ci) => {
              const la = (c.lat * Math.PI) / 180
              const r = DUNYA_R * Math.cos(la)
              const h = DUNYA_R * Math.sin(la)
              // Eksen yönüne göre çemberi döndür
              const noktalar: V3[] = Array.from({ length: 65 }, (_, i) => {
                const u = (i / 64) * Math.PI * 2
                const yerel = [r * Math.cos(u), h, r * Math.sin(u)]
                // eksen eğimi kadar z ekseninde döndür
                const x = yerel[0] * Math.cos(egim) - yerel[1] * Math.sin(egim)
                const y = yerel[0] * Math.sin(egim) + yerel[1] * Math.cos(egim)
                return [D[0] + x, D[1] + y, D[2] + yerel[2]]
              })
              return <Line key={ci} points={noktalar} color={c.renk} lineWidth={ci === 0 ? 1.6 : 2.2} />
            })}

          {adim >= 3 && (
            <Etiket konum={[D[0], -2.2, D[2]]} renk="#4ade80" kucuk>
              {ogleAcisi > 70
                ? 'ışınlar dike yakın → aynı enerji küçük alana düşer → YAZ'
                : ogleAcisi < 35
                  ? 'ışınlar eğik → aynı enerji geniş alana yayılır → KIŞ'
                  : 'ışınlar orta açıyla geliyor → ılıman mevsim'}
            </Etiket>
          )}
          {adim >= 4 && !egimVar && (
            <Etiket konum={[0, 3.4, 0]} renk="#f472b6">
              eksen dik olsaydı: her yerde yıl boyunca aynı mevsim — MEVSİM OLMAZDI
            </Etiket>
          )}
        </Sahne>
      }
    />
  )
}

export const mevsimlerModulu: DersModulu = {
  id: 'mevsimler',
  baslik: 'Mevsimlerin Oluşumu',
  altBaslik: 'Mevsimleri Güneş’e uzaklık değil, eksen eğikliği yaratır. Kanıtı sahnede.',
  ders: 'fen',
  seviye: '4. / 8. Sınıf',
  sure: 15,
  etiketler: ['eksen eğikliği', 'dolanma', 'ışın açısı', 'gündüz süresi'],
  Sahne: MevsimlerSahne,
  adimlar: [
    {
      baslik: 'Dünya’nın iki hareketi',
      metin:
        'Dünya hem kendi ekseni etrafında döner (24 saat → gece ve gündüz) hem de Güneş çevresinde dolanır (365 gün → bir yıl). Mevsimler ikinci hareketle ilgilidir, ama tek başına dolanma yeterli değildir.',
    },
    {
      baslik: 'Eksen eğikliği: 23,5°',
      metin:
        'Dünya\'nın dönme ekseni yörünge düzlemine dik değil, 23,5° eğiktir (pembe çizgi) ve bu eğiklik uzayda hep AYNI yöne bakar. Bu yüzden yıl boyunca kimi zaman kuzey yarım küre, kimi zaman güney yarım küre Güneş\'e doğru eğik kalır.',
    },
    {
      baslik: 'Işınların geliş açısı',
      metin:
        'Sarı ışın demeti Dünya\'ya paralel gelir. Ama eğik eksen yüzünden bu ışınlar bir yarım küreye dike yakın, diğerine eğik çarpar. Yeşil çember seçtiğin enlemi gösteriyor; enlem kaydıracını oynatıp öğle açısının nasıl değiştiğini göstergeden izle.',
    },
    {
      baslik: 'Dört mevsim ve gündüz süresi',
      metin:
        'Işınlar dike yakın geldiğinde aynı enerji küçük bir alana düşer → sıcaklık artar, gündüz uzar: YAZ. Eğik geldiğinde enerji geniş alana yayılır → KIŞ. Dönüm noktalarına tıklayarak 21 Aralık, 21 Mart, 21 Haziran ve 23 Eylül konumlarını karşılaştır. Ekinokslarda ışınlar Ekvator\'a dik gelir ve her yerde gece-gündüz eşitlenir.',
    },
    {
      baslik: 'En yaygın yanılgı',
      metin:
        'Mevsimler Güneş\'e uzaklıkla ilgili DEĞİLDİR. Dünya, kuzey yarım kürede kış olan Ocak ayında Güneş\'e en yakın konumdadır! Ayrıca uzaklık aynıyken iki yarım kürede zıt mevsimler yaşanır. Kanıt için "eksen eğikliği" anahtarını kapat: eğiklik olmadan mevsim de kalmıyor.',
    },
  ],
  ispat: {
    baslik: 'Işın açısı ile enerji yoğunluğu ilişkisi',
    satirlar: [
      { tex: 'I_0 = \\text{birim alana düşen güç (dik geliş)}' },
      { tex: 'A_{\\text{eğik}}=\\frac{A_{\\text{dik}}}{\\sin h}', not: 'h: ışınların yatayla yaptığı açı' },
      { tex: 'I = I_0 \\sin h', not: 'Aynı enerji daha geniş alana yayılır' },
      { tex: 'h_{\\text{öğle}} = 90^{\\circ}-|\\varphi-\\delta|', not: 'φ enlem, δ ışınların dik geldiği enlem' },
      { tex: '\\delta \\in [-23{,}5^{\\circ},\\ +23{,}5^{\\circ}]', not: 'Eksen eğikliği kadar salınır' },
      { tex: '\\cos H = -\\tan\\varphi\\,\\tan\\delta', not: 'Gündüz süresinin yarı açısı' },
    ],
    sonuc: 'Eğiklik sıfır olsaydı δ = 0 sabit kalır, mevsim oluşmazdı.',
  },
  sorular: [
    {
      soru: 'Mevsimlerin oluşmasının temel nedeni nedir?',
      secenekler: [
        'Dünya’nın Güneş’e uzaklığının değişmesi',
        'Dünya’nın ekseninin 23,5° eğik olması',
        'Güneş’in enerjisinin değişmesi',
        'Ay’ın çekim etkisi',
      ],
      dogru: 1,
      aciklama:
        'Eksen eğikliği, ışınların geliş açısını ve gündüz süresini yıl boyunca değiştirir. Uzaklık değişimi çok küçüktür ve mevsimleri açıklamaz.',
    },
    {
      soru: 'Kuzey yarım kürede yaz yaşanırken güney yarım kürede hangi mevsim yaşanır?',
      secenekler: ['Yaz', 'Kış', 'İlkbahar', 'Sonbahar'],
      dogru: 1,
      aciklama: 'İki yarım kürede mevsimler daima zıttır; bu da uzaklık açıklamasını doğrudan çürütür.',
    },
    {
      soru: '21 Mart ve 23 Eylül tarihlerinde ne olur?',
      secenekler: [
        'Işınlar Yengeç dönencesine dik gelir',
        'Gece ve gündüz her yerde eşit olur',
        'Kutuplarda 24 saat gündüz olur',
        'Dünya Güneş’e en yakın konumdadır',
      ],
      dogru: 1,
      aciklama: 'Ekinokslarda ışınlar Ekvator’a dik gelir ve dünyanın her yerinde gündüz 12 saat sürer.',
    },
    {
      soru: 'Işınlar bir bölgeye daha eğik geldiğinde ne olur?',
      secenekler: [
        'Aynı enerji daha küçük alana düşer, ısınır',
        'Aynı enerji daha geniş alana yayılır, az ısınır',
        'Enerji miktarı artar',
        'Gündüz süresi uzar',
      ],
      dogru: 1,
      aciklama: 'I = I₀·sin h bağıntısına göre açı küçüldükçe birim alana düşen enerji azalır.',
    },
  ],
}
