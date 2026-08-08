import { useMemo, useState } from 'react'
import * as THREE from 'three'
import { Cizgi as Line, Egri, Eksenler, Etiket, Sahne, type V3 } from '../shared/sahne'
import { Anahtar, Dugme, Duzen, Gosterge, Kaydirac } from '../shared/ui'
import { useGecis } from '../shared/animasyon'
import type { DersModulu, SahneProps } from '../types'

interface FTanim {
  ad: string
  f: (x: number) => number
  /** π∫f² dx'in ilkel fonksiyonu */
  V: (x: number) => number
  tex: string
  enBuyukB: number
}

const FONKSIYONLAR: FTanim[] = [
  {
    ad: '√x',
    f: (x) => Math.sqrt(Math.max(x, 0)),
    V: (x) => (Math.PI * x * x) / 2,
    tex: 'f(x)=\\sqrt{x}',
    enBuyukB: 4.5,
  },
  {
    ad: 'x/2 (koni)',
    f: (x) => x / 2,
    V: (x) => (Math.PI * x ** 3) / 12,
    tex: 'f(x)=\\dfrac{x}{2}',
    enBuyukB: 5,
  },
  {
    ad: 'sin x + 1',
    f: (x) => Math.sin(x) + 1,
    V: (x) => Math.PI * (1.5 * x - Math.sin(2 * x) / 4 - 2 * Math.cos(x)),
    tex: 'f(x)=\\sin x+1',
    enBuyukB: 2 * Math.PI,
  },
]

