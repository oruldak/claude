import { useMemo, useState } from 'react'
import { Cizgi as Line, Egri, Etiket, Nokta, Sahne, UzayEgrisi, type V3 } from '../shared/sahne'
import { Anahtar, Dugme, Duzen, Gosterge, Kaydirac } from '../shared/ui'
import { useZaman } from '../shared/animasyon'
import type { DersModulu, SahneProps } from '../types'

const CX = -4.6 // çemberin merkezi
const R = 1.7 // görsel yarıçap (1 birim = R)
const G0 = CX + R + 0.9 // grafiğin başlangıç x'i

function BirimCemberSahne({ adim }: SahneProps) {
  const [oynat, setOynat] = useState(true)
  const [elle, setElle] = useState(2.1)
  const [cosGoster, setCosGoster] = useState(false)
  const [genlik, setGenlik] = useState(1)
  const [periyotK, setPeriyotK] = useState(1)
  const [oteleme, setOteleme] = useState(0)

  const [t] = useZaman(oynat, 0.7)
  const th = oynat ? (t % (Math.PI * 2)) : elle

  const P: V3 = [CX + R * Math.cos(th), R * Math.sin(th), 0]
  const cember = useMemo(() => {
    const p: V3[] = []
    for (let i = 0; i <= 120; i++) {
      const u = (i / 120) * Math.PI * 2
      p.push([CX + R * Math.cos(u), R * Math.sin(u), 0])
    }
    return p
  }, [])

  const yay = useMemo(() => {
    const p: V3[] = []
    const adet = Math.max(2, Math.round((th / (Math.PI * 2)) * 120))
    for (let i = 0; i <= adet; i++) {
      const u = (th * i) / adet
      p.push([CX + R * Math.cos(u), R * Math.sin(u), 0])
    }
    return p
  }, [th])

  // Sinüs grafiği: yatay eksen açı (radyan), 1 radyan = R birim
  const A = adim >= 5 ? genlik : 1
  const b = adim >= 5 ? periyotK : 1
  const c = adim >= 5 ? oteleme : 0
  const sinF = (x: number) => A * R * Math.sin(b * ((x - G0) / R) + c)
  const cosF = (x: number) => A * R * Math.cos(b * ((x - G0) / R) + c)
  const grafikSonu = adim >= 3 ? G0 + th * R : G0

  // Sarmal (helix): 3B'de tek eğri, iki gölge
  const helix = (u: number): V3 => [CX + R * Math.cos(u), R * Math.sin(u), -u * 0.62]
  const helixSon = Math.max(th, 0.001) + (oynat ? 0 : 0)

  return (
    <Duzen
      gosterge={
        <Gosterge
          satirlar={[
            { ad: 'θ (radyan)', deger: th.toFixed(3), renk: '#8b7dff' },
            { ad: 'θ (derece)', deger: `${((th * 180) / Math.PI).toFixed(1)}°` },
            { ad: 'cos θ', deger: Math.cos(th).toFixed(3), renk: '#ffb454' },
            { ad: 'sin θ', deger: Math.sin(th).toFixed(3), renk: '#38e1c6' },
          ]}
        />
      }
      kontrol={
        <>
          <Dugme onClick={() => setOynat(!oynat)} aktif={oynat} boyut="sm">
            {oynat ? '⏸ durdur' : '▶ oynat'}
          </Dugme>
          <Kaydirac
            etiket="θ (elle)"
            deger={elle}
            min={0}
            max={Math.PI * 2}
            onChange={(v) => {
              setElle(v)
              setOynat(false)
            }}
            renk="#8b7dff"
          />
          <Anahtar etiket="kosinüs eğrisi" deger={cosGoster} onChange={setCosGoster} renk="#ffb454" />
          {adim >= 5 && (
            <>
              <Kaydirac etiket="genlik a" deger={genlik} min={0.2} max={2} onChange={setGenlik} basamak={1} />
              <Kaydirac etiket="b (periyot)" deger={periyotK} min={0.5} max={4} onChange={setPeriyotK} basamak={1} renk="#ffb454" />
              <Kaydirac etiket="c (öteleme)" deger={oteleme} min={-3.14} max={3.14} onChange={setOteleme} basamak={2} renk="#f472b6" />
            </>
          )}
        </>
      }
      sahne={
        <Sahne kamera={[0, 1.5, 13]} izgara={false} maxUzaklik={36}>
          {/* Çember ve eksenleri */}
          <Line points={cember} color="#334867" lineWidth={2} />
          <Line points={[[CX - R - 0.6, 0, 0], [CX + R + 0.6, 0, 0]] as V3[]} color="#3d4d6b" lineWidth={1.4} />
          <Line points={[[CX, -R - 0.6, 0], [CX, R + 0.6, 0]] as V3[]} color="#3d4d6b" lineWidth={1.4} />
          <Etiket konum={[CX, -R - 1.05, 0]} renk="#64748b" kucuk>
            birim çember (r = 1)
          </Etiket>

          {/* Yönlü açı ve yay */}
          <Line points={[[CX, 0, 0], P]} color="#8b7dff" lineWidth={2.6} />
          {yay.length > 1 && <Line points={yay} color="#8b7dff" lineWidth={4} />}
          <Nokta konum={P} renk="#e6ecf7" r={0.11} />
          <Etiket konum={[CX + 0.55 * Math.cos(th / 2), 0.55 * Math.sin(th / 2), 0]} renk="#8b7dff" kucuk>
            θ
          </Etiket>

          {/* sin ve cos bileşenleri */}
          {adim >= 1 && (
            <>
              <Line points={[[P[0], 0, 0], P]} color="#38e1c6" lineWidth={3} />
              <Line points={[[CX, 0, 0], [P[0], 0, 0]] as V3[]} color="#ffb454" lineWidth={3} />
              <Etiket konum={[P[0] + 0.55, P[1] / 2, 0]} renk="#38e1c6" kucuk>
                sin θ
              </Etiket>
              <Etiket konum={[(CX + P[0]) / 2, -0.42, 0]} renk="#ffb454" kucuk>
                cos θ
              </Etiket>
            </>
          )}

          {adim === 2 && (
            <Etiket konum={[CX, R + 1.15, 0]} renk="#8b7dff" kucuk>
              yay uzunluğu = θ  →  radyanın tanımı
            </Etiket>
          )}

          {/* Sinüs grafiğinin doğuşu */}
          {adim >= 3 && (
            <>
              <Line points={[[G0 - 0.4, 0, 0], [G0 + Math.PI * 2 * R + 0.5, 0, 0]] as V3[]} color="#3d4d6b" lineWidth={1.4} />
              <Line points={[[G0, -R * 2.1, 0], [G0, R * 2.1, 0]] as V3[]} color="#3d4d6b" lineWidth={1.4} />
              <Egri f={sinF} x0={G0} x1={adim >= 5 ? G0 + Math.PI * 2 * R : grafikSonu} renk="#38e1c6" kalinlik={3.2} adet={300} />
              {(cosGoster || adim >= 5) && (
                <Egri f={cosF} x0={G0} x1={adim >= 5 ? G0 + Math.PI * 2 * R : grafikSonu} renk="#ffb454" kalinlik={2.6} adet={300} kesikli />
              )}
              {/* P noktasının yüksekliğini grafiğe taşıyan bağ */}
              <Line
                points={[P, [G0 + th * R, P[1], 0]] as V3[]}
                color="#38e1c6"
                lineWidth={1.3}
                dashed
                dashSize={0.16}
                gapSize={0.12}
              />
              <Nokta konum={[G0 + th * R, A * R * Math.sin(b * th + c), 0]} renk="#38e1c6" r={0.1} />
              {[Math.PI / 2, Math.PI, (3 * Math.PI) / 2, Math.PI * 2].map((v) => (
                <Etiket key={v} konum={[G0 + v * R, -0.45, 0]} renk="#64748b" arka="transparent" kucuk>
                  {v === Math.PI ? 'π' : v === Math.PI * 2 ? '2π' : v === Math.PI / 2 ? 'π/2' : '3π/2'}
                </Etiket>
              ))}
            </>
          )}

          {/* Sarmal: tek eğrinin iki gölgesi */}
          {adim === 4 && (
            <>
              <UzayEgrisi f={helix} t0={0} t1={Math.max(helixSon, 0.05)} renk="#f472b6" kalinlik={3} />
              <UzayEgrisi
                f={(u) => [CX - R - 1.2, R * Math.sin(u), -u * 0.62]}
                t0={0}
                t1={Math.max(helixSon, 0.05)}
                renk="#38e1c6"
                kalinlik={2.4}
              />
              <UzayEgrisi
                f={(u) => [CX + R * Math.cos(u), -R - 1.2, -u * 0.62]}
                t0={0}
                t1={Math.max(helixSon, 0.05)}
                renk="#ffb454"
                kalinlik={2.4}
              />
              <Nokta konum={helix(th)} renk="#f472b6" r={0.11} />
              <Etiket konum={[CX - R - 1.2, R + 0.5, -helixSon * 0.62]} renk="#38e1c6" kucuk>
                sin gölgesi
              </Etiket>
              <Etiket konum={[CX, -R - 1.7, -helixSon * 0.62]} renk="#ffb454" kucuk>
                cos gölgesi
              </Etiket>
            </>
          )}
        </Sahne>
      }
    />
  )
}

