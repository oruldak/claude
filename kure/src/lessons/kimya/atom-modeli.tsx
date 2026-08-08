import { useMemo, useState } from 'react'
import { Points, PointMaterial } from '@react-three/drei'
import * as THREE from 'three'
import { Cizgi as Line, Etiket, Sahne, type V3 } from '../shared/sahne'
import { Anahtar, Dugme, Duzen, Gosterge, Kaydirac } from '../shared/ui'
import { useZaman } from '../shared/animasyon'
import type { DersModulu, SahneProps } from '../types'

interface Element {
  Z: number
  sembol: string
  ad: string
  notron: number
}

const ELEMENTLER: Element[] = [
  { Z: 1, sembol: 'H', ad: 'Hidrojen', notron: 0 },
  { Z: 2, sembol: 'He', ad: 'Helyum', notron: 2 },
  { Z: 3, sembol: 'Li', ad: 'Lityum', notron: 4 },
  { Z: 6, sembol: 'C', ad: 'Karbon', notron: 6 },
  { Z: 7, sembol: 'N', ad: 'Azot', notron: 7 },
  { Z: 8, sembol: 'O', ad: 'Oksijen', notron: 8 },
  { Z: 11, sembol: 'Na', ad: 'Sodyum', notron: 12 },
  { Z: 17, sembol: 'Cl', ad: 'Klor', notron: 18 },
  { Z: 18, sembol: 'Ar', ad: 'Argon', notron: 22 },
  { Z: 20, sembol: 'Ca', ad: 'Kalsiyum', notron: 20 },
]

/** Basit kabuk doldurma (2, 8, 8, 18 …) — Bohr modeli için. */
function kabuklar(Z: number): number[] {
  const kapasite = [2, 8, 8, 18, 18, 32]
  const k: number[] = []
  let kalan = Z
  for (const c of kapasite) {
    if (kalan <= 0) break
    k.push(Math.min(kalan, c))
    kalan -= c
  }
  return k
}

/** 1s ve 2p olasılık bulutları için örnek noktalar. */
function bulutNoktalari(tur: 's' | 'p', adet = 2600): Float32Array {
  const p = new Float32Array(adet * 3)
  let i = 0
  let guvenlik = 0
  while (i < adet && guvenlik < adet * 60) {
    guvenlik++
    const x = (Math.random() * 2 - 1) * 3
    const y = (Math.random() * 2 - 1) * 3
    const z = (Math.random() * 2 - 1) * 3
    const r = Math.hypot(x, y, z)
    if (r < 1e-4 || r > 3) continue
    // |ψ|²: 1s → e^(−2r);  2p_z → r²e^(−r) cos²θ
    const yogunluk =
      tur === 's'
        ? Math.exp(-2 * r) * 1
        : r * r * Math.exp(-r) * (z / r) ** 2 * 0.09
    if (Math.random() < yogunluk) {
      p[i * 3] = x
      p[i * 3 + 1] = y
      p[i * 3 + 2] = z
      i++
    }
  }
  return p.slice(0, i * 3)
}