function DonelSahne({ adim }: SahneProps) {
  const [fi, setFi] = useState(0)
  const [a, setA] = useState(0)
  const [b, setB] = useState(4)
  const [n, setN] = useState(8)
  const [katiGoster, setKatiGoster] = useState(true)
  const [oynat, setOynat] = useState(true)

  const fn = FONKSIYONLAR[fi]
  const gecis = useGecis(`${adim}-${fi}`, 2)

  // 1. adımda bölge eksen etrafında süpürülür
  const theta = adim === 0 ? 0 : adim === 1 ? (oynat ? gecis * Math.PI * 2 : Math.PI * 2) : Math.PI * 2
  const nEt = adim === 3 ? Math.round(4 + gecis * gecis * 56) : n

  const latheNoktalari = useMemo(() => {
    const p: THREE.Vector2[] = []
    const adet = 90
    for (let i = 0; i <= adet; i++) {
      const x = a + ((b - a) * i) / adet
      p.push(new THREE.Vector2(Math.max(fn.f(x), 0.0001), x))
    }
    return p
  }, [a, b, fn])

  const dx = (b - a) / nEt
  const diskler = useMemo(() => {
    const d: { x: number; r: number }[] = []
    for (let i = 0; i < nEt; i++) {
      const orta = a + (i + 0.5) * dx
      d.push({ x: orta, r: Math.max(fn.f(orta), 0.001) })
    }
    return d
  }, [a, nEt, dx, fn])

  const yaklasik = diskler.reduce((s, d) => s + Math.PI * d.r * d.r * dx, 0)
  const kesin = fn.V(b) - fn.V(a)

  return (
    <Duzen
      gosterge={
        <Gosterge
          satirlar={[
            { ad: 'dilim sayısı', deger: adim >= 2 ? nEt : '—' },
            { ad: 'disk toplamı', deger: adim >= 2 ? yaklasik.toFixed(4) : '—', renk: '#b45309' },
            { ad: 'kesin hacim', deger: kesin.toFixed(4), renk: '#0f766e' },
            { ad: 'dönme açısı', deger: `${Math.round((theta * 180) / Math.PI)}°`, renk: '#4338ca' },
          ]}
        />
      }
      kontrol={
        <>
          <div className="flex gap-1.5">
            {FONKSIYONLAR.map((f, i) => (
              <Dugme
                key={f.ad}
                onClick={() => {
                  setFi(i)
                  setB(Math.min(b, FONKSIYONLAR[i].enBuyukB))
                }}
                aktif={i === fi}
                boyut="sm"
              >
                {f.ad}
              </Dugme>
            ))}
          </div>
          <Kaydirac etiket="a" deger={a} min={0} max={b - 0.5} onChange={setA} basamak={1} />
          <Kaydirac etiket="b" deger={b} min={a + 0.5} max={fn.enBuyukB} onChange={setB} basamak={1} />
          <Kaydirac etiket="dilim (n)" deger={n} min={2} max={60} adim={1} basamak={0} onChange={setN} renk="#b45309" />
          <Anahtar etiket="katı yüzey" deger={katiGoster} onChange={setKatiGoster} />
          <Dugme onClick={() => setOynat(!oynat)} aktif={oynat} boyut="sm">
            {oynat ? '⏸ durdur' : '▶ oynat'}
          </Dugme>
        </>
      }
      sahne={
        <Sahne kamera={[5, 3.6, 8.5]} zemin="studyo" zeminY={-1.6} maxUzaklik={30} otoDondur={adim >= 4}>
          <Eksenler boy={5.5} eksiBoy={1.2} zBoy={3} bolme={1} adlar={['x', 'y', 'z']} />

          {/* Döndürülen bölgenin sınırı */}
          <Egri f={fn.f} x0={a} x1={b} renk="#0369a1" kalinlik={3.4} />
          <Line points={[[a, 0, 0], [b, 0, 0]] as V3[]} color="#0369a1" lineWidth={2} />
          <Line points={[[a, 0, 0], [a, fn.f(a), 0]] as V3[]} color="#0369a1" lineWidth={2} />
          <Line points={[[b, 0, 0], [b, fn.f(b), 0]] as V3[]} color="#0369a1" lineWidth={2} />

          {adim === 0 && (
            <Etiket konum={[(a + b) / 2, fn.f((a + b) / 2) / 2 + 0.2, 0]} renk="#0369a1">
              bu bölge x ekseni etrafında dönecek
            </Etiket>
          )}

          {/* Dönel yüzey */}
          {theta > 0.01 && katiGoster && (
            <group rotation={[0, 0, -Math.PI / 2]}>
              <mesh>
                <latheGeometry args={[latheNoktalari, 72, 0, theta]} />
                <meshStandardMaterial
                  color="#0f766e"
                  transparent
                  opacity={adim >= 2 ? 0.18 : 0.42}
                  side={THREE.DoubleSide}
                  roughness={0.35}
                  metalness={0.15}
                />
              </mesh>
            </group>
          )}

          {/* Disk (silindir) yaklaşımı */}
          {adim >= 2 &&
            diskler.map((d, i) => (
              <mesh key={i} position={[d.x, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[d.r, d.r, dx * 0.94, 40, 1, false]} />
                <meshStandardMaterial
                  color={i % 2 ? '#b45309' : '#c2620a'}
                  transparent
                  opacity={nEt > 30 ? 0.7 : 0.55}
                  roughness={0.4}
                />
              </mesh>
            ))}

          {/* Tek diskin anatomisi */}
          {adim === 2 && diskler.length > 2 && (
            <>
              <Line
                points={[
                  [diskler[2].x, 0, 0],
                  [diskler[2].x, diskler[2].r, 0],
                ]}
                color="#be185d"
                lineWidth={2.6}
              />
              <Etiket konum={[diskler[2].x, diskler[2].r + 0.45, 0]} renk="#be185d" kucuk>
                yarıçap = f(x)
              </Etiket>
              <Etiket konum={[diskler[2].x, -0.55, 0]} renk="#be185d" kucuk>
                kalınlık = dx
              </Etiket>
            </>
          )}

          {adim >= 4 && (
            <Etiket konum={[(a + b) / 2, -1.6, 0]} renk="#0f766e">
              V = π∫ₐᵇ f(x)² dx = {kesin.toFixed(3)}
            </Etiket>
          )}
        </Sahne>
      }
    />
  )
}

export const donelCisimModulu: DersModulu = {
  id: 'donel-cisim',
  baslik: 'Dönel Cisimlerin Hacmi — Disk Yöntemi',
  altBaslik: 'Düzlemsel bir bölgeyi eksen etrafında döndür, hacmini disklerle biriktir.',
  ders: 'matematik',
  seviye: '12. Sınıf',
  sure: 16,
  etiketler: ['integral', 'hacim', 'uzay geometri', 'disk yöntemi'],
  Sahne: DonelSahne,
  adimlar: [
    {
      baslik: 'Döndürülecek bölge',
      metin:
        'y = f(x) eğrisi, x ekseni ve x = a, x = b doğrularının sınırladığı düzlemsel bölgeyle başlıyoruz. Bu bölge şimdilik düz bir levha; hacmi yok, yalnızca alanı var.',
    },
    {
      baslik: 'Ekseni etrafında döndür',
      metin:
        'Bölgeyi x ekseni etrafında 360° döndürüyoruz. Sahneyi fareyle çevirerek oluşan katı cisme her açıdan bak. Dikkat et: eksene dik her kesit bir DAİREdir ve o dairenin yarıçapı tam olarak f(x)\'tir.',
    },
    {
      baslik: 'Cismi disklere ayır',
      metin:
        'Cismi eksene dik ince dilimlere ayırıyoruz. Her dilim, yarıçapı f(x) ve kalınlığı dx olan bir silindire (diske) çok yakındır. Bir diskin hacmi: π·f(x)²·dx.',
    },
    {
      baslik: 'Dilimleri incelt',
      metin:
        'Dilim sayısı otomatik olarak artıyor. Basamaklı yüzey gerçek yüzeye yaklaşıyor ve disklerin hacim toplamı kesin hacme yakınsıyor. Göstergede "disk toplamı" ile "kesin hacim" arasındaki farkın kapandığını izle.',
    },
    {
      baslik: 'Formül ve doğrulama',
      metin:
        'Limitte toplam bir integrale dönüşür: V = π∫ₐᵇ f(x)²dx. f(x) = x/2 seçip a = 0, b = h alırsan sonuç πh³/12 çıkar — bu, taban yarıçapı h/2 olan koninin (1/3)πr²h hacmiyle birebir aynıdır. Formül kendini doğruluyor.',
    },
  ],
  ispat: {
    baslik: 'Disk yönteminin türetilişi ve koni hacminin ispatı',
    satirlar: [
      { tex: '\\Delta V_i \\approx \\pi\\,[f(x_i)]^{2}\\,\\Delta x', not: 'Bir dilim ≈ silindir' },
      { tex: 'V \\approx \\sum_{i=1}^{n} \\pi\\,[f(x_i)]^{2}\\,\\Delta x', not: 'Dilimleri topla' },
      {
        tex: 'V=\\lim_{n\\to\\infty}\\sum_{i=1}^{n}\\pi [f(x_i)]^{2}\\Delta x=\\pi\\int_a^b [f(x)]^{2}dx',
        not: 'Riemann toplamının limiti',
      },
      { tex: '\\text{Koni: } f(x)=\\frac{r}{h}x,\\quad x\\in[0,h]', not: 'Doğrusal kenar' },
      { tex: 'V=\\pi\\int_0^h \\frac{r^{2}}{h^{2}}x^{2}\\,dx=\\frac{\\pi r^{2}}{h^{2}}\\cdot\\frac{h^{3}}{3}' },
    ],
    sonuc: 'V_{\\text{koni}}=\\frac{1}{3}\\pi r^{2}h',
  },
  sorular: [
    {
      soru: 'Disk yönteminde eksene dik kesitler hangi şekildedir?',
      secenekler: ['Kare', 'Daire', 'Üçgen', 'Dikdörtgen'],
      dogru: 1,
      aciklama: 'Bölge bir eksen etrafında tam tur döndüğü için eksene dik her kesit dairedir.',
    },
    {
      soru: 'y = √x eğrisinin 0 ≤ x ≤ 4 aralığındaki bölgesi x ekseni etrafında döndürülürse hacim kaçtır?',
      secenekler: ['4π', '8π', '16π', '2π'],
      dogru: 1,
      aciklama: 'V = π∫₀⁴ x dx = π·[x²/2]₀⁴ = π·8 = 8π.',
    },
    {
      soru: 'Diskin hacim ifadesinde neden f(x) kare alınır?',
      secenekler: [
        'Kalınlık iki kez sayıldığı için',
        'Dairenin alanı πr² olduğu için',
        'İntegral kare aldığı için',
        'Simetriden dolayı',
      ],
      dogru: 1,
      aciklama: 'Diskin taban alanı πr² = π[f(x)]², hacmi ise taban alanı × kalınlıktır.',
    },
  ],
}
