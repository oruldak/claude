import { useState } from 'react'
import { Cizgi as Line, Etiket, Ok, Sahne, type V3 } from '../shared/sahne'
import { Anahtar, Dugme, Duzen, Gosterge, Kaydirac } from '../shared/ui'
import { useZaman } from '../shared/animasyon'
import type { DersModulu, SahneProps } from '../types'

const PIVOT_Y = 3.6

/** Enerji çubuğu (3B). */
function Cubuk({ x, deger, enBuyuk, renk, ad }: { x: number; deger: number; enBuyuk: number; renk: string; ad: string }) {
  const h = Math.max((deger / (enBuyuk || 1)) * 3, 0.001)
  return (
    <group position={[x, -2.6, 0]}>
      <mesh position={[0, h / 2, 0]}>
        <boxGeometry args={[0.5, h, 0.5]} />
        <meshStandardMaterial color={renk} roughness={0.4} />
      </mesh>
      <Etiket konum={[0, -0.42, 0]} renk={renk} kucuk>
        {ad}
      </Etiket>
      <Etiket konum={[0, h + 0.32, 0]} renk={renk} kucuk>
        {deger.toFixed(2)} J
      </Etiket>
    </group>
  )
}

function SarkacSahne({ adim }: SahneProps) {
  const [L, setL] = useState(2.4)
  const [th0, setTh0] = useState(35)
  const [g, setG] = useState(9.81)
  const [m, setM] = useState(1)
  const [oynat, setOynat] = useState(true)
  const [ikinci, setIkinci] = useState(false)

  const t0 = (th0 * Math.PI) / 180
  const T0 = 2 * Math.PI * Math.sqrt(L / g)
  // Genlik düzeltmeli periyot (yaklaşık seri açılım)
  const T = T0 * (1 + t0 ** 2 / 16 + (11 * t0 ** 4) / 3072)

  const [t] = useZaman(oynat, 1)
  const w = (2 * Math.PI) / T
  const th = t0 * Math.cos(w * t)
  const dth = -t0 * w * Math.sin(w * t)

  const v = Math.abs(L * dth)
  const yuk = L * (1 - Math.cos(th))
  const Ep = m * g * yuk
  const Ek = 0.5 * m * v * v
  const Etop = m * g * L * (1 - Math.cos(t0))

  const P: V3 = [L * Math.sin(th), PIVOT_Y - L * Math.cos(th), 0]
  // İkinci sarkaç: aynı uzunluk, farklı kütle → aynı periyot
  const P2: V3 = [L * Math.sin(th) + 2.6, PIVOT_Y - L * Math.cos(th), 0]

  const yay: V3[] = []
  for (let i = -20; i <= 20; i++) {
    const u = (t0 * i) / 20
    yay.push([L * Math.sin(u), PIVOT_Y - L * Math.cos(u), 0])
  }

  return (
    <Duzen
      gosterge={
        <Gosterge
          satirlar={[
            { ad: 'uzunluk L', deger: `${L.toFixed(2)} m` },
            { ad: 'genlik θ₀', deger: `${th0.toFixed(0)}°`, renk: '#b45309' },
            { ad: 'periyot T', deger: `${T.toFixed(3)} s`, renk: '#0f766e' },
            { ad: 'T₀ = 2π√(L/g)', deger: `${T0.toFixed(3)} s`, renk: '#4338ca' },
            { ad: 'hız v', deger: `${v.toFixed(2)} m/s` },
            { ad: 'Eₖ + Eₚ', deger: `${(Ek + Ep).toFixed(3)} J`, renk: '#15803d' },
          ]}
        />
      }
      kontrol={
        <>
          <Kaydirac etiket="L (m)" deger={L} min={0.8} max={3.4} onChange={setL} basamak={2} />
          <Kaydirac etiket="θ₀" deger={th0} min={5} max={80} adim={1} basamak={0} onChange={setTh0} birim="°" renk="#b45309" />
          <Kaydirac etiket="kütle m (kg)" deger={m} min={0.2} max={5} onChange={setM} basamak={1} renk="#be185d" />
          <Kaydirac etiket="g (m/s²)" deger={g} min={1.6} max={25} onChange={setG} basamak={2} renk="#4338ca" />
          <Anahtar etiket="ikinci sarkaç (farklı kütle)" deger={ikinci} onChange={setIkinci} />
          <Dugme onClick={() => setOynat(!oynat)} aktif={oynat} boyut="sm">
            {oynat ? '⏸ durdur' : '▶ oynat'}
          </Dugme>
        </>
      }
      sahne={
        <Sahne kamera={[1.5, 1.0, 10]} zemin="ahsap" zeminY={-3.15} maxUzaklik={30}>
          {/* Askı kirişi ve ayakları */}
          <mesh position={[1.3, PIVOT_Y + 0.22, 0]} castShadow receiveShadow>
            <boxGeometry args={[6.6, 0.28, 0.6]} />
            <meshStandardMaterial color="#6b4b2f" roughness={0.75} metalness={0.05} />
          </mesh>
          {[-1.7, 4.2].map((x) => (
            <mesh key={x} position={[x, (PIVOT_Y - 3.05) / 2 + 0.05, 0]} castShadow>
              <boxGeometry args={[0.22, PIVOT_Y + 3.05, 0.22]} />
              <meshStandardMaterial color="#7a5636" roughness={0.8} />
            </mesh>
          ))}

          {/* Denge doğrultusu ve yay */}
          <Line points={[[0, PIVOT_Y, 0], [0, PIVOT_Y - L - 0.4, 0]] as V3[]} color="#c9c0b1" lineWidth={1.4} dashed dashSize={0.14} gapSize={0.1} />
          <Line points={yay} color="#d8cfc0" lineWidth={2} />

          {/* İp ve top */}
          <Line points={[[0, PIVOT_Y, 0], P]} color="#6b7280" lineWidth={2.4} />
          <mesh position={P} castShadow>
            <sphereGeometry args={[0.14 + m * 0.045, 40, 28]} />
            <meshStandardMaterial color="#b9bdc6" roughness={0.16} metalness={0.95} />
          </mesh>
          <Etiket konum={[0.55, PIVOT_Y - 0.35, 0]} renk="#4338ca" kucuk>
            θ = {((th * 180) / Math.PI).toFixed(1)}°
          </Etiket>

          {/* İkinci sarkaç */}
          {(ikinci || adim === 3) && (
            <>
              <Line points={[[2.6, PIVOT_Y, 0], P2]} color="#8a8f9c" lineWidth={2.2} />
              <mesh position={P2} castShadow>
                <sphereGeometry args={[0.34, 40, 28]} />
                <meshStandardMaterial color="#c4708f" roughness={0.22} metalness={0.7} />
              </mesh>
              <Etiket konum={[2.6, PIVOT_Y - L - 0.7, 0]} renk="#be185d" kucuk>
                4 kat kütle — aynı periyot
              </Etiket>
            </>
          )}

          {/* Kuvvet bileşenleri */}
          {adim >= 1 && (
            <>
              <Ok baslangic={P} bitis={[P[0], P[1] - 1.3, 0]} renk="#be185d" kalinlik={0.038} />
              <Etiket konum={[P[0] + 0.42, P[1] - 1.35, 0]} renk="#be185d" kucuk>
                G = mg
              </Etiket>
              {/* İp doğrultusundaki bileşen (mg cosθ) ve dik bileşen (mg sinθ) */}
              <Ok
                baslangic={P}
                bitis={[P[0] + 1.3 * Math.sin(th) * Math.cos(th), P[1] - 1.3 * Math.cos(th) * Math.cos(th), 0]}
                renk="#6b7280"
                kalinlik={0.03}
                baslikBoyu={0.2}
              />
              <Ok
                baslangic={P}
                bitis={[P[0] - 1.3 * Math.cos(th) * Math.sin(th), P[1] - 1.3 * Math.sin(th) * Math.sin(th), 0]}
                renk="#0f766e"
                kalinlik={0.03}
                baslikBoyu={0.2}
              />
              <Etiket konum={[P[0] - 1.5 * Math.cos(th) * Math.sin(th), P[1] - 1.5 * Math.sin(th) * Math.sin(th) + 0.2, 0]} renk="#0f766e" kucuk>
                mg·sinθ (geri çağırıcı)
              </Etiket>
            </>
          )}

          {/* Enerji çubukları */}
          {adim >= 2 && (
            <>
              <Cubuk x={-4.2} deger={Ep} enBuyuk={Etop} renk="#4338ca" ad="Eₚ" />
              <Cubuk x={-3.3} deger={Ek} enBuyuk={Etop} renk="#b45309" ad="Eₖ" />
              <Cubuk x={-2.4} deger={Ek + Ep} enBuyuk={Etop} renk="#15803d" ad="toplam" />
              <Etiket konum={[-3.3, 1.1, 0]} renk="#15803d" kucuk>
                toplam enerji sabit
              </Etiket>
            </>
          )}
        </Sahne>
      }
    />
  )
}

