import { useMemo, useState } from 'react'
import * as THREE from 'three'
import { Etiket, Sahne, type V3 } from '../shared/sahne'
import { Anahtar, Dugme, Duzen, Gosterge, Kaydirac } from '../shared/ui'
import { gitGel, useZaman } from '../shared/animasyon'
import type { DersModulu, SahneProps } from '../types'

/** İki nokta arasına kemik (kapsül) çizer. */
function Kemik({
  a,
  b,
  r = 0.11,
  renk = '#f2ede3',
  opaklik = 1,
}: {
  a: V3
  b: V3
  r?: number
  renk?: string
  opaklik?: number
}) {
  const { poz, quat, uz } = useMemo(() => {
    const A = new THREE.Vector3(...a)
    const B = new THREE.Vector3(...b)
    const d = B.clone().sub(A)
    return {
      poz: A.clone().add(d.clone().multiplyScalar(0.5)),
      quat: new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.clone().normalize()),
      uz: Math.max(d.length() - r * 2, 0.02),
    }
  }, [a, b, r])
  return (
    <mesh position={poz} quaternion={quat}>
      <capsuleGeometry args={[r, uz, 6, 16]} />
      <meshStandardMaterial color={renk} roughness={0.42} transparent={opaklik < 1} opacity={opaklik} />
    </mesh>
  )
}

const EKSEN_RENK = '#f2ede3'
const UYE_RENK = '#cdc7b8'