function AtomSahne({ adim }: SahneProps) {
  const [ei, setEi] = useState(5)
  const [oynat, setOynat] = useState(true)
  const [uyarilmis, setUyarilmis] = useState(false)
  const [orbital, setOrbital] = useState<'s' | 'p'>('s')
  const [hiz, setHiz] = useState(1)

  const el = ELEMENTLER[ei]
  const kab = kabuklar(el.Z)
  const degerlik = kab[kab.length - 1]
  const [t] = useZaman(oynat, hiz)

  const cekirdek = useMemo(() => {
    const toplam = el.Z + el.notron
    const p: { poz: V3; proton: boolean }[] = []
    for (let i = 0; i < toplam; i++) {
      const k = i + 0.5
      const phi = Math.acos(1 - (2 * k) / toplam)
      const th = Math.PI * (1 + Math.sqrt(5)) * k
      const r = 0.16 * Math.cbrt(toplam) * (0.55 + 0.45 * Math.sqrt(i / Math.max(toplam - 1, 1)))
      p.push({
        poz: [r * Math.sin(phi) * Math.cos(th), r * Math.sin(phi) * Math.sin(th), r * Math.cos(phi)],
        proton: i < el.Z,
      })
    }
    return p
  }, [el])

  const bulut = useMemo(() => bulutNoktalari(orbital), [orbital])

  return (
    <Duzen
      gosterge={
        <Gosterge
          satirlar={[
            { ad: 'element', deger: `${el.sembol} — ${el.ad}`, renk: '#ffb454' },
            { ad: 'proton (Z)', deger: el.Z, renk: '#ff7a45' },
            { ad: 'nötron', deger: el.notron, renk: '#94a3b8' },
            { ad: 'elektron', deger: el.Z, renk: '#7dd3fc' },
            { ad: 'kütle numarası', deger: el.Z + el.notron },
            { ad: 'kabuk dizilimi', deger: kab.join(' · '), renk: '#38e1c6' },
            { ad: 'değerlik elektronu', deger: degerlik, renk: '#f472b6' },
          ]}
        />
      }
      kontrol={
        <>
          <div className="flex flex-wrap gap-1.5">
            {ELEMENTLER.map((e, i) => (
              <Dugme key={e.sembol} onClick={() => setEi(i)} aktif={i === ei} boyut="sm">
                {e.sembol}
              </Dugme>
            ))}
          </div>
          <Kaydirac etiket="dönme hızı" deger={hiz} min={0} max={2.5} onChange={setHiz} basamak={1} />
          {adim >= 3 && <Anahtar etiket="elektronu uyar (ışıma)" deger={uyarilmis} onChange={setUyarilmis} renk="#ffb454" />}
          {adim >= 4 && (
            <div className="flex gap-1.5">
              <Dugme onClick={() => setOrbital('s')} aktif={orbital === 's'} boyut="sm">
                s orbitali
              </Dugme>
              <Dugme onClick={() => setOrbital('p')} aktif={orbital === 'p'} boyut="sm" renk="#8b7dff">
                p orbitali
              </Dugme>
            </div>
          )}
          <Dugme onClick={() => setOynat(!oynat)} aktif={oynat} boyut="sm">
            {oynat ? '⏸ durdur' : '▶ oynat'}
          </Dugme>
        </>
      }
      sahne={
        <Sahne kamera={[0, 2.5, 8]} izgara={false} maxUzaklik={26} otoDondur={adim === 0}>
          {/* Çekirdek */}
          {adim < 4 &&
            cekirdek.map((c, i) => (
              <mesh key={i} position={c.poz}>
                <sphereGeometry args={[0.13, 16, 16]} />
                <meshStandardMaterial
                  color={c.proton ? '#ff7a45' : '#8fa3c4'}
                  emissive={c.proton ? '#ff7a45' : '#000000'}
                  emissiveIntensity={c.proton ? 0.25 : 0}
                  roughness={0.4}
                />
              </mesh>
            ))}
          {adim < 4 && (
            <Etiket konum={[0, -0.95, 0]} renk="#ff7a45" kucuk>
              çekirdek: {el.Z} proton + {el.notron} nötron
            </Etiket>
          )}

          {/* Bohr kabukları ve elektronlar */}
          {adim >= 1 && adim < 4 &&
            kab.map((sayi, ki) => {
              const R = 1.25 + ki * 0.85 + (uyarilmis && ki === kab.length - 1 ? 0.7 : 0)
              const yorunge: V3[] = []
              for (let i = 0; i <= 80; i++) {
                const u = (i / 80) * Math.PI * 2
                yorunge.push([R * Math.cos(u), R * Math.sin(u) * 0.32, R * Math.sin(u)])
              }
              return (
                <group key={ki}>
                  <Line points={yorunge} color="#26324f" lineWidth={1.4} />
                  {Array.from({ length: sayi }, (_, j) => {
                    const u = (j / sayi) * Math.PI * 2 + t * (1.4 / (ki + 1))
                    const poz: V3 = [R * Math.cos(u), R * Math.sin(u) * 0.32, R * Math.sin(u)]
                    return (
                      <mesh key={j} position={poz}>
                        <sphereGeometry args={[0.1, 14, 14]} />
                        <meshStandardMaterial
                          color={ki === kab.length - 1 ? '#f472b6' : '#7dd3fc'}
                          emissive={ki === kab.length - 1 ? '#f472b6' : '#7dd3fc'}
                          emissiveIntensity={0.7}
                        />
                      </mesh>
                    )
                  })}
                  {adim >= 2 && (
                    <Etiket konum={[R + 0.35, 0.32, 0]} renk={ki === kab.length - 1 ? '#f472b6' : '#7dd3fc'} kucuk>
                      {ki + 1}. kabuk: {sayi}e⁻
                    </Etiket>
                  )}
                </group>
              )
            })}

          {/* Uyarılma / ışıma */}
          {adim >= 3 && uyarilmis && adim < 4 && (
            <>
              <mesh>
                <sphereGeometry args={[0.5, 20, 20]} />
                <meshStandardMaterial color="#ffb454" transparent opacity={0.25} emissive="#ffb454" emissiveIntensity={0.6} />
              </mesh>
              <Etiket konum={[0, 3.4, 0]} renk="#ffb454" kucuk>
                elektron üst kabuğa çıktı → geri dönerken foton yayar (E = h·f)
              </Etiket>
            </>
          )}

          {/* Kuantum modeli: olasılık bulutu */}
          {adim >= 4 && (
            <>
              <Points positions={bulut} stride={3}>
                <PointMaterial
                  transparent
                  color={orbital === 's' ? '#7dd3fc' : '#8b7dff'}
                  size={0.055}
                  sizeAttenuation
                  depthWrite={false}
                  blending={THREE.AdditiveBlending}
                  opacity={0.85}
                />
              </Points>
              <mesh>
                <sphereGeometry args={[0.16, 16, 16]} />
                <meshStandardMaterial color="#ff7a45" emissive="#ff7a45" emissiveIntensity={0.7} />
              </mesh>
              <Etiket konum={[0, -3.2, 0]} renk={orbital === 's' ? '#7dd3fc' : '#8b7dff'} kucuk>
                {orbital === 's'
                  ? 's orbitali: küresel simetrik, elektron bulunma olasılığı merkeze yakın en yüksek'
                  : 'p orbitali: iki loblu, düğüm düzleminde bulunma olasılığı sıfır'}
              </Etiket>
            </>
          )}
        </Sahne>
      }
    />
  )
}

