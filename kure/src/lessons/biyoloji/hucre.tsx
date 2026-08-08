import { useMemo, useState } from 'react'
import * as THREE from 'three'
import { Etiket, Sahne, type V3 } from '../shared/sahne'
import { Anahtar, Dugme, Duzen, Gosterge } from '../shared/ui'
import { useZaman } from '../shared/animasyon'
import type { DersModulu, SahneProps } from '../types'

interface Organel {
  ad: string
  gorev: string
  renk: string
  konum: V3
  tip: 'kure' | 'kapsul' | 'disk' | 'kutu'
  olcu: V3
  bitki?: boolean
  hayvan?: boolean
}

const ORGANELLER: Organel[] = [
  { ad: 'Çekirdek', gorev: 'DNA’yı barındırır, hücreyi yönetir', renk: '#8b7dff', konum: [0, 0.2, 0], tip: 'kure', olcu: [0.95, 0, 0] },
  { ad: 'Çekirdekçik', gorev: 'Ribozom üretimini başlatır', renk: '#c084fc', konum: [0.25, 0.35, 0.2], tip: 'kure', olcu: [0.32, 0, 0] },
  { ad: 'Mitokondri', gorev: 'Solunumla ATP (enerji) üretir', renk: '#f472b6', konum: [1.9, 0.9, 0.6], tip: 'kapsul', olcu: [0.28, 0.95, 0] },
  { ad: 'Mitokondri', gorev: 'Solunumla ATP (enerji) üretir', renk: '#f472b6', konum: [-1.7, -0.9, 0.9], tip: 'kapsul', olcu: [0.26, 0.85, 0] },
  { ad: 'Granüllü ER', gorev: 'Protein sentezi ve taşınması', renk: '#38e1c6', konum: [-1.5, 1.1, -0.3], tip: 'disk', olcu: [1.15, 0.09, 0] },
  { ad: 'Golgi aygıtı', gorev: 'Salgı maddelerini paketler', renk: '#ffb454', konum: [1.6, -1.2, -0.5], tip: 'disk', olcu: [0.95, 0.08, 0] },
  { ad: 'Lizozom', gorev: 'Sindirim enzimleriyle parçalar', renk: '#fb7185', konum: [-0.6, -1.8, 0.8], tip: 'kure', olcu: [0.3, 0, 0] },
  { ad: 'Sentrozom', gorev: 'Hücre bölünmesinde iğ ipliği kurar', renk: '#94a3b8', konum: [0.9, 1.7, -0.9], tip: 'kapsul', olcu: [0.13, 0.5, 0], hayvan: true },
  { ad: 'Kloroplast', gorev: 'Fotosentezle besin üretir', renk: '#4ade80', konum: [-2.1, 0.2, -1], tip: 'kapsul', olcu: [0.38, 1, 0], bitki: true },
  { ad: 'Kloroplast', gorev: 'Fotosentezle besin üretir', renk: '#4ade80', konum: [2, 1.6, -1.1], tip: 'kapsul', olcu: [0.36, 0.95, 0], bitki: true },
  { ad: 'Koful', gorev: 'Su ve madde depolar, turgoru sağlar', renk: '#7dd3fc', konum: [0, -1.4, -0.6], tip: 'kure', olcu: [1.25, 0, 0], bitki: true },
]

function OrganelMesh({ o }: { o: Organel }) {
  return (
    <mesh position={o.konum} rotation={[0.4, 0.7, 0.2]}>
      {o.tip === 'kure' && <sphereGeometry args={[o.olcu[0], 28, 28]} />}
      {o.tip === 'kapsul' && <capsuleGeometry args={[o.olcu[0], o.olcu[1], 8, 20]} />}
      {o.tip === 'disk' && <cylinderGeometry args={[o.olcu[0], o.olcu[0] * 0.8, o.olcu[1], 26]} />}
      {o.tip === 'kutu' && <boxGeometry args={[o.olcu[0], o.olcu[1], o.olcu[2]]} />}
      <meshStandardMaterial color={o.renk} roughness={0.4} metalness={0.05} emissive={o.renk} emissiveIntensity={0.12} />
    </mesh>
  )
}

