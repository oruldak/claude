import { useMemo, useState } from 'react'
import * as THREE from 'three'
import { Cizgi as Line, Etiket, Ok, Sahne, type V3 } from '../shared/sahne'
import { Anahtar, Dugme, Duzen, Gosterge, Kaydirac } from '../shared/ui'
import { useZaman } from '../shared/animasyon'
import type { DersModulu, SahneProps } from '../types'

const TABAN = 6.4

function EgikDuzlemSahne({ adim }: SahneProps) {
  const [aciD, setAciD] = useState(28)
  const [mu, setMu] = useState(0.3)
  const [m, setM] = useState(2)
  const [oynat, setOynat] = useState(true)
  const [bilesenler, setBilesenler] = useState(true)

  const g = 9.81
  const al = (aciD * Math.PI) / 180
  const H = TABAN * Math.tan(al)
  const Ls = TABAN / Math.cos(al)

  const G = m * g
  const Gpar = G * Math.sin(al) // yamaç boyunca
  const Gdik = G * Math.cos(al) // yüzeye dik
  const N = Gdik
  const fMax = mu * N
  const hareket = Gpar > fMax
  const f = hareket ? fMax : Gpar
  const a = hareket ? g * (Math.sin(al) - mu * Math.cos(al)) : 0
  const kritikAci = (Math.atan(mu) * 180) / Math.PI

  const [t] = useZaman(oynat && hareket, 1)
  const s = hareket ? (0.5 * a * t * t) % (Ls - 1.2) : Ls * 0.42

  const C: [number, number] = [-TABAN / 2, H]
  const yon: [number, number] = [Math.cos(al), -Math.sin(al)]
  const nor: [number, number] = [Math.sin(al), Math.cos(al)]
  const merkez: V3 = [
    C[0] + yon[0] * (s + 0.55) + nor[0] * 0.32,
    C[1] + yon[1] * (s + 0.55) + nor[1] * 0.32,
    0,
  ]

  const kama = useMemo(() => {
    const sh = new THREE.Shape()
    sh.moveTo(-TABAN / 2, 0)
    sh.lineTo(TABAN / 2, 0)
    sh.lineTo(-TABAN / 2, H)
    sh.closePath()
    return new THREE.ExtrudeGeometry(sh, { depth: 1.6, bevelEnabled: false })
  }, [H])

  const k = 1.7 / G // kuvvet → ok uzunluğu ölçeği
  const V = (dx: number, dy: number): V3 => [merkez[0] + dx, merkez[1] + dy, merkez[2]]

  return (
    <Duzen
      gosterge={
        <Gosterge
          satirlar={[
            { ad: 'eğim açısı α', deger: `${aciD.toFixed(0)}°` },
            { ad: 'G = mg', deger: `${G.toFixed(1)} N`, renk: '#be185d' },
            { ad: 'G·sinα (yamaç)', deger: `${Gpar.toFixed(1)} N`, renk: '#0f766e' },
            { ad: 'N = G·cosα', deger: `${N.toFixed(1)} N`, renk: '#0369a1' },
            { ad: 'sürtünme f', deger: `${f.toFixed(1)} N`, renk: '#b45309' },
            { ad: 'ivme a', deger: `${a.toFixed(2)} m/s²`, renk: hareket ? '#15803d' : '#6b7280' },
            { ad: 'kritik açı', deger: `${kritikAci.toFixed(1)}°`, renk: '#4338ca' },
          ]}
        />
      }
      kontrol={
        <>
          <Kaydirac etiket="eğim α" deger={aciD} min={5} max={60} adim={1} basamak={0} onChange={setAciD} birim="°" />
          <Kaydirac etiket="sürtünme κ (μ)" deger={mu} min={0} max={1} onChange={setMu} basamak={2} renk="#b45309" />
          <Kaydirac etiket="kütle m (kg)" deger={m} min={0.5} max={8} onChange={setM} basamak={1} renk="#be185d" />
          <Anahtar etiket="ağırlığın bileşenleri" deger={bilesenler} onChange={setBilesenler} />
          <Dugme onClick={() => setOynat(!oynat)} aktif={oynat} boyut="sm">
            {oynat ? '⏸ durdur' : '▶ oynat'}
          </Dugme>
          <span className="text-xs" style={{ color: hareket ? '#15803d' : '#6b7280' }}>
            {hareket ? 'cisim kayıyor (G·sinα > f_max)' : 'cisim dengede (G·sinα ≤ f_max)'}
          </span>
        </>
      }
      sahne={
        <Sahne kamera={[2.5, 2.8, 11]} zemin="ahsap" maxUzaklik={32}>
          {/* Eğik düzlem */}
          <group position={[0, 0, -0.8]}>
            <mesh geometry={kama} castShadow receiveShadow>
              <meshStandardMaterial color="#8a6440" roughness={0.72} metalness={0.04} side={THREE.DoubleSide} />
            </mesh>
          </group>
          <Line
            points={[
              [-TABAN / 2, H, 0.85],
              [TABAN / 2, 0, 0.85],
            ]}
            color="#0f766e"
            lineWidth={2.4}
          />
          <Line
            points={[
              [-TABAN / 2, 0, 0.85],
              [TABAN / 2, 0, 0.85],
              [-TABAN / 2, H, 0.85],
              [-TABAN / 2, 0, 0.85],
            ]}
            color="#c9c0b1"
            lineWidth={1.6}
          />
          <Etiket konum={[TABAN / 2 - 1.1, 0.28, 0.85]} renk="#6b7280" kucuk>
            α = {aciD.toFixed(0)}°
          </Etiket>
          <Etiket konum={[-TABAN / 2 - 0.55, H / 2, 0.85]} renk="#6b7280" kucuk>
            h = {H.toFixed(2)} m
          </Etiket>
          <Etiket konum={[0, -0.5, 0.85]} renk="#6b7280" kucuk>
            taban = {TABAN} m
          </Etiket>

          {/* Blok */}
          <group position={merkez} rotation={[0, 0, -al]}>
            <mesh castShadow receiveShadow>
              <boxGeometry args={[0.85, 0.6, 0.85]} />
              <meshStandardMaterial color="#a8452a" roughness={0.68} metalness={0.05} />
            </mesh>
          </group>

          {/* Ağırlık */}
          <Ok baslangic={merkez} bitis={V(0, -G * k)} renk="#be185d" kalinlik={0.042} />
          <Etiket konum={V(0.45, -G * k - 0.15)} renk="#be185d" kucuk>
            G = mg
          </Etiket>

          {/* Bileşenler */}
          {adim >= 1 && bilesenler && (
            <>
              <Ok baslangic={merkez} bitis={V(yon[0] * Gpar * k, yon[1] * Gpar * k)} renk="#0f766e" kalinlik={0.032} baslikBoyu={0.22} />
              <Ok baslangic={merkez} bitis={V(-nor[0] * Gdik * k, -nor[1] * Gdik * k)} renk="#0369a1" kalinlik={0.032} baslikBoyu={0.22} />
              <Etiket konum={V(yon[0] * Gpar * k + 0.3, yon[1] * Gpar * k - 0.25)} renk="#0f766e" kucuk>
                G·sinα
              </Etiket>
              <Etiket konum={V(-nor[0] * Gdik * k - 0.35, -nor[1] * Gdik * k - 0.2)} renk="#0369a1" kucuk>
                G·cosα
              </Etiket>
            </>
          )}

          {/* Normal ve sürtünme */}
          {adim >= 2 && (
            <>
              <Ok baslangic={merkez} bitis={V(nor[0] * N * k, nor[1] * N * k)} renk="#0369a1" kalinlik={0.036} />
              <Etiket konum={V(nor[0] * N * k + 0.32, nor[1] * N * k + 0.2)} renk="#0369a1" kucuk>
                N
              </Etiket>
              <Ok baslangic={merkez} bitis={V(-yon[0] * f * k, -yon[1] * f * k)} renk="#b45309" kalinlik={0.036} />
              <Etiket konum={V(-yon[0] * f * k - 0.35, -yon[1] * f * k + 0.3)} renk="#b45309" kucuk>
                f = μN
              </Etiket>
            </>
          )}

          {adim >= 3 && (
            <Etiket konum={[0, H + 0.9, 0.85]} renk={hareket ? '#15803d' : '#6b7280'}>
              {hareket
                ? `kayma başladı:  tanα = ${Math.tan(al).toFixed(2)} > μ = ${mu.toFixed(2)}`
                : `denge:  tanα = ${Math.tan(al).toFixed(2)} ≤ μ = ${mu.toFixed(2)}`}
            </Etiket>
          )}

          {adim >= 4 && (
            <Etiket konum={[0, H + 1.6, 0.85]} renk="#4338ca" kucuk>
              basit makine: kuvvet kazancı = L / h = 1 / sinα = {(1 / Math.sin(al)).toFixed(2)}
            </Etiket>
          )}
        </Sahne>
      }
    />
  )
}

