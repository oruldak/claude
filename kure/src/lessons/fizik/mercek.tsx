import { useMemo, useState } from 'react'
import * as THREE from 'three'
import { Cizgi as Line, Etiket, KareliKagit, Nokta, Ok, Sahne, type V3 } from '../shared/sahne'
import { Dugme, Duzen, Gosterge, Kaydirac } from '../shared/ui'
import type { DersModulu, SahneProps } from '../types'

const XMAX = 7.5
const R_MERCEK = 1.9

/** Mercek gövdesi: profil eğrisinin dönmesiyle oluşan katı. */
function MercekGovde({ f }: { f: number }) {
  const noktalar = useMemo(() => {
    const N = 24
    const ince = f > 0
    const t0 = 0.34
    const tmin = 0.07
    const yari = (r: number) =>
      ince
        ? t0 * Math.sqrt(Math.max(1 - (r / R_MERCEK) ** 2, 0)) + 0.04
        : tmin + (t0 - tmin) * (r / R_MERCEK) ** 2
    const p: THREE.Vector2[] = []
    for (let i = N; i >= 0; i--) {
      const r = (R_MERCEK * i) / N
      p.push(new THREE.Vector2(Math.max(r, 0.0001), yari(r)))
    }
    for (let i = 0; i <= N; i++) {
      const r = (R_MERCEK * i) / N
      p.push(new THREE.Vector2(Math.max(r, 0.0001), -yari(r)))
    }
    return p
  }, [f])

  return (
    <group rotation={[0, 0, -Math.PI / 2]}>
      <mesh>
        <latheGeometry args={[noktalar, 48]} />
        <meshPhysicalMaterial
          color="#0369a1"
          transparent
          opacity={0.3}
          roughness={0.05}
          metalness={0}
          transmission={0.6}
          thickness={0.5}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  )
}

