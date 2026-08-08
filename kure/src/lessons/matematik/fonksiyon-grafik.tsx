import { useMemo, useState } from 'react'
import { Cizgi as Line, Egri, Eksenler, Etiket, KareliKagit, Nokta, Ok, Sahne, type V3 } from '../shared/sahne'
import { Anahtar, Dugme, Duzen, Gosterge, Kaydirac } from '../shared/ui'
import type { DersModulu, SahneProps } from '../types'

interface Temel {
  ad: string
  f: (x: number) => number
  tex: string
  tanim?: (x: number) => boolean
}

const TEMELLER: Temel[] = [
  { ad: 'x²', f: (x) => x * x, tex: 'f(x)=x^{2}' },
  { ad: '|x|', f: Math.abs, tex: 'f(x)=|x|' },
  { ad: '√x', f: (x) => Math.sqrt(x), tex: 'f(x)=\\sqrt{x}', tanim: (x) => x >= 0 },
  { ad: 'sin x', f: Math.sin, tex: 'f(x)=\\sin x' },
  { ad: '2ˣ', f: (x) => Math.pow(2, x), tex: 'f(x)=2^{x}' },
  { ad: '1/x', f: (x) => 1 / x, tex: 'f(x)=\\dfrac{1}{x}', tanim: (x) => Math.abs(x) > 0.12 },
]

