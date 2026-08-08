import { useMemo, useState } from 'react'
import { Cizgi as Line, Etiket, Sahne, type V3 } from '../shared/sahne'
import { Anahtar, Dugme, Duzen, Gosterge, Kaydirac } from '../shared/ui'
import { useZaman } from '../shared/animasyon'
import type { DersModulu, SahneProps } from '../types'

interface Gezegen {
  ad: string
  r: number // görsel yarıçap
  a: number // yörünge yarıçapı (sahne birimi)
  periyot: number // yıl
  renk: string
  halka?: boolean
}

/** Ölçek gerçek değildir; uzaklıklar sıkıştırılmış, çaplar büyütülmüştür. */
const GEZEGENLER: Gezegen[] = [
  { ad: 'Merkür', r: 0.11, a: 1.6, periyot: 0.24, renk: '#a8a29e' },
  { ad: 'Venüs', r: 0.18, a: 2.3, periyot: 0.62, renk: '#e8c07d' },
  { ad: 'Dünya', r: 0.19, a: 3.1, periyot: 1, renk: '#4aa8ff' },
  { ad: 'Mars', r: 0.14, a: 3.9, periyot: 1.88, renk: '#e2725b' },
  { ad: 'Jüpiter', r: 0.46, a: 5.4, periyot: 11.86, renk: '#d9a066' },
  { ad: 'Satürn', r: 0.4, a: 6.8, periyot: 29.5, renk: '#e6d3a3', halka: true },
  { ad: 'Uranüs', r: 0.28, a: 8.0, periyot: 84, renk: '#8fd6e6' },
  { ad: 'Neptün', r: 0.27, a: 9.1, periyot: 165, renk: '#4f6fd8' },
]

function cember(r: number, y = 0): V3[] {
  return Array.from({ length: 129 }, (_, i) => {
    const u = (i / 128) * Math.PI * 2
    return [r * Math.cos(u), y, r * Math.sin(u)] as V3
  })
}

