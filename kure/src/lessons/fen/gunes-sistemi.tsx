import { useMemo, useState } from 'react'
import { Cizgi as Line, Etiket, Sahne, type V3 } from '../shared/sahne'
import { Ay, Dunya, Gezegen, Gunes } from '../shared/gokcisimleri'
import { Anahtar, Dugme, Duzen, Gosterge, Kaydirac } from '../shared/ui'
import { useZaman } from '../shared/animasyon'
import type { DersModulu, SahneProps } from '../types'

interface GezegenTanim {
  ad: string
  r: number
  a: number
  periyot: number
  renk: string
  halka?: { ic: number; dis: number; renk: string }
  gercek?: 'dunya'
}

/** Ölçek gerçek değildir: uzaklıklar sıkıştırılmış, çaplar büyütülmüştür. */
const GEZEGENLER: GezegenTanim[] = [
  { ad: 'Merkür', r: 0.13, a: 2.2, periyot: 0.24, renk: '#9b9188' },
  { ad: 'Venüs', r: 0.2, a: 3.0, periyot: 0.62, renk: '#d8b075' },
  { ad: 'Dünya', r: 0.22, a: 3.9, periyot: 1, renk: '#2f7fd4', gercek: 'dunya' },
  { ad: 'Mars', r: 0.16, a: 4.8, periyot: 1.88, renk: '#c1563c' },
  { ad: 'Jüpiter', r: 0.5, a: 6.5, periyot: 11.86, renk: '#c8a071' },
  {
    ad: 'Satürn',
    r: 0.44,
    a: 8.0,
    periyot: 29.5,
    renk: '#d8c69a',
    halka: { ic: 1.35, dis: 2.15, renk: '#c3b48d' },
  },
  { ad: 'Uranüs', r: 0.31, a: 9.3, periyot: 84, renk: '#8ec9d6' },
  { ad: 'Neptün', r: 0.3, a: 10.4, periyot: 165, renk: '#4a63b8' },
]

function cember(r: number): V3[] {
  return Array.from({ length: 161 }, (_, i) => {
    const u = (i / 160) * Math.PI * 2
    return [r * Math.cos(u), 0, r * Math.sin(u)] as V3
  })
}

