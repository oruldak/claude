import { useMemo, useState } from 'react'
import { Cizgi as Line, Egri, Eksenler, Etiket, KareliKagit, Nokta, Sahne, type V3 } from '../shared/sahne'
import { Anahtar, Dugme, Duzen, Gosterge, Kaydirac } from '../shared/ui'
import { dongusel, useGecis, useZaman } from '../shared/animasyon'
import type { DersModulu, SahneProps } from '../types'

interface FTanim {
  ad: string
  f: (x: number) => number
  F: (x: number) => number
  tex: string
  altSinir: number
}

const FONKSIYONLAR: FTanim[] = [
  { ad: 'x²/2', f: (x) => (x * x) / 2, F: (x) => x ** 3 / 6, tex: 'f(x)=\\dfrac{x^{2}}{2}', altSinir: -3 },
  {
    ad: 'sin x + 1,5',
    f: (x) => Math.sin(x) + 1.5,
    F: (x) => -Math.cos(x) + 1.5 * x,
    tex: 'f(x)=\\sin x+1{,}5',
    altSinir: 0,
  },
  { ad: '1,5√x', f: (x) => 1.5 * Math.sqrt(Math.max(x, 0)), F: (x) => Math.max(x, 0) ** 1.5, tex: 'f(x)=1{,}5\\sqrt{x}', altSinir: 0 },
]

type Yontem = 'sol' | 'orta' | 'sag'
const YONTEM_ADI: Record<Yontem, string> = { sol: 'sol uç', orta: 'orta nokta', sag: 'sağ uç' }
const BIRIKIM_Z = -3

