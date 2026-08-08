import { useMemo, useState } from 'react'
import * as THREE from 'three'
import { Etiket, Sahne, type V3 } from '../shared/sahne'
import { Anahtar, Dugme, Duzen, Gosterge, Kaydirac } from '../shared/ui'
import { useZaman } from '../shared/animasyon'
import type { DersModulu, SahneProps } from '../types'

/** Dolaşım yolunun kırılma noktaları (basitleştirilmiş anatomik şema). */
const YOL: V3[] = [
  [-1.5, 3.4, 0], // üst ana toplardamar
  [-1.25, 1.9, 0],
  [-1.1, 1.0, 0], // SAĞ KULAKÇIK
  [-1.05, 0.1, 0],
  [-1.0, -1.0, 0], // SAĞ KARINCIK
  [-1.5, 0.2, -0.45],
  [-1.9, 2.2, -0.6], // akciğer atardamarı
  [-3.1, 3.0, -0.8], // sağ akciğer
  [-3.3, 1.9, -0.8],
  [3.3, 1.9, -0.8], // sol akciğer (oksijenlenme)
  [2.5, 2.7, -0.6], // akciğer toplardamarı
  [1.4, 1.5, -0.3],
  [1.1, 1.05, -0.1], // SOL KULAKÇIK
  [1.0, 0.1, 0],
  [0.95, -1.1, 0], // SOL KARINCIK
  [1.6, 0.2, 0.25],
  [1.9, 2.5, 0.25], // aort
  [0.6, 3.5, 0.3],
  [-0.7, 3.6, 0.2], // vücuda dağılım
  [-1.5, 3.4, 0],
]

/** 9. noktadan sonra kan oksijenlenir; 18. noktadan sonra tekrar kirlenir. */
const OKS_BAS = 9
const OKS_SON = 18

const ODACIKLAR = [
  { ad: 'Sağ kulakçık', kisa: 'RA', p: [-1.1, 1.0, 0] as V3, r: 0.72, renk: '#2f7fd4', karincik: false },
  { ad: 'Sağ karıncık', kisa: 'RV', p: [-1.0, -0.85, 0] as V3, r: 0.92, renk: '#3b82f6', karincik: true },
  { ad: 'Sol kulakçık', kisa: 'LA', p: [1.1, 1.05, -0.1] as V3, r: 0.68, renk: '#ef6b6b', karincik: false },
  { ad: 'Sol karıncık', kisa: 'LV', p: [0.95, -0.95, 0] as V3, r: 1.02, renk: '#ef4444', karincik: true },
]

const KAPAKCIKLAR = [
  { ad: 'Triküspit kapak', p: [-1.05, 0.1, 0] as V3, karincikCikisi: false },
  { ad: 'Mitral kapak', p: [1.0, 0.1, 0] as V3, karincikCikisi: false },
  { ad: 'Pulmoner kapak', p: [-1.4, 0.1, -0.35] as V3, karincikCikisi: true },
  { ad: 'Aort kapağı', p: [1.45, 0.05, 0.2] as V3, karincikCikisi: true },
]

function Damar({ noktalar, renk }: { noktalar: V3[]; renk: string }) {
  const geo = useMemo(() => {
    const egri = new THREE.CatmullRomCurve3(noktalar.map((p) => new THREE.Vector3(...p)))
    return new THREE.TubeGeometry(egri, 90, 0.17, 14, false)
  }, [noktalar])
  return (
    <mesh geometry={geo}>
      <meshStandardMaterial color={renk} transparent opacity={0.32} roughness={0.5} />
    </mesh>
  )
}