function GunesSahne({ adim }: SahneProps) {
  const [hiz, setHiz] = useState(0.35)
  const [oynat, setOynat] = useState(true)
  const [yorungeler, setYorungeler] = useState(true)
  const [tutulma, setTutulma] = useState<'yok' | 'gunes' | 'ay'>('yok')
  const [t] = useZaman(oynat, hiz)

  const yakin = adim === 2 || adim === 3 // Dünya–Ay yakın görünümü

  const gezegenKonum = (g: Gezegen): V3 => {
    const a = (t * 2 * Math.PI) / g.periyot
    return [g.a * Math.cos(a), 0, g.a * Math.sin(a)]
  }

  // Yakın görünümde Güneş sola sabitlenir, Ay Dünya çevresinde dolanır
  const gunesYonu: V3 = [-9, 0, 0]
  const ayAcisi = tutulma === 'gunes' ? Math.PI : tutulma === 'ay' ? 0 : t * 1.6
  const ayKonum: V3 = [2.6 * Math.cos(ayAcisi), 0.32 * Math.sin(ayAcisi), 2.6 * Math.sin(ayAcisi)]

  const evreAdi = useMemo(() => {
    const a = ((ayAcisi % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2)
    if (a < 0.4 || a > 5.88) return 'dolunay'
    if (a < 1.2) return 'şişkin ay'
    if (a < 1.95) return 'son dördün'
    if (a < 2.75) return 'hilal'
    if (a < 3.53) return 'yeni ay'
    if (a < 4.3) return 'hilal'
    if (a < 5.1) return 'ilk dördün'
    return 'şişkin ay'
  }, [ayAcisi])

  return (
    <Duzen
      gosterge={
        <Gosterge
          satirlar={
            yakin
              ? [
                  { ad: 'görünüm', deger: 'Güneş – Dünya – Ay', renk: '#ffb454' },
                  { ad: 'Ay evresi', deger: evreAdi, renk: '#e2e8f0' },
                  { ad: 'Ay’ın dolanma süresi', deger: '≈ 27,3 gün' },
                  { ad: 'tutulma', deger: tutulma === 'yok' ? '—' : tutulma === 'gunes' ? 'Güneş tutulması' : 'Ay tutulması', renk: '#f472b6' },
                ]
              : [
                  { ad: 'geçen süre', deger: `${(t).toFixed(1)} yıl`, renk: '#ffb454' },
                  { ad: 'gezegen sayısı', deger: 8 },
                  { ad: 'en hızlı', deger: 'Merkür (88 gün)', renk: '#a8a29e' },
                  { ad: 'en yavaş', deger: 'Neptün (165 yıl)', renk: '#4f6fd8' },
                ]
          }
        />
      }
      kontrol={
        <>
          <Kaydirac etiket="zaman hızı" deger={hiz} min={0} max={2} onChange={setHiz} basamak={2} />
          <Anahtar etiket="yörünge çizgileri" deger={yorungeler} onChange={setYorungeler} />
          {yakin && (
            <div className="flex gap-1.5">
              {(['yok', 'gunes', 'ay'] as const).map((k) => (
                <Dugme key={k} onClick={() => setTutulma(k)} aktif={tutulma === k} boyut="sm" renk="#f472b6">
                  {k === 'yok' ? 'serbest dolanım' : k === 'gunes' ? 'Güneş tutulması' : 'Ay tutulması'}
                </Dugme>
              ))}
            </div>
          )}
          <Dugme onClick={() => setOynat(!oynat)} aktif={oynat} boyut="sm">
            {oynat ? '⏸ durdur' : '▶ oynat'}
          </Dugme>
        </>
      }
      sahne={
        <Sahne
          kamera={yakin ? [0, 4.5, 9] : [0, 8, 13]}
          izgara={false}
          uzay
          maxUzaklik={50}
          minUzaklik={2}
        >
          {yakin ? (
            <>
              {/* Güneş yönü (uzakta) */}
              <pointLight position={gunesYonu} intensity={260} distance={0} decay={2} color="#fff6e0" />
              <mesh position={gunesYonu}>
                <sphereGeometry args={[1.4, 32, 32]} />
                <meshBasicMaterial color="#ffd479" />
              </mesh>
              <Etiket konum={[gunesYonu[0], 2.1, 0]} renk="#ffd479" kucuk>
                Güneş
              </Etiket>

              {/* Dünya */}
              <mesh>
                <sphereGeometry args={[1, 48, 32]} />
                <meshStandardMaterial color="#3b82f6" roughness={0.85} />
              </mesh>
              <Etiket konum={[0, 1.4, 0]} renk="#7dd3fc" kucuk>
                Dünya
              </Etiket>

              {/* Ay */}
              <mesh position={ayKonum}>
                <sphereGeometry args={[0.3, 32, 24]} />
                <meshStandardMaterial color="#d6d3d1" roughness={0.95} />
              </mesh>
              <Etiket konum={[ayKonum[0], ayKonum[1] + 0.55, ayKonum[2]]} renk="#e2e8f0" kucuk>
                Ay — {evreAdi}
              </Etiket>
              {yorungeler && <Line points={cember(2.6)} color="#26324f" lineWidth={1.4} />}

              {/* Gölge konileri */}
              {tutulma === 'gunes' && (
                <>
                  <Line points={[[gunesYonu[0], 0, 0], [3.5, 0, 0]] as V3[]} color="#f472b6" lineWidth={1.6} dashed dashSize={0.2} gapSize={0.15} />
                  <Etiket konum={[1.6, -1.3, 0]} renk="#f472b6" kucuk>
                    Ay, Güneş ile Dünya arasında → Güneş tutulması
                  </Etiket>
                </>
              )}
              {tutulma === 'ay' && (
                <>
                  <Line points={[[gunesYonu[0], 0, 0], [4.2, 0, 0]] as V3[]} color="#f472b6" lineWidth={1.6} dashed dashSize={0.2} gapSize={0.15} />
                  <Etiket konum={[1.6, -1.3, 0]} renk="#f472b6" kucuk>
                    Dünya, Güneş ile Ay arasında → Ay tutulması
                  </Etiket>
                </>
              )}
            </>
          ) : (
            <>
              {/* Güneş */}
              <pointLight position={[0, 0, 0]} intensity={220} distance={0} decay={2} color="#fff3d6" />
              <mesh>
                <sphereGeometry args={[0.85, 40, 32]} />
                <meshBasicMaterial color="#ffcf5c" />
              </mesh>
              <Etiket konum={[0, 1.3, 0]} renk="#ffcf5c" kucuk>
                Güneş
              </Etiket>

              {GEZEGENLER.map((g) => {
                const p = gezegenKonum(g)
                return (
                  <group key={g.ad}>
                    {yorungeler && <Line points={cember(g.a)} color="#1c2a48" lineWidth={1.2} />}
                    <mesh position={p}>
                      <sphereGeometry args={[g.r, 28, 22]} />
                      <meshStandardMaterial color={g.renk} roughness={0.85} />
                    </mesh>
                    {g.halka && (
                      <mesh position={p} rotation={[Math.PI / 2 - 0.35, 0, 0]}>
                        <torusGeometry args={[g.r * 1.9, 0.03, 8, 48]} />
                        <meshStandardMaterial color="#cbb994" roughness={0.8} />
                      </mesh>
                    )}
                    <Etiket konum={[p[0], p[1] + g.r + 0.32, p[2]]} renk={g.renk} kucuk>
                      {g.ad}
                    </Etiket>
                    {/* Dünya'nın Ay'ı */}
                    {g.ad === 'Dünya' && (
                      <mesh position={[p[0] + 0.42 * Math.cos(t * 12), 0, p[2] + 0.42 * Math.sin(t * 12)]}>
                        <sphereGeometry args={[0.06, 14, 12]} />
                        <meshStandardMaterial color="#d6d3d1" roughness={0.95} />
                      </mesh>
                    )}
                  </group>
                )
              })}

              {adim >= 4 && (
                <Etiket konum={[0, -1.6, 0]} renk="#38e1c6" kucuk>
                  Kepler 3: T² ∝ a³ — Güneş’ten uzaklaşan gezegen yavaşlar
                </Etiket>
              )}
              {adim === 0 && (
                <Etiket konum={[0, 3.4, 0]} renk="#94a3b8" kucuk>
                  ölçek gerçek değildir: uzaklıklar sıkıştırılmış, gezegenler büyütülmüştür
                </Etiket>
              )}
            </>
          )}
        </Sahne>
      }
    />
  )
}

export const gunesSistemiModulu: DersModulu = {
  id: 'gunes-sistemi',
  baslik: 'Güneş Sistemi, Ay’ın Evreleri ve Tutulmalar',
  altBaslik: 'Yörüngeleri gez, Ay’ın evrelerini geometriyle çöz, tutulmaları kur.',
  ders: 'fen',
  seviye: '5. / 6. / 7. Sınıf',
  sure: 16,
  etiketler: ['güneş sistemi', 'yörünge', 'Ay evreleri', 'tutulma', 'Kepler'],
  Sahne: GunesSahne,
  adimlar: [
    {
      baslik: 'Güneş sistemi',
      metin:
        'Merkezde Güneş, çevresinde sekiz gezegen dolanır. İçteki dört gezegen (Merkür, Venüs, Dünya, Mars) kayaç; dıştaki dördü (Jüpiter, Satürn, Uranüs, Neptün) gaz ve buz devleridir. Dikkat: sahnedeki ölçek gerçek değildir — gerçek uzaklıklar bu ekrana sığmaz.',
    },
    {
      baslik: 'Yörüngeler: dolanma ve dönme',
      metin:
        'Her gezegen kendi ekseni etrafında DÖNER (gece-gündüz) ve Güneş çevresinde DOLANIR (yıl). Güneş\'e yakın gezegenler daha hızlı dolanır: Merkür\'ün yılı 88 gün, Neptün\'ünki 165 Dünya yılıdır. Zaman hızını artırıp bu farkı izle.',
    },
    {
      baslik: 'Ay’ın evreleri',
      metin:
        'Şimdi yakın görünümdeyiz. Ay ışık ÜRETMEZ; Güneş\'ten aldığı ışığı yansıtır. Yarısı her zaman aydınlıktır ama biz Dünya\'dan bu aydınlık yarının ne kadarını gördüğümüze göre farklı evreler görürüz. Ay Dünya ile Güneş arasındayken karanlık yüzünü görürüz: yeni ay. Tam karşısındayken: dolunay.',
    },
    {
      baslik: 'Tutulmalar',
      metin:
        'GÜNEŞ TUTULMASI: Ay tam olarak Güneş ile Dünya arasına girer ve gölgesi Dünya\'ya düşer (yeni ay evresinde olur). AY TUTULMASI: Dünya, Güneş ile Ay arasına girer ve gölgesi Ay\'ın üzerine düşer (dolunay evresinde olur). Her ay tutulma olmamasının nedeni, Ay\'ın yörüngesinin yaklaşık 5° eğik olmasıdır.',
    },
    {
      baslik: 'Kepler yasaları',
      metin:
        'Yörüngeler tam çember değil, Güneş bir odakta olan ELİPSTİR (1. yasa). Gezegen Güneş\'e yakınken hızlanır, uzakken yavaşlar; eşit zamanda eşit alan tarar (2. yasa). Dolanma süresinin karesi, yörünge yarıçapının küpüyle orantılıdır: T² ∝ a³ (3. yasa).',
    },
  ],
  ispat: {
    baslik: 'Kepler’in 3. yasasının Newton ile türetilişi',
    giris: 'Dairesel yörünge yaklaşımı için kütle çekimi merkezcil kuvveti sağlar.',
    satirlar: [
      { tex: 'G\\frac{Mm}{a^{2}}=\\frac{mv^{2}}{a}', not: 'Çekim = merkezcil kuvvet' },
      { tex: 'v=\\frac{2\\pi a}{T}', not: 'Bir turluk yol / süre' },
      { tex: 'G\\frac{M}{a^{2}}=\\frac{4\\pi^{2}a}{T^{2}}' },
      { tex: 'T^{2}=\\frac{4\\pi^{2}}{GM}\\,a^{3}' },
    ],
    sonuc: 'T^{2}\\propto a^{3}\\quad (\\text{Kepler’in 3. yasası})',
  },
  sorular: [
    {
      soru: 'Ay’ın evrelerinin oluşma nedeni nedir?',
      secenekler: [
        'Dünya’nın gölgesinin Ay üzerine düşmesi',
        'Ay’ın Dünya çevresinde dolanırken aydınlık yüzünün farklı görünmesi',
        'Ay’ın kendi ışığını değiştirmesi',
        'Bulutların Ay’ı kapatması',
      ],
      dogru: 1,
      aciklama:
        'Gölge açıklaması yanlıştır — o Ay tutulmasıdır. Evreler, aydınlık yarının bize göre görünen kısmının değişmesinden doğar.',
    },
    {
      soru: 'Güneş tutulması hangi evrede gerçekleşir?',
      secenekler: ['Dolunay', 'Yeni ay', 'İlk dördün', 'Son dördün'],
      dogru: 1,
      aciklama: 'Güneş tutulması için Ay’ın Güneş ile Dünya arasında olması gerekir; bu da yeni ay evresidir.',
    },
    {
      soru: 'Güneş’ten uzaklaştıkça gezegenlerin dolanma süresi nasıl değişir?',
      secenekler: ['Kısalır', 'Uzar', 'Değişmez', 'Önce uzar sonra kısalır'],
      dogru: 1,
      aciklama: 'T² ∝ a³ olduğundan yörünge yarıçapı arttıkça dolanma süresi hızla uzar.',
    },
    {
      soru: 'Neden her ay Güneş ve Ay tutulması olmaz?',
      secenekler: [
        'Ay bazen çok küçüktür',
        'Ay’ın yörünge düzlemi yaklaşık 5° eğiktir',
        'Bulutlar engel olur',
        'Dünya çok hızlı döner',
      ],
      dogru: 1,
      aciklama:
        'Ay’ın yörüngesi Dünya’nın yörünge düzlemiyle çakışmadığından üç gök cismi çoğu ayda tam hizaya gelmez.',
    },
  ],
}