function IskeletSahne({ adim }: SahneProps) {
  const [vurgu, setVurgu] = useState<'yok' | 'eksen' | 'uye'>('yok')
  const [aciElle, setAciElle] = useState(60)
  const [oto, setOto] = useState(true)
  const [kasGoster, setKasGoster] = useState(true)
  const [t] = useZaman(oto, 1)

  const dirsekAci = adim >= 3 ? (oto ? 15 + gitGel(t, 3) * 105 : aciElle) : 15
  const th = (dirsekAci * Math.PI) / 180

  // Omurga
  const omurlar = useMemo(
    () => Array.from({ length: 22 }, (_, i) => [0, 0.15 + i * 0.16, -0.05] as V3),
    [],
  )

  // Kol kinematiği (sağ ve sol)
  const kol = (taraf: 1 | -1) => {
    const S: V3 = [taraf * 0.62, 3.05, 0]
    const f1 = ((taraf * 18) * Math.PI) / 180
    const d1: V3 = [Math.sin(f1), -Math.cos(f1), 0]
    const L1 = 1.0
    const E: V3 = [S[0] + d1[0] * L1, S[1] + d1[1] * L1, 0]
    const a2 = Math.atan2(d1[0], -d1[1]) + taraf * th
    const d2: V3 = [Math.sin(a2), -Math.cos(a2), 0]
    const L2 = 0.92
    const W: V3 = [E[0] + d2[0] * L2, E[1] + d2[1] * L2, 0]
    const kasUcu: V3 = [E[0] + d2[0] * 0.28, E[1] + d2[1] * 0.28, 0.12]
    return { S, E, W, kasUcu }
  }

  const bacak = (taraf: 1 | -1) => {
    const K: V3 = [taraf * 0.3, 1.5, 0]
    const D: V3 = [taraf * 0.36, 0.78, 0]
    const A: V3 = [taraf * 0.34, 0.08, 0]
    return { K, D, A }
  }

  const eksenOpak = vurgu === 'uye' ? 0.2 : 1
  const uyeOpak = vurgu === 'eksen' ? 0.2 : 1

  return (
    <Duzen
      gosterge={
        <Gosterge
          satirlar={[
            { ad: 'kemik sayısı (yetişkin)', deger: '206' },
            { ad: 'eksen iskeleti', deger: 'kafatası · omurga · göğüs kafesi', renk: EKSEN_RENK },
            { ad: 'üye iskeleti', deger: 'kollar · bacaklar · kuşaklar', renk: UYE_RENK },
            ...(adim >= 3
              ? [
                  { ad: 'dirsek açısı', deger: `${dirsekAci.toFixed(0)}°`, renk: '#0f766e' },
                  { ad: 'ön kol kası', deger: dirsekAci > 60 ? 'biseps KASILIR' : 'triseps KASILIR', renk: dirsekAci > 60 ? '#be185d' : '#b45309' },
                ]
              : []),
          ]}
        />
      }
      kontrol={
        <>
          <div className="flex gap-1.5">
            {(['yok', 'eksen', 'uye'] as const).map((v) => (
              <Dugme key={v} onClick={() => setVurgu(v)} aktif={vurgu === v} boyut="sm">
                {v === 'yok' ? 'tümü' : v === 'eksen' ? 'eksen iskeleti' : 'üye iskeleti'}
              </Dugme>
            ))}
          </div>
          {adim >= 3 && (
            <>
              <Dugme onClick={() => setOto(!oto)} aktif={oto} boyut="sm">
                {oto ? '⏸ durdur' : '▶ hareket'}
              </Dugme>
              {!oto && <Kaydirac etiket="dirsek açısı" deger={aciElle} min={10} max={125} adim={1} basamak={0} onChange={setAciElle} birim="°" />}
              <Anahtar etiket="kaslar" deger={kasGoster} onChange={setKasGoster} renk="#be185d" />
            </>
          )}
        </>
      }
      sahne={
        <Sahne kamera={[3.4, 2.6, 6.5]} zeminY={0} maxUzaklik={28} otoDondur={adim === 0}>
          {/* Kafatası */}
          <mesh position={[0, 4.15, 0]}>
            <sphereGeometry args={[0.46, 28, 24]} />
            <meshStandardMaterial color={EKSEN_RENK} roughness={0.4} transparent opacity={eksenOpak} />
          </mesh>
          <mesh position={[0, 3.82, 0.14]}>
            <boxGeometry args={[0.38, 0.22, 0.32]} />
            <meshStandardMaterial color={EKSEN_RENK} roughness={0.45} transparent opacity={eksenOpak} />
          </mesh>
          {adim >= 1 && (
            <Etiket konum={[0, 4.85, 0]} renk={EKSEN_RENK} kucuk>
              kafatası — yassı kemik
            </Etiket>
          )}

          {/* Omurga */}
          {omurlar.map((p, i) => (
            <mesh key={i} position={[p[0], p[1] + 1.35, p[2]]}>
              <cylinderGeometry args={[0.13, 0.13, 0.11, 14]} />
              <meshStandardMaterial color={EKSEN_RENK} roughness={0.45} transparent opacity={eksenOpak} />
            </mesh>
          ))}
          {adim >= 1 && (
            <Etiket konum={[-0.95, 2.4, 0]} renk={EKSEN_RENK} kucuk>
              omurga — düzensiz kemikler
            </Etiket>
          )}

          {/* Göğüs kafesi */}
          {Array.from({ length: 7 }, (_, i) => {
            const y = 3.0 - i * 0.24
            const rx = 0.78 - Math.abs(i - 2) * 0.055
            return [1, -1].map((s) => (
              <mesh key={`${i}${s}`} position={[0, y, 0.02]} rotation={[Math.PI / 2, 0, s > 0 ? 0 : Math.PI]}>
                <torusGeometry args={[rx, 0.045, 8, 26, Math.PI * 0.92]} />
                <meshStandardMaterial color={EKSEN_RENK} roughness={0.45} transparent opacity={eksenOpak} />
              </mesh>
            ))
          })}
          <mesh position={[0, 2.75, 0.55]}>
            <boxGeometry args={[0.24, 0.85, 0.08]} />
            <meshStandardMaterial color={EKSEN_RENK} roughness={0.45} transparent opacity={eksenOpak} />
          </mesh>

          {/* Omuz ve leğen kuşağı */}
          {[1, -1].map((s) => (
            <Kemik key={`k${s}`} a={[0, 3.2, 0.35]} b={[s * 0.62, 3.05, 0.1]} r={0.06} renk={UYE_RENK} opaklik={uyeOpak} />
          ))}
          <mesh position={[0, 1.55, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.42, 0.1, 10, 24]} />
            <meshStandardMaterial color={UYE_RENK} roughness={0.45} transparent opacity={uyeOpak} />
          </mesh>

          {/* Kollar */}
          {([1, -1] as const).map((s) => {
            const k = kol(s)
            return (
              <group key={`kol${s}`}>
                <Kemik a={k.S} b={k.E} r={0.11} renk={UYE_RENK} opaklik={uyeOpak} />
                <Kemik a={k.E} b={k.W} r={0.09} renk={UYE_RENK} opaklik={uyeOpak} />
                <mesh position={k.W}>
                  <sphereGeometry args={[0.13, 14, 14]} />
                  <meshStandardMaterial color={UYE_RENK} roughness={0.45} transparent opacity={uyeOpak} />
                </mesh>
                {/* Eklem */}
                {adim >= 2 && (
                  <mesh position={k.E}>
                    <sphereGeometry args={[0.15, 16, 16]} />
                    <meshStandardMaterial color="#0f766e" transparent opacity={0.75} />
                  </mesh>
                )}
                {/* Kaslar */}
                {adim >= 3 && kasGoster && (
                  <>
                    <Kemik
                      a={[k.S[0] + s * 0.05, k.S[1] - 0.08, 0.12]}
                      b={k.kasUcu}
                      r={0.09 + (dirsekAci / 125) * 0.09}
                      renk="#be185d"
                      opaklik={0.75}
                    />
                    <Kemik
                      a={[k.S[0] - s * 0.05, k.S[1] - 0.1, -0.14]}
                      b={[k.E[0] - s * 0.02, k.E[1] - 0.05, -0.16]}
                      r={0.13 - (dirsekAci / 125) * 0.06}
                      renk="#b45309"
                      opaklik={0.7}
                    />
                  </>
                )}
              </group>
            )
          })}
          {adim >= 3 && kasGoster && (
            <>
              <Etiket konum={[1.6, 2.55, 0.4]} renk="#be185d" kucuk>
                biseps (bükücü)
              </Etiket>
              <Etiket konum={[1.6, 2.05, -0.5]} renk="#b45309" kucuk>
                triseps (açıcı)
              </Etiket>
            </>
          )}

          {/* Bacaklar */}
          {([1, -1] as const).map((s) => {
            const b = bacak(s)
            return (
              <group key={`bacak${s}`}>
                <Kemik a={[s * 0.28, 1.5, 0]} b={b.D} r={0.13} renk={UYE_RENK} opaklik={uyeOpak} />
                <Kemik a={b.D} b={b.A} r={0.11} renk={UYE_RENK} opaklik={uyeOpak} />
                <mesh position={[b.A[0], 0.05, 0.14]}>
                  <boxGeometry args={[0.24, 0.1, 0.5]} />
                  <meshStandardMaterial color={UYE_RENK} roughness={0.45} transparent opacity={uyeOpak} />
                </mesh>
                {adim >= 2 && (
                  <mesh position={b.D}>
                    <sphereGeometry args={[0.16, 16, 16]} />
                    <meshStandardMaterial color="#0f766e" transparent opacity={0.75} />
                  </mesh>
                )}
                {adim >= 1 && s === 1 && (
                  <Etiket konum={[1.15, 1.1, 0]} renk={UYE_RENK} kucuk>
                    uyluk kemiği — uzun kemik
                  </Etiket>
                )}
              </group>
            )
          })}

          {adim >= 2 && (
            <Etiket konum={[-1.9, 2.2, 0]} renk="#0f766e" kucuk>
              yeşil noktalar: oynar eklemler
            </Etiket>
          )}
        </Sahne>
      }
    />
  )
}