function KalpSahne({ adim }: SahneProps) {
  const [nabiz, setNabiz] = useState(72)
  const [oynat, setOynat] = useState(true)
  const [etiket, setEtiket] = useState(true)
  const [t] = useZaman(oynat, 1)

  const periyot = 60 / nabiz
  const faz = (t % periyot) / periyot
  // Kulakçık sistolü: 0–0.15, karıncık sistolü: 0.2–0.5
  const kulakcikSistol = faz < 0.15
  const karincikSistol = faz > 0.2 && faz < 0.5
  const kulakcikOlcek = kulakcikSistol ? 0.82 : 1
  const karincikOlcek = karincikSistol ? 0.78 : 1

  const egri = useMemo(() => new THREE.CatmullRomCurve3(YOL.map((p) => new THREE.Vector3(...p))), [])
  const uzunluk = useMemo(() => egri.getLength(), [egri])

  const kirli = YOL.slice(0, OKS_BAS + 1)
  const temiz = YOL.slice(OKS_BAS, OKS_SON + 1)
  const geriDonus = YOL.slice(OKS_SON, YOL.length)

  const parcacikSayisi = 46
  const parcaciklar = useMemo(
    () => Array.from({ length: parcacikSayisi }, (_, i) => i / parcacikSayisi),
    [],
  )

  const gorunurAdim = adim
  const kucukDolasim = gorunurAdim === 1
  const buyukDolasim = gorunurAdim === 2

  return (
    <Duzen
      gosterge={
        <Gosterge
          satirlar={[
            { ad: 'nabız', deger: `${nabiz.toFixed(0)} /dk` },
            { ad: 'evre', deger: karincikSistol ? 'karıncık sistolü' : kulakcikSistol ? 'kulakçık sistolü' : 'diyastol', renk: karincikSistol ? '#ef4444' : '#0369a1' },
            { ad: 'kirli kan', deger: 'sağ taraf', renk: '#2f7fd4' },
            { ad: 'temiz kan', deger: 'sol taraf', renk: '#ef4444' },
            { ad: 'dolaşım süresi', deger: `${(periyot * 2).toFixed(2)} s (yaklaşık)` },
          ]}
        />
      }
      kontrol={
        <>
          <Kaydirac etiket="nabız (atım/dk)" deger={nabiz} min={40} max={180} adim={1} basamak={0} onChange={setNabiz} renk="#ef4444" />
          <Anahtar etiket="etiketler" deger={etiket} onChange={setEtiket} />
          <Dugme onClick={() => setOynat(!oynat)} aktif={oynat} boyut="sm">
            {oynat ? '⏸ durdur' : '▶ oynat'}
          </Dugme>
          <span className="text-xs text-slate-400">kalbi döndürerek arka yüzünü de incele</span>
        </>
      }
      sahne={
        <Sahne kamera={[0.5, 1.5, 9]} zemin="yok" maxUzaklik={26} otoDondur={adim === 0}>
          {/* Damarlar */}
          {(!kucukDolasim || true) && <Damar noktalar={kirli} renk="#2f7fd4" />}
          <Damar noktalar={temiz} renk="#ef4444" />
          <Damar noktalar={geriDonus} renk="#ef4444" />

          {/* Odacıklar */}
          {ODACIKLAR.map((o) => {
            const olcek = o.karincik ? karincikOlcek : kulakcikOlcek
            return (
              <group key={o.kisa}>
                <mesh position={o.p} scale={[olcek, olcek, olcek]}>
                  <sphereGeometry args={[o.r, 32, 24]} />
                  <meshStandardMaterial
                    color={o.renk}
                    transparent
                    opacity={0.42}
                    roughness={0.45}
                    emissive={o.renk}
                    emissiveIntensity={olcek < 1 ? 0.4 : 0.12}
                  />
                </mesh>
                {/* Kalın duvar: sol karıncık */}
                {adim >= 4 && o.kisa === 'LV' && (
                  <mesh position={o.p} scale={[olcek, olcek, olcek]}>
                    <sphereGeometry args={[o.r * 1.16, 32, 24]} />
                    <meshStandardMaterial color="#7f1d1d" transparent opacity={0.3} side={THREE.BackSide} />
                  </mesh>
                )}
                {etiket && (
                  <Etiket konum={[o.p[0], o.p[1] + o.r + 0.32, o.p[2]]} renk={o.renk} kucuk>
                    {o.ad}
                  </Etiket>
                )}
              </group>
            )
          })}

          {/* Kapakçıklar */}
          {adim >= 3 &&
            KAPAKCIKLAR.map((k) => {
              const acik = k.karincikCikisi ? karincikSistol : !karincikSistol
              return (
                <group key={k.ad}>
                  <mesh position={k.p} rotation={[Math.PI / 2, 0, 0]}>
                    <torusGeometry args={[0.24, 0.05, 10, 24]} />
                    <meshStandardMaterial
                      color={acik ? '#15803d' : '#6b7280'}
                      emissive={acik ? '#15803d' : '#000000'}
                      emissiveIntensity={acik ? 0.5 : 0}
                    />
                  </mesh>
                  {etiket && (
                    <Etiket konum={[k.p[0], k.p[1] - 0.36, k.p[2]]} renk={acik ? '#15803d' : '#6b7280'} kucuk>
                      {k.ad} · {acik ? 'açık' : 'kapalı'}
                    </Etiket>
                  )}
                </group>
              )
            })}

          {/* Kan hücreleri */}
          {parcaciklar.map((ofset, i) => {
            const u = (t * 0.14 + ofset) % 1
            const p = egri.getPointAt(u)
            const idx = u * (YOL.length - 1)
            const oksijenli = idx >= OKS_BAS + 0.6 && idx < OKS_SON
            if (kucukDolasim && !(idx <= OKS_BAS + 1.2 || oksijenli)) return null
            if (buyukDolasim && idx > OKS_BAS + 1 && idx < OKS_BAS + 3) return null
            return (
              <mesh key={i} position={[p.x, p.y, p.z]}>
                <sphereGeometry args={[0.085, 10, 10]} />
                <meshStandardMaterial
                  color={oksijenli ? '#ef4444' : '#2f7fd4'}
                  emissive={oksijenli ? '#ef4444' : '#2f7fd4'}
                  emissiveIntensity={0.21}
                />
              </mesh>
            )
          })}

          {/* Akciğerler */}
          {etiket && (
            <>
              <Etiket konum={[-3.2, 3.5, -0.8]} renk="#0369a1" kucuk>
                sağ akciğer
              </Etiket>
              <Etiket konum={[3.2, 3.5, -0.8]} renk="#0369a1" kucuk>
                sol akciğer — burada O₂ alınır
              </Etiket>
              <Etiket konum={[-0.1, 4.1, 0.2]} renk="#ef4444" kucuk>
                aort — vücuda temiz kan
              </Etiket>
            </>
          )}

          {kucukDolasim && (
            <Etiket konum={[0, -2.6, 0]} renk="#2f7fd4">
              KÜÇÜK DOLAŞIM: sağ karıncık → akciğer → sol kulakçık
            </Etiket>
          )}
          {buyukDolasim && (
            <Etiket konum={[0, -2.6, 0]} renk="#ef4444">
              BÜYÜK DOLAŞIM: sol karıncık → vücut → sağ kulakçık
            </Etiket>
          )}
          {uzunluk > 0 && adim >= 4 && (
            <Etiket konum={[0, -3.2, 0]} renk="#6b7280" kucuk>
              sol karıncık duvarı daha kalın: kanı tüm vücuda pompalar
            </Etiket>
          )}
        </Sahne>
      }
    />
  )
}

