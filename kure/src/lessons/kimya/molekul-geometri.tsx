import { useMemo, useState } from 'react'
import * as THREE from 'three'
import { Cizgi as Line, Etiket, Ok, Sahne, type V3 } from '../shared/sahne'
import { Anahtar, Dugme, Duzen, Gosterge } from '../shared/ui'
import type { DersModulu, SahneProps } from '../types'

const RENK: Record<string, string> = {
  H: '#e8eef8',
  C: '#4b5563',
  N: '#4d7cff',
  O: '#ef4444',
  F: '#7ee787',
  Cl: '#4ade80',
  S: '#facc15',
  B: '#f9a8d4',
  P: '#fb923c',
  Be: '#a3e635',
}

const YARICAP: Record<string, number> = {
  H: 0.24, C: 0.4, N: 0.38, O: 0.36, F: 0.34, Cl: 0.44, S: 0.46, B: 0.4, P: 0.46, Be: 0.4,
}

const T = 1 / Math.sqrt(3)

interface Molekul {
  ad: string
  formul: string
  merkez: string
  bag: { el: string; yon: V3 }[]
  /** Ortaklanmamış elektron çifti yönleri */
  ciftler: V3[]
  elektronGeo: string
  molekulGeo: string
  aci: string
  polar: boolean
  /** Bileşke dipol yönü (polar ise) */
  dipol?: V3
  hibrit: string
}

const MOLEKULLER: Molekul[] = [
  {
    ad: 'Karbondioksit',
    formul: 'CO₂',
    merkez: 'C',
    bag: [
      { el: 'O', yon: [1, 0, 0] },
      { el: 'O', yon: [-1, 0, 0] },
    ],
    ciftler: [],
    elektronGeo: 'doğrusal',
    molekulGeo: 'doğrusal',
    aci: '180°',
    polar: false,
    hibrit: 'sp',
  },
  {
    ad: 'Bor triflorür',
    formul: 'BF₃',
    merkez: 'B',
    bag: [0, 1, 2].map((i) => ({
      el: 'F',
      yon: [Math.cos((i * 2 * Math.PI) / 3), 0, Math.sin((i * 2 * Math.PI) / 3)] as V3,
    })),
    ciftler: [],
    elektronGeo: 'düzlem üçgen',
    molekulGeo: 'düzlem üçgen',
    aci: '120°',
    polar: false,
    hibrit: 'sp²',
  },
  {
    ad: 'Metan',
    formul: 'CH₄',
    merkez: 'C',
    bag: [
      { el: 'H', yon: [T, T, T] },
      { el: 'H', yon: [T, -T, -T] },
      { el: 'H', yon: [-T, T, -T] },
      { el: 'H', yon: [-T, -T, T] },
    ],
    ciftler: [],
    elektronGeo: 'düzgün dörtyüzlü',
    molekulGeo: 'düzgün dörtyüzlü',
    aci: '109,5°',
    polar: false,
    hibrit: 'sp³',
  },
  {
    ad: 'Amonyak',
    formul: 'NH₃',
    merkez: 'N',
    bag: [
      { el: 'H', yon: [T, -T, -T] },
      { el: 'H', yon: [-T, -T, T] },
      { el: 'H', yon: [T, -T, T] },
    ],
    ciftler: [[0, 1, 0]],
    elektronGeo: 'düzgün dörtyüzlü',
    molekulGeo: 'üçgen piramit',
    aci: '107°',
    polar: true,
    dipol: [0, 1, 0],
    hibrit: 'sp³',
  },
  {
    ad: 'Su',
    formul: 'H₂O',
    merkez: 'O',
    bag: [
      { el: 'H', yon: [T, -T, T] },
      { el: 'H', yon: [-T, -T, T] },
    ],
    ciftler: [
      [T, T, -T],
      [-T, T, -T],
    ],
    elektronGeo: 'düzgün dörtyüzlü',
    molekulGeo: 'açısal (bükük)',
    aci: '104,5°',
    polar: true,
    dipol: [0, 0.55, -0.83],
    hibrit: 'sp³',
  },
  {
    ad: 'Fosfor pentaklorür',
    formul: 'PCl₅',
    merkez: 'P',
    bag: [
      { el: 'Cl', yon: [0, 1, 0] },
      { el: 'Cl', yon: [0, -1, 0] },
      ...[0, 1, 2].map((i) => ({
        el: 'Cl',
        yon: [Math.cos((i * 2 * Math.PI) / 3), 0, Math.sin((i * 2 * Math.PI) / 3)] as V3,
      })),
    ],
    ciftler: [],
    elektronGeo: 'üçgen çift piramit',
    molekulGeo: 'üçgen çift piramit',
    aci: '90° ve 120°',
    polar: false,
    hibrit: 'sp³d',
  },
]

