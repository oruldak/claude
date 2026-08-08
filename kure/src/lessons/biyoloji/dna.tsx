import { useMemo, useState } from 'react'
import { Cizgi as Line, Etiket, Nokta, Sahne, type V3 } from '../shared/sahne'
import { Anahtar, Dugme, Duzen, Gosterge, Kaydirac } from '../shared/ui'
import { useZaman } from '../shared/animasyon'
import type { DersModulu, SahneProps } from '../types'

const DIZI = 'ATGGCTTTACGCAAGTCCGATTGGCAA'
const ESLER: Record<string, string> = { A: 'T', T: 'A', G: 'C', C: 'G' }
const RENK: Record<string, string> = {
  A: '#15803d',
  T: '#b45309',
  G: '#0369a1',
  C: '#be185d',
  U: '#4338ca',
}

/* Standart genetik şifre (RNA kodonları → aminoasit kısaltmaları) */
const KOD = `UUU Fen;UUC Fen;UUA Lös;UUG Lös;CUU Lös;CUC Lös;CUA Lös;CUG Lös;AUU İle;AUC İle;AUA İle;AUG Met;GUU Val;GUC Val;GUA Val;GUG Val;UCU Ser;UCC Ser;UCA Ser;UCG Ser;CCU Pro;CCC Pro;CCA Pro;CCG Pro;ACU Tre;ACC Tre;ACA Tre;ACG Tre;GCU Ala;GCC Ala;GCA Ala;GCG Ala;UAU Tir;UAC Tir;UAA DUR;UAG DUR;CAU His;CAC His;CAA Gln;CAG Gln;AAU Asn;AAC Asn;AAA Lis;AAG Lis;GAU Asp;GAC Asp;GAA Glu;GAG Glu;UGU Sis;UGC Sis;UGA DUR;UGG Trp;CGU Arg;CGC Arg;CGA Arg;CGG Arg;AGU Ser;AGC Ser;AGA Arg;AGG Arg;GGU Gli;GGC Gli;GGA Gli;GGG Gli`
const KODON_TABLOSU: Record<string, string> = Object.fromEntries(
  KOD.split(';').map((s) => {
    const [k, v] = s.split(' ')
    return [k, v]
  }),
)

const R = 1.15
const DY = 0.44
const DTH = 0.56