export const egikDuzlemModulu: DersModulu = {
  id: 'egik-duzlem',
  baslik: 'Eğik Düzlem — Serbest Cisim Diyagramı ve Sürtünme',
  altBaslik: 'Kuvvetleri doğru eksenlere ayır; cismin kayıp kaymayacağını hesapla.',
  ders: 'fizik',
  seviye: '9-11. Sınıf',
  sure: 16,
  etiketler: ['Newton yasaları', 'sürtünme', 'vektör ayrıştırma', 'basit makine'],
  Sahne: EgikDuzlemSahne,
  adimlar: [
    {
      baslik: 'Eğik yüzeydeki cisim',
      metin:
        'Bir cisim, yatayla α açısı yapan yüzeyin üzerinde duruyor. Ona etkiyen tek "gerçek" temel kuvvet ağırlıktır (pembe ok) ve her zaman düşey aşağı doğrudur — yüzeye dik değil!',
    },
    {
      baslik: 'Eksenleri yamaca göre seç',
      metin:
        'İşin püf noktası: eksenleri yatay-düşey değil, YAMAÇ BOYUNCA ve YAMACA DİK seçmek. Böylece ağırlık iki bileşene ayrılır: G·sinα cismi aşağı çeker (yeşil), G·cosα ise cismi yüzeye bastırır (mavi).',
    },
    {
      baslik: 'Normal kuvvet ve sürtünme',
      metin:
        'Yüzey, kendisine bastıran G·cosα kuvvetine eşit büyüklükte bir tepki verir: normal kuvvet N. Sürtünme kuvveti bu normal kuvvetle orantılıdır: f_max = μ·N = μ·mg·cosα. Dikkat: açı büyüdükçe N azalır, dolayısıyla sürtünme de azalır.',
    },
    {
      baslik: 'Kayma şartı ve kritik açı',
      metin:
        'Cisim ancak G·sinα > μ·G·cosα olduğunda kayar. mg terimleri sadeleşir ve şart tanα > μ hâline gelir. Yani KAYMA, cismin kütlesine bağlı değildir! α kaydıracını kritik açının üstüne çıkarıp izle.',
    },
    {
      baslik: 'Eğik düzlem bir basit makinedir',
      metin:
        'Yükü h yüksekliğine doğrudan kaldırmak yerine L uzunluğundaki yamaçtan iterek çıkarırsak daha az kuvvet uygularız: kazanç = L/h = 1/sinα. Ancak yol uzar; yapılan iş (sürtünmesiz durumda) değişmez — makineden iş kazancı olmaz.',
    },
  ],
  ispat: {
    baslik: 'Kritik açı ve ivmenin türetilişi',
    satirlar: [
      { tex: '\\text{Yamaca dik: } N-mg\\cos\\alpha=0 \\Rightarrow N=mg\\cos\\alpha' },
      { tex: '\\text{Yamaç boyunca: } mg\\sin\\alpha-f=ma' },
      { tex: 'f_{\\max}=\\mu N=\\mu mg\\cos\\alpha', not: 'Sürtünme yasası' },
      { tex: 'mg\\sin\\alpha>\\mu mg\\cos\\alpha', not: 'Kayma şartı' },
      { tex: '\\tan\\alpha>\\mu', not: 'mg sadeleşti — kütleden bağımsız!' },
      { tex: 'a=g(\\sin\\alpha-\\mu\\cos\\alpha)', not: 'Kayarken ivme' },
    ],
    sonuc: '\\alpha_{\\text{kritik}}=\\arctan\\mu',
  },
  sorular: [
    {
      soru: 'Eğik düzlemde normal kuvvetin büyüklüğü nedir?',
      secenekler: ['mg', 'mg·sinα', 'mg·cosα', 'mg·tanα'],
      dogru: 2,
      aciklama: 'Yüzeye dik doğrultuda denge vardır: N = mg·cosα.',
    },
    {
      soru: 'Cismin kütlesi iki katına çıkarılırsa kayma başlangıç açısı nasıl değişir?',
      secenekler: ['İki katına çıkar', 'Yarıya iner', 'Değişmez', 'Sürtünmeye bağlıdır'],
      dogru: 2,
      aciklama: 'Kayma şartı tanα > μ olduğundan kütle sadeleşir; kritik açı kütleden bağımsızdır.',
    },
    {
      soru: 'μ = 0,5 olan bir yüzeyde kritik açı yaklaşık kaç derecedir?',
      secenekler: ['15°', '27°', '45°', '60°'],
      dogru: 1,
      aciklama: 'α = arctan(0,5) ≈ 26,6° ≈ 27°.',
    },
    {
      soru: 'Eğik düzlemde eğim açısı artarsa sürtünme kuvveti nasıl değişir?',
      secenekler: ['Artar', 'Azalır', 'Değişmez', 'Önce artar sonra azalır'],
      dogru: 1,
      aciklama:
        'f = μmg·cosα olduğundan α büyüdükçe cosα küçülür ve sürtünme kuvveti azalır.',
    },
  ],
}