function Bag({ a, b, renk }: { a: V3; b: V3; renk: string }) {
  const { poz, quat, uz } = useMemo(() => {
    const A = new THREE.Vector3(...a)
    const B = new THREE.Vector3(...b)
    const d = B.clone().sub(A)
    return {
      poz: A.clone().add(d.clone().multiplyScalar(0.5)),
      quat: new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.clone().normalize()),
      uz: d.length(),
    }
  }, [a, b])
  return (
    <mesh position={poz} quaternion={quat}>
      <cylinderGeometry args={[0.075, 0.075, uz, 14]} />
      <meshStandardMaterial color={renk} roughness={0.4} metalness={0.15} />
    </mesh>
  )
}

function MolekulSahne({ adim }: SahneProps) {
  const [mi, setMi] = useState(4)
  const [ciftGoster, setCiftGoster] = useState(true)

  const M = MOLEKULLER[mi]
  const L = 1.7
  const uc = (yon: V3): V3 => [yon[0] * L, yon[1] * L, yon[2] * L]

  return (
    <Duzen
      gosterge={
        <Gosterge
          satirlar={[
            { ad: 'molekül', deger: `${M.formul} — ${M.ad}`, renk: '#38e1c6' },
            { ad: 'bağ sayısı', deger: M.bag.length },
            { ad: 'ortaklanmamış çift', deger: M.ciftler.length, renk: '#8b7dff' },
            { ad: 'elektron geometrisi', deger: M.elektronGeo, renk: '#94a3b8' },
            { ad: 'molekül geometrisi', deger: M.molekulGeo, renk: '#ffb454' },
            { ad: 'bağ açısı', deger: M.aci },
            { ad: 'hibritleşme', deger: M.hibrit, renk: '#7dd3fc' },
            { ad: 'polarlık', deger: M.polar ? 'polar' : 'apolar', renk: M.polar ? '#f472b6' : '#4ade80' },
          ]}
        />
      }
      kontrol={
        <>
          <div className="flex flex-wrap gap-1.5">
            {MOLEKULLER.map((m, i) => (
              <Dugme key={m.formul} onClick={() => setMi(i)} aktif={i === mi} boyut="sm">
                {m.formul}
              </Dugme>
            ))}
          </div>
          <Anahtar etiket="ortaklanmamış çiftler" deger={ciftGoster} onChange={setCiftGoster} />
        </>
      }
      sahne={
        <Sahne kamera={[3.6, 2.8, 5.2]} izgara={false} maxUzaklik={20} otoDondur>
          {/* Merkez atom */}
          <mesh>
            <sphereGeometry args={[YARICAP[M.merkez] ?? 0.4, 32, 32]} />
            <meshStandardMaterial color={RENK[M.merkez]} roughness={0.35} metalness={0.1} />
          </mesh>
          <Etiket konum={[0, (YARICAP[M.merkez] ?? 0.4) + 0.3, 0]} renk="#e6ecf7" kucuk>
            {M.merkez}
          </Etiket>

          {/* Bağlar ve uç atomlar */}
          {M.bag.map((b, i) => (
            <group key={i}>
              <Bag a={[0, 0, 0]} b={uc(b.yon)} renk="#8fa3c4" />
              <mesh position={uc(b.yon)}>
                <sphereGeometry args={[YARICAP[b.el] ?? 0.3, 28, 28]} />
                <meshStandardMaterial color={RENK[b.el]} roughness={0.35} metalness={0.1} />
              </mesh>
              <Etiket konum={[b.yon[0] * (L + 0.42), b.yon[1] * (L + 0.42), b.yon[2] * (L + 0.42)]} renk="#94a3b8" kucuk>
                {b.el}
              </Etiket>
            </group>
          ))}

          {/* Ortaklanmamış elektron çiftleri: bağdan daha geniş yer kaplar */}
          {adim >= 2 &&
            ciftGoster &&
            M.ciftler.map((c, i) => (
              <group key={i}>
                <mesh position={[c[0] * 1.1, c[1] * 1.1, c[2] * 1.1]}>
                  <sphereGeometry args={[0.52, 24, 24]} />
                  <meshStandardMaterial
                    color="#8b7dff"
                    transparent
                    opacity={0.3}
                    emissive="#8b7dff"
                    emissiveIntensity={0.35}
                  />
                </mesh>
                <Etiket konum={[c[0] * 1.85, c[1] * 1.85, c[2] * 1.85]} renk="#8b7dff" kucuk>
                  ortaklanmamış çift
                </Etiket>
              </group>
            ))}

          {/* Bağ açısı yayı */}
          {adim >= 1 && M.bag.length >= 2 && (
            <>
              <Line
                points={Array.from({ length: 40 }, (_, i) => {
                  const a = new THREE.Vector3(...M.bag[0].yon).normalize()
                  const b = new THREE.Vector3(...M.bag[1].yon).normalize()
                  const q = new THREE.Quaternion().setFromUnitVectors(a, b)
                  const ara = new THREE.Quaternion().slerpQuaternions(new THREE.Quaternion(), q, i / 39)
                  return a.clone().applyQuaternion(ara).multiplyScalar(0.85).toArray() as V3
                })}
                color="#ffb454"
                lineWidth={2}
              />
              <Etiket
                konum={[
                  ((M.bag[0].yon[0] + M.bag[1].yon[0]) / 2) * 1.15,
                  ((M.bag[0].yon[1] + M.bag[1].yon[1]) / 2) * 1.15,
                  ((M.bag[0].yon[2] + M.bag[1].yon[2]) / 2) * 1.15,
                ]}
                renk="#ffb454"
                kucuk
              >
                {M.aci}
              </Etiket>
            </>
          )}

          {/* Dipol momenti */}
          {adim >= 3 && M.polar && M.dipol && (
            <>
              <Ok
                baslangic={[0, 0, 0]}
                bitis={[M.dipol[0] * 2.3, M.dipol[1] * 2.3, M.dipol[2] * 2.3]}
                renk="#f472b6"
                kalinlik={0.045}
              />
              <Etiket
                konum={[M.dipol[0] * 2.8, M.dipol[1] * 2.8, M.dipol[2] * 2.8]}
                renk="#f472b6"
                kucuk
              >
                bileşke dipol μ ≠ 0 → polar
              </Etiket>
            </>
          )}
          {adim >= 3 && !M.polar && (
            <Etiket konum={[0, -2.6, 0]} renk="#4ade80" kucuk>
              simetri nedeniyle bağ dipolleri birbirini götürür → apolar
            </Etiket>
          )}
        </Sahne>
      }
    />
  )
}