function FonksiyonSahne({ adim }: SahneProps) {
  const [ti, setTi] = useState(0)
  const [a, setAmp] = useState(1)
  const [bpar, setB] = useState(1)
  const [h, setH] = useState(0)
  const [k, setK] = useState(0)
  const [okGoster, setOkGoster] = useState(true)

  const T = TEMELLER[ti]
  // Adımlara göre hangi parametrelerin etkin olduğu
  const kEt = adim >= 1 ? k : 0
  const hEt = adim >= 2 ? h : 0
  const aEt = adim >= 3 ? a : 1
  const bEt = adim >= 4 ? bpar : 1

  const g = (x: number) => aEt * T.f(bEt * (x - hEt)) + kEt
  const gTanim = (x: number) => (T.tanim ? T.tanim(bEt * (x - hEt)) : true)

  const oklar = useMemo(() => {
    if (!okGoster) return []
    const o: { a: V3; b: V3 }[] = []
    for (let x = -4; x <= 4; x += 1) {
      if (T.tanim && !T.tanim(x)) continue
      const y0 = T.f(x)
      if (!Number.isFinite(y0) || Math.abs(y0) > 5) continue
      // temel eğrideki (x, f(x)) noktası, dönüşüm sonrası nereye gider?
      const xy = x / bEt + hEt
      const yy = aEt * y0 + kEt
      if (!Number.isFinite(yy) || Math.abs(yy) > 5.5 || Math.abs(xy) > 5) continue
      if (Math.hypot(xy - x, yy - y0) < 0.12) continue
      o.push({ a: [x, y0, 0], b: [xy, yy, 0] })
    }
    return o
  }, [T, aEt, bEt, hEt, kEt, okGoster])

  const tepe = ti === 0 ? ([hEt, kEt, 0] as V3) : null

  return (
    <Duzen
      gosterge={
        <Gosterge
          satirlar={[
            { ad: 'temel', deger: T.ad, renk: '#0369a1' },
            { ad: 'a (dikey ölçek)', deger: aEt.toFixed(2), renk: '#0f766e' },
            { ad: 'b (yatay ölçek)', deger: bEt.toFixed(2), renk: '#b45309' },
            { ad: 'h (yatay öteleme)', deger: hEt.toFixed(2), renk: '#be185d' },
            { ad: 'k (dikey öteleme)', deger: kEt.toFixed(2), renk: '#4338ca' },
          ]}
        />
      }
      kontrol={
        <>
          <div className="flex flex-wrap gap-1.5">
            {TEMELLER.map((t, i) => (
              <Dugme key={t.ad} onClick={() => setTi(i)} aktif={i === ti} boyut="sm">
                {t.ad}
              </Dugme>
            ))}
          </div>
          {adim >= 1 && <Kaydirac etiket="k" deger={k} min={-3} max={3} onChange={setK} basamak={1} renk="#4338ca" />}
          {adim >= 2 && <Kaydirac etiket="h" deger={h} min={-3} max={3} onChange={setH} basamak={1} renk="#be185d" />}
          {adim >= 3 && <Kaydirac etiket="a" deger={a} min={-2.5} max={2.5} onChange={setAmp} basamak={1} />}
          {adim >= 4 && <Kaydirac etiket="b" deger={bpar} min={-3} max={3} onChange={setB} basamak={1} renk="#b45309" />}
          <Anahtar etiket="dönüşüm okları" deger={okGoster} onChange={setOkGoster} />
          <Dugme
            boyut="sm"
            onClick={() => {
              setAmp(1)
              setB(1)
              setH(0)
              setK(0)
            }}
          >
            sıfırla
          </Dugme>
        </>
      }
      sahne={
        <Sahne kamera={[0, 0.5, 12]} zemin="yok" maxUzaklik={30}>
          <KareliKagit genislik={10} yukseklik={10} />
          <Eksenler boy={5} eksiBoy={5} bolme={1} />

          {/* Temel fonksiyon */}
          <Egri
            f={(x) => (T.tanim && !T.tanim(x) ? NaN : T.f(x))}
            x0={-5}
            x1={5}
            renk="#b8b0a2"
            kalinlik={2.4}
            kesikli
            sinirY={5.5}
            adet={360}
          />
          {/* Dönüşmüş fonksiyon */}
          <Egri
            f={(x) => (gTanim(x) ? g(x) : NaN)}
            x0={-5}
            x1={5}
            renk="#0f766e"
            kalinlik={3.4}
            sinirY={5.5}
            adet={420}
          />

          {oklar.map((o, i) => (
            <Ok key={i} baslangic={o.a} bitis={o.b} renk="#be185d" kalinlik={0.026} baslikBoyu={0.2} opaklik={0.85} />
          ))}

          {/* Parabolün tepe noktası ve kökleri */}
          {adim >= 5 && tepe && (
            <>
              <Nokta konum={tepe} renk="#b45309" r={0.13} />
              <Etiket konum={[tepe[0], tepe[1] + 0.55, 0]} renk="#b45309" kucuk>
                tepe (h, k) = ({hEt.toFixed(1)}, {kEt.toFixed(1)})
              </Etiket>
              <Line
                points={[[hEt, -5, 0], [hEt, 5, 0]] as V3[]}
                color="#b45309"
                lineWidth={1.2}
                dashed
                dashSize={0.16}
                gapSize={0.12}
              />
              {aEt !== 0 && -kEt / aEt >= 0 && (
                [1, -1].map((s) => {
                  const kok = hEt + (s * Math.sqrt(-kEt / aEt)) / Math.abs(bEt)
                  return Math.abs(kok) < 5 ? (
                    <Nokta key={s} konum={[kok, 0, 0]} renk="#be185d" r={0.11} />
                  ) : null
                })
              )}
            </>
          )}

          <Etiket konum={[-4.2, 4.6, 0]} renk="#b8b0a2" kucuk>
            kesikli: temel fonksiyon
          </Etiket>
          <Etiket konum={[-4.2, 4.1, 0]} renk="#0f766e" kucuk>
            düz: dönüşmüş fonksiyon
          </Etiket>
        </Sahne>
      }
    />
  )
}

