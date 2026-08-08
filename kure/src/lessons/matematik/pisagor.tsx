import { useMemo, useState } from 'react'
import * as THREE from 'three'
import { Cizgi as Line, Etiket, KareliKagit, Sahne, type V3 } from '../shared/sahne'
import { Dugme, Duzen, Gosterge, Kaydirac } from '../shared/ui'
import { useGecis } from '../shared/animasyon'
import type { DersModulu, SahneProps } from '../types'

type P2 = [number, number]

/** Kapalı bir çokgeni ince bir levha olarak çizer. */
function Levha({
  noktalar,
  renk,
  opaklik = 0.55,
  derinlik = 0.14,
  z = 0,
  cerceve = true,
}: {
  noktalar: P2[]
  renk: string
  opaklik?: number
  derinlik?: number
  z?: number
  cerceve?: boolean
}) {
  const geo = useMemo(() => {
    const s = new THREE.Shape()
    s.moveTo(noktalar[0][0], noktalar[0][1])
    for (let i = 1; i < noktalar.length; i++) s.lineTo(noktalar[i][0], noktalar[i][1])
    s.closePath()
    return new THREE.ExtrudeGeometry(s, { depth: derinlik, bevelEnabled: false })
  }, [noktalar, derinlik])

  const cizgi = useMemo<V3[]>(
    () => [...noktalar, noktalar[0]].map(([x, y]) => [x, y, z + derinlik + 0.005]),
    [noktalar, z, derinlik],
  )

  return (
    <group position={[0, 0, z]}>
      <mesh geometry={geo}>
        <meshStandardMaterial
          color={renk}
          transparent
          opacity={opaklik}
          roughness={0.45}
          metalness={0.05}
        />
      </mesh>
      {cerceve && <Line points={cizgi} color={renk} lineWidth={2} />}
    </group>
  )
}

