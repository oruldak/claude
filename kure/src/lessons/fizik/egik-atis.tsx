import { useMemo, useState } from 'react'
import { Cizgi as Line, Etiket, Nokta, Ok, Sahne, UzayEgrisi, type V3 } from '../shared/sahne'
import { Anahtar, Dugme, Duzen, Gosterge, Kaydirac } from '../shared/ui'
import { useZaman } from '../shared/animasyon'
import type { DersModulu, SahneProps } from '../types'

const GEZEGENLER = [
  { ad: 'Dünya', g: 9.81 },
  { ad: 'Ay', g: 1.62 },
  { ad: 'Mars', g: 3.71 },
  { ad: 'Jüpiter', g: 24.8 },
]

const OLCEK = 0.22 // metre → sahne birimi

function EgikAtisSahne({ adim }: SahneProps) {
  const [v0, setV0] = useState(18)
  const [aci, setAci] = useState(45)
  const [azimut, setAzimut] = useState(0)
  const [gi, setGi] = useState(0)
  const [oynat, setOynat] = useState(true)
  const [serbestDusme, setSerbestDusme] = useState(false)

  const g = GEZEGENLER[gi].g
  const th = (aci * Math.PI) / 180
  const az = (azimut * Math.PI) / 180

  const vy = v0 * Math.sin(th)
  const vYatay = v0 * Math.cos(th)
  const vx = vYatay * Math.cos(az)
  const vz = vYatay * Math.sin(az)

  const ucus = (2 * vy) / g
  const menzil = vYatay * ucus
  const maxY = (vy * vy) / (2 * g)

  const [t] = useZaman(oynat, 1)
  const tt = oynat ? t % (ucus * 1.25) : ucus / 2
  const tk = Math.min(tt, ucus)

  const konum = (s: number): V3 => [
    vx * s * OLCEK,
    Math.max(vy * s - 0.5 * g * s * s, 0) * OLCEK,
    vz * s * OLCEK,
  ]

  const P = konum(tk)
  const anlikVy = vy - g * tk
  const hiz = Math.hypot(vYatay, anlikVy)

  // 4. adım: farklı açılar için yörünge ailesi
  const aile = useMemo(() => {
    if (adim < 4) return []
    return [15, 30, 45, 60, 75].map((d) => {
      const r = (d * Math.PI) / 180
      const vy2 = v0 * Math.sin(r)
      const vh = v0 * Math.cos(r)
      const T = (2 * vy2) / g
      return {
        d,
        f: (s: number): V3 => [
          vh * s * Math.cos(az) * OLCEK,
          (vy2 * s - 0.5 * g * s * s) * OLCEK,
          vh * s * Math.sin(az) * OLCEK,
        ],
        T,
        menzil: vh * T,
      }
    })
  }, [adim, v0, g, az])

  return (
    <Duzen
      gosterge={
        <Gosterge
          satirlar={[
            { ad: 'v₀', deger: `${v0.toFixed(1)} m/s` },
            { ad: 'açı', deger: `${aci.toFixed(0)}°` },
            { ad: 'g', deger: `${g} m/s²`, renk: '#8b7dff' },
            { ad: 'uçuş süresi', deger: `${ucus.toFixed(2)} s`, renk: '#ffb454' },
            { ad: 'menzil', deger: `${menzil.toFixed(1)} m`, renk: '#38e1c6' },
            { ad: 'max yükseklik', deger: `${maxY.toFixed(1)} m`, renk: '#f472b6' },
            { ad: 'anlık hız', deger: `${hiz.toFixed(1)} m/s` },
          ]}
        />
      }
      kontrol={
        <>
          <Kaydirac etiket="v₀ (m/s)" deger={v0} min={5} max={30} onChange={setV0} basamak={0} />
          <Kaydirac etiket="atış açısı" deger={aci} min={5} max={85} adim={1} basamak={0} onChange={setAci} birim="°" renk="#ffb454" />
          <Kaydirac etiket="yön (azimut)" deger={azimut} min={-80} max={80} adim={1} basamak={0} onChange={setAzimut} birim="°" renk="#8b7dff" />
          <div className="flex gap-1.5">
            {GEZEGENLER.map((p, i) => (
              <Dugme key={p.ad} onClick={() => setGi(i)} aktif={i === gi} boyut="sm" renk="#8b7dff">
                {p.ad}
              </Dugme>
            ))}
          </div>
          <Anahtar etiket="serbest düşen ikinci cisim" deger={serbestDusme} onChange={setSerbestDusme} />
          <Dugme onClick={() => setOynat(!oynat)} aktif={oynat} boyut="sm">
            {oynat ? '⏸ durdur' : '▶ oynat'}
          </Dugme>
        </>
      }
      sahne={
        <Sahne kamera={[6, 4.5, 11]} izgara maxUzaklik={45}>
          {/* Atış rampası */}
          <mesh position={[0, 0.12, 0]}>
            <cylinderGeometry args={[0.28, 0.36, 0.24, 20]} />
            <meshStandardMaterial color="#334867" />
          </mesh>

          {/* Yörünge */}
          <UzayEgrisi f={konum} t0={0} t1={ucus} renk="#38e1c6" kalinlik={3} />

          {/* Hareketli cisim */}
          <Nokta konum={P} renk="#ffb454" r={0.16} />

          {/* Hız vektörü ve bileşenleri */}
          {adim >= 1 && (
            <>
              <Ok
                baslangic={P}
                bitis={[P[0] + vx * OLCEK * 0.35, P[1] + anlikVy * OLCEK * 0.35, P[2] + vz * OLCEK * 0.35]}
                renk="#f472b6"
                kalinlik={0.04}
              />
              <Ok
                baslangic={P}
                bitis={[P[0] + vx * OLCEK * 0.35, P[1], P[2] + vz * OLCEK * 0.35]}
                renk="#38e1c6"
                kalinlik={0.032}
                baslikBoyu={0.2}
              />
              <Ok
                baslangic={P}
                bitis={[P[0], P[1] + anlikVy * OLCEK * 0.35, P[2]]}
                renk="#8b7dff"
                kalinlik={0.032}
                baslikBoyu={0.2}
              />
              <Etiket konum={[P[0] + 0.4, P[1] + 0.7, P[2]]} renk="#f472b6" kucuk>
                v = {hiz.toFixed(1)} m/s
              </Etiket>
              <Etiket konum={[P[0] + vx * OLCEK * 0.4, P[1] - 0.35, P[2]]} renk="#38e1c6" kucuk>
                vₓ sabit
              </Etiket>
              <Etiket konum={[P[0] - 0.55, P[1] + anlikVy * OLCEK * 0.4, P[2]]} renk="#8b7dff" kucuk>
                v_y değişiyor
              </Etiket>
            </>
          )}

          {/* Serbest düşen ikinci cisim: düşey hareketin bağımsızlığı */}
          {(serbestDusme || adim === 1) && (
            <>
              <Nokta
                konum={[-1.2, Math.max(vy * tk - 0.5 * g * tk * tk, 0) * OLCEK, 0]}
                renk="#94a3b8"
                r={0.14}
              />
              <Line
                points={[
                  [-1.2, P[1], 0],
                  [P[0], P[1], P[2]],
                ]}
                color="#64748b"
                lineWidth={1.2}
                dashed
                dashSize={0.16}
                gapSize={0.12}
              />
              <Etiket konum={[-1.2, -0.4, 0]} renk="#94a3b8" kucuk>
                aynı düşey hareket
              </Etiket>
            </>
          )}

          {/* Menzil ve tepe noktası */}
          {adim >= 3 && (
            <>
              <Line
                points={[
                  [0, 0.02, 0],
                  [menzil * Math.cos(az) * OLCEK, 0.02, menzil * Math.sin(az) * OLCEK],
                ]}
                color="#38e1c6"
                lineWidth={2.4}
              />
              <Etiket
                konum={[(menzil * Math.cos(az) * OLCEK) / 2, -0.4, (menzil * Math.sin(az) * OLCEK) / 2]}
                renk="#38e1c6"
                kucuk
              >
                menzil = {menzil.toFixed(1)} m
              </Etiket>
              <Nokta konum={konum(ucus / 2)} renk="#f472b6" r={0.12} />
              <Etiket konum={[konum(ucus / 2)[0], maxY * OLCEK + 0.45, konum(ucus / 2)[2]]} renk="#f472b6" kucuk>
                h_max = {maxY.toFixed(1)} m
              </Etiket>
            </>
          )}

          {/* Açı ailesi */}
          {adim >= 4 &&
            aile.map((y) => (
              <group key={y.d}>
                <UzayEgrisi
                  f={y.f}
                  t0={0}
                  t1={y.T}
                  renk={y.d === 45 ? '#ffb454' : '#42536f'}
                  kalinlik={y.d === 45 ? 3 : 1.8}
                />
                <Etiket
                  konum={[y.f(y.T)[0], 0.25, y.f(y.T)[2]]}
                  renk={y.d === 45 ? '#ffb454' : '#64748b'}
                  kucuk
                >
                  {y.d}°
                </Etiket>
              </group>
            ))}
        </Sahne>
      }
    />
  )
}

