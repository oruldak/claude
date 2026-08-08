import { useMemo, useState } from 'react'
import * as THREE from 'three'
import { Cizgi as Line, Etiket, Sahne, type V3 } from '../shared/sahne'
import { Anahtar, Dugme, Duzen, Gosterge, Kaydirac } from '../shared/ui'
import { useGecis } from '../shared/animasyon'
import type { DersModulu, SahneProps } from '../types'

type CisimTuru = 'kup' | 'prizma' | 'piramit' | 'silindir' | 'koni' | 'kure'

const ADLAR: Record<CisimTuru, string> = {
  kup: 'Küp',
  prizma: 'Dikdörtgenler prizması',
  piramit: 'Kare piramit',
  silindir: 'Silindir',
  koni: 'Koni',
  kure: 'Küre',
}

const YUZEY = '#38e1c6'

function Yuz({
  w,
  h,
  konum = [0, 0, 0],
  renk = YUZEY,
  opaklik = 0.42,
}: {
  w: number
  h: number
  konum?: V3
  renk?: string
  opaklik?: number
}) {
  return (
    <mesh position={konum} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[w, h]} />
      <meshStandardMaterial
        color={renk}
        transparent
        opacity={opaklik}
        side={THREE.DoubleSide}
        roughness={0.5}
      />
    </mesh>
  )
}

/** Katlanabilir prizma: u = 0 açınım, u = 1 kapalı cisim. */
function Prizma({ a, b, c, u }: { a: number; b: number; c: number; u: number }) {
  const t = (u * Math.PI) / 2
  return (
    <group>
      <Yuz w={a} h={b} renk="#7dd3fc" opaklik={0.5} />
      {/* +x kenarı: yan yüz ve ona bağlı üst yüz */}
      <group position={[a / 2, 0, 0]} rotation={[0, 0, t]}>
        <Yuz w={c} h={b} konum={[c / 2, 0, 0]} />
        <group position={[c, 0, 0]} rotation={[0, 0, t]}>
          <Yuz w={a} h={b} konum={[a / 2, 0, 0]} renk="#7dd3fc" opaklik={0.5} />
        </group>
      </group>
      <group position={[-a / 2, 0, 0]} rotation={[0, 0, -t]}>
        <Yuz w={c} h={b} konum={[-c / 2, 0, 0]} />
      </group>
      <group position={[0, 0, b / 2]} rotation={[-t, 0, 0]}>
        <Yuz w={a} h={c} konum={[0, 0, c / 2]} />
      </group>
      <group position={[0, 0, -b / 2]} rotation={[t, 0, 0]}>
        <Yuz w={a} h={c} konum={[0, 0, -c / 2]} />
      </group>
    </group>
  )
}

function ucgenGeo(taban: number, yukseklik: number) {
  const s = new THREE.Shape()
  s.moveTo(-taban / 2, 0)
  s.lineTo(taban / 2, 0)
  s.lineTo(0, yukseklik)
  s.closePath()
  return new THREE.ShapeGeometry(s)
}

/** Katlanabilir kare piramit. */
function Piramit({ a, h, u }: { a: number; h: number; u: number }) {
  const m = Math.hypot(h, a / 2) // yanal yükseklik
  const tam = Math.atan2(h, a / 2)
  const t = u * tam
  const geo = useMemo(() => ucgenGeo(a, m), [a, m])

  const kenarlar: { poz: V3; rot: V3 }[] = [
    { poz: [a / 2, 0, 0], rot: [0, -Math.PI / 2, 0] },
    { poz: [-a / 2, 0, 0], rot: [0, Math.PI / 2, 0] },
    { poz: [0, 0, a / 2], rot: [0, 0, 0] },
    { poz: [0, 0, -a / 2], rot: [0, Math.PI, 0] },
  ]

  return (
    <group>
      <Yuz w={a} h={a} renk="#7dd3fc" opaklik={0.5} />
      {kenarlar.map((k, i) => (
        <group key={i} position={k.poz} rotation={k.rot as unknown as [number, number, number]}>
          <group rotation={[-Math.PI / 2 + t, 0, 0]}>
            <mesh geometry={geo}>
              <meshStandardMaterial
                color={YUZEY}
                transparent
                opacity={0.42}
                side={THREE.DoubleSide}
                roughness={0.5}
              />
            </mesh>
          </group>
        </group>
      ))}
    </group>
  )
}