function DnaSahne({ adim }: SahneProps) {
  const [oynat, setOynat] = useState(true)
  const [hiz, setHiz] = useState(1)
  const [bagGoster, setBagGoster] = useState(true)
  const [t] = useZaman(oynat, hiz)

  const n = DIZI.length
  const kalip = DIZI.split('')
  const tamamlayici = kalip.map((b) => ESLER[b])
  const mRNA = kalip.map((b) => (ESLER[b] === 'T' ? 'U' : ESLER[b]))

  // Açılma cephesi: replikasyon / transkripsiyon adımlarında ilerler
  const cephe = adim >= 2 ? ((t * 2.4) % (n + 5)) : 0

  const konumA = (i: number, ayrik: number): V3 => {
    const a = i * DTH
    return [R * Math.cos(a) + ayrik * 1.15, i * DY - (n * DY) / 2, R * Math.sin(a)]
  }
  const konumB = (i: number, ayrik: number): V3 => {
    const a = i * DTH + Math.PI
    return [R * Math.cos(a) - ayrik * 1.15, i * DY - (n * DY) / 2, R * Math.sin(a)]
  }
  const ayrilma = (i: number) =>
    adim >= 2 ? Math.max(0, Math.min(1, (cephe - i) / 2.5)) * (adim === 2 ? 1 : 0.85) : 0

  const iskeletA = useMemo(
    () => Array.from({ length: n }, (_, i) => konumA(i, ayrilma(i))),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [cephe, adim, n],
  )
  const iskeletB = useMemo(
    () => Array.from({ length: n }, (_, i) => konumB(i, ayrilma(i))),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [cephe, adim, n],
  )

  // Translasyon: ribozomun kodon üzerindeki konumu
  const kodonSayisi = Math.floor(n / 3)
  const ribozom = adim >= 4 ? Math.floor((t * 0.7) % (kodonSayisi + 1)) : 0
  const kodonlar = useMemo(
    () => Array.from({ length: kodonSayisi }, (_, i) => mRNA.slice(i * 3, i * 3 + 3).join('')),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [kodonSayisi],
  )
  const protein = kodonlar.slice(0, ribozom).map((k) => KODON_TABLOSU[k] ?? '?')

  return (
    <Duzen
      gosterge={
        <Gosterge
          satirlar={[
            { ad: 'kalıp zincir', deger: `5'-${kalip.slice(0, 9).join('')}…-3'`, renk: '#0f766e' },
            { ad: 'baz çifti', deger: n },
            { ad: 'eşleşme', deger: 'A=T (2 bağ) · G≡C (3 bağ)', renk: '#6b7280' },
            ...(adim >= 3 ? [{ ad: 'mRNA', deger: `${mRNA.slice(0, 9).join('')}…`, renk: '#4338ca' }] : []),
            ...(adim >= 4
              ? [
                  { ad: 'okunan kodon', deger: kodonlar[ribozom] ?? '—', renk: '#b45309' },
                  { ad: 'protein', deger: protein.join('-') || '—', renk: '#15803d' },
                ]
              : []),
          ]}
        />
      }
      kontrol={
        <>
          <Kaydirac etiket="hız" deger={hiz} min={0.1} max={2.5} onChange={setHiz} basamak={1} />
          <Anahtar etiket="hidrojen bağları" deger={bagGoster} onChange={setBagGoster} />
          <Dugme onClick={() => setOynat(!oynat)} aktif={oynat} boyut="sm">
            {oynat ? '⏸ durdur' : '▶ oynat'}
          </Dugme>
        </>
      }
      sahne={
        <Sahne kamera={[6, 1, 8]} zemin="yok" maxUzaklik={34} otoDondur={adim === 0}>
          {/* Şeker-fosfat iskeletleri */}
          <Line points={iskeletA} color="#0f766e" lineWidth={4} />
          <Line points={iskeletB} color="#b45309" lineWidth={4} />

          {/* Baz çiftleri */}
          {kalip.map((b, i) => {
            const ay = ayrilma(i)
            const pa = konumA(i, ay)
            const pb = konumB(i, ay)
            const orta: V3 = [(pa[0] + pb[0]) / 2, (pa[1] + pb[1]) / 2, (pa[2] + pb[2]) / 2]
            const kopuk = ay > 0.35
            return (
              <group key={i}>
                <mesh position={[(pa[0] + orta[0]) / 2, (pa[1] + orta[1]) / 2, (pa[2] + orta[2]) / 2]}>
                  <sphereGeometry args={[0.17, 14, 14]} />
                  <meshStandardMaterial color={RENK[b]} />
                </mesh>
                <mesh position={[(pb[0] + orta[0]) / 2, (pb[1] + orta[1]) / 2, (pb[2] + orta[2]) / 2]}>
                  <sphereGeometry args={[0.17, 14, 14]} />
                  <meshStandardMaterial color={RENK[tamamlayici[i]]} />
                </mesh>
                {bagGoster && !kopuk && (
                  <Line
                    points={[pa, pb]}
                    color={b === 'G' || b === 'C' ? '#191d24' : '#8a8f9c'}
                    lineWidth={b === 'G' || b === 'C' ? 2.2 : 1.4}
                    dashed
                    dashSize={0.09}
                    gapSize={0.07}
                  />
                )}
                {adim === 1 && i === Math.floor(n / 2) && (
                  <Etiket konum={[orta[0], orta[1] + 0.5, orta[2]]} renk="#191d24" kucuk>
                    {b}–{tamamlayici[i]} ({b === 'G' || b === 'C' ? '3' : '2'} hidrojen bağı)
                  </Etiket>
                )}
              </group>
            )
          })}

          {/* Replikasyon: açılan bölgede yeni nükleotitler */}
          {adim === 2 &&
            kalip.map((b, i) => {
              if (ayrilma(i) < 0.6) return null
              const pa = konumA(i, ayrilma(i))
              const pb = konumB(i, ayrilma(i))
              return (
                <group key={`y${i}`}>
                  <Nokta konum={[pa[0] + 0.75, pa[1], pa[2]]} renk={RENK[tamamlayici[i]]} r={0.14} />
                  <Nokta konum={[pb[0] - 0.75, pb[1], pb[2]]} renk={RENK[b]} r={0.14} />
                </group>
              )
            })}
          {adim === 2 && (
            <Etiket konum={[0, (n * DY) / 2 + 0.8, 0]} renk="#15803d" kucuk>
              yarı korunumlu eşleme: her yeni DNA’nın bir zinciri eskidir
            </Etiket>
          )}

          {/* Transkripsiyon: mRNA sentezi */}
          {adim === 3 && (
            <>
              {mRNA.map((b, i) => {
                if (i > cephe) return null
                const pa = konumA(i, ayrilma(i))
                return (
                  <mesh key={`m${i}`} position={[pa[0] + 1.5, pa[1], pa[2]]}>
                    <sphereGeometry args={[0.16, 14, 14]} />
                    <meshStandardMaterial color={RENK[b]} />
                  </mesh>
                )
              })}
              <Etiket konum={[2.8, (n * DY) / 2 + 0.4, 0]} renk="#4338ca" kucuk>
                mRNA — T yerine U kullanılır
              </Etiket>
            </>
          )}

          {/* Translasyon: ribozom mRNA üzerinde ilerler */}
          {adim >= 4 && (
            <group position={[5.2, 0, 0]}>
              {mRNA.map((b, i) => (
                <mesh key={`t${i}`} position={[0, i * 0.34 - (n * 0.34) / 2, 0]}>
                  <sphereGeometry args={[0.14, 12, 12]} />
                  <meshStandardMaterial color={RENK[b]} />
                </mesh>
              ))}
              {/* Ribozom */}
              <mesh position={[0, (ribozom * 3 + 1) * 0.34 - (n * 0.34) / 2, 0]}>
                <sphereGeometry args={[0.62, 20, 20]} />
                <meshStandardMaterial color="#6b7280" transparent opacity={0.45} />
              </mesh>
              <Etiket konum={[1.3, (ribozom * 3 + 1) * 0.34 - (n * 0.34) / 2, 0]} renk="#b45309" kucuk>
                kodon: {kodonlar[ribozom] ?? 'DUR'}
              </Etiket>
              {/* Büyüyen polipeptit */}
              {protein.map((aa, i) => (
                <group key={`p${i}`}>
                  <mesh position={[-1.5, i * 0.55 - (n * 0.34) / 2, 0]}>
                    <sphereGeometry args={[0.22, 16, 16]} />
                    <meshStandardMaterial color="#15803d" roughness={0.4} />
                  </mesh>
                  <Etiket konum={[-2.3, i * 0.55 - (n * 0.34) / 2, 0]} renk="#15803d" kucuk>
                    {aa}
                  </Etiket>
                </group>
              ))}
            </group>
          )}
        </Sahne>
      }
    />
  )
}

