import { useMemo, useState } from 'react'
import { Cizgi as Line, Etiket, Nokta, Ok, Sahne, type V3 } from '../shared/sahne'
import { Anahtar, Dugme, Duzen, Gosterge, Kaydirac } from '../shared/ui'
import { useZaman } from '../shared/animasyon'
import type { DersModulu, SahneProps } from '../types'

interface Yuk {
  q: number
  p: V3
}

function alan(yukler: Yuk[], p: V3): V3 {
  let ex = 0
  let ey = 0
  let ez = 0
  for (const y of yukler) {
    const dx = p[0] - y.p[0]
    const dy = p[1] - y.p[1]
    const dz = p[2] - y.p[2]
    const r2 = dx * dx + dy * dy + dz * dz
    if (r2 < 0.02) continue
    const r = Math.sqrt(r2)
    const c = y.q / (r2 * r)
    ex += c * dx
    ey += c * dy
    ez += c * dz
  }
  return [ex, ey, ez]
}

function potansiyel(yukler: Yuk[], p: V3): number {
  let v = 0
  for (const y of yukler) {
    const r = Math.hypot(p[0] - y.p[0], p[1] - y.p[1], p[2] - y.p[2])
    if (r < 0.14) continue
    v += y.q / r
  }
  return v
}

function ElektrikSahne({ adim }: SahneProps) {
  const [q1, setQ1] = useState(1)
  const [q2, setQ2] = useState(-1)
  const [d, setD] = useState(2.4)
  const [ikinciVar, setIkinciVar] = useState(false)
  const [oynat, setOynat] = useState(true)
  const [testYuk, setTestYuk] = useState(0.3)

  const cokYuk = adim >= 2 || ikinciVar
  const yukler = useMemo<Yuk[]>(
    () =>
      cokYuk
        ? [
            { q: q1, p: [-d / 2, 0, 0] },
            { q: q2, p: [d / 2, 0, 0] },
          ]
        : [{ q: q1, p: [0, 0, 0] }],
    [cokYuk, q1, q2, d],
  )

  /** Alan çizgileri: pozitif yüklerden çıkıp negatiflerde biter. */
  const cizgiler = useMemo<{ p: V3[]; renk: string }[]>(() => {
    if (adim < 1) return []
    const sonuc: { p: V3[]; renk: string }[] = []
    const N = 14
    for (const y of yukler) {
      if (y.q === 0) continue
      const isaret = Math.sign(y.q)
      for (let i = 0; i < N; i++) {
        // Fibonacci küresi ile eşit dağılmış başlangıç yönleri
        const k = i + 0.5
        const phi = Math.acos(1 - (2 * k) / N)
        const theta = Math.PI * (1 + Math.sqrt(5)) * k
        const yon: V3 = [
          Math.sin(phi) * Math.cos(theta),
          Math.sin(phi) * Math.sin(theta),
          Math.cos(phi) * 0.55,
        ]
        let p: V3 = [y.p[0] + yon[0] * 0.22, y.p[1] + yon[1] * 0.22, y.p[2] + yon[2] * 0.22]
        const yol: V3[] = [p]
        for (let s = 0; s < 340; s++) {
          const E = alan(yukler, p)
          const n = Math.hypot(E[0], E[1], E[2])
          if (!Number.isFinite(n) || n < 1e-12) break
          const h = 0.055 * isaret
          p = [p[0] + (E[0] / n) * h, p[1] + (E[1] / n) * h, p[2] + (E[2] / n) * h]
          if (Math.hypot(p[0], p[1], p[2]) > 7) break
          // Bir yüke çok yaklaştıysa dur
          if (yukler.some((z) => Math.hypot(p[0] - z.p[0], p[1] - z.p[1], p[2] - z.p[2]) < 0.2)) {
            yol.push(p)
            break
          }
          yol.push(p)
        }
        if (yol.length > 3) sonuc.push({ p: yol, renk: isaret > 0 ? '#ffb454' : '#7dd3fc' })
      }
    }
    return sonuc
  }, [yukler, adim])

  const [t] = useZaman(oynat && adim >= 3, 1)
  // Test yükünün konumu (deneme amaçlı yörünge)
  const aci = t * 0.6
  const Ptest: V3 = [2.2 * Math.cos(aci), 1.5 * Math.sin(aci * 1.3), 0.9 * Math.sin(aci * 0.7)]
  const E = alan(yukler, Ptest)
  const Emag = Math.hypot(E[0], E[1], E[2])
  const F = Emag * Math.abs(testYuk)
  const V = potansiyel(yukler, Ptest)

  const okOlcek = 1.6 / Math.max(Emag, 0.05)

  return (
    <Duzen
      gosterge={
        <Gosterge
          satirlar={[
            { ad: 'q₁', deger: `${q1.toFixed(1)} μC`, renk: q1 >= 0 ? '#ffb454' : '#7dd3fc' },
            ...(cokYuk ? [{ ad: 'q₂', deger: `${q2.toFixed(1)} μC`, renk: q2 >= 0 ? '#ffb454' : '#7dd3fc' }] : []),
            ...(adim >= 3
              ? [
                  { ad: '|E| (bağıl)', deger: Emag.toFixed(3), renk: '#f472b6' },
                  { ad: '|F| = |q₀·E|', deger: F.toFixed(3), renk: '#4ade80' },
                  { ad: 'V (bağıl)', deger: V.toFixed(3), renk: '#8b7dff' },
                ]
              : []),
          ]}
        />
      }
      kontrol={
        <>
          <Kaydirac etiket="q₁ (μC)" deger={q1} min={-3} max={3} onChange={setQ1} basamak={1} renk="#ffb454" />
          {cokYuk && (
            <>
              <Kaydirac etiket="q₂ (μC)" deger={q2} min={-3} max={3} onChange={setQ2} basamak={1} renk="#7dd3fc" />
              <Kaydirac etiket="uzaklık d" deger={d} min={1} max={5} onChange={setD} basamak={1} />
            </>
          )}
          {adim >= 3 && (
            <Kaydirac etiket="test yükü q₀" deger={testYuk} min={-1} max={1} onChange={setTestYuk} basamak={2} renk="#4ade80" />
          )}
          {adim < 2 && <Anahtar etiket="ikinci yük" deger={ikinciVar} onChange={setIkinciVar} />}
          <Dugme onClick={() => setOynat(!oynat)} aktif={oynat} boyut="sm">
            {oynat ? '⏸ durdur' : '▶ oynat'}
          </Dugme>
          <Dugme boyut="sm" onClick={() => { setQ1(1); setQ2(-1) }} aktif={q1 > 0 && q2 < 0}>
            dipol (+ / −)
          </Dugme>
          <Dugme boyut="sm" onClick={() => { setQ1(1); setQ2(1) }} aktif={q1 > 0 && q2 > 0}>
            aynı işaret (+ / +)
          </Dugme>
        </>
      }
      sahne={
        <Sahne kamera={[5, 4, 8]} izgara={false} maxUzaklik={30} otoDondur={adim === 1}>
          {/* Yükler */}
          {yukler.map((y, i) => (
            <group key={i}>
              <mesh position={y.p}>
                <sphereGeometry args={[0.15 + Math.abs(y.q) * 0.06, 24, 24]} />
                <meshStandardMaterial
                  color={y.q >= 0 ? '#ff7a45' : '#4aa8ff'}
                  emissive={y.q >= 0 ? '#ff7a45' : '#4aa8ff'}
                  emissiveIntensity={0.55}
                />
              </mesh>
              <Etiket konum={[y.p[0], y.p[1] + 0.55, y.p[2]]} renk={y.q >= 0 ? '#ffb454' : '#7dd3fc'} kucuk>
                {y.q >= 0 ? '+' : '−'}
                {Math.abs(y.q).toFixed(1)} μC
              </Etiket>
            </group>
          ))}

          {/* Alan çizgileri */}
          {cizgiler.map((c, i) => (
            <Line key={i} points={c.p} color={c.renk} lineWidth={1.5} transparent opacity={0.75} />
          ))}

          {adim === 0 && (
            <Etiket konum={[0, -1.6, 0]} renk="#94a3b8" kucuk>
              yükün çevresindeki her noktada bir elektrik alan vardır
            </Etiket>
          )}

          {/* Test yükü, alan ve kuvvet vektörleri */}
          {adim >= 3 && (
            <>
              <Nokta konum={Ptest} renk={testYuk >= 0 ? '#4ade80' : '#f472b6'} r={0.12} />
              <Ok
                baslangic={Ptest}
                bitis={[Ptest[0] + E[0] * okOlcek, Ptest[1] + E[1] * okOlcek, Ptest[2] + E[2] * okOlcek]}
                renk="#f472b6"
                kalinlik={0.03}
                baslikBoyu={0.22}
              />
              <Ok
                baslangic={Ptest}
                bitis={[
                  Ptest[0] + E[0] * okOlcek * testYuk,
                  Ptest[1] + E[1] * okOlcek * testYuk,
                  Ptest[2] + E[2] * okOlcek * testYuk,
                ]}
                renk="#4ade80"
                kalinlik={0.034}
                baslikBoyu={0.22}
              />
              <Etiket konum={[Ptest[0] + 0.5, Ptest[1] + 0.5, Ptest[2]]} renk="#f472b6" kucuk>
                E
              </Etiket>
              <Etiket konum={[Ptest[0] - 0.5, Ptest[1] - 0.5, Ptest[2]]} renk="#4ade80" kucuk>
                F = q₀E
              </Etiket>
            </>
          )}

          {adim >= 4 && (
            <Etiket konum={[0, -2.6, 0]} renk="#8b7dff" kucuk>
              alan çizgilerinin sıklığı = alan şiddeti · çizgiler + yükten çıkar, − yükte biter
            </Etiket>
          )}
        </Sahne>
      }
    />
  )
}

