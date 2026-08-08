import { useState } from 'react'
import { Etiket, Sahne, type V3 } from '../shared/sahne'
import { Dugme, Duzen, Gosterge, Kaydirac } from '../shared/ui'
import { useGecis } from '../shared/animasyon'
import type { DersModulu, SahneProps } from '../types'

const ebob = (a: number, b: number): number => (b === 0 ? a : ebob(b, a % b))
const ekok = (a: number, b: number) => (a * b) / ebob(a, b)

/** Bir "pastanın" tek dilimi. */
function Dilim({
  merkez,
  bas,
  uzunluk,
  renk,
  dolu,
  r = 1.35,
  yukseklik = 0.34,
  ayrik = 0,
}: {
  merkez: V3
  bas: number
  uzunluk: number
  renk: string
  dolu: boolean
  r?: number
  yukseklik?: number
  ayrik?: number
}) {
  const orta = bas + uzunluk / 2
  const kaydir: V3 = [
    merkez[0] + Math.cos(orta) * ayrik,
    merkez[1] + Math.sin(orta) * ayrik,
    merkez[2],
  ]
  return (
    <mesh position={kaydir} rotation={[Math.PI / 2, 0, 0]}>
      {/* cylinderGeometry: (üst r, alt r, yükseklik, dilim, yükseklik dilimi, açık, başlangıç, uzunluk) */}
      <cylinderGeometry args={[r, r, yukseklik, 48, 1, false, bas, uzunluk * 0.985]} />
      <meshStandardMaterial
        color={dolu ? renk : '#cfc6b6'}
        transparent
        opacity={dolu ? 0.92 : 0.35}
        roughness={0.5}
        emissive={dolu ? renk : '#000000'}
        emissiveIntensity={dolu ? 0.18 : 0}
      />
    </mesh>
  )
}

function Pasta({
  merkez,
  pay,
  payda,
  renk,
  ayrik = 0,
}: {
  merkez: V3
  pay: number
  payda: number
  renk: string
  ayrik?: number
}) {
  const adim = (Math.PI * 2) / payda
  return (
    <group>
      {Array.from({ length: payda }, (_, i) => (
        <Dilim
          key={i}
          merkez={merkez}
          bas={i * adim + Math.PI / 2}
          uzunluk={adim}
          renk={renk}
          dolu={i < pay}
          ayrik={i < pay ? ayrik : 0}
        />
      ))}
    </group>
  )
}

/** Şerit (bar) modeli — kesirleri karşılaştırmak için. */
function Serit({
  merkez,
  pay,
  payda,
  renk,
  genislik = 3.4,
}: {
  merkez: V3
  pay: number
  payda: number
  renk: string
  genislik?: number
}) {
  const w = genislik / payda
  return (
    <group>
      {Array.from({ length: payda }, (_, i) => (
        <mesh key={i} position={[merkez[0] - genislik / 2 + w * (i + 0.5), merkez[1], merkez[2]]}>
          <boxGeometry args={[w * 0.95, 0.42, 0.28]} />
          <meshStandardMaterial
            color={i < pay ? renk : '#cfc6b6'}
            transparent
            opacity={i < pay ? 0.95 : 0.4}
            roughness={0.5}
          />
        </mesh>
      ))}
    </group>
  )
}