export const iskeletModulu: DersModulu = {
  id: 'iskelet',
  baslik: 'Destek ve Hareket Sistemi',
  altBaslik: 'Kemikleri, eklemleri ve kasların birlikte çalışmasını hareket hâlinde gör.',
  ders: 'biyoloji',
  seviye: '5. / 6. / 11. Sınıf',
  sure: 14,
  etiketler: ['iskelet', 'kemik çeşitleri', 'eklem', 'kas'],
  Sahne: IskeletSahne,
  adimlar: [
    {
      baslik: 'İskeletin görevleri',
      metin:
        'İskelet vücuda şekil ve destek verir, iç organları korur (kafatası beyni, göğüs kafesi kalp ve akciğerleri), kaslarla birlikte hareketi sağlar, kemik iliğinde kan hücresi üretir ve kalsiyum deposu olarak çalışır. Yetişkin bir insanda 206 kemik vardır.',
    },
    {
      baslik: 'Kemik çeşitleri',
      metin:
        'UZUN kemikler (uyluk, kol) hareket kaldıraçlarıdır. YASSI kemikler (kafatası, kürek, kaburga) koruma sağlar. KISA kemikler (bilek, ayak bileği) darbeyi emer. DÜZENSİZ kemikler (omurlar) özel görevler üstlenir. Düğmelerle eksen ve üye iskeletini ayrı ayrı vurgula.',
    },
    {
      baslik: 'Eklemler',
      metin:
        'Kemiklerin birleşme yerlerine eklem denir. OYNAMAZ eklem: kafatası kemikleri. YARI OYNAR eklem: omurlar arası. OYNAR eklem: omuz, dirsek, diz, kalça (yeşil noktalar). Oynar eklemlerde kıkırdak ve eklem sıvısı sürtünmeyi neredeyse sıfıra indirir.',
    },
    {
      baslik: 'Kaslar kemikleri nasıl hareket ettirir?',
      metin:
        'Kaslar yalnızca KASILIR — itemezler, sadece çekerler. Bu yüzden zıt çalışan çiftler hâlinde bulunurlar: kol bükülürken biseps (pembe) kasılıp kısalır ve kalınlaşır, triseps (turuncu) gevşer. Kol açılırken tam tersi olur. Animasyonu izleyip kalınlık değişimine dikkat et.',
    },
  ],
  ispat: {
    baslik: 'Ön kol: III. tip kaldıraç',
    giris: 'Dirsek eklemi destek, biseps kuvvet, elde tutulan yük ise direnç noktasıdır.',
    satirlar: [
      { tex: '\\sum \\tau = 0 \\Rightarrow F_{\\text{kas}}\\cdot d_{\\text{kas}} = W\\cdot d_{\\text{yük}}' },
      { tex: 'd_{\\text{kas}} \\approx 4\\ \\text{cm},\\qquad d_{\\text{yük}} \\approx 32\\ \\text{cm}' },
      { tex: 'F_{\\text{kas}} = W\\cdot\\frac{32}{4}=8W', not: 'Kas, yükün 8 katı kuvvet uygular' },
      { tex: '\\text{Kuvvetten kayıp var, ama YOLDAN ve HIZDAN kazanç var}' },
    ],
    sonuc: 'Kısa kas kasılması, elin büyük ve hızlı hareketine dönüşür.',
  },
  sorular: [
    {
      soru: 'Aşağıdakilerden hangisi yassı kemiktir?',
      secenekler: ['Uyluk kemiği', 'Kürek kemiği', 'Bilek kemiği', 'Omur'],
      dogru: 1,
      aciklama: 'Kürek kemiği, kafatası kemikleri ve kaburgalar yassı kemiklerdir; koruma görevi görürler.',
    },
    {
      soru: 'Kafatası kemikleri arasındaki eklem türü nedir?',
      secenekler: ['Oynar', 'Yarı oynar', 'Oynamaz', 'Kayar'],
      dogru: 2,
      aciklama: 'Kafatası kemikleri birbirine dişli biçimde kaynamıştır; beyni korumak için oynamaz eklem yaparlar.',
    },
    {
      soru: 'Kol bükülürken hangi kas kasılır?',
      secenekler: ['Triseps', 'Biseps', 'İkisi birden', 'Hiçbiri'],
      dogru: 1,
      aciklama:
        'Biseps kasılıp kısalır, triseps gevşer. Kaslar yalnızca çekebildiği için zıt çiftler hâlinde çalışırlar.',
    },
    {
      soru: 'Kemik iliğinin temel görevi nedir?',
      secenekler: ['Kalsiyum üretmek', 'Kan hücresi üretmek', 'Eklem sıvısı salgılamak', 'Kası kemiğe bağlamak'],
      dogru: 1,
      aciklama: 'Kırmızı kemik iliğinde alyuvar, akyuvar ve kan pulcukları üretilir.',
    },
  ],
}