export const kalpModulu: DersModulu = {
  id: 'kalp',
  baslik: 'Kalp ve Kan Dolaşımı',
  altBaslik: 'Dört odacık, dört kapakçık, iki dolaşım — kanın yolculuğunu adım adım izle.',
  ders: 'biyoloji',
  seviye: '6. / 11. Sınıf',
  sure: 18,
  etiketler: ['dolaşım sistemi', 'kalp', 'kapakçık', 'sistol-diyastol'],
  Sahne: KalpSahne,
  adimlar: [
    {
      baslik: 'Dört odacık',
      metin:
        'Kalp dört odacıklıdır: üstte iki KULAKÇIK (kan toplar), altta iki KARINCIK (kan pompalar). Sağ taraf (mavi) kirli, sol taraf (kırmızı) temiz kan taşır; aralarındaki perde sayesinde iki kan asla karışmaz. Sahneyi döndürerek yapıyı her açıdan incele.',
    },
    {
      baslik: 'Küçük dolaşım (akciğer dolaşımı)',
      metin:
        'Vücuttan gelen oksijeni azalmış kan sağ kulakçığa, oradan sağ karıncığa geçer. Sağ karıncık kanı akciğer atardamarıyla akciğerlere pompalar. Akciğerde CO₂ bırakılıp O₂ alınır — parçacıkların rengi tam bu noktada maviden kırmızıya döner. Temiz kan akciğer toplardamarıyla sol kulakçığa döner.',
    },
    {
      baslik: 'Büyük dolaşım (vücut dolaşımı)',
      metin:
        'Sol kulakçıktan sol karıncığa geçen temiz kan, aort ile tüm vücuda gönderilir. Dokular oksijeni kullanır, kan kirlenir ve ana toplardamarlarla sağ kulakçığa geri döner. Dikkat: ATARDAMAR kanı kalpten UZAKLAŞTIRIR — akciğer atardamarındaki kan kirli olmasına rağmen yine atardamardır.',
    },
    {
      baslik: 'Kapakçıklar: tek yönlü akış',
      metin:
        'Kulakçık–karıncık arasında (triküspit ve mitral) ve karıncık çıkışlarında (pulmoner ve aort) birer kapakçık vardır. Bunlar yalnızca tek yöne açılır; geri kaçışı engeller. Yeşil = açık, gri = kapalı. Kalp seslerinin ("lup-dup") kaynağı bu kapakçıkların kapanmasıdır.',
    },
    {
      baslik: 'Kalp döngüsü ve duvar kalınlığı',
      metin:
        'SİSTOL kasılma, DİYASTOL gevşeme evresidir. Önce kulakçıklar, sonra karıncıklar kasılır. Nabız kaydıracını artırdığında döngünün hızlandığını gör. Sol karıncığın duvarı sağınkinden çok daha kalındır: çünkü kanı yalnızca akciğere değil tüm vücuda göndermek zorundadır.',
    },
  ],
  ispat: {
    baslik: 'Kalp debisi ve basınç ilişkisi',
    satirlar: [
      { tex: 'Q = \\text{Atım hacmi} \\times \\text{Nabız}', not: 'Kalp debisi (dakikadaki kan hacmi)' },
      { tex: 'Q \\approx 70\\ \\text{mL} \\times 72\\ \\text{atım/dk} \\approx 5\\ \\text{L/dk}', not: 'Vücuttaki kanın tamamı ≈ 5 L' },
      { tex: '\\Delta P = Q \\times R', not: 'Akış: basınç farkı = debi × direnç' },
      {
        tex: 'R_{\\text{vücut}} \\gg R_{\\text{akciğer}} \\Rightarrow P_{\\text{sol}} \\gg P_{\\text{sağ}}',
        not: 'Bu yüzden sol karıncık duvarı kalındır',
      },
    ],
    sonuc: 'Kanın tamamı yaklaşık bir dakikada tüm vücuyu dolaşır.',
  },
  sorular: [
    {
      soru: 'Küçük dolaşım hangi odacıktan başlar?',
      secenekler: ['Sol karıncık', 'Sağ karıncık', 'Sol kulakçık', 'Sağ kulakçık'],
      dogru: 1,
      aciklama: 'Küçük (akciğer) dolaşımı sağ karıncıktan başlar ve sol kulakçıkta sona erer.',
    },
    {
      soru: 'Akciğer atardamarında hangi tür kan bulunur?',
      secenekler: ['Temiz kan', 'Kirli kan', 'Karışık kan', 'Kan bulunmaz'],
      dogru: 1,
      aciklama:
        'Atardamar, kanı kalpten uzaklaştıran damardır. Akciğer atardamarı kirli kanı akciğere taşır — kuralın istisnasıdır.',
    },
    {
      soru: 'Sol karıncığın duvarı neden daha kalındır?',
      secenekler: [
        'Daha çok kan aldığı için',
        'Kanı tüm vücuda pompaladığı için',
        'Kapakçığı büyük olduğu için',
        'Oksijenli kan daha ağır olduğu için',
      ],
      dogru: 1,
      aciklama: 'Vücut dolaşımının direnci yüksektir; bu yüzden sol karıncık daha yüksek basınç üretmelidir.',
    },
    {
      soru: 'Kalp kapakçıklarının görevi nedir?',
      secenekler: [
        'Kanı temizlemek',
        'Kanın tek yönde akmasını sağlamak',
        'Oksijen taşımak',
        'Kalbi kasmak',
      ],
      dogru: 1,
      aciklama: 'Kapakçıklar yalnızca tek yöne açılarak kanın geri kaçmasını engeller.',
    },
  ],
}