function KesirlerSahne({ adim }: SahneProps) {
  const [p1, setP1] = useState(2)
  const [q1, setQ1] = useState(3)
  const [p2, setP2] = useState(1)
  const [q2, setQ2] = useState(4)

  const gecis = useGecis(`${adim}-${p1}-${q1}-${p2}-${q2}`, 1.4)

  const ortak = ekok(q1, q2)
  const g1 = ortak / q1
  const g2 = ortak / q2
  // 2. ve 4. adımda paydalar ortak paydaya "genişletilir"
  const genislet = adim === 2 || adim >= 4
  const q1Et = genislet ? Math.round(q1 + (ortak - q1) * gecis) : q1
  const q2Et = genislet ? Math.round(q2 + (ortak - q2) * gecis) : q2
  const p1Et = genislet && q1Et === ortak ? p1 * g1 : p1
  const p2Et = genislet && q2Et === ortak ? p2 * g2 : p2

  const toplamPay = p1 * g1 + p2 * g2

  return (
    <Duzen
      gosterge={
        <Gosterge
          satirlar={[
            { ad: '1. kesir', deger: `${p1}/${q1}`, renk: '#0f766e' },
            { ad: '2. kesir', deger: `${p2}/${q2}`, renk: '#b45309' },
            { ad: 'ondalık', deger: `${(p1 / q1).toFixed(3)}  |  ${(p2 / q2).toFixed(3)}` },
            ...(adim >= 3
              ? [
                  {
                    ad: 'karşılaştırma',
                    deger:
                      p1 / q1 > p2 / q2 ? `${p1}/${q1} > ${p2}/${q2}` : p1 / q1 < p2 / q2 ? `${p1}/${q1} < ${p2}/${q2}` : 'eşit',
                    renk: '#be185d',
                  },
                ]
              : []),
            ...(adim >= 4
              ? [{ ad: 'toplam', deger: `${toplamPay}/${ortak}`, renk: '#4338ca' }]
              : []),
          ]}
        />
      }
      kontrol={
        <>
          <Kaydirac etiket="1. pay" deger={p1} min={0} max={q1} adim={1} basamak={0} onChange={setP1} />
          <Kaydirac
            etiket="1. payda"
            deger={q1}
            min={2}
            max={10}
            adim={1}
            basamak={0}
            onChange={(v) => {
              setQ1(v)
              setP1((p) => Math.min(p, v))
            }}
          />
          <Kaydirac etiket="2. pay" deger={p2} min={0} max={q2} adim={1} basamak={0} onChange={setP2} renk="#b45309" />
          <Kaydirac
            etiket="2. payda"
            deger={q2}
            min={2}
            max={10}
            adim={1}
            basamak={0}
            renk="#b45309"
            onChange={(v) => {
              setQ2(v)
              setP2((p) => Math.min(p, v))
            }}
          />
          <Dugme
            boyut="sm"
            onClick={() => {
              setQ1(3)
              setP1(2)
              setQ2(6)
              setP2(4)
            }}
          >
            denk örnek (2/3 = 4/6)
          </Dugme>
        </>
      }
      sahne={
        <Sahne kamera={[0, 2.2, 9.5]} zemin="yok" maxUzaklik={26}>
          <Pasta merkez={[-2.4, 0.6, 0]} pay={p1Et} payda={q1Et} renk="#0f766e" ayrik={adim === 1 ? 0.16 : 0} />
          <Etiket konum={[-2.4, -1.35, 0]} renk="#0f766e">
            {p1Et} / {q1Et}
          </Etiket>

          <Pasta merkez={[2.4, 0.6, 0]} pay={p2Et} payda={q2Et} renk="#b45309" ayrik={adim === 1 ? 0.16 : 0} />
          <Etiket konum={[2.4, -1.35, 0]} renk="#b45309">
            {p2Et} / {q2Et}
          </Etiket>

          {adim === 0 && (
            <Etiket konum={[0, 2.6, 0]} renk="#6b7280" kucuk>
              payda = bütün kaç EŞ parçaya bölündü
            </Etiket>
          )}
          {adim === 1 && (
            <Etiket konum={[0, 2.6, 0]} renk="#6b7280" kucuk>
              pay = bu parçalardan kaç tanesini aldık
            </Etiket>
          )}
          {adim === 2 && (
            <Etiket konum={[0, 2.6, 0]} renk="#4338ca" kucuk>
              her dilimi ikiye bölmek kesrin DEĞERİNİ değiştirmez
            </Etiket>
          )}

          {/* Şerit modeli — karşılaştırma ve toplama */}
          {adim >= 3 && (
            <>
              <Serit merkez={[0, -2.3, 0]} pay={p1} payda={q1} renk="#0f766e" />
              <Serit merkez={[0, -3.05, 0]} pay={p2} payda={q2} renk="#b45309" />
              <Etiket konum={[-2.35, -2.3, 0]} renk="#0f766e" kucuk>
                {p1}/{q1}
              </Etiket>
              <Etiket konum={[-2.35, -3.05, 0]} renk="#b45309" kucuk>
                {p2}/{q2}
              </Etiket>
            </>
          )}
          {adim >= 4 && (
            <>
              <Serit merkez={[0, -3.9, 0]} pay={Math.min(toplamPay, ortak)} payda={ortak} renk="#4338ca" />
              <Etiket konum={[-2.35, -3.9, 0]} renk="#4338ca" kucuk>
                {toplamPay}/{ortak}
              </Etiket>
              <Etiket konum={[0, -4.6, 0]} renk="#4338ca">
                {p1}/{q1} + {p2}/{q2} = {toplamPay}/{ortak}
                {toplamPay > ortak ? ` (= 1 tam ${toplamPay - ortak}/${ortak})` : ''}
              </Etiket>
            </>
          )}
        </Sahne>
      }
    />
  )
}