function GunesSahne({ adim }: SahneProps) {
  const [hiz, setHiz] = useState(0.3)
  const [oynat, setOynat] = useState(true)
  const [yorungeler, setYorungeler] = useState(true)
  const [tutulma, setTutulma] = useState<'yok' | 'gunes' | 'ay'>('yok')
  const [t] = useZaman(oynat, hiz)

  const yakin = adim === 2 || adim === 3

  const konum = (g: GezegenTanim): V3 => {
    const a = (t * 2 * Math.PI) / g.periyot
    return [g.a * Math.cos(a), 0, g.a * Math.sin(a)]
  }

  // Yakın görünüm: Güneş solda uzakta, Ay Dünya çevresinde
  const gunesYonu: V3 = [-13, 0, 0]
  const ayAcisi = tutulma === 'gunes' ? Math.PI : tutulma === 'ay' ? 0 : t * 1.5
  const ayKonum: V3 = [
    3.1 * Math.cos(ayAcisi),
    tutulma === 'yok' ? 0.35 * Math.sin(ayAcisi * 0.8) : 0,
    3.1 * Math.sin(ayAcisi),
  ]

  const evre = useMemo(() => {
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
          baslik={yakin ? 'Güneş – Dünya – Ay' : 'güneş sistemi'}
          satirlar={
            yakin
              ? [
                  { ad: 'Ay evresi', deger: evre, renk: '#b45309' },
                  { ad: 'dolanma süresi', deger: '≈ 27,3 gün' },
                  { ad: 'Ay uzaklığı', deger: '384 400 km' },
                  {
                    ad: 'tutulma',
                    deger:
                      tutulma === 'yok'
                        ? '—'
                        : tutulma === 'gunes'
                          ? 'Güneş tutulması'
                          : 'Ay tutulması',
                    renk: '#be185d',
                  },
                ]
              : [
                  { ad: 'geçen süre', deger: `${t.toFixed(1)} yıl`, renk: '#b45309' },
                  { ad: 'gezegen sayısı', deger: 8 },
                  { ad: 'en hızlı', deger: 'Merkür · 88 gün' },
                  { ad: 'en yavaş', deger: 'Neptün · 165 yıl' },
                ]
          }
        />
      }
      kontrol={
        <>
          <Kaydirac etiket="zaman hızı" deger={hiz} min={0} max={1.5} onChange={setHiz} basamak={2} />
          <Anahtar etiket="yörünge çizgileri" deger={yorungeler} onChange={setYorungeler} />
          {yakin && (
            <div className="flex flex-wrap gap-1.5">
              {(['yok', 'gunes', 'ay'] as const).map((k) => (
                <Dugme key={k} onClick={() => setTutulma(k)} aktif={tutulma === k} boyut="sm" renk="#be185d">
                  {k === 'yok'
                    ? 'serbest dolanım'
                    : k === 'gunes'
                      ? 'Güneş tutulması kur'
                      : 'Ay tutulması kur'}
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
          kamera={yakin ? [-1.4, 2.6, 7.6] : [0, 12, 17]}
          fov={yakin ? 42 : 46}
          zemin="yok"
          uzay
          maxUzaklik={60}
          minUzaklik={2}
        >
          {yakin ? (
            <>
              <Gunes konum={gunesYonu} r={2.2} isik={900} hale={11} />
              <Etiket konum={[-5.4, 2.4, 0]} koyu kucuk>
                ← Güneş (ölçek dışı uzaklıkta)
              </Etiket>

              <Dunya konum={[0, 0, 0]} r={1.25} egim={0.41} />
              <Etiket konum={[0, 1.8, 0]} koyu kucuk>
                Dünya
              </Etiket>

              <Ay konum={ayKonum} r={0.34} />
              <Etiket konum={[ayKonum[0], ayKonum[1] + 0.72, ayKonum[2]]} koyu kucuk>
                Ay — {evre}
              </Etiket>
              {yorungeler && <Line points={cember(3.1)} color="#2c3450" lineWidth={1} />}

              {tutulma !== 'yok' && (
                <>
                  <Line
                    points={[
                      [gunesYonu[0] + 2.2, 0, 0],
                      [5, 0, 0],
                    ]}
                    color="#ff8fb0"
                    lineWidth={1.4}
                    dashed
                    dashSize={0.24}
                    gapSize={0.18}
                  />
                  <Etiket konum={[1.6, -1.9, 0]} koyu>
                    {tutulma === 'gunes'
                      ? 'Ay tam arada → gölgesi Dünya’ya düşer → Güneş tutulması'
                      : 'Dünya tam arada → gölgesi Ay’a düşer → Ay tutulması'}
                  </Etiket>
                </>
              )}
            </>
          ) : (
            <>
              <Gunes konum={[0, 0, 0]} r={1.1} isik={620} hale={6} />
              <Etiket konum={[0, 1.7, 0]} koyu kucuk>
                Güneş
              </Etiket>

              {GEZEGENLER.map((g) => {
                const p = konum(g)
                return (
                  <group key={g.ad}>
                    {yorungeler && <Line points={cember(g.a)} color="#243050" lineWidth={1} />}
                    {g.gercek === 'dunya' ? (
                      <Dunya konum={p} r={g.r} egim={0.41} bulut={false} atmosfer={false} />
                    ) : (
                      <Gezegen konum={p} r={g.r} renk={g.renk} halka={g.halka} />
                    )}
                    <Etiket konum={[p[0], p[1] + g.r + 0.42, p[2]]} koyu kucuk>
                      {g.ad}
                    </Etiket>
                    {g.ad === 'Dünya' && (
                      <Ay konum={[p[0] + 0.5 * Math.cos(t * 12), 0, p[2] + 0.5 * Math.sin(t * 12)]} r={0.07} />
                    )}
                  </group>
                )
              })}

              {adim >= 4 && (
                <Etiket konum={[0, -2.2, 0]} koyu>
                  Kepler 3: T² ∝ a³ — Güneş’ten uzaklaşan gezegen yavaşlar
                </Etiket>
              )}
              {adim === 0 && (
                <Etiket konum={[0, 4.4, 0]} koyu kucuk>
                  ölçek gerçek değil: uzaklıklar sıkıştırıldı, gezegenler büyütüldü
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
  altBaslik:
    'Gerçek Dünya ve Ay görüntüleriyle: yörüngeler, evrelerin geometrisi ve tutulmaların kurulumu.',
  ders: 'fen',
  seviye: '5. / 6. / 7. Sınıf',
  sure: 16,
  etiketler: ['güneş sistemi', 'yörünge', 'Ay evreleri', 'tutulma', 'Kepler'],
  Sahne: GunesSahne,
  adimlar: [
    {
      baslik: 'Güneş sistemi neye benziyor?',
      metin:
        'Merkezde Güneş, çevresinde sekiz gezegen dolanır. İçteki dördü (Merkür, Venüs, Dünya, Mars) kayaç; dıştaki dördü gaz ve buz devidir. Dünya gerçek uydu görüntüsüyle kaplandı, diğerleri gerçek renklerine yakın malzemelerle çizildi. Uyarı: ölçek gerçek değil — gerçek uzaklıklar bu ekrana sığmaz.',
    },
    {
      baslik: 'Neden bazı gezegenler daha hızlı dolanıyor?',
      metin:
        'Her gezegen kendi ekseninde döner (gün) ve Güneş çevresinde dolanır (yıl). Güneş\'e yakın olanlar hem daha kısa yol alır hem daha güçlü çekim altında daha hızlı gider: Merkür\'ün yılı 88 gün, Neptün\'ünki 165 Dünya yılıdır. Zaman hızını artırıp farkı izle.',
    },
    {
      baslik: 'Ay neden şekil değiştiriyor?',
      metin:
        'Yakın görünümdeyiz. Ay ışık üretmez; Güneş\'ten aldığı ışığı yansıtır ve yarısı her zaman aydınlıktır — sahnedeki aydınlanmayı da boya değil, gerçek ışık hesabı yapıyor. Biz Dünya\'dan bu aydınlık yarının ne kadarını gördüğümüze göre farklı evreler görürüz. Ay, Güneş ile Dünya arasındayken karanlık yüzüne bakarız: yeni ay. Tam karşısındayken: dolunay.',
    },
    {
      baslik: 'Tutulmalar nasıl oluşur?',
      metin:
        'GÜNEŞ TUTULMASI: Ay tam olarak Güneş ile Dünya arasına girer, gölgesi Dünya\'ya düşer — yalnızca yeni ay evresinde olabilir. AY TUTULMASI: Dünya araya girer, gölgesi Ay\'ın üzerine düşer — yalnızca dolunayda. Düğmelerle iki dizilimi de kur. Peki her ay neden tutulma olmuyor? Çünkü Ay\'ın yörüngesi yaklaşık 5° eğik; üçü çoğu ayda tam aynı hizaya gelmez.',
    },
    {
      baslik: 'Yörüngeleri hangi kural yönetiyor?',
      metin:
        'Yörüngeler tam çember değil, Güneş\'in bir odakta olduğu elipstir (Kepler 1). Gezegen Güneş\'e yakınken hızlanır, uzakken yavaşlar; eşit sürede eşit alan tarar (Kepler 2). Dolanma süresinin karesi yörünge yarıçapının küpüyle orantılıdır: T² ∝ a³ (Kepler 3). Bu üçüncü kuralın Newton\'ın çekim yasasından nasıl çıktığını İspat sekmesinde adım adım göreceksin.',
    },
  ],
  ispat: {
    baslik: 'Kepler’in 3. yasası Newton’dan nasıl çıkar?',
    giris: 'Dairesel yörünge yaklaşımıyla: gezegeni yörüngede tutan tek kuvvet kütle çekimidir.',
    satirlar: [
      { tex: 'G\\frac{Mm}{a^{2}}=\\frac{mv^{2}}{a}', not: 'Çekim kuvveti = merkezcil kuvvet' },
      { tex: 'v=\\frac{2\\pi a}{T}', not: 'Bir turluk yol / süre' },
      { tex: 'G\\frac{M}{a^{2}}=\\frac{4\\pi^{2}a}{T^{2}}', not: 'v yerine yazıldı, gezegen kütlesi m sadeleşti' },
      { tex: 'T^{2}=\\frac{4\\pi^{2}}{GM}\\,a^{3}', not: 'Sabit yalnızca merkezdeki kütleye bağlı' },
    ],
    sonuc: 'T² ∝ a³ — aynı yıldızın çevresindeki bütün gezegenler için geçerlidir.',
  },
  sorular: [
    {
      soru: 'Ay’ın evrelerinin oluşma nedeni nedir?',
      secenekler: [
        'Dünya’nın gölgesinin Ay üzerine düşmesi',
        'Ay dolanırken aydınlık yüzünün bize farklı görünmesi',
        'Ay’ın kendi ışığını değiştirmesi',
        'Bulutların Ay’ı kapatması',
      ],
      dogru: 1,
      aciklama:
        'Gölge açıklaması Ay tutulmasına aittir. Evreler, hep aydınlık olan yarının bize görünen kısmının değişmesinden doğar.',
    },
    {
      soru: 'Güneş tutulması hangi evrede gerçekleşir?',
      secenekler: ['Dolunay', 'Yeni ay', 'İlk dördün', 'Son dördün'],
      dogru: 1,
      aciklama: 'Ay’ın Güneş ile Dünya arasında olması gerekir; bu dizilim yeni ay evresidir.',
    },
    {
      soru: 'Güneş’ten uzaklaştıkça gezegenlerin dolanma süresi nasıl değişir?',
      secenekler: ['Kısalır', 'Uzar', 'Değişmez', 'Önce uzar sonra kısalır'],
      dogru: 1,
      aciklama: 'T² ∝ a³ olduğundan yörünge yarıçapı arttıkça dolanma süresi hızla uzar.',
    },
    {
      soru: 'Neden her ay hem Güneş hem Ay tutulması olmaz?',
      secenekler: [
        'Ay bazen çok küçük göründüğü için',
        'Ay’ın yörünge düzlemi yaklaşık 5° eğik olduğu için',
        'Bulutlar engellediği için',
        'Dünya çok hızlı döndüğü için',
      ],
      dogru: 1,
      aciklama:
        'Ay’ın yörüngesi Dünya’nın yörünge düzlemiyle çakışmaz; üç gök cismi çoğu ayda tam hizaya gelmez.',
    },
  ],
}