export const egikAtisModulu: DersModulu = {
  id: 'egik-atis',
  baslik: 'Eğik Atış — İki Bağımsız Hareketin Toplamı',
  altBaslik: 'Yatayda sabit hız, düşeyde serbest düşüş. İkisi birleşince parabol doğar.',
  ders: 'fizik',
  seviye: '11. Sınıf',
  sure: 18,
  etiketler: ['vektör', 'iki boyutta hareket', 'menzil', 'yer çekimi'],
  Sahne: EgikAtisSahne,
  adimlar: [
    {
      baslik: 'Atış',
      metin:
        'Bir cismi v₀ hızıyla, yatayla θ açısı yapacak şekilde fırlatıyoruz. Azimut kaydıracıyla atış yönünü de değiştirebilirsin — sahneyi döndürüp hareketin gerçekten üç boyutlu olduğunu gör.',
    },
    {
      baslik: 'Sır: hareketi ikiye ayır',
      metin:
        'Hızı yatay ve düşey bileşenlerine ayırıyoruz. Yatayda hiçbir kuvvet yok → vₓ SABİT kalır (yeşil ok hep aynı boy). Düşeyde yalnızca yer çekimi var → v_y azalır, sıfırlanır, sonra ters yöne büyür (mor ok). Gri top, aynı anda serbest bırakılan ikinci cisim: yüksekliği her an atılan cisimle AYNI. Yatay hareket, düşey hareketi etkilemez.',
    },
    {
      baslik: 'Yörünge neden parabol?',
      metin:
        'x = vₓ·t ve y = v_y·t − ½g·t² denklemlerinde t\'yi yok edersek y, x\'in ikinci dereceden bir fonksiyonu olur. Yani yörünge zorunlu olarak bir paraboldür. Gezegen düğmeleriyle g\'yi değiştir: Ay\'da parabol çok daha geniştir.',
    },
    {
      baslik: 'Menzil ve maksimum yükseklik',
      metin:
        'Cisim, düşey hızı sıfırlandığında en yüksek noktadadır (pembe nokta) ve uçuş süresinin tam yarısında oraya varır. Yere düştüğü andaki yatay uzaklık menzildir. Formüller: h_max = v₀²sin²θ / 2g, R = v₀²sin2θ / g.',
    },
    {
      baslik: 'Hangi açı en uzağa atar?',
      metin:
        'Aynı hızla farklı açılarda yapılan atışları birlikte çizdik. R = v₀²sin(2θ)/g ifadesinde sin(2θ) en büyük değerini 2θ = 90°, yani θ = 45° için alır. Ayrıca 30° ile 60° gibi tümler açılar aynı menzili verir — grafikte bunu doğrula.',
    },
  ],
  ispat: {
    baslik: 'Yörünge denklemi ve menzil formülünün türetilişi',
    satirlar: [
      { tex: 'v_x=v_0\\cos\\theta \\quad (\\text{sabit}),\\qquad v_y=v_0\\sin\\theta-gt' },
      { tex: 'x=v_0\\cos\\theta\\; t,\\qquad y=v_0\\sin\\theta\\; t-\\tfrac{1}{2}gt^{2}' },
      { tex: 't=\\dfrac{x}{v_0\\cos\\theta}', not: 'Birinci denklemden t çekilir' },
      {
        tex: 'y=x\\tan\\theta-\\dfrac{g}{2v_0^{2}\\cos^{2}\\theta}\\,x^{2}',
        not: 'Parabol denklemi',
      },
      { tex: 'y=0 \\Rightarrow t_{\\text{uçuş}}=\\dfrac{2v_0\\sin\\theta}{g}', not: 'Yere iniş anı' },
      {
        tex: 'R=v_0\\cos\\theta\\cdot t_{\\text{uçuş}}=\\dfrac{2v_0^{2}\\sin\\theta\\cos\\theta}{g}=\\dfrac{v_0^{2}\\sin 2\\theta}{g}',
      },
    ],
    sonuc: 'R_{\\max}=\\dfrac{v_0^{2}}{g}\\quad (\\theta=45^{\\circ})',
  },
  sorular: [
    {
      soru: 'Eğik atışta yatay hız bileşeni zamanla nasıl değişir? (hava direnci yok)',
      secenekler: ['Artar', 'Azalır', 'Sabit kalır', 'Önce artar sonra azalır'],
      dogru: 2,
      aciklama: 'Yatay doğrultuda kuvvet olmadığından ivme sıfırdır; vₓ sabit kalır.',
    },
    {
      soru: 'Cisim en yüksek noktadayken hızı hakkında ne söylenebilir?',
      secenekler: [
        'Hızı sıfırdır',
        'Yalnızca düşey bileşeni sıfırdır',
        'Yalnızca yatay bileşeni sıfırdır',
        'İvmesi sıfırdır',
      ],
      dogru: 1,
      aciklama:
        'Tepe noktasında v_y = 0 olur ama vₓ devam eder; bu yüzden hız sıfır değildir, yalnızca yataydır.',
    },
    {
      soru: 'Aynı hızla 30° ve 60° ile yapılan atışların menzilleri nasıldır?',
      secenekler: ['30° daha uzaktır', '60° daha uzaktır', 'Eşittir', 'Karşılaştırılamaz'],
      dogru: 2,
      aciklama: 'R = v₀²sin(2θ)/g. sin60° = sin120° olduğundan tümler açılar aynı menzili verir.',
    },
    {
      soru: 'Ay yüzeyinde aynı atış yapılırsa menzil nasıl değişir?',
      secenekler: ['Değişmez', 'Yaklaşık 6 kat artar', 'Yarıya iner', '6 kat azalır'],
      dogru: 1,
      aciklama:
        'R ile g ters orantılıdır. Ay\'da g ≈ 1,62 m/s², Dünya\'nın yaklaşık 1/6\'sı olduğundan menzil ~6 kat artar.',
    },
  ],
}