export const dnaModulu: DersModulu = {
  id: 'dna',
  baslik: 'DNA — Yapı, Eşlenme ve Protein Sentezi',
  altBaslik: 'Çift sarmalı aç, kopyala, mRNA’ya yaz ve proteine çevir.',
  ders: 'biyoloji',
  seviye: '8. / 10. / 12. Sınıf',
  sure: 20,
  etiketler: ['DNA', 'replikasyon', 'transkripsiyon', 'translasyon', 'genetik şifre'],
  Sahne: DnaSahne,
  adimlar: [
    {
      baslik: 'Çift sarmal',
      metin:
        'DNA iki zincirden oluşur. Yeşil ve turuncu iplikler ŞEKER-FOSFAT iskeletidir; ortadaki renkli toplar ise organik bazlardır (A, T, G, C). İki zincir birbirinin çevresinde dönerek çift sarmalı (double helix) oluşturur. Sahneyi döndürerek sarmalı yakından incele.',
    },
    {
      baslik: 'Tamamlayıcılık kuralı',
      metin:
        'Bazlar rastgele eşleşmez: A daima T ile (2 hidrojen bağı), G daima C ile (3 hidrojen bağı) eşleşir. Bu yüzden bir zinciri bilmek diğerini de bilmek demektir — kalıtımın kopyalanabilmesi bu basit kurala dayanır. G–C bağları daha güçlü olduğundan G–C oranı yüksek DNA daha zor açılır.',
    },
    {
      baslik: 'Replikasyon: kendini eşleme',
      metin:
        'Bölünmeden önce DNA fermuar gibi açılır. Açılan her zincir bir KALIP olur ve karşısına tamamlayıcı nükleotitler dizilir. Sonuçta oluşan iki DNA\'nın her birinde bir eski, bir yeni zincir bulunur: yarı korunumlu eşleme.',
    },
    {
      baslik: 'Transkripsiyon: DNA’dan mRNA’ya',
      metin:
        'Protein üretmek için tüm DNA değil, ilgili gen kopyalanır. RNA polimeraz kalıp zinciri okur ve mRNA sentezler. Tek fark: RNA\'da timin (T) yerine urasil (U) bulunur. mRNA çekirdekten sitoplazmaya çıkar.',
    },
    {
      baslik: 'Translasyon: mRNA’dan proteine',
      metin:
        'Ribozom mRNA üzerinde üçlü gruplar (KODON) hâlinde ilerler. Her kodon bir aminoasidi belirtir: AUG = Met (başlat), UAA/UAG/UGA = DUR. tRNA molekülleri uygun aminoasitleri getirir ve zincir uzar. Sağdaki yeşil toplar oluşan proteini gösteriyor.',
    },
  ],
  ispat: {
    baslik: 'Chargaff kuralları ve şifrenin üçlü olması',
    satirlar: [
      { tex: '[A]=[T],\\qquad [G]=[C]', not: 'Chargaff’ın deneysel bulgusu — tamamlayıcılığın kanıtı' },
      { tex: '[A]+[G]=[T]+[C]', not: 'Purin toplamı = pirimidin toplamı' },
      { tex: '4^{1}=4 < 20', not: 'Tek bazlı şifre 20 aminoasidi kodlayamaz' },
      { tex: '4^{2}=16 < 20', not: 'İkili şifre de yetmez' },
      { tex: '4^{3}=64 \\ge 20', not: 'Üçlü şifre yeterlidir → kodon 3 bazlıdır' },
      { tex: '64 > 20 \\Rightarrow \\text{şifre "yedeklidir": bir aminoaside birden çok kodon}' },
    ],
    sonuc: 'Genetik şifre üçlüdür, yedeklidir ve neredeyse tüm canlılarda ortaktır.',
  },
  sorular: [
    {
      soru: 'Bir DNA zincirinde 5′-ATGC-3′ dizisi varsa karşı zincir nasıldır?',
      secenekler: ['TACG', 'ATGC', 'UACG', 'GCTA'],
      dogru: 0,
      aciklama: 'A↔T ve G↔C eşleşmesine göre tamamlayıcı dizi TACG olur.',
    },
    {
      soru: 'DNA’nın kendini eşlemesine "yarı korunumlu" denmesinin nedeni nedir?',
      secenekler: [
        'Yalnızca yarısı kopyalandığı için',
        'Yeni DNA’ların her birinde bir eski zincir bulunduğu için',
        'Yarı hızda gerçekleştiği için',
        'İki kopyadan biri bozulduğu için',
      ],
      dogru: 1,
      aciklama: 'Her yeni DNA molekülü bir eski (kalıp) ve bir yeni sentezlenmiş zincir içerir.',
    },
    {
      soru: 'mRNA’yı DNA’dan ayıran özellik hangisidir?',
      secenekler: [
        'Adenin bulundurmaması',
        'Timin yerine urasil bulundurması',
        'Çift zincirli olması',
        'Fosfat içermemesi',
      ],
      dogru: 1,
      aciklama: 'RNA tek zincirlidir, şekeri ribozdur ve timin yerine urasil taşır.',
    },
    {
      soru: 'AUG kodonu neyi belirtir?',
      secenekler: ['Durdurma', 'Metiyonin / başlatma', 'Lösin', 'Rastgele bir baz'],
      dogru: 1,
      aciklama: 'AUG hem metiyonin aminoasidini kodlar hem de protein sentezinin başlangıç işaretidir.',
    },
  ],
}