export const atomModeliModulu: DersModulu = {
  id: 'atom-modeli',
  baslik: 'Atomun Yapısı — Bohr\'dan Kuantum Modeline',
  altBaslik: 'Çekirdeği kur, elektronları kabuklara yerleştir, sonra bulutun içine gir.',
  ders: 'kimya',
  seviye: '7. / 9. / 11. Sınıf',
  sure: 18,
  etiketler: ['atom', 'elektron dizilimi', 'Bohr modeli', 'orbital'],
  Sahne: AtomSahne,
  adimlar: [
    {
      baslik: 'Atomun temel parçacıkları',
      metin:
        'Çekirdekte pozitif yüklü PROTONLAR (turuncu) ve yüksüz NÖTRONLAR (gri) bulunur. Atomun neredeyse tüm kütlesi buradadır ama hacminin yalnızca çok küçük bir kısmını kaplar. Proton sayısı (Z) elementin kimliğidir: 6 protonu olan her atom karbondur.',
    },
    {
      baslik: 'Bohr modeli: kabuklar',
      metin:
        'Elektronlar çekirdeğin çevresinde belirli enerji kabuklarında bulunur. Kabuk kapasiteleri sırasıyla 2, 8, 8, 18\'dir. Elementleri değiştirip kabukların nasıl dolduğunu izle.',
    },
    {
      baslik: 'Değerlik elektronları',
      metin:
        'En dıştaki kabuktaki elektronlara DEĞERLİK elektronu denir (pembe) ve kimyasal davranışı bunlar belirler. Na\'nın 1, Cl\'nin 7 değerlik elektronu vardır — bu yüzden Na elektron verir, Cl alır ve NaCl oluşur. Ar\'ın dış kabuğu dolu olduğu için tepkimeye girmez.',
    },
    {
      baslik: 'Uyarılma ve ışıma',
      metin:
        'Atoma enerji verilirse elektron üst kabuğa sıçrar (uyarılmış hâl). Geri düşerken aradaki enerji farkını bir FOTON olarak yayar: E = h·f. Havai fişeklerin rengi, neon lambaların ışığı ve yıldızların spektrumu tam olarak budur.',
    },
    {
      baslik: 'Kuantum modeli: orbital',
      metin:
        'Modern fizik, elektronun yörüngesini değil BULUNMA OLASILIĞINI verir. Her nokta, elektronun orada bulunma olasılığını temsil eder. s orbitali küresel, p orbitali iki lobludur ve lobların arasında elektronun asla bulunmadığı bir düğüm düzlemi vardır.',
    },
  ],
  ispat: {
    baslik: 'Bohr yarıçapı ve enerji düzeylerinin türetilişi',
    giris: 'Elektronun çekirdek çevresindeki çembersel hareketi ve açısal momentumun kuantumlanması.',
    satirlar: [
      { tex: '\\frac{ke^{2}}{r^{2}}=\\frac{m v^{2}}{r}', not: 'Coulomb kuvveti merkezcil kuvveti sağlar' },
      { tex: 'm v r = n\\hbar', not: 'Bohr varsayımı: açısal momentum kuantumludur' },
      { tex: 'r_n=\\frac{n^{2}\\hbar^{2}}{k m e^{2}}\\ \\Rightarrow\\ r_1\\approx 0{,}529\\ \\text{Å}', not: 'Bohr yarıçapı' },
      { tex: 'E_n=-\\frac{k^{2}me^{4}}{2\\hbar^{2}n^{2}}=-\\frac{13{,}6}{n^{2}}\\ \\text{eV}' },
      { tex: 'h f = E_{n_2}-E_{n_1}', not: 'Yayılan fotonun enerjisi = düzeyler arası fark' },
    ],
    sonuc: '\\frac{1}{\\lambda}=R_H\\left(\\frac{1}{n_1^{2}}-\\frac{1}{n_2^{2}}\\right)',
  },
  sorular: [
    {
      soru: 'Bir atomun kimliğini belirleyen sayı hangisidir?',
      secenekler: ['Nötron sayısı', 'Proton sayısı', 'Elektron sayısı', 'Kütle numarası'],
      dogru: 1,
      aciklama: 'Proton sayısı (atom numarası Z) elementi belirler; nötron sayısı izotopları oluşturur.',
    },
    {
      soru: '₁₁Na atomunun elektron dizilimi nasıldır?',
      secenekler: ['2 · 9', '2 · 8 · 1', '8 · 3', '2 · 8 · 8'],
      dogru: 1,
      aciklama: 'Kabuklar 2 ve 8 dolduktan sonra son kabuğa 1 elektron kalır: 2 · 8 · 1.',
    },
    {
      soru: 'Uyarılmış bir elektron temel hâle dönerken ne olur?',
      secenekler: [
        'Enerji soğurur',
        'Foton yayar',
        'Proton salar',
        'Nötron kazanır',
      ],
      dogru: 1,
      aciklama: 'Aradaki enerji farkı ışık (foton) olarak yayılır; bu, atomun ışıma spektrumunu oluşturur.',
    },
    {
      soru: 'Kuantum modelinde "orbital" ne anlama gelir?',
      secenekler: [
        'Elektronun kesin yörüngesi',
        'Elektronun bulunma olasılığının yüksek olduğu bölge',
        'Çekirdeğin sınırı',
        'Bir enerji birimi',
      ],
      dogru: 1,
      aciklama:
        'Orbital, elektronun belirli bir olasılıkla (genellikle %90) bulunduğu uzay bölgesidir; kesin bir yörünge değildir.',
    },
  ],
}