function IntegralSahne({ adim }: SahneProps) {
  const [fi, setFi] = useState(0)
  const [n, setN] = useState(6)
  const [yontem, setYontem] = useState<Yontem>('sol')
  const [a, setA] = useState(0)
  const [b, setB] = useState(3)
  const [oynat, setOynat] = useState(true)
  const [derinlik, setDerinlik] = useState(true)

  const fn = FONKSIYONLAR[fi]
  const gecis = useGecis(`${adim}-${fi}`, 1.8)
  const [t] = useZaman(oynat && adim >= 3, 1)

  // 2. adımda dilim sayısı otomatik olarak artar: n = 4 → 120
  const nEt = adim === 2 ? Math.round(4 + gecis * gecis * 116) : n

  const dx = (b - a) / nEt
  const dilimler = useMemo(() => {
    const d: { x: number; y: number }[] = []
    for (let i = 0; i < nEt; i++) {
      const sol = a + i * dx
      const orn = yontem === 'sol' ? sol : yontem === 'sag' ? sol + dx : sol + dx / 2
      d.push({ x: sol, y: fn.f(orn) })
    }
    return d
  }, [a, b, nEt, dx, yontem, fn])

  const riemann = dilimler.reduce((s, d) => s + d.y * dx, 0)
  const kesin = fn.F(b) - fn.F(a)
  const hata = Math.abs(riemann - kesin)

  // 3. adımda üst sınır x süpürülür → birikim fonksiyonu A(x) doğar
  const xSuper = adim >= 3 && oynat ? a + (b - a) * dongusel(t, 7) : b
  const derin = derinlik ? 0.7 : 0.06

  return (
    <Duzen
      gosterge={
        <Gosterge
          satirlar={[
            { ad: 'n (dilim)', deger: nEt },
            { ad: 'Riemann toplamı', deger: riemann.toFixed(4), renk: '#b45309' },
            { ad: 'kesin değer', deger: kesin.toFixed(4), renk: '#0f766e' },
            { ad: 'hata', deger: hata.toFixed(4), renk: hata < 0.01 ? '#15803d' : '#be185d' },
          ]}
        />
      }
      kontrol={
        <>
          <div className="flex gap-1.5">
            {FONKSIYONLAR.map((f, i) => (
              <Dugme key={f.ad} onClick={() => setFi(i)} aktif={i === fi} boyut="sm">
                {f.ad}
              </Dugme>
            ))}
          </div>
          <div className="flex gap-1.5">
            {(['sol', 'orta', 'sag'] as Yontem[]).map((y) => (
              <Dugme key={y} onClick={() => setYontem(y)} aktif={y === yontem} boyut="sm" renk="#b45309">
                {YONTEM_ADI[y]}
              </Dugme>
            ))}
          </div>
          <Kaydirac etiket="n" deger={n} min={1} max={140} adim={1} basamak={0} onChange={setN} renk="#b45309" />
          <Kaydirac etiket="a" deger={a} min={fn.altSinir} max={b - 0.5} onChange={setA} basamak={1} />
          <Kaydirac etiket="b" deger={b} min={a + 0.5} max={5} onChange={setB} basamak={1} />
          <Anahtar etiket="derinlik" deger={derinlik} onChange={setDerinlik} />
          <Dugme onClick={() => setOynat(!oynat)} aktif={oynat} boyut="sm">
            {oynat ? '⏸ durdur' : '▶ oynat'}
          </Dugme>
        </>
      }
      sahne={
        <Sahne kamera={[5.6, 3.8, 9.8]} zemin="yok" maxUzaklik={30}>
          <KareliKagit genislik={10} yukseklik={10} />
          <Eksenler boy={5} eksiBoy={3.4} bolme={1} />
          <Egri f={fn.f} x0={Math.max(fn.altSinir, -4)} x1={5} renk="#0369a1" kalinlik={3.4} sinirY={7} />

          {/* Sınırlar */}
          <Line points={[[a, 0, 0], [a, fn.f(a), 0]] as V3[]} color="#6b7280" lineWidth={2} />
          <Line points={[[b, 0, 0], [b, fn.f(b), 0]] as V3[]} color="#6b7280" lineWidth={2} />
          <Etiket konum={[a, -0.45, 0]} renk="#6b7280" kucuk>a</Etiket>
          <Etiket konum={[b, -0.45, 0]} renk="#6b7280" kucuk>b</Etiket>

          {/* Riemann dikdörtgenleri */}
          {adim >= 1 &&
            dilimler.map((d, i) => (
              <mesh key={i} position={[d.x + dx / 2, d.y / 2, 0]}>
                <boxGeometry args={[dx * 0.97, Math.max(Math.abs(d.y), 0.001), derin]} />
                <meshStandardMaterial
                  color="#b45309"
                  transparent
                  opacity={nEt > 60 ? 0.55 : 0.42}
                />
              </mesh>
            ))}

          {adim === 0 && (
            <Etiket konum={[(a + b) / 2, fn.f((a + b) / 2) / 2, 0]} renk="#0369a1">
              bu alan kaç?
            </Etiket>
          )}

          {/* Birikim fonksiyonu A(x) = ∫ₐˣ f(t)dt */}
          {adim >= 3 && (
            <group position={[0, 0, BIRIKIM_Z]}>
              <KareliKagit genislik={10} yukseklik={10} />
              <Eksenler boy={5} eksiBoy={3.4} bolme={0} adlar={['', 'A(x)', '']} />
              <Egri
                f={(x) => fn.F(x) - fn.F(a)}
                x0={a}
                x1={xSuper}
                renk="#4338ca"
                kalinlik={3.2}
                sinirY={9}
              />
              <Nokta konum={[xSuper, fn.F(xSuper) - fn.F(a), 0]} renk="#4338ca" r={0.11} />
              <Etiket konum={[a + 0.1, 4.4, 0]} renk="#4338ca" kucuk>
                A(x) = ∫ₐˣ f(t) dt
              </Etiket>
            </group>
          )}

          {/* Süpürülen üst sınır ve iki düzlem arası bağ */}
          {adim >= 3 && (
            <>
              <Line points={[[xSuper, 0, 0], [xSuper, fn.f(xSuper), 0]] as V3[]} color="#4338ca" lineWidth={2.4} />
              <Line
                points={[
                  [xSuper, fn.f(xSuper), 0],
                  [xSuper, fn.F(xSuper) - fn.F(a), BIRIKIM_Z],
                ]}
                color="#4338ca"
                lineWidth={1.3}
                dashed
                dashSize={0.16}
                gapSize={0.12}
              />
              <Etiket konum={[xSuper + 0.55, fn.f(xSuper) + 0.4, 0]} renk="#4338ca" kucuk>
                A′(x) = f(x)
              </Etiket>
            </>
          )}

          {adim >= 4 && (
            <Etiket konum={[(a + b) / 2, -1.5, 0]} renk="#0f766e">
              ∫ₐᵇ f(x)dx = F(b) − F(a) = {kesin.toFixed(3)}
            </Etiket>
          )}
        </Sahne>
      }
    />
  )
}