export const birimCemberModulu: DersModulu = {
  id: 'birim-cember',
  baslik: 'Birim Çember — Sinüs ve Kosinüsün Doğuşu',
  altBaslik:
    'Çember üzerinde dolaşan bir nokta, dalgayı nasıl çiziyor? Radyan neden "doğal" birim?',
  ders: 'matematik',
  seviye: '11. Sınıf',
  sure: 16,
  etiketler: ['trigonometri', 'radyan', 'periyodik fonksiyon', 'grafik'],
  Sahne: BirimCemberSahne,
  adimlar: [
    {
      baslik: 'Birim çember ve yönlü açı',
      metin:
        'Merkezi orijinde, yarıçapı 1 olan çembere birim çember denir. Pozitif x ekseninden saat yönünün tersine döndüğümüz açıya θ diyoruz. Nokta çember üzerinde dolaşırken açı büyür.',
    },
    {
      baslik: 'sin θ ve cos θ aslında birer koordinat',
      metin:
        'Çember üzerindeki P noktasının koordinatları tam olarak (cos θ, sin θ)\'dır. Yani kosinüs yatay uzaklık, sinüs dikey uzaklıktır. Turuncu ve yeşil parçaların uzunluklarını göstergedeki değerlerle karşılaştır.',
    },
    {
      baslik: 'Radyan: açıyı yay ile ölçmek',
      metin:
        'Birim çemberde θ açısının gördüğü yayın uzunluğu tam olarak θ\'dır. Mor yay büyüdükçe açı büyür. Tam turda yay 2π olduğundan 360° = 2π radyandır. Radyan, yarıçapı birim alan doğal ölçüdür — türev formüllerinin sadeliği buradan gelir.',
    },
    {
      baslik: 'Çemberi açarsak: sinüs dalgası',
      metin:
        'Şimdi noktanın YÜKSEKLİĞİNİ, açı ilerledikçe sağa doğru taşıyoruz. Çember üzerindeki dolanma, sağdaki dalgayı çiziyor. Dalga bir tam turda kendini tekrar eder; bu yüzden periyot 2π\'dir.',
    },
    {
      baslik: 'Üç boyutta: tek eğrinin iki gölgesi',
      metin:
        'Noktayı dönerken aynı zamanda ileri doğru kaydırırsak uzayda bir SARMAL oluşur. Bu sarmalın bir duvara düşen gölgesi sinüs, zemine düşen gölgesi kosinüstür. Sahneyi döndürerek gölgeleri karşılaştır: sinüs ve kosinüs aynı hareketin iki farklı bakış açısıdır.',
    },
    {
      baslik: 'Genlik, periyot, öteleme',
      metin:
        'y = a·sin(bθ + c) fonksiyonunda a genliği (yüksekliği), b periyodu (2π/b), c ise yatay ötelemeyi belirler. Kaydıraçları oynatıp her parametrenin dalgayı nasıl değiştirdiğini gör.',
    },
  ],
  ispat: {
    baslik: 'Temel özdeşlik ve toplam formülünün çemberden okunuşu',
    satirlar: [
      { tex: 'P(\\cos\\theta,\\ \\sin\\theta)\\ \\text{birim çember üzerindedir}' },
      { tex: 'x^{2}+y^{2}=1 \\Rightarrow \\cos^{2}\\theta+\\sin^{2}\\theta=1', not: 'Pisagor bağıntısının çemberdeki hâli' },
      { tex: '\\text{Yay uzunluğu } s=r\\theta,\\quad r=1 \\Rightarrow s=\\theta', not: 'Radyanın tanımı' },
      { tex: '\\cos(\\alpha-\\beta)=\\cos\\alpha\\cos\\beta+\\sin\\alpha\\sin\\beta', not: 'İki nokta arasındaki uzaklığın iki farklı hesabından' },
      { tex: '\\sin(\\alpha+\\beta)=\\sin\\alpha\\cos\\beta+\\cos\\alpha\\sin\\beta' },
      { tex: '\\lim_{\\theta\\to 0}\\frac{\\sin\\theta}{\\theta}=1', not: 'Yalnızca radyanda geçerli — türev formüllerinin temeli' },
    ],
    sonuc: "(\\sin x)'=\\cos x,\\qquad (\\cos x)'=-\\sin x",
  },
  sorular: [
    {
      soru: 'Birim çemberde θ = π/2 için nokta hangi koordinattadır?',
      secenekler: ['(1, 0)', '(0, 1)', '(−1, 0)', '(0, −1)'],
      dogru: 1,
      aciklama: 'cos(π/2) = 0 ve sin(π/2) = 1 olduğundan nokta (0, 1) konumundadır.',
    },
    {
      soru: '1 radyan yaklaşık kaç derecedir?',
      secenekler: ['45°', '57,3°', '60°', '90°'],
      dogru: 1,
      aciklama: '180°/π ≈ 57,3° olduğundan 1 radyan yaklaşık 57,3 derecedir.',
    },
    {
      soru: 'y = 3·sin(2x) fonksiyonunun genliği ve periyodu nedir?',
      secenekler: ['3 ve π', '2 ve 3', '3 ve 2π', '6 ve π'],
      dogru: 0,
      aciklama: 'Genlik a = 3, periyot ise 2π/b = 2π/2 = π olur.',
    },
    {
      soru: 'cos²θ + sin²θ ifadesinin değeri nedir?',
      secenekler: ['0', '1', '2', 'θ’ya bağlı değişir'],
      dogru: 1,
      aciklama:
        'Nokta birim çember üzerinde olduğu için x² + y² = 1 olur; bu da cos²θ + sin²θ = 1 demektir.',
    },
  ],
}