function MercekSahne({ adim }: SahneProps) {
  const [f, setF] = useState(2)
  const [cisimUzakligi, setCisimUzakligi] = useState(4.5)
  const [ho, setHo] = useState(1.2)

  const do_ = cisimUzakligi
  const paydaSifir = Math.abs(do_ - f) < 0.08
  const di = paydaSifir ? Number.POSITIVE_INFINITY : (do_ * f) / (do_ - f)
  const hi = paydaSifir ? Number.POSITIVE_INFINITY : (-ho * di) / do_
  const buyutme = -di / do_
  const gercek = Number.isFinite(di) && di > 0

  /** Mercekten çıkan ışını çizer; sanal görüntüde kesikli uzantı ekler. */
  const isin = (hL: number): { duz: V3[]; kesik: V3[] | null } => {
    if (!Number.isFinite(di)) {
      return { duz: [[0, hL, 0], [XMAX, hL, 0]], kesik: null }
    }
    let dx = di - 0
    let dy = hi - hL
    if (dx < 0) {
      dx = -dx
      dy = -dy
    }
    const k = (XMAX - 0) / dx
    return {
      duz: [
        [0, hL, 0],
        [XMAX, hL + dy * k, 0],
      ],
      kesik: di < 0 ? [[0, hL, 0], [di, hi, 0]] : null,
    }
  }

  const r1 = isin(ho) // eksene paralel gelen ışın
  const r3 = isin(Number.isFinite(hi) ? hi : ho) // odaktan geçen ışın
  const merkezIsin: V3[] = [
    [-do_, ho, 0],
    [0, 0, 0],
    [XMAX, (-ho / do_) * XMAX, 0],
  ]
  const merkezKesik: V3[] | null =
    Number.isFinite(di) && di < 0
      ? [
          [0, 0, 0],
          [di, hi, 0],
        ]
      : null

  return (
    <Duzen
      gosterge={
        <Gosterge
          satirlar={[
            { ad: 'mercek', deger: f > 0 ? 'ince kenarlı (yakınsak)' : 'kalın kenarlı (ıraksak)', renk: '#0369a1' },
            { ad: 'odak f', deger: `${f.toFixed(2)}`, renk: '#b45309' },
            { ad: 'cisim uzaklığı d₀', deger: do_.toFixed(2) },
            {
              ad: 'görüntü uzaklığı dᵢ',
              deger: Number.isFinite(di) ? di.toFixed(2) : 'sonsuz',
              renk: gercek ? '#15803d' : '#be185d',
            },
            { ad: 'büyütme', deger: Number.isFinite(buyutme) ? buyutme.toFixed(2) : '—' },
            { ad: 'görüntü', deger: gercek ? 'gerçek · ters' : 'sanal · düz', renk: gercek ? '#15803d' : '#be185d' },
          ]}
        />
      }
      kontrol={
        <>
          <div className="flex gap-1.5">
            <Dugme onClick={() => setF(Math.abs(f))} aktif={f > 0} boyut="sm">
              ince kenarlı
            </Dugme>
            <Dugme onClick={() => setF(-Math.abs(f))} aktif={f < 0} boyut="sm" renk="#be185d">
              kalın kenarlı
            </Dugme>
          </div>
          <Kaydirac
            etiket="odak uzaklığı |f|"
            deger={Math.abs(f)}
            min={0.8}
            max={3.4}
            onChange={(v) => setF(Math.sign(f) * v)}
            basamak={2}
            renk="#b45309"
          />
          <Kaydirac etiket="cisim uzaklığı d₀" deger={do_} min={0.6} max={7} onChange={setCisimUzakligi} basamak={2} />
          <Kaydirac etiket="cisim boyu" deger={ho} min={0.4} max={2} onChange={setHo} basamak={1} renk="#15803d" />
          <Dugme boyut="sm" onClick={() => setCisimUzakligi(Math.abs(f) * 0.6)}>
            cismi odak içine al
          </Dugme>
        </>
      }
      sahne={
        <Sahne kamera={[0, 2.2, 11]} zemin="yok" maxUzaklik={34}>
          <KareliKagit genislik={20} yukseklik={10} z={-0.3} birim={1} />
          {/* Optik eksen ve mercek */}
          <Line points={[[-XMAX, 0, 0], [XMAX, 0, 0]] as V3[]} color="#c9c0b1" lineWidth={1.6} />
          <MercekGovde f={f} />

          {/* Odak noktaları */}
          {[-1, 1].map((s) => (
            <group key={s}>
              <Nokta konum={[s * Math.abs(f), 0, 0]} renk="#b45309" r={0.085} />
              <Etiket konum={[s * Math.abs(f), -0.42, 0]} renk="#b45309" kucuk>
                {s < 0 ? 'F' : "F'"}
              </Etiket>
              <Nokta konum={[s * Math.abs(f) * 2, 0, 0]} renk="#8b8577" r={0.07} />
              <Etiket konum={[s * Math.abs(f) * 2, -0.42, 0]} renk="#8a8f9c" kucuk>
                2{s < 0 ? 'F' : "F'"}
              </Etiket>
            </group>
          ))}

          {/* Cisim */}
          <Ok baslangic={[-do_, 0, 0]} bitis={[-do_, ho, 0]} renk="#15803d" kalinlik={0.04} baslikBoyu={0.24} />
          <Etiket konum={[-do_, ho + 0.4, 0]} renk="#15803d" kucuk>
            cisim
          </Etiket>

          {/* Işınlar */}
          {adim >= 1 && (
            <>
              <Line points={[[-do_, ho, 0], [0, ho, 0]] as V3[]} color="#0f766e" lineWidth={2} />
              <Line points={r1.duz} color="#0f766e" lineWidth={2} />
              {r1.kesik && <Line points={r1.kesik} color="#0f766e" lineWidth={1.4} dashed dashSize={0.16} gapSize={0.12} />}
              <Etiket konum={[-do_ / 2, ho + 0.28, 0]} renk="#0f766e" kucuk>
                ① eksene paralel gelir → odaktan geçer
              </Etiket>
            </>
          )}
          {adim >= 2 && (
            <>
              <Line points={merkezIsin} color="#4338ca" lineWidth={2} />
              {merkezKesik && <Line points={merkezKesik} color="#4338ca" lineWidth={1.4} dashed dashSize={0.16} gapSize={0.12} />}
              <Etiket konum={[-do_ / 2, ho / 2 - 0.3, 0]} renk="#4338ca" kucuk>
                ② merkezden kırılmadan geçer
              </Etiket>
              {Number.isFinite(hi) && (
                <>
                  <Line points={[[-do_, ho, 0], [0, hi, 0]] as V3[]} color="#b45309" lineWidth={2} />
                  <Line points={r3.duz} color="#b45309" lineWidth={2} />
                  {r3.kesik && <Line points={r3.kesik} color="#b45309" lineWidth={1.4} dashed dashSize={0.16} gapSize={0.12} />}
                </>
              )}
            </>
          )}

          {/* Görüntü */}
          {adim >= 3 && Number.isFinite(di) && Math.abs(di) < XMAX && (
            <>
              <Ok
                baslangic={[di, 0, 0]}
                bitis={[di, hi, 0]}
                renk={gercek ? '#15803d' : '#be185d'}
                kalinlik={0.04}
                baslikBoyu={0.24}
                opaklik={gercek ? 1 : 0.6}
              />
              <Etiket konum={[di, hi + (hi > 0 ? 0.42 : -0.42), 0]} renk={gercek ? '#15803d' : '#be185d'} kucuk>
                {gercek ? 'gerçek görüntü' : 'sanal görüntü'}
              </Etiket>
              {/* Perde: gerçek görüntü perdeye düşer */}
              {gercek && (
                <mesh position={[di, 0, -0.02]} rotation={[0, 0, 0]}>
                  <planeGeometry args={[0.1, 4.4]} />
                  <meshStandardMaterial color="#191d24" transparent opacity={0.12} side={THREE.DoubleSide} />
                </mesh>
              )}
            </>
          )}

          {adim >= 4 && (
            <Etiket konum={[0, -2.8, 0]} renk="#0369a1" kucuk>
              1/f = 1/d₀ + 1/dᵢ · büyütme = −dᵢ/d₀
            </Etiket>
          )}
        </Sahne>
      }
    />
  )
}