export const fonksiyonGrafikModulu: DersModulu = {
  id: 'fonksiyon-grafik',
  baslik: 'Fonksiyon Grafikleri ve Dönüşümler',
  altBaslik:
    'a·f(b(x − h)) + k ifadesindeki her harfin grafiği nasıl kıpırdattığını canlı gör.',
  ders: 'matematik',
  seviye: '9-10. Sınıf',
  sure: 15,
  etiketler: ['fonksiyon', 'grafik', 'öteleme', 'parabol'],
  Sahne: FonksiyonSahne,
  adimlar: [
    {
      baslik: 'Temel fonksiyonlar',
      metin:
        'Grafik çizmenin sırrı ezber değil, birkaç temel fonksiyonun şeklini bilmek. Düğmelerden temel fonksiyonu değiştir: x², |x|, √x, sin x, 2ˣ ve 1/x. Bunların hepsi "referans" eğrilerdir.',
    },
    {
      baslik: 'Dikey öteleme: +k',
      metin:
        'f(x) + k grafiği, k birim YUKARI kaydırır (k negatifse aşağı). Pembe oklar her noktanın nereye gittiğini gösteriyor. Fonksiyona sabit eklemek, çıktıyı doğrudan değiştirir — bu yüzden hareket dikeydir.',
    },
    {
      baslik: 'Yatay öteleme: (x − h)',
      metin:
        'f(x − h) grafiği h birim SAĞA kayar. İşaretin ters görünmesi kafa karıştırır: aynı çıktıyı elde etmek için girdiyi h fazla vermek gerekir. Yani grafik, h kadar geç "tepki verir".',
    },
    {
      baslik: 'Dikey ölçekleme ve yansıma: a·f(x)',
      metin:
        'a > 1 grafiği dikey olarak gerer, 0 < a < 1 basıklaştırır, a < 0 ise x eksenine göre yansıtır. a\'yı negatife çekip parabolün nasıl ters döndüğüne bak.',
    },
    {
      baslik: 'Yatay ölçekleme: f(bx)',
      metin:
        'b > 1 grafiği yatayda SIKIŞTIRIR (1/b oranında), 0 < b < 1 genişletir, b < 0 ise y eksenine göre yansıtır. sin x seçip b\'yi büyüttüğünde periyodun 2π/b olarak kısaldığını göreceksin.',
    },
    {
      baslik: 'Parabolde tepe noktası ve kökler',
      metin:
        'x² temelini seçtiğinde y = a(x − h)² + k tepe noktası formudur: tepe doğrudan (h, k) noktasıdır. Kökler ise tepe noktasından simetrik uzaklıktadır. Maksimum-minimum problemlerinde aranan değer tam olarak k\'dır.',
    },
  ],
  ispat: {
    baslik: 'Tepe noktası formuna geçiş (tam kareye tamamlama)',
    satirlar: [
      { tex: 'y=ax^{2}+bx+c' },
      { tex: 'y=a\\left(x^{2}+\\frac{b}{a}x\\right)+c', not: 'a parantezine al' },
      {
        tex: 'y=a\\left(x^{2}+\\frac{b}{a}x+\\frac{b^{2}}{4a^{2}}\\right)+c-\\frac{b^{2}}{4a}',
        not: 'Tam kareye tamamla, eklediğini çıkar',
      },
      { tex: 'y=a\\left(x+\\frac{b}{2a}\\right)^{2}+\\frac{4ac-b^{2}}{4a}' },
      {
        tex: 'h=-\\frac{b}{2a},\\qquad k=-\\frac{\\Delta}{4a}',
        not: 'Tepe noktası doğrudan okunur',
      },
    ],
    sonuc: 'y=a(x-h)^{2}+k \\Rightarrow \\text{tepe } T(h,k)',
  },
  sorular: [
    {
      soru: 'y = f(x − 3) grafiği, y = f(x) grafiğine göre nasıl konumlanır?',
      secenekler: ['3 birim sola', '3 birim sağa', '3 birim yukarı', '3 birim aşağı'],
      dogru: 1,
      aciklama: 'x yerine (x − 3) yazmak grafiği pozitif yönde, yani 3 birim sağa öteler.',
    },
    {
      soru: 'y = −2x² grafiği y = x² grafiğine göre nasıldır?',
      secenekler: [
        'Daha basık ve yukarı açılan',
        'Daha dar ve aşağı açılan',
        'Aynı, sadece ötelenmiş',
        'Y eksenine göre yansımış',
      ],
      dogru: 1,
      aciklama: '|a| = 2 > 1 dikey germe yapar (daha dar), a < 0 ise parabolü aşağı çevirir.',
    },
    {
      soru: 'y = (x − 2)² + 5 parabolünün tepe noktası nedir?',
      secenekler: ['(−2, 5)', '(2, 5)', '(2, −5)', '(5, 2)'],
      dogru: 1,
      aciklama: 'y = a(x − h)² + k formunda tepe (h, k) olduğundan tepe (2, 5) noktasıdır.',
    },
    {
      soru: 'y = sin(3x) fonksiyonunun periyodu nedir?',
      secenekler: ['2π', '3π', '2π/3', '6π'],
      dogru: 2,
      aciklama: 'y = sin(bx) için periyot 2π/b\'dir; b = 3 için periyot 2π/3 olur.',
    },
  ],
}