function HucreSahne({ adim }: SahneProps) {
  const [bitki, setBitki] = useState(false)
  const [etiketler, setEtiketler] = useState(true)
  const [tasima, setTasima] = useState<'difuzyon' | 'osmoz' | 'aktif'>('difuzyon')
  const [t] = useZaman(true, 1)

  const gorunur = useMemo(
    () => ORGANELLER.filter((o) => (bitki ? !o.hayvan : !o.bitki)),
    [bitki],
  )

  const R = 3.1
  // Zardan geçen parçacıklar
  const parcaciklar = useMemo(() => {
    const p: { yon: V3; faz: number; renk: string; ice: boolean }[] = []
    for (let i = 0; i < 26; i++) {
      const k = i + 0.5
      const phi = Math.acos(1 - (2 * k) / 26)
      const th = Math.PI * (1 + Math.sqrt(5)) * k
      p.push({
        yon: [Math.sin(phi) * Math.cos(th), Math.sin(phi) * Math.sin(th), Math.cos(phi)],
        faz: (i * 0.37) % 1,
        renk: i % 3 === 0 ? '#7dd3fc' : i % 3 === 1 ? '#4ade80' : '#ffb454',
        ice: i % 4 !== 0,
      })
    }
    return p
  }, [])

  const hiz = tasima === 'aktif' ? 0.55 : tasima === 'osmoz' ? 0.3 : 0.22

  return (
    <Duzen
      gosterge={
        <Gosterge
          satirlar={[
            { ad: 'hücre tipi', deger: bitki ? 'Bitki hücresi' : 'Hayvan hücresi', renk: bitki ? '#4ade80' : '#f472b6' },
            { ad: 'organel sayısı', deger: gorunur.length },
            ...(adim >= 3
              ? [
                  {
                    ad: 'taşıma',
                    deger:
                      tasima === 'difuzyon'
                        ? 'Difüzyon (enerjisiz)'
                        : tasima === 'osmoz'
                          ? 'Osmoz (su, enerjisiz)'
                          : 'Aktif taşıma (ATP harcar)',
                    renk: tasima === 'aktif' ? '#ffb454' : '#38e1c6',
                  },
                ]
              : []),
          ]}
        />
      }
      kontrol={
        <>
          <div className="flex gap-1.5">
            <Dugme onClick={() => setBitki(false)} aktif={!bitki} boyut="sm" renk="#f472b6">
              hayvan hücresi
            </Dugme>
            <Dugme onClick={() => setBitki(true)} aktif={bitki} boyut="sm" renk="#4ade80">
              bitki hücresi
            </Dugme>
          </div>
          {adim >= 3 && (
            <div className="flex gap-1.5">
              {(['difuzyon', 'osmoz', 'aktif'] as const).map((m) => (
                <Dugme key={m} onClick={() => setTasima(m)} aktif={tasima === m} boyut="sm" renk="#ffb454">
                  {m === 'difuzyon' ? 'difüzyon' : m === 'osmoz' ? 'osmoz' : 'aktif taşıma'}
                </Dugme>
              ))}
            </div>
          )}
          <Anahtar etiket="etiketler" deger={etiketler} onChange={setEtiketler} />
        </>
      }
      sahne={
        <Sahne kamera={[5.5, 3.5, 7]} izgara={false} maxUzaklik={26} otoDondur={adim === 0}>
          {/* Hücre çeperi (bitki) */}
          {bitki && (
            <mesh>
              <boxGeometry args={[R * 2.05, R * 2.05, R * 2.05]} />
              <meshStandardMaterial color="#4ade80" transparent opacity={0.08} side={THREE.BackSide} />
            </mesh>
          )}

          {/* Hücre zarı */}
          <mesh>
            <sphereGeometry args={[R, 48, 32]} />
            <meshPhysicalMaterial
              color="#7dd3fc"
              transparent
              opacity={0.14}
              roughness={0.2}
              transmission={0.4}
              side={THREE.DoubleSide}
            />
          </mesh>
          {etiketler && (
            <Etiket konum={[0, R + 0.45, 0]} renk="#7dd3fc" kucuk>
              hücre zarı — seçici geçirgen
            </Etiket>
          )}

          {/* Organeller */}
          {gorunur.map((o, i) => (
            <group key={i}>
              <OrganelMesh o={o} />
              {etiketler && adim >= 1 && (o.ad !== 'Çekirdekçik' || adim >= 2) && (
                <Etiket konum={[o.konum[0], o.konum[1] + 0.75, o.konum[2]]} renk={o.renk} kucuk>
                  {o.ad}
                </Etiket>
              )}
            </group>
          ))}

          {/* Ribozomlar */}
          {adim >= 2 &&
            Array.from({ length: 30 }, (_, i) => {
              const k = i + 0.5
              const phi = Math.acos(1 - (2 * k) / 30)
              const th = Math.PI * (1 + Math.sqrt(5)) * k
              const r = 2.2
              return (
                <mesh
                  key={i}
                  position={[r * Math.sin(phi) * Math.cos(th), r * Math.sin(phi) * Math.sin(th), r * Math.cos(phi)]}
                >
                  <sphereGeometry args={[0.07, 10, 10]} />
                  <meshStandardMaterial color="#e6ecf7" emissive="#e6ecf7" emissiveIntensity={0.3} />
                </mesh>
              )
            })}

          {/* Zardan madde geçişi */}
          {adim >= 3 &&
            parcaciklar.map((p, i) => {
              const u = (t * hiz + p.faz) % 1
              const yon = tasima === 'aktif' && !p.ice ? -1 : 1
              const rr = p.ice ? R + 1.6 - u * 2.6 * yon : R - 1.4 + u * 2.4
              const renk = tasima === 'osmoz' ? '#7dd3fc' : p.renk
              return (
                <mesh key={i} position={[p.yon[0] * rr, p.yon[1] * rr, p.yon[2] * rr]}>
                  <sphereGeometry args={[0.09, 10, 10]} />
                  <meshStandardMaterial color={renk} emissive={renk} emissiveIntensity={0.6} />
                </mesh>
              )
            })}

          {adim >= 4 && (
            <Etiket konum={[0, -R - 0.8, 0]} renk={bitki ? '#4ade80' : '#f472b6'} kucuk>
              {bitki
                ? 'bitki hücresinde: hücre çeperi + kloroplast + büyük koful'
                : 'hayvan hücresinde: sentrozom var, çeper ve kloroplast yok'}
            </Etiket>
          )}
        </Sahne>
      }
    />
  )
}