function PisagorSahne({ adim }: SahneProps) {
  const [a, setA] = useState(3)
  const [b, setB] = useState(4)
  const [elleGecis, setElleGecis] = useState(1)
  const [otomatik, setOtomatik] = useState(true)

  const c = Math.hypot(a, b)
  const s = a + b
  const k = 6.2 / s // ekrana sığdırma ölçeği
  const gecisOto = useGecis(adim, 2.2)
  const g = adim >= 3 ? (otomatik ? gecisOto : elleGecis) : 0

  const ort: P2 = [-s / 2, -s / 2]
  const T = ([x, y]: P2): P2 => [(x + ort[0]) * k, (y + ort[1]) * k]

  // Taban üçgen: dik açı orijinde, a → +x, b → +y
  const taban: P2[] = [
    [0, 0],
    [a, 0],
    [0, b],
  ]

  /** Tabanı döndürüp öteleyerek yerleştirir. */
  const yerlestir = (aci: number, dx: number, dy: number): P2[] =>
    taban.map(([x, y]) => {
      const co = Math.cos(aci)
      const si = Math.sin(aci)
      return T([x * co - y * si + dx, x * si + y * co + dy])
    })

  // Düzen 1 (a² + b² kalır) → Düzen 2 (c² kalır); dönme aynı, yalnızca konum değişir.
  const ucgenler = useMemo(() => {
    const cift: { aci: number; bas: P2; son: P2 }[] = [
      { aci: Math.PI / 2, bas: [s, 0], son: [s, 0] },
      { aci: -Math.PI / 2, bas: [a, a], son: [0, s] },
      { aci: 0, bas: [0, a], son: [0, 0] },
      { aci: Math.PI, bas: [a, s], son: [s, s] },
    ]
    return cift.map(({ aci, bas, son }) =>
      yerlestir(aci, bas[0] + (son[0] - bas[0]) * g, bas[1] + (son[1] - bas[1]) * g),
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [a, b, g, k])

  const kareA: P2[] = ([[0, 0], [a, 0], [a, a], [0, a]] as P2[]).map(T)
  const kareB: P2[] = ([[a, a], [s, a], [s, s], [a, s]] as P2[]).map(T)
  const kareC: P2[] = ([[a, 0], [s, b], [b, s], [0, a]] as P2[]).map(T)
  const buyukKare: V3[] = ([[0, 0], [s, 0], [s, s], [0, s], [0, 0]] as P2[])
    .map(T)
    .map(([x, y]) => [x, y, 0.16] as V3)

  // 1. adım: kenarlar üzerine kurulan kareler (klasik şekil)
  const t0: P2 = [-a * 0.5 * k, -b * 0.5 * k]
  const M = ([x, y]: P2): P2 => [x * k + t0[0], y * k + t0[1]]
  const ucgen1 = ([[0, 0], [a, 0], [0, b]] as P2[]).map(M)
  const kareLegA = ([[0, 0], [a, 0], [a, -a], [0, -a]] as P2[]).map(M)
  const kareLegB = ([[0, 0], [0, b], [-b, b], [-b, 0]] as P2[]).map(M)
  const kareHip = ([[a, 0], [0, b], [b, b + a], [a + b, a]] as P2[]).map(M)

  return (
    <Duzen
      gosterge={
        <Gosterge
          satirlar={[
            { ad: 'a', deger: a.toFixed(1), renk: '#0f766e' },
            { ad: 'b', deger: b.toFixed(1), renk: '#b45309' },
            { ad: 'c = √(a²+b²)', deger: c.toFixed(3), renk: '#be185d' },
            { ad: 'a² + b²', deger: (a * a + b * b).toFixed(2) },
            { ad: 'c²', deger: (c * c).toFixed(2) },
          ]}
        />
      }
      kontrol={
        <>
          <Kaydirac etiket="a" deger={a} min={1.5} max={5} onChange={setA} basamak={1} />
          <Kaydirac etiket="b" deger={b} min={1.5} max={5} onChange={setB} basamak={1} renk="#b45309" />
          {adim >= 3 && (
            <>
              <Dugme onClick={() => setOtomatik(!otomatik)} aktif={otomatik} boyut="sm">
                {otomatik ? 'otomatik' : 'elle'}
              </Dugme>
              {!otomatik && (
                <Kaydirac
                  etiket="yeniden diz"
                  deger={elleGecis}
                  min={0}
                  max={1}
                  onChange={setElleGecis}
                  renk="#be185d"
                />
              )}
            </>
          )}
        </>
      }
      sahne={
        <Sahne kamera={[0, 0.6, 11]} zemin="yok" maxUzaklik={28}>
          <KareliKagit genislik={15} yukseklik={10} z={-0.2} />
          {adim <= 1 ? (
            <>
              <Levha noktalar={ucgen1} renk="#191d24" opaklik={0.28} />
              <Etiket konum={[...M([a / 2, -0.3]), 0.3] as V3} renk="#0f766e" kucuk>
                a = {a.toFixed(1)}
              </Etiket>
              <Etiket konum={[...M([-0.35, b / 2]), 0.3] as V3} renk="#b45309" kucuk>
                b = {b.toFixed(1)}
              </Etiket>
              <Etiket konum={[...M([a / 2 + 0.35, b / 2 + 0.35]), 0.3] as V3} renk="#be185d" kucuk>
                c = {c.toFixed(2)}
              </Etiket>
              {adim === 1 && (
                <>
                  <Levha noktalar={kareLegA} renk="#0f766e" opaklik={0.42} />
                  <Levha noktalar={kareLegB} renk="#b45309" opaklik={0.42} />
                  <Levha noktalar={kareHip} renk="#be185d" opaklik={0.42} />
                  <Etiket konum={[...M([a / 2, -a / 2]), 0.3] as V3} renk="#0f766e">
                    a² = {(a * a).toFixed(1)}
                  </Etiket>
                  <Etiket konum={[...M([-b / 2, b / 2]), 0.3] as V3} renk="#b45309">
                    b² = {(b * b).toFixed(1)}
                  </Etiket>
                  <Etiket konum={[...M([a / 2 + b / 2, b / 2 + a / 2]), 0.3] as V3} renk="#be185d">
                    c² = {(c * c).toFixed(1)}
                  </Etiket>
                </>
              )}
            </>
          ) : (
            <>
              {/* Sabit büyük kare: (a+b)² */}
              <Line points={buyukKare} color="#8b8577" lineWidth={2.4} />
              <Etiket konum={[0, (s / 2 + 0.45 - s / 2) * k + 3.4, 0]} renk="#6b7280" kucuk>
                büyük karenin alanı = (a + b)² — iki düzende de aynı
              </Etiket>

              {/* Kalan bölgeler */}
              <Levha noktalar={kareA} renk="#0f766e" opaklik={0.5 * (1 - g)} cerceve={g < 0.5} />
              <Levha noktalar={kareB} renk="#b45309" opaklik={0.5 * (1 - g)} cerceve={g < 0.5} />
              <Levha noktalar={kareC} renk="#be185d" opaklik={0.5 * g} cerceve={g > 0.5} />

              {g < 0.5 && (
                <>
                  <Etiket konum={[...T([a / 2, a / 2]), 0.3] as V3} renk="#0f766e">
                    a²
                  </Etiket>
                  <Etiket konum={[...T([(a + s) / 2, (a + s) / 2]), 0.3] as V3} renk="#b45309">
                    b²
                  </Etiket>
                </>
              )}
              {g > 0.5 && (
                <Etiket konum={[...T([s / 2, s / 2]), 0.3] as V3} renk="#be185d">
                  c²
                </Etiket>
              )}

              {/* Dört eş üçgen */}
              {ucgenler.map((u, i) => (
                <Levha key={i} noktalar={u} renk="#a8a396" opaklik={0.6} derinlik={0.2} z={0.02} />
              ))}
            </>
          )}
        </Sahne>
      }
    />
  )
}

export const pisagorModulu: DersModulu = {
  id: 'pisagor',
  baslik: 'Pisagor Bağıntısı — Alanlarla İspat',
  altBaslik: 'Dört eş üçgeni yeniden dizerek a² + b² = c² eşitliğini gözünle gör.',
  ders: 'matematik',
  seviye: '8. Sınıf / 9. Sınıf',
  sure: 12,
  etiketler: ['geometri', 'ispat', 'alan', 'dik üçgen'],
  Sahne: PisagorSahne,
  adimlar: [
    {
      baslik: 'Dik üçgen',
      metin:
        'Dik kenarları a ve b, hipotenüsü c olan bir dik üçgenimiz var. a ve b kaydıraçlarını değiştirdiğinde c\'nin nasıl değiştiğini göstergeden izle. Amacımız c ile a, b arasındaki bağıntıyı bulmak.',
    },
    {
      baslik: 'Kenarlar üzerine kareler kuralım',
      metin:
        'Her kenar üzerine, o kenarı bir ayrıtı kabul eden birer kare çiziyoruz. Alanları a², b² ve c² oluyor. Göstergedeki "a² + b²" ile "c²" satırlarını karşılaştır: hangi a, b seçersen seç ikisi eşit çıkıyor. Peki NEDEN?',
    },
    {
      baslik: 'İki düzenin sırrı: (a + b)² kare',
      metin:
        'Kenarı (a + b) olan büyük bir kare alıyoruz. İçine dört tane eş dik üçgen (gri) yerleştirdik. Üçgenlerin dışında kalan boşluk tam olarak iki kare: a² (yeşil) ve b² (turuncu).',
    },
    {
      baslik: 'Aynı dört üçgeni yeniden dizelim',
      metin:
        'Şimdi aynı dört üçgeni büyük karenin içinde kaydırıyoruz — hiçbiri döndürülmüyor, sadece yer değiştiriyor. Kapladıkları toplam alan değişmedi. Ama bu kez boşta kalan bölge tek bir eğik kare: c² (pembe).',
    },
    {
      baslik: 'Sonuç',
      metin:
        'Büyük karenin alanı iki düzende de aynı. Dört üçgenin alanı da aynı. Öyleyse geriye kalan boşluklar eşit olmak zorunda: a² + b² = c². İspat bitti — hiçbir formül ezberlemeden, yalnızca alanları sayarak.',
    },
  ],
  ispat: {
    baslik: 'Cebirsel yazımı',
    giris: 'Sahnedeki iki düzeni cebirle yazalım.',
    satirlar: [
      { tex: '\\text{Büyük karenin alanı}=(a+b)^{2}' },
      { tex: '\\text{Bir üçgenin alanı}=\\frac{ab}{2}\\ \\Rightarrow\\ \\text{dört üçgen}=2ab' },
      { tex: '\\text{Düzen 1: } (a+b)^{2}=2ab+a^{2}+b^{2}', not: 'Boşluk iki kare' },
      { tex: '\\text{Düzen 2: } (a+b)^{2}=2ab+c^{2}', not: 'Boşluk tek eğik kare' },
      { tex: '2ab+a^{2}+b^{2}=2ab+c^{2}', not: 'Sol taraflar eşit' },
    ],
    sonuc: 'a^{2}+b^{2}=c^{2}',
  },
  sorular: [
    {
      soru: 'Dik kenarları 6 ve 8 olan dik üçgenin hipotenüsü kaçtır?',
      secenekler: ['10', '12', '14', '48'],
      dogru: 0,
      aciklama: 'c² = 6² + 8² = 36 + 64 = 100 olduğundan c = 10 bulunur.',
    },
    {
      soru: 'İspatta eğik karenin kenarının c olduğunu nereden biliyoruz?',
      secenekler: [
        'Ölçtüğümüz için',
        'Kenarı, üçgenin hipotenüsüyle çakıştığı için',
        'Büyük karenin köşegeni olduğu için',
        'Varsayım olduğu için',
      ],
      dogru: 1,
      aciklama:
        'Eğik karenin her kenarı, yerleştirdiğimiz eş üçgenlerden birinin hipotenüsüdür; dolayısıyla uzunluğu c\'dir.',
    },
    {
      soru: 'Kenarları 5, 12, 13 olan üçgen için hangisi doğrudur?',
      secenekler: ['Dar açılıdır', 'Dik üçgendir', 'Geniş açılıdır', 'Böyle bir üçgen yoktur'],
      dogru: 1,
      aciklama: '5² + 12² = 25 + 144 = 169 = 13² olduğundan Pisagor bağıntısı sağlanır: dik üçgendir.',
    },
  ],
}