export const sarkacModulu: DersModulu = {
  id: 'sarkac',
  baslik: 'Basit Sarkaç — Enerjinin Korunumu ve Periyot',
  altBaslik: 'Neden periyot kütleye bağlı değil? Enerji nereye gidiyor?',
  ders: 'fizik',
  seviye: '9. / 12. Sınıf',
  sure: 16,
  etiketler: ['enerji korunumu', 'basit harmonik hareket', 'periyot', 'kuvvet bileşenleri'],
  Sahne: SarkacSahne,
  adimlar: [
    {
      baslik: 'Salınan bir kütle',
      metin:
        'Bir ipin ucuna bağlı kütleyi denge konumundan θ₀ kadar uzaklaştırıp bırakıyoruz. Sistem sürekli olarak denge konumuna dönmeye çalışıyor ama her seferinde öteye geçiyor. Bu tekrarlı harekete salınım denir.',
    },
    {
      baslik: 'Geri çağırıcı kuvvet',
      metin:
        'Ağırlığı iki bileşene ayırdık: ip doğrultusundaki mg·cosθ (gri) ipin gerilmesiyle dengelenir; ipe dik olan mg·sinθ (yeşil) ise kütleyi hep dengeye doğru iter. İşte hareketi doğuran kuvvet budur ve θ büyüdükçe büyür.',
    },
    {
      baslik: 'Enerji dönüşümü',
      metin:
        'Uçlarda hız sıfır, yükseklik en fazladır → enerjinin tamamı potansiyel (mor). Dengeden geçerken yükseklik sıfır, hız en büyüktür → enerjinin tamamı kinetik (turuncu). Yeşil çubuk hiç değişmiyor: sürtünmesiz ortamda toplam mekanik enerji korunur.',
    },
    {
      baslik: 'Periyot neyе bağlı?',
      metin:
        'Kütle kaydıracını değiştir: periyot kılını kıpırdatmıyor. İkinci sarkaç 4 kat ağır olmasına rağmen tamamen aynı ritimde salınıyor. Çünkü hem geri çağırıcı kuvvet hem eylemsizlik kütleyle orantılıdır, m sadeleşir. Buna karşılık L\'yi artırınca periyot uzuyor, g\'yi artırınca kısalıyor.',
    },
    {
      baslik: 'Küçük açı yaklaşımı',
      metin:
        'θ küçükken sinθ ≈ θ olur ve hareket tam olarak basit harmonik harekete dönüşür: T = 2π√(L/g). Genliği 60-80°ye çıkardığında gerçek periyodun (T) formülün verdiği değerden (T₀) sapmaya başladığını göstergede gör — yaklaşımın sınırı budur.',
    },
  ],
  ispat: {
    baslik: 'Periyot formülünün türetilişi',
    satirlar: [
      { tex: 'F_{\\text{geri}}=-mg\\sin\\theta', not: 'Yay doğrultusuna dik bileşen' },
      { tex: '\\theta \\ll 1 \\Rightarrow \\sin\\theta \\approx \\theta', not: 'Küçük açı yaklaşımı (radyan!)' },
      { tex: 'x=L\\theta \\Rightarrow F\\approx -\\frac{mg}{L}x', not: 'Hooke yasası biçiminde: F = −kx' },
      { tex: 'k_{\\text{etkin}}=\\frac{mg}{L}' },
      { tex: 'T=2\\pi\\sqrt{\\frac{m}{k}}=2\\pi\\sqrt{\\frac{m}{mg/L}}', not: 'BHH periyodu' },
      { tex: '\\text{Enerji: } \\frac{1}{2}mv^{2}+mgL(1-\\cos\\theta)=\\text{sabit}', not: 'Korunum yasası' },
    ],
    sonuc: 'T=2\\pi\\sqrt{\\dfrac{L}{g}}\\quad (\\text{kütleden bağımsız})',
  },
  sorular: [
    {
      soru: 'Basit sarkacın periyodu aşağıdakilerden hangisine bağlı DEĞİLDİR?',
      secenekler: ['İp uzunluğuna', 'Yer çekimi ivmesine', 'Asılı kütleye', 'Bulunduğu gezegene'],
      dogru: 2,
      aciklama: 'T = 2π√(L/g) ifadesinde kütle yoktur; m hem kuvvette hem eylemsizlikte olduğu için sadeleşir.',
    },
    {
      soru: 'Sarkacın kinetik enerjisi nerede en büyüktür?',
      secenekler: ['En yüksek noktada', 'Denge konumunda', 'Yolun çeyreğinde', 'Her yerde eşittir'],
      dogru: 1,
      aciklama: 'Denge konumunda yükseklik (dolayısıyla potansiyel enerji) en küçük, hız en büyüktür.',
    },
    {
      soru: 'İp uzunluğu 4 katına çıkarılırsa periyot nasıl değişir?',
      secenekler: ['2 katına çıkar', '4 katına çıkar', 'Yarıya iner', 'Değişmez'],
      dogru: 0,
      aciklama: 'T, √L ile orantılıdır; L 4 katına çıkarsa T √4 = 2 katına çıkar.',
    },
    {
      soru: 'Sürtünmeli ortamda salınan sarkaçta hangisi korunmaz?',
      secenekler: ['Toplam enerji', 'Mekanik enerji', 'Kütle', 'Periyot yaklaşık olarak'],
      dogru: 1,
      aciklama:
        'Sürtünme mekanik enerjiyi ısıya çevirir; mekanik enerji azalır, ancak toplam enerji (ısı dâhil) korunur.',
    },
  ],
}