export const hucreModulu: DersModulu = {
  id: 'hucre',
  baslik: 'Hücre — Canlılığın Temel Birimi',
  altBaslik: 'Zarın içine gir, organelleri tanı, madde geçişini izle.',
  ders: 'biyoloji',
  seviye: '6. / 7. / 9. Sınıf',
  sure: 18,
  etiketler: ['hücre', 'organel', 'difüzyon', 'osmoz', 'bitki-hayvan hücresi'],
  Sahne: HucreSahne,
  adimlar: [
    {
      baslik: 'Hücre zarı ve sitoplazma',
      metin:
        'Hücrenin en dışında, yağ ve proteinlerden oluşan seçici geçirgen bir zar vardır: her şeyi değil, gerekeni içeri alır. İçini dolduran jelimsi sıvı sitoplazmadır; organeller bunun içinde yüzer.',
    },
    {
      baslik: 'Çekirdek: yönetim merkezi',
      metin:
        'Mor küre çekirdektir; içinde DNA bulunur ve hücrenin tüm faaliyetleri buradan yönetilir. Çekirdekçik ise ribozom yapımının başladığı yerdir.',
    },
    {
      baslik: 'Organeller ve görevleri',
      metin:
        'Mitokondri (pembe) besinden ATP üretir — hücrenin enerji santralidir. Granüllü ER ve ribozomlar protein sentezler, Golgi aygıtı bunları paketleyip gönderir, lizozom ise sindirim yapar. Her organel bir görev için özelleşmiştir.',
    },
    {
      baslik: 'Zardan madde geçişi',
      metin:
        'DİFÜZYON: maddeler çoktan aza doğru kendiliğinden geçer, enerji harcanmaz. OSMOZ: suyun az yoğun ortamdan çok yoğun ortama geçişidir. AKTİF TAŞIMA: azdan çoka, yani doğaya karşı — bu yüzden ATP harcanır. Düğmelerle üçünü karşılaştır.',
    },
    {
      baslik: 'Bitki ve hayvan hücresi',
      metin:
        'Bitki hücresinde ek olarak selülozdan hücre ÇEPERİ (dayanıklılık), KLOROPLAST (fotosentez) ve büyük KOFUL (su deposu, turgor) bulunur. Hayvan hücresinde ise sentrozom vardır ve şekli yuvarlaktır.',
    },
  ],
  ispat: {
    baslik: 'Osmoz ve turgor basıncı',
    satirlar: [
      { tex: '\\pi = i\\,M\\,R\\,T', not: 'Osmotik basınç (van’t Hoff)' },
      { tex: '\\text{Su, } \\pi \\text{ küçük olan taraftan büyük olan tarafa geçer}' },
      { tex: '\\text{Emme kuvveti} = \\pi_{\\text{osmotik}} - P_{\\text{turgor}}' },
      { tex: 'P_{\\text{turgor}} = \\pi \\Rightarrow \\text{net su alışı durur}', not: 'Bitki hücresi çeper sayesinde patlamaz' },
    ],
    sonuc: 'Çeperli hücre hipotonik ortamda turgorlu hâle gelir, patlamaz.',
  },
  sorular: [
    {
      soru: 'Hücrenin enerji üretiminden sorumlu organeli hangisidir?',
      secenekler: ['Ribozom', 'Mitokondri', 'Golgi aygıtı', 'Lizozom'],
      dogru: 1,
      aciklama: 'Mitokondride oksijenli solunum gerçekleşir ve ATP üretilir.',
    },
    {
      soru: 'Aşağıdakilerden hangisi bitki hücresinde bulunup hayvan hücresinde bulunmaz?',
      secenekler: ['Mitokondri', 'Ribozom', 'Kloroplast', 'Çekirdek'],
      dogru: 2,
      aciklama: 'Kloroplast, hücre çeperi ve büyük koful bitki hücresine özgüdür.',
    },
    {
      soru: 'Aktif taşımayı difüzyondan ayıran temel özellik nedir?',
      secenekler: [
        'Yalnızca suyun taşınması',
        'Enerji (ATP) harcanması',
        'Zarın olmaması',
        'Yalnızca bitkilerde olması',
      ],
      dogru: 1,
      aciklama: 'Aktif taşıma derişim farkına karşı gerçekleştiği için ATP harcar; difüzyon kendiliğinden olur.',
    },
    {
      soru: 'Bir hücre saf suya konulursa ne olur?',
      secenekler: [
        'Su kaybeder, büzüşür',
        'Su alır, şişer',
        'Hiçbir değişiklik olmaz',
        'Zarı sertleşir',
      ],
      dogru: 1,
      aciklama:
        'Saf su hipotoniktir; osmozla hücre içine su girer. Hayvan hücresi patlayabilir, bitki hücresi ise çeper sayesinde turgorlu hâle gelir.',
    },
  ],
}