function GeometrikSahne({ adim }: SahneProps) {
  const [tur, setTur] = useState<CisimTuru>('kup')
  const [a, setA] = useState(2.4)
  const [b, setB] = useState(1.8)
  const [c, setC] = useState(2)
  const [r, setR] = useState(1.4)
  const [h, setH] = useState(2.4)
  const [kesitY, setKesitY] = useState(1)
  const [acinim, setAcinim] = useState(1)
  const [elle, setElle] = useState(false)

  const gecis = useGecis(`${adim}-${tur}`, 2)
  // 1. adımda cisim açılır, 2. adımda tekrar kapanır
  const u = elle ? acinim : adim === 1 ? 1 - gecis : adim === 2 ? gecis : 1

  const kupA = tur === 'kup' ? a : a
  const kupB = tur === 'kup' ? a : b
  const kupC = tur === 'kup' ? a : c

  const olcum = useMemo(() => {
    switch (tur) {
      case 'kup':
        return { V: a ** 3, S: 6 * a * a, k: 8, ay: 12, y: 6, vt: 'V = a³', st: 'S = 6a²' }
      case 'prizma':
        return {
          V: a * b * c,
          S: 2 * (a * b + a * c + b * c),
          k: 8,
          ay: 12,
          y: 6,
          vt: 'V = a·b·c',
          st: 'S = 2(ab + ac + bc)',
        }
      case 'piramit':
        return {
          V: (a * a * h) / 3,
          S: a * a + 2 * a * Math.hypot(h, a / 2),
          k: 5,
          ay: 8,
          y: 5,
          vt: 'V = (Taban Alanı × h) / 3',
          st: 'S = a² + 2·a·m',
        }
      case 'silindir':
        return {
          V: Math.PI * r * r * h,
          S: 2 * Math.PI * r * (r + h),
          k: 0,
          ay: 2,
          y: 3,
          vt: 'V = πr²h',
          st: 'S = 2πr² + 2πrh',
        }
      case 'koni':
        return {
          V: (Math.PI * r * r * h) / 3,
          S: Math.PI * r * (r + Math.hypot(r, h)),
          k: 1,
          ay: 1,
          y: 2,
          vt: 'V = πr²h / 3',
          st: 'S = πr² + πrl',
        }
      case 'kure':
        return {
          V: (4 / 3) * Math.PI * r ** 3,
          S: 4 * Math.PI * r * r,
          k: 0,
          ay: 0,
          y: 1,
          vt: 'V = 4πr³/3',
          st: 'S = 4πr²',
        }
    }
  }, [tur, a, b, c, r, h])

  // Kesit çizgisi (yataydan alınan kesitin sınırı)
  const kesit = useMemo<V3[]>(() => {
    const y = kesitY
    const cember = (yar: number) => {
      const p: V3[] = []
      for (let i = 0; i <= 64; i++) {
        const u2 = (i / 64) * Math.PI * 2
        p.push([yar * Math.cos(u2), y, yar * Math.sin(u2)])
      }
      return p
    }
    if (tur === 'silindir') return y <= h ? cember(r) : []
    if (tur === 'koni') return y <= h ? cember(r * (1 - y / h)) : []
    if (tur === 'kure') return Math.abs(y - r) < r ? cember(Math.sqrt(Math.max(r * r - (y - r) ** 2, 0))) : []
    if (tur === 'piramit') {
      if (y > h) return []
      const s = (a / 2) * (1 - y / h)
      return [
        [-s, y, -s],
        [s, y, -s],
        [s, y, s],
        [-s, y, s],
        [-s, y, -s],
      ]
    }
    if (y > kupC) return []
    return [
      [-kupA / 2, y, -kupB / 2],
      [kupA / 2, y, -kupB / 2],
      [kupA / 2, y, kupB / 2],
      [-kupA / 2, y, kupB / 2],
      [-kupA / 2, y, -kupB / 2],
    ]
  }, [tur, kesitY, r, h, a, kupA, kupB, kupC])

  const koniAcisi = (2 * Math.PI * r) / Math.hypot(r, h)

  return (
    <Duzen
      gosterge={
        <Gosterge
          satirlar={[
            { ad: 'cisim', deger: ADLAR[tur], renk: '#7dd3fc' },
            { ad: olcum.vt, deger: olcum.V.toFixed(2), renk: '#38e1c6' },
            { ad: olcum.st, deger: olcum.S.toFixed(2), renk: '#ffb454' },
            { ad: 'köşe / ayrıt / yüz', deger: `${olcum.k} / ${olcum.ay} / ${olcum.y}` },
          ]}
        />
      }
      kontrol={
        <>
          <div className="flex flex-wrap gap-1.5">
            {(Object.keys(ADLAR) as CisimTuru[]).map((t) => (
              <Dugme key={t} onClick={() => setTur(t)} aktif={t === tur} boyut="sm">
                {ADLAR[t]}
              </Dugme>
            ))}
          </div>
          {(tur === 'kup' || tur === 'prizma' || tur === 'piramit') && (
            <Kaydirac etiket="a" deger={a} min={1} max={3.4} onChange={setA} basamak={1} />
          )}
          {tur === 'prizma' && (
            <>
              <Kaydirac etiket="b" deger={b} min={1} max={3.4} onChange={setB} basamak={1} />
              <Kaydirac etiket="c" deger={c} min={1} max={3.4} onChange={setC} basamak={1} />
            </>
          )}
          {(tur === 'silindir' || tur === 'koni' || tur === 'kure') && (
            <Kaydirac etiket="r" deger={r} min={0.6} max={2.2} onChange={setR} basamak={1} />
          )}
          {(tur === 'silindir' || tur === 'koni' || tur === 'piramit') && (
            <Kaydirac etiket="h" deger={h} min={1} max={3.6} onChange={setH} basamak={1} />
          )}
          {adim >= 3 && (
            <Kaydirac etiket="kesit yüksekliği" deger={kesitY} min={0} max={4} onChange={setKesitY} basamak={1} renk="#f472b6" />
          )}
          <Anahtar etiket="açınımı elle çevir" deger={elle} onChange={setElle} />
          {elle && (tur === 'kup' || tur === 'prizma' || tur === 'piramit') && (
            <Kaydirac etiket="katlanma" deger={acinim} min={0} max={1} onChange={setAcinim} />
          )}
        </>
      }
      sahne={
        <Sahne kamera={[6, 5.5, 7.5]} izgara maxUzaklik={32} otoDondur={adim === 0}>
          {(tur === 'kup' || tur === 'prizma') && <Prizma a={kupA} b={kupB} c={kupC} u={u} />}
          {tur === 'piramit' && <Piramit a={a} h={h} u={u} />}

          {tur === 'silindir' && (
            <>
              <mesh position={[0, h / 2, 0]}>
                <cylinderGeometry args={[r, r, h, 56, 1, false]} />
                <meshStandardMaterial color={YUZEY} transparent opacity={0.32} side={THREE.DoubleSide} roughness={0.4} />
              </mesh>
              {/* Açınım: yan yüzey bir dikdörtgen, tabanlar iki daire */}
              {u < 0.98 && (
                <group position={[r + 1.2, 0.02, 0]}>
                  <mesh rotation={[-Math.PI / 2, 0, 0]} position={[(2 * Math.PI * r * (1 - u)) / 2, 0, 0]}>
                    <planeGeometry args={[2 * Math.PI * r * (1 - u), h]} />
                    <meshStandardMaterial color="#ffb454" transparent opacity={0.5} side={THREE.DoubleSide} />
                  </mesh>
                  <Etiket konum={[Math.PI * r * (1 - u), 0.3, 0]} renk="#ffb454" kucuk>
                    2πr × h
                  </Etiket>
                </group>
              )}
            </>
          )}

          {tur === 'koni' && (
            <>
              <mesh position={[0, h / 2, 0]}>
                <coneGeometry args={[r, h, 56]} />
                <meshStandardMaterial color={YUZEY} transparent opacity={0.32} side={THREE.DoubleSide} roughness={0.4} />
              </mesh>
              {u < 0.98 && (
                <group position={[r + 1.6, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                  <mesh>
                    <circleGeometry args={[Math.hypot(r, h), 48, 0, koniAcisi * (1 - u)]} />
                    <meshStandardMaterial color="#ffb454" transparent opacity={0.5} side={THREE.DoubleSide} />
                  </mesh>
                </group>
              )}
              {u < 0.98 && (
                <Etiket konum={[r + 2.4, 0.3, 0]} renk="#ffb454" kucuk>
                  yan yüzey = daire dilimi (l = √(r²+h²))
                </Etiket>
              )}
            </>
          )}

          {tur === 'kure' && (
            <mesh position={[0, r, 0]}>
              <sphereGeometry args={[r, 48, 32]} />
              <meshStandardMaterial color={YUZEY} transparent opacity={0.34} roughness={0.35} metalness={0.1} />
            </mesh>
          )}

          {/* Kesit düzlemi */}
          {adim >= 3 && (
            <>
              <mesh position={[0, kesitY, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[8, 8]} />
                <meshStandardMaterial color="#f472b6" transparent opacity={0.1} side={THREE.DoubleSide} />
              </mesh>
              {kesit.length > 1 && <Line points={kesit} color="#f472b6" lineWidth={3} />}
              <Etiket konum={[0, kesitY + 0.45, 0]} renk="#f472b6" kucuk>
                kesit
              </Etiket>
            </>
          )}

          {adim === 0 && (
            <Etiket konum={[0, -0.7, 0]} renk="#94a3b8" kucuk>
              cismi döndürerek yüzlerini, ayrıtlarını ve köşelerini incele
            </Etiket>
          )}
        </Sahne>
      }
    />
  )
}

export const geometrikCisimlerModulu: DersModulu = {
  id: 'geometrik-cisimler',
  baslik: 'Geometrik Cisimler — Açınım, Yüzey Alanı ve Hacim',
  altBaslik: 'Cismi aç, kâğıda yay, tekrar katla; yüzey alanı formülünün nereden geldiğini gör.',
  ders: 'matematik',
  seviye: '3-10. Sınıf',
  sure: 16,
  etiketler: ['uzay geometri', 'açınım', 'hacim', 'yüzey alanı', 'kesit'],
  Sahne: GeometrikSahne,
  adimlar: [
    {
      baslik: 'Cismi tanı',
      metin:
        'Üst düğmelerden bir cisim seç ve sahneyi döndür. Her cismin YÜZ (düz yüzeyler), AYRIT (yüzlerin kesiştiği çizgiler) ve KÖŞE sayısını göstergeden takip et. Küpte 6 yüz, 12 ayrıt, 8 köşe vardır.',
    },
    {
      baslik: 'Cismi açalım: açınım',
      metin:
        'Cismi makasla ayrıtlarından keserek düzleme yayıyoruz. Ortaya çıkan şekle AÇINIM denir. Açınım, cismin "kâğıttan kalıbıdır"; yüzey alanı tam olarak bu kalıbın alanıdır.',
    },
    {
      baslik: 'Yüzey alanı formülünün kaynağı',
      metin:
        'Şimdi kalıbı tekrar katlıyoruz. Küpte 6 eş kare olduğu için S = 6a²; silindirde bir dikdörtgen (2πr × h) ve iki daire olduğu için S = 2πrh + 2πr². Formüller ezber değil, açınımın alanıdır.',
    },
    {
      baslik: 'Kesitler',
      metin:
        'Cismi bir düzlemle keselim. Pembe kaydıraçla düzlemi yukarı aşağı hareket ettir. Silindirin her kesiti aynı büyüklükte dairedir, koninin kesiti yukarı çıktıkça küçülür, kürenin kesiti önce büyüyüp sonra küçülür. Kesit, hacim formüllerini anlamanın anahtarıdır.',
    },
    {
      baslik: 'Hacim: kesitleri üst üste yığmak',
      metin:
        'Hacmi, kesit alanlarını yukarı doğru toplayarak buluruz. Silindirde bütün kesitler aynı olduğundan V = πr²·h; koni ve piramitte kesitler yukarı doğru küçüldüğü için hacim, aynı tabanlı prizmanın tam üçte biri kadar olur.',
    },
  ],
  ispat: {
    baslik: 'Koninin hacminin prizmanın 1/3\'ü olması',
    giris: 'Tepe noktasından y yüksekliğindeki kesit yarıçapı benzerlikle bulunur.',
    satirlar: [
      { tex: '\\frac{\\rho}{r}=\\frac{y}{h}\\ \\Rightarrow\\ \\rho=\\frac{r}{h}\\,y', not: 'Benzerlik' },
      { tex: 'A(y)=\\pi\\rho^{2}=\\pi\\frac{r^{2}}{h^{2}}y^{2}', not: 'Kesit alanı' },
      { tex: 'V=\\int_0^h A(y)\\,dy=\\pi\\frac{r^{2}}{h^{2}}\\int_0^h y^{2}dy', not: 'Kesitleri yığ' },
      { tex: '=\\pi\\frac{r^{2}}{h^{2}}\\cdot\\frac{h^{3}}{3}' },
    ],
    sonuc: 'V=\\frac{1}{3}\\pi r^{2}h=\\frac{1}{3}\\cdot V_{\\text{silindir}}',
  },
  sorular: [
    {
      soru: 'Bir ayrıtı 5 cm olan küpün yüzey alanı kaç cm²dir?',
      secenekler: ['25', '125', '150', '100'],
      dogru: 2,
      aciklama: 'Küpün 6 eş kare yüzü vardır: S = 6·5² = 150 cm².',
    },
    {
      soru: 'Silindirin yan yüzeyinin açınımı hangi şekildir?',
      secenekler: ['Daire', 'Üçgen', 'Dikdörtgen', 'Daire dilimi'],
      dogru: 2,
      aciklama: 'Yan yüzey açıldığında bir kenarı 2πr (taban çevresi), diğeri h olan dikdörtgen elde edilir.',
    },
    {
      soru: 'Taban yarıçapı 3, yüksekliği 4 olan koninin hacmi kaçtır?',
      secenekler: ['12π', '36π', '9π', '48π'],
      dogru: 0,
      aciklama: 'V = πr²h/3 = π·9·4/3 = 12π.',
    },
    {
      soru: 'Bir küreyi merkezinden geçen bir düzlemle kesersek kesit ne olur?',
      secenekler: [
        'Elips',
        'En büyük yarıçaplı daire',
        'Kare',
        'Daire dilimi',
      ],
      dogru: 1,
      aciklama:
        'Kürenin her kesiti dairedir; merkezden geçen kesit ise yarıçapı kürenin yarıçapına eşit olan en büyük dairedir (büyük daire).',
    },
  ],
}