export const molekulGeometriModulu: DersModulu = {
  id: 'molekul-geometri',
  baslik: 'Molekül Geometrisi — VSEPR Kuramı',
  altBaslik: 'Elektron çiftleri birbirini iter; molekülün şekli bu itmeden doğar.',
  ders: 'kimya',
  seviye: '9. / 11. Sınıf',
  sure: 16,
  etiketler: ['VSEPR', 'bağ açısı', 'hibritleşme', 'polarlık'],
  Sahne: MolekulSahne,
  adimlar: [
    {
      baslik: 'Merkez atom ve bağlar',
      metin:
        'Bir molekülde merkez atomun çevresine bağlı atomlar yerleşir. Formül düğmeleriyle molekülü değiştir ve sahneyi döndürerek üç boyutlu yapıyı incele. Düz kâğıt üzerindeki çizimler yanıltıcıdır: moleküller düzlemsel değildir.',
    },
    {
      baslik: 'Temel ilke: elektron çiftleri birbirini iter',
      metin:
        'Merkez atomun çevresindeki elektron çiftleri (bağ yapanlar ve yapmayanlar) negatif yüklü olduğu için birbirini iter ve mümkün olduğunca UZAKLAŞIR. 2 çift → 180°, 3 çift → 120°, 4 çift → 109,5°. Şekil bu itmeden çıkar, ezberlenmez.',
    },
    {
      baslik: 'Ortaklanmamış çiftler daha çok yer kaplar',
      metin:
        'CH₄, NH₃ ve H₂O\'nun elektron geometrisi aynıdır (dörtyüzlü) ama molekül geometrisi farklıdır. Çünkü ortaklanmamış çiftler (mor bulutlar) tek bir çekirdeğe bağlı olduğundan daha geniş yer kaplar ve bağları sıkıştırır: 109,5° → 107° → 104,5°.',
    },
    {
      baslik: 'Geometri ve polarlık',
      metin:
        'CO₂\'de bağlar polar olmasına rağmen molekül doğrusal olduğu için dipoller birbirini götürür: apolar. H₂O\'da ise açısal geometri nedeniyle dipoller toplanır ve molekül polar olur. Suyun yüksek kaynama noktası, çözücü gücü ve buzun yüzmesi tamamen bu şekilden gelir.',
    },
  ],
  ispat: {
    baslik: 'Dörtyüzlü açının hesabı',
    giris: 'Düzgün dörtyüzlünün merkezinden köşelerine giden vektörler arasındaki açı.',
    satirlar: [
      { tex: '\\vec{u}=(1,1,1),\\qquad \\vec{v}=(1,-1,-1)', not: 'Küpün köşegen doğrultuları' },
      { tex: '\\vec{u}\\cdot\\vec{v}=1-1-1=-1' },
      { tex: '|\\vec{u}|=|\\vec{v}|=\\sqrt{3}' },
      { tex: '\\cos\\theta=\\frac{-1}{3}' },
      { tex: '\\theta=\\arccos\\left(-\\tfrac{1}{3}\\right)\\approx 109{,}47^{\\circ}' },
    ],
    sonuc: '\\theta_{\\text{dörtyüzlü}}\\approx 109{,}5^{\\circ}',
  },
  sorular: [
    {
      soru: 'H₂O molekülünün geometrisi nedir?',
      secenekler: ['Doğrusal', 'Düzlem üçgen', 'Açısal (bükük)', 'Dörtyüzlü'],
      dogru: 2,
      aciklama:
        'Oksijenin 2 bağı ve 2 ortaklanmamış çifti vardır; elektron geometrisi dörtyüzlü, molekül geometrisi açısaldır.',
    },
    {
      soru: 'NH₃\'ün bağ açısı neden CH₄\'ten küçüktür?',
      secenekler: [
        'Azot daha küçük olduğu için',
        'Ortaklanmamış çift bağları sıkıştırdığı için',
        'Bağ sayısı fazla olduğu için',
        'Hibritleşme farklı olduğu için',
      ],
      dogru: 1,
      aciklama:
        'Ortaklanmamış elektron çifti bağ çiftlerinden daha fazla yer kaplar ve N–H bağlarını birbirine yaklaştırır (107°).',
    },
    {
      soru: 'CO₂ molekülü neden apolardır?',
      secenekler: [
        'Bağları apolar olduğu için',
        'Doğrusal simetri dipolleri götürdüğü için',
        'Karbon elektronegatif olduğu için',
        'Ortaklanmamış çifti olmadığı için',
      ],
      dogru: 1,
      aciklama:
        'C=O bağları polardır, ancak 180°lik doğrusal geometride iki bağ dipolü eşit ve zıt olduğundan bileşke sıfırdır.',
    },
    {
      soru: 'sp³ hibritleşmesi yapan merkez atomun elektron geometrisi nedir?',
      secenekler: ['Doğrusal', 'Düzlem üçgen', 'Düzgün dörtyüzlü', 'Oktahedral'],
      dogru: 2,
      aciklama: 'sp³ hibritleşmesinde 4 elektron grubu vardır ve bunlar dörtyüzlü düzende dizilir.',
    },
  ],
}