export const integralModulu: DersModulu = {
  id: 'integral',
  baslik: 'İntegral — Riemann Toplamlarından Analizin Temel Teoremine',
  altBaslik:
    'Alanı dikdörtgenlerle kuşat, dilimleri inceltip limite git ve türevle bağını kur.',
  ders: 'matematik',
  seviye: '12. Sınıf',
  sure: 20,
  etiketler: ['alan', 'Riemann toplamı', 'belirli integral', 'analizin temel teoremi'],
  Sahne: IntegralSahne,
  adimlar: [
    {
      baslik: 'Problem: eğrinin altındaki alan',
      metin:
        'Bir eğri ile x ekseni arasında, a ve b sınırları arasındaki alanı istiyoruz. Dikdörtgenin alanını biliyoruz, üçgeninkini biliyoruz — ama kenarı eğri olan bir bölgenin alanını doğrudan hesaplayacak bir formülümüz yok.',
    },
    {
      baslik: 'Alanı dikdörtgenlerle kuşatalım',
      metin:
        '[a, b] aralığını n eşit parçaya bölüp her parçanın üzerine bir dikdörtgen dikiyoruz. Yüksekliği hangi noktadan aldığımız (sol uç, orta nokta, sağ uç) sonucu değiştirir. n değerini ve yöntemi değiştirip toplamın kesin değerden ne kadar saptığını izle.',
    },
    {
      baslik: 'Dilimleri inceltince ne oluyor?',
      metin:
        'Şimdi n değeri otomatik olarak 4\'ten 120\'ye çıkıyor. Dikdörtgenler inceldikçe basamaklı çatı eğriye yapışıyor ve hata sıfıra gidiyor. Bu limit, belirli integralin tanımıdır: ∫ₐᵇ f(x)dx = lim(n→∞) Σ f(xᵢ)Δx.',
    },
    {
      baslik: 'Analizin temel teoremi',
      metin:
        'Üst sınırı serbest bırakıp A(x) = ∫ₐˣ f(t)dt fonksiyonunu tanımlayalım (arkadaki mor düzlem). Sınırı biraz ilerlettiğimizde alana eklenen şerit ≈ f(x)·Δx olur, yani A′(x) = f(x). Alan biriktirmek ile türev almak birbirinin tersidir.',
    },
    {
      baslik: 'Sonuç: hesap artık kolay',
      metin:
        'A′ = f olduğu için, f\'nin herhangi bir ilkel fonksiyonu F ile ∫ₐᵇ f(x)dx = F(b) − F(a) yazabiliriz. Sonsuz toplam almak yerine iki değer çıkarıyoruz. Göstergedeki "kesin değer" tam olarak budur.',
    },
  ],
  ispat: {
    baslik: 'Analizin Temel Teoremi (I. Kısım) ispatı',
    giris: 'f, [a, b] üzerinde sürekli olsun ve A(x) = ∫ₐˣ f(t)dt tanımlansın.',
    satirlar: [
      { tex: 'A(x+h)-A(x)=\\int_{x}^{x+h} f(t)\\,dt', not: 'Alanların farkı, ince şeridin alanıdır' },
      {
        tex: 'm_h\\cdot h \\le \\int_{x}^{x+h} f(t)\\,dt \\le M_h\\cdot h',
        not: 'Şerit, en küçük ve en büyük değere sahip dikdörtgenler arasında sıkışır',
      },
      { tex: 'm_h \\le \\frac{A(x+h)-A(x)}{h} \\le M_h', not: 'h > 0 ile bölündü' },
      {
        tex: 'f\\ \\text{sürekli} \\Rightarrow \\lim_{h\\to 0} m_h=\\lim_{h\\to 0} M_h=f(x)',
        not: 'Aralık daraldıkça hem en küçük hem en büyük değer f(x)’e yaklaşır',
      },
      { tex: "A'(x)=\\lim_{h\\to 0}\\frac{A(x+h)-A(x)}{h}=f(x)", not: 'Sıkıştırma teoremi' },
      {
        tex: 'F\\ \\text{herhangi bir ilkel ise}\\ F(x)=A(x)+C',
        not: 'Türevleri eşit olan fonksiyonlar sabit farkla ayrılır',
      },
      { tex: 'F(b)-F(a)=A(b)-A(a)=A(b)=\\int_a^b f(x)\\,dx' },
    ],
    sonuc: '\\int_a^b f(x)\\,dx = F(b)-F(a)',
  },
  sorular: [
    {
      soru: 'Riemann toplamında dilim sayısı n artarken toplam neye yaklaşır?',
      secenekler: [
        'Fonksiyonun türevine',
        'Belirli integralin değerine',
        'Fonksiyonun maksimum değerine',
        'Sıfıra',
      ],
      dogru: 1,
      aciklama: 'Belirli integral, tanımı gereği Riemann toplamlarının n → ∞ limitidir.',
    },
    {
      soru: 'A(x) = ∫₀ˣ f(t)dt ise A′(x) nedir?',
      secenekler: ['f′(x)', 'f(x)', 'x·f(x)', 'F(x) − F(0)'],
      dogru: 1,
      aciklama: 'Analizin temel teoreminin birinci kısmına göre A′(x) = f(x) olur.',
    },
    {
      soru: '∫₀² x² dx değeri kaçtır?',
      secenekler: ['4/3', '8/3', '2', '4'],
      dogru: 1,
      aciklama: 'F(x) = x³/3 alınırsa F(2) − F(0) = 8/3 − 0 = 8/3 bulunur.',
    },
    {
      soru: 'Artan bir fonksiyonda sol uç noktalarla kurulan Riemann toplamı gerçek alana göre nasıldır?',
      secenekler: ['Her zaman büyüktür', 'Her zaman küçüktür', 'Eşittir', 'Belirsizdir'],
      dogru: 1,
      aciklama:
        'Artan fonksiyonda sol uç, dilimdeki en küçük değeri verir; bu yüzden toplam gerçek alandan küçük kalır (alttan yaklaşım).',
    },
  ],
}