export const kesirlerModulu: DersModulu = {
  id: 'kesirler',
  baslik: 'Kesirler — Bütünü Bölmek, Karşılaştırmak, Toplamak',
  altBaslik: 'Payda neden eşitlenir? Dilimleri gözünle görerek anla.',
  ders: 'matematik',
  seviye: '3-6. Sınıf',
  sure: 12,
  etiketler: ['kesir', 'denk kesir', 'payda eşitleme', 'model'],
  Sahne: KesirlerSahne,
  adimlar: [
    {
      baslik: 'Payda: bütün kaç eş parçaya bölündü?',
      metin:
        'Bir bütünü eş parçalara bölüyoruz. Alttaki sayı (payda) kaç eş parça olduğunu söyler. Payda kaydıracını değiştirdiğinde dilimlerin sayısı artıyor ama her biri küçülüyor — bütün hep aynı kalıyor.',
    },
    {
      baslik: 'Pay: kaç parça aldık?',
      metin:
        'Üstteki sayı (pay), aldığımız parça sayısıdır. Alınan dilimler renkli ve hafifçe dışarı çıkmış durumda. 3/4 demek "dört eş parçadan üçü" demektir.',
    },
    {
      baslik: 'Denk kesirler',
      metin:
        'Her dilimi ikiye bölersek dilim sayısı iki katına çıkar, aldığımız dilim sayısı da iki katına çıkar. Elimizdeki miktar hiç değişmez! İşte bu yüzden 2/3 = 4/6 = 8/12. "denk örnek" düğmesine basıp izle.',
    },
    {
      baslik: 'Karşılaştırma',
      metin:
        'Paydaları farklı iki kesri gözle karşılaştırmak zordur; şerit modelinde ise doğrudan görünür. Aynı uzunluktaki iki şeritten hangisi daha çok doluysa o kesir büyüktür.',
    },
    {
      baslik: 'Toplama: neden payda eşitlenir?',
      metin:
        'Farklı büyüklükteki parçaları doğrudan toplayamayız — 1 elma + 1 armut gibi. Önce ikisini de aynı büyüklükte parçalara (ortak paydaya) çeviririz, sonra parçaları sayarız. Mor şerit sonucu gösteriyor.',
    },
  ],
  ispat: {
    baslik: 'Denk kesir ve toplama kuralının gerekçesi',
    satirlar: [
      { tex: '\\frac{a}{b}=\\frac{a\\cdot k}{b\\cdot k},\\quad k\\neq 0', not: 'Pay ve payda aynı sayıyla çarpılırsa değer değişmez' },
      { tex: '\\frac{a\\cdot k}{b\\cdot k}=\\frac{a}{b}\\cdot\\frac{k}{k}=\\frac{a}{b}\\cdot 1', not: 'Çünkü k/k = 1' },
      { tex: '\\frac{a}{b}+\\frac{c}{d}=\\frac{a\\,d}{b\\,d}+\\frac{c\\,b}{d\\,b}', not: 'Her ikisini ortak paydaya taşı' },
      { tex: '=\\frac{ad+cb}{bd}', not: 'Artık parçalar aynı büyüklükte, sayabiliriz' },
    ],
    sonuc: '\\frac{a}{b}+\\frac{c}{d}=\\frac{ad+bc}{bd}',
  },
  sorular: [
    {
      soru: '2/3 kesrine denk olan kesir hangisidir?',
      secenekler: ['3/4', '4/6', '2/6', '6/3'],
      dogru: 1,
      aciklama: 'Pay ve paydayı 2 ile çarparsak 2/3 = 4/6 olur; değeri değişmez.',
    },
    {
      soru: '1/2 + 1/3 işleminin sonucu nedir?',
      secenekler: ['2/5', '5/6', '1/6', '2/6'],
      dogru: 1,
      aciklama: 'Ortak payda 6\'dır: 3/6 + 2/6 = 5/6. Paydalar toplanmaz!',
    },
    {
      soru: '3/8 ile 2/5 kesirlerinden hangisi büyüktür?',
      secenekler: ['3/8', '2/5', 'Eşittirler', 'Karşılaştırılamaz'],
      dogru: 1,
      aciklama: 'Ortak payda 40: 15/40 ile 16/40. 16/40 daha büyük olduğundan 2/5 büyüktür.',
    },
    {
      soru: 'Bir kesirde payda büyürken pay sabit kalırsa kesrin değeri nasıl değişir?',
      secenekler: ['Büyür', 'Küçülür', 'Değişmez', 'Sıfır olur'],
      dogru: 1,
      aciklama: 'Bütün daha çok parçaya bölündüğü için her parça küçülür; aynı sayıda parça daha az eder.',
    },
  ],
}