export const mercekModulu: DersModulu = {
  id: 'mercek',
  baslik: 'Mercekler ve Görüntü Oluşumu',
  altBaslik: 'Üç ana ışını çiz, görüntünün nerede ve nasıl oluştuğunu kendin bul.',
  ders: 'fizik',
  seviye: '7. / 10. Sınıf',
  sure: 15,
  etiketler: ['optik', 'kırılma', 'odak', 'görüntü'],
  Sahne: MercekSahne,
  adimlar: [
    {
      baslik: 'Mercek ve odak noktası',
      metin:
        'İnce kenarlı (yakınsak) mercek, eksene paralel gelen ışınları tek bir noktada toplar: odak (F). Kalın kenarlı (ıraksak) mercek ise ışınları dağıtır; ışınlar sanki odaktan geliyormuş gibi görünür. Odak uzaklığını kaydıraçla değiştir.',
    },
    {
      baslik: '1. ana ışın: eksene paralel',
      metin:
        'Cismin tepesinden eksene paralel bir ışın gönderiyoruz. Bu ışın mercekten geçtikten sonra mutlaka odaktan geçer. Işınları tek tek eklemek, görüntüyü "ezberlemek" yerine inşa etmemizi sağlar.',
    },
    {
      baslik: '2. ve 3. ana ışın',
      metin:
        'Merkezden geçen ışın (mor) hiç kırılmadan yoluna devam eder. Odaktan geçerek gelen ışın (turuncu) ise mercekten sonra eksene paralel çıkar. Üç ışının da kesiştiği nokta, görüntünün tepesidir.',
    },
    {
      baslik: 'Gerçek mi, sanal mı?',
      metin:
        'Işınlar gerçekten kesişiyorsa görüntü GERÇEKtir: perdeye düşürülebilir ve terstir. "Cismi odak içine al" düğmesine bas: ışınlar artık kesişmez, yalnızca uzantıları kesişir. Bu SANAL görüntüdür — düzdür, büyüktür ve perdeye düşmez (büyüteç böyle çalışır).',
    },
    {
      baslik: 'Mercek denklemi',
      metin:
        '1/f = 1/d₀ + 1/dᵢ ve büyütme = −dᵢ/d₀. Negatif dᵢ sanal görüntüyü, negatif büyütme ters görüntüyü gösterir. Kaydıraçları oynatıp göstergedeki değerlerin çizimle her seferinde uyuştuğunu doğrula.',
    },
  ],
  ispat: {
    baslik: 'İnce mercek denkleminin benzerlikle ispatı',
    giris: 'Merkez ışını ve odak ışınının oluşturduğu benzer üçgenleri kullanıyoruz.',
    satirlar: [
      { tex: '\\text{Merkez ışını: } \\frac{h_i}{h_o}=-\\frac{d_i}{d_o}', not: 'Tepe tepeye benzer üçgenler' },
      { tex: "\\text{Odak ışını: } \\frac{h_i}{h_o}=-\\frac{d_i-f}{f}", not: 'Mercek ile odak arasındaki benzerlik' },
      { tex: '\\frac{d_i}{d_o}=\\frac{d_i-f}{f}', not: 'İki oran eşitlenir' },
      { tex: 'd_i f = d_o d_i - d_o f' },
      { tex: 'd_o f + d_i f = d_o d_i', not: 'Düzenle' },
      { tex: '\\frac{1}{d_i}+\\frac{1}{d_o}=\\frac{1}{f}', not: 'Her iki tarafı d₀·dᵢ·f ile böl' },
    ],
    sonuc: '\\frac{1}{f}=\\frac{1}{d_o}+\\frac{1}{d_i},\\qquad m=-\\frac{d_i}{d_o}',
  },
  sorular: [
    {
      soru: 'İnce kenarlı mercekte cisim 2F noktasına konulursa görüntü nasıl olur?',
      secenekler: [
        'Sanal, düz, büyük',
        'Gerçek, ters, cisimle aynı boyda',
        'Gerçek, ters, küçük',
        'Görüntü oluşmaz',
      ],
      dogru: 1,
      aciklama: 'd₀ = 2f için dᵢ = 2f ve büyütme −1 olur: gerçek, ters ve aynı boyda görüntü.',
    },
    {
      soru: 'Büyüteç olarak kullanılan mercekte cisim nerededir?',
      secenekler: ['2F dışında', 'F ile 2F arasında', 'Odak uzaklığı içinde', 'Tam odakta'],
      dogru: 2,
      aciklama: 'Cisim odak içindeyken sanal, düz ve büyük görüntü oluşur; büyüteç bu ilkeyle çalışır.',
    },
    {
      soru: 'Kalın kenarlı (ıraksak) mercekte oluşan görüntü daima nasıldır?',
      secenekler: ['Gerçek ve ters', 'Sanal, düz ve küçük', 'Gerçek ve büyük', 'Cisimle aynı boyda'],
      dogru: 1,
      aciklama: 'Iraksak merceklerde cisim nerede olursa olsun görüntü sanal, düz ve küçüktür.',
    },
    {
      soru: 'f = 10 cm olan mercekten 15 cm uzağa konan cismin görüntüsü kaç cm uzaktadır?',
      secenekler: ['6', '25', '30', '5'],
      dogru: 2,
      aciklama: '1/10 = 1/15 + 1/dᵢ → 1/dᵢ = 1/30 → dᵢ = 30 cm (gerçek görüntü).',
    },
  ],
}