export const elektrikAlanModulu: DersModulu = {
  id: 'elektrik-alan',
  baslik: 'Elektriksel Kuvvet ve Alan',
  altBaslik: 'Yükler birbirine dokunmadan nasıl kuvvet uygular? Alan çizgilerini üç boyutta gez.',
  ders: 'fizik',
  seviye: '11. Sınıf',
  sure: 18,
  etiketler: ['Coulomb yasası', 'elektrik alan', 'dipol', 'potansiyel'],
  Sahne: ElektrikSahne,
  adimlar: [
    {
      baslik: 'Yükün çevresindeki bölge',
      metin:
        'Bir elektrik yükü, çevresindeki uzayı değiştirir: her noktaya bir "elektrik alan" vektörü yerleşir. Buraya başka bir yük getirdiğimizde kuvveti bu alan uygular. Kuvvet, uzaktan sihirle değil, alan aracılığıyla iletilir.',
    },
    {
      baslik: 'Alan çizgileri',
      metin:
        'Alan vektörlerini uç uca ekleyerek çizgiler elde ederiz. Kural basit: çizgiler POZİTİF yükten çıkar, NEGATİF yükte biter; hiçbir zaman kesişmezler. Sahneyi döndür — alan gerçekten üç boyutlu, tıpkı bir kirpi gibi her yöne yayılıyor.',
    },
    {
      baslik: 'İki yük: dipol ve itme',
      metin:
        'İkinci yükü ekledik. Zıt işaretli yüklerde (dipol) çizgiler birinden çıkıp diğerine akar; aynı işaretlilerde ise çizgiler birbirini iterek ortada bir "boşluk" bırakır. Ortadaki nokta, alanın sıfırlandığı yerdir.',
    },
    {
      baslik: 'Test yükü: kuvvet nasıl ölçülür?',
      metin:
        'Yeşil test yükünü alanın içinde gezdiriyoruz. Pembe ok o noktadaki E alanını, yeşil ok ise test yüküne etkiyen F = q₀·E kuvvetini gösteriyor. Test yükünü negatife çevir: kuvvet anında ters döner, çünkü q₀ işaret değiştirir.',
    },
    {
      baslik: 'Alan şiddeti ve potansiyel',
      metin:
        'Çizgilerin sık olduğu yerde alan güçlüdür. Alan 1/r² ile azalırken potansiyel 1/r ile azalır. Potansiyel bir SAYIDIR (skaler), alan ise VEKTÖRdür; bu yüzden potansiyelle hesap yapmak çoğu zaman daha kolaydır.',
    },
  ],
  ispat: {
    baslik: 'Coulomb yasasından alan ve potansiyele',
    satirlar: [
      { tex: 'F=k\\dfrac{q_1 q_2}{r^{2}}', not: 'Coulomb yasası, k = 9·10⁹ N·m²/C²' },
      { tex: '\\vec{E}=\\dfrac{\\vec{F}}{q_0} \\Rightarrow E=k\\dfrac{q}{r^{2}}', not: 'Alan, birim yüke düşen kuvvet' },
      { tex: 'W=\\int_{r_1}^{r_2} \\vec{F}\\cdot d\\vec{r}=kqq_0\\int_{r_1}^{r_2}\\frac{dr}{r^{2}}' },
      { tex: 'W=kqq_0\\left(\\frac{1}{r_1}-\\frac{1}{r_2}\\right)', not: 'İş yalnızca uç noktalara bağlı → korunumlu kuvvet' },
      { tex: 'V=\\dfrac{U}{q_0}=k\\dfrac{q}{r}', not: 'Potansiyel skalerdir, toplanması kolaydır' },
    ],
    sonuc: 'E \\sim \\dfrac{1}{r^{2}},\\qquad V \\sim \\dfrac{1}{r}',
  },
  sorular: [
    {
      soru: 'İki nokta yük arasındaki uzaklık 3 katına çıkarılırsa aralarındaki kuvvet nasıl değişir?',
      secenekler: ['3 kat azalır', '9 kat azalır', '3 kat artar', 'Değişmez'],
      dogru: 1,
      aciklama: 'Coulomb kuvveti r² ile ters orantılıdır: 3² = 9 kat azalır.',
    },
    {
      soru: 'Elektrik alan çizgileri hakkında hangisi YANLIŞTIR?',
      secenekler: [
        'Pozitif yükten çıkar',
        'Negatif yükte biter',
        'Birbirini kesebilir',
        'Sıklıkları alan şiddetini gösterir',
      ],
      dogru: 2,
      aciklama:
        'Bir noktada alan tek bir yöne sahiptir; iki çizgi kesişseydi o noktada iki farklı yön olurdu. Çizgiler kesişmez.',
    },
    {
      soru: 'Negatif bir test yükünün hissettiği kuvvetin yönü nasıldır?',
      secenekler: [
        'Alanla aynı yönde',
        'Alana zıt yönde',
        'Alana dik',
        'Yüke bağlı değildir',
      ],
      dogru: 1,
      aciklama: 'F = q·E ifadesinde q negatifse kuvvet, alan vektörüne zıt yönde olur.',
    },
    {
      soru: 'Eşit büyüklükte iki pozitif yükün tam ortasında elektrik alan kaçtır?',
      secenekler: ['En büyüktür', 'Sıfırdır', 'Yüklerin toplamı kadardır', 'Belirsizdir'],
      dogru: 1,
      aciklama:
        'İki alan vektörü eşit büyüklükte ve zıt yönlü olduğundan tam ortada birbirini götürür; bileşke alan sıfırdır.',
    },
  ],
}
