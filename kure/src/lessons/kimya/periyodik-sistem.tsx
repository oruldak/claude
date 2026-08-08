import { useMemo, useState } from 'react'
import { Etiket, Sahne } from '../shared/sahne'
import { Dugme, Duzen, Gosterge } from '../shared/ui'
import type { DersModulu, SahneProps } from '../types'

/* Sembol | Türkçe ad | Pauling elektronegatifliği (bilinmeyen: boş) */
const VERI = `H|Hidrojen|2.20;He|Helyum|;Li|Lityum|0.98;Be|Berilyum|1.57;B|Bor|2.04;C|Karbon|2.55;N|Azot|3.04;O|Oksijen|3.44;F|Flor|3.98;Ne|Neon|;Na|Sodyum|0.93;Mg|Magnezyum|1.31;Al|Alüminyum|1.61;Si|Silisyum|1.90;P|Fosfor|2.19;S|Kükürt|2.58;Cl|Klor|3.16;Ar|Argon|;K|Potasyum|0.82;Ca|Kalsiyum|1.00;Sc|Skandiyum|1.36;Ti|Titanyum|1.54;V|Vanadyum|1.63;Cr|Krom|1.66;Mn|Mangan|1.55;Fe|Demir|1.83;Co|Kobalt|1.88;Ni|Nikel|1.91;Cu|Bakır|1.90;Zn|Çinko|1.65;Ga|Galyum|1.81;Ge|Germanyum|2.01;As|Arsenik|2.18;Se|Selenyum|2.55;Br|Brom|2.96;Kr|Kripton|3.00;Rb|Rubidyum|0.82;Sr|Stronsiyum|0.95;Y|İtriyum|1.22;Zr|Zirkonyum|1.33;Nb|Niyobyum|1.60;Mo|Molibden|2.16;Tc|Teknesyum|1.90;Ru|Rutenyum|2.20;Rh|Rodyum|2.28;Pd|Paladyum|2.20;Ag|Gümüş|1.93;Cd|Kadmiyum|1.69;In|İndiyum|1.78;Sn|Kalay|1.96;Sb|Antimon|2.05;Te|Tellür|2.10;I|İyot|2.66;Xe|Ksenon|2.60;Cs|Sezyum|0.79;Ba|Baryum|0.89;La|Lantan|1.10;Ce|Seryum|1.12;Pr|Praseodim|1.13;Nd|Neodim|1.14;Pm|Prometyum|;Sm|Samaryum|1.17;Eu|Evropiyum|;Gd|Gadolinyum|1.20;Tb|Terbiyum|;Dy|Disprosyum|1.22;Ho|Holmiyum|1.23;Er|Erbiyum|1.24;Tm|Tulyum|1.25;Yb|İterbiyum|;Lu|Lutesyum|1.27;Hf|Hafniyum|1.30;Ta|Tantal|1.50;W|Volfram|2.36;Re|Renyum|1.90;Os|Osmiyum|2.20;Ir|İridyum|2.20;Pt|Platin|2.28;Au|Altın|2.54;Hg|Cıva|2.00;Tl|Talyum|1.62;Pb|Kurşun|2.33;Bi|Bizmut|2.02;Po|Polonyum|2.00;At|Astatin|2.20;Rn|Radon|;Fr|Fransiyum|0.70;Ra|Radyum|0.90;Ac|Aktinyum|1.10;Th|Toryum|1.30;Pa|Protaktinyum|1.50;U|Uranyum|1.38;Np|Neptunyum|1.36;Pu|Plutonyum|1.28;Am|Amerikyum|1.30;Cm|Küriyum|1.30;Bk|Berkelyum|1.30;Cf|Kaliforniyum|1.30;Es|Aynştaynyum|1.30;Fm|Fermiyum|1.30;Md|Mendelevyum|1.30;No|Nobelyum|1.30;Lr|Lavrensiyum|;Rf|Rutherfordyum|;Db|Dubniyum|;Sg|Seaborgiyum|;Bh|Bohriyum|;Hs|Hassiyum|;Mt|Meitneryum|;Ds|Darmstadtiyum|;Rg|Röntgenyum|;Cn|Kopernikyum|;Nh|Nihonyum|;Fl|Flerovyum|;Mc|Moskovyum|;Lv|Livermoryum|;Ts|Tennessin|;Og|Oganesson|`

type Kategori = 'alkali' | 'toprakAlkali' | 'gecis' | 'lantanit' | 'aktinit' | 'metal' | 'yariMetal' | 'ametal' | 'halojen' | 'soygaz'

const KATEGORI_RENK: Record<Kategori, string> = {
  alkali: '#ff7a45',
  toprakAlkali: '#ffb454',
  gecis: '#8b7dff',
  lantanit: '#c084fc',
  aktinit: '#f472b6',
  metal: '#60a5fa',
  yariMetal: '#2dd4bf',
  ametal: '#4ade80',
  halojen: '#facc15',
  soygaz: '#7dd3fc',
}

const KATEGORI_ADI: Record<Kategori, string> = {
  alkali: 'Alkali metal',
  toprakAlkali: 'Toprak alkali metal',
  gecis: 'Geçiş metali',
  lantanit: 'Lantanit',
  aktinit: 'Aktinit',
  metal: 'Metal',
  yariMetal: 'Yarı metal',
  ametal: 'Ametal',
  halojen: 'Halojen',
  soygaz: 'Soy gaz',
}

interface Elmnt {
  Z: number
  sembol: string
  ad: string
  en: number | null
  grup: number
  periyot: number
  /** f bloğu ayrı satırlarda gösterilir */
  satir: number
  kategori: Kategori
  blok: 's' | 'p' | 'd' | 'f'
}

const ANA_GRUP_2_3 = [1, 2, 13, 14, 15, 16, 17, 18]
const YARI_METALLER = ['B', 'Si', 'Ge', 'As', 'Sb', 'Te', 'At']
const AMETALLER = ['H', 'C', 'N', 'O', 'P', 'S', 'Se']

function konum(Z: number): { grup: number; periyot: number; satir: number } {
  if (Z === 1) return { grup: 1, periyot: 1, satir: 1 }
  if (Z === 2) return { grup: 18, periyot: 1, satir: 1 }
  if (Z <= 10) return { grup: ANA_GRUP_2_3[Z - 3], periyot: 2, satir: 2 }
  if (Z <= 18) return { grup: ANA_GRUP_2_3[Z - 11], periyot: 3, satir: 3 }
  if (Z <= 36) return { grup: Z - 18, periyot: 4, satir: 4 }
  if (Z <= 54) return { grup: Z - 36, periyot: 5, satir: 5 }
  if (Z <= 56) return { grup: Z - 54, periyot: 6, satir: 6 }
  if (Z <= 71) return { grup: Z - 54, periyot: 6, satir: 8 } // lantanitler ayrı satırda
  if (Z <= 86) return { grup: Z - 68, periyot: 6, satir: 6 }
  if (Z <= 88) return { grup: Z - 86, periyot: 7, satir: 7 }
  if (Z <= 103) return { grup: Z - 86, periyot: 7, satir: 9 } // aktinitler ayrı satırda
  return { grup: Z - 100, periyot: 7, satir: 7 }
}

function kategoriBul(Z: number, sembol: string, grup: number): Kategori {
  if (Z >= 57 && Z <= 71) return 'lantanit'
  if (Z >= 89 && Z <= 103) return 'aktinit'
  if (grup === 18) return 'soygaz'
  if (grup === 17) return 'halojen'
  if (grup === 1 && Z !== 1) return 'alkali'
  if (grup === 2) return 'toprakAlkali'
  if (grup >= 3 && grup <= 12) return 'gecis'
  if (YARI_METALLER.includes(sembol)) return 'yariMetal'
  if (AMETALLER.includes(sembol)) return 'ametal'
  return 'metal'
}

function blokBul(Z: number, grup: number, satir: number): 's' | 'p' | 'd' | 'f' {
  if (satir >= 8) return 'f'
  if (grup <= 2) return 's'
  if (grup >= 13) return 'p'
  if (Z === 2) return 's'
  return 'd'
}

const ELEMENTLER: Elmnt[] = VERI.split(';').map((satirMetni, i) => {
  const [sembol, ad, en] = satirMetni.split('|')
  const Z = i + 1
  const k = konum(Z)
  return {
    Z,
    sembol,
    ad,
    en: en ? parseFloat(en) : null,
    grup: k.grup,
    periyot: k.periyot,
    satir: k.satir,
    kategori: kategoriBul(Z, sembol, k.grup),
    blok: blokBul(Z, k.grup, k.satir),
  }
})

const BLOK_RENK: Record<string, string> = { s: '#ff7a45', p: '#4ade80', d: '#8b7dff', f: '#f472b6' }

type Mod = 'kategori' | 'blok' | 'elektronegatiflik' | 'metal'

function PeriyodikSahne({ adim }: SahneProps) {
  const [secili, setSecili] = useState(11) // Na
  const [mod, setMod] = useState<Mod>('kategori')

  const M: Mod = adim === 1 ? 'blok' : adim === 2 ? 'metal' : adim >= 3 ? 'elektronegatiflik' : mod
  const el = ELEMENTLER[secili]

  const kutucuklar = useMemo(
    () =>
      ELEMENTLER.map((e) => {
        const x = (e.grup - 9.5) * 0.62
        const z = (e.satir - 5) * 0.62 + (e.satir >= 8 ? 0.4 : 0)
        const h =
          M === 'elektronegatiflik' ? 0.12 + (e.en ?? 0.6) * 0.62 : 0.16
        let renk: string
        if (M === 'blok') renk = BLOK_RENK[e.blok]
        else if (M === 'metal')
          renk =
            e.kategori === 'ametal' || e.kategori === 'halojen' || e.kategori === 'soygaz'
              ? '#4ade80'
              : e.kategori === 'yariMetal'
                ? '#2dd4bf'
                : '#60a5fa'
        else if (M === 'elektronegatiflik')
          renk = e.en ? `hsl(${(1 - (e.en - 0.7) / 3.3) * 210}, 85%, 58%)` : '#334867'
        else renk = KATEGORI_RENK[e.kategori]
        return { e, x, z, h, renk }
      }),
    [M],
  )

  return (
    <Duzen
      gosterge={
        <Gosterge
          satirlar={[
            { ad: 'element', deger: `${el.sembol} — ${el.ad}`, renk: KATEGORI_RENK[el.kategori] },
            { ad: 'atom numarası', deger: el.Z },
            { ad: 'periyot / grup', deger: `${el.periyot}. periyot · ${el.grup}. grup` },
            { ad: 'blok', deger: `${el.blok} bloğu`, renk: BLOK_RENK[el.blok] },
            { ad: 'sınıf', deger: KATEGORI_ADI[el.kategori] },
            { ad: 'elektronegatiflik', deger: el.en ? el.en.toFixed(2) : '—', renk: '#ffb454' },
          ]}
        />
      }
      kontrol={
        <>
          <div className="flex flex-wrap gap-1.5">
            {(['kategori', 'blok', 'metal', 'elektronegatiflik'] as Mod[]).map((m) => (
              <Dugme key={m} onClick={() => setMod(m)} aktif={M === m} boyut="sm">
                {m === 'kategori'
                  ? 'element sınıfları'
                  : m === 'blok'
                    ? 's · p · d · f blokları'
                    : m === 'metal'
                      ? 'metal / ametal'
                      : 'elektronegatiflik (yükseklik)'}
              </Dugme>
            ))}
          </div>
          <span className="text-xs text-slate-400">
            kutucuklara tıklayarak element seç · {ELEMENTLER.length} element
          </span>
        </>
      }
      sahne={
        <Sahne kamera={[0, 7.5, 8.5]} izgara={false} maxUzaklik={30} minUzaklik={3}>
          {kutucuklar.map(({ e, x, z, h, renk }) => (
            <group key={e.Z} position={[x, h / 2, z]}>
              <mesh
                onClick={(ev) => {
                  ev.stopPropagation()
                  setSecili(e.Z - 1)
                }}
              >
                <boxGeometry args={[0.55, h, 0.55]} />
                <meshStandardMaterial
                  color={renk}
                  emissive={e.Z - 1 === secili ? '#ffffff' : renk}
                  emissiveIntensity={e.Z - 1 === secili ? 0.5 : 0.12}
                  roughness={0.45}
                />
              </mesh>
            </group>
          ))}

          {/* Seçili elementin etiketi */}
          {(() => {
            const k = kutucuklar[secili]
            return (
              <Etiket konum={[k.x, k.h + 0.75, k.z]} renk="#e6ecf7">
                {el.Z} · {el.sembol} — {el.ad}
              </Etiket>
            )
          })()}

          {/* Grup ve periyot başlıkları */}
          {Array.from({ length: 18 }, (_, i) => (
            <Etiket key={`g${i}`} konum={[(i + 1 - 9.5) * 0.62, 0.05, (0.4 - 5) * 0.62]} renk="#64748b" arka="transparent" kucuk>
              {i + 1}
            </Etiket>
          ))}
          {[1, 2, 3, 4, 5, 6, 7].map((p) => (
            <Etiket key={`p${p}`} konum={[(0.2 - 9.5) * 0.62, 0.05, (p - 5) * 0.62]} renk="#64748b" arka="transparent" kucuk>
              {p}
            </Etiket>
          ))}

          {adim === 0 && (
            <Etiket konum={[0, 1.6, -3.4]} renk="#94a3b8" kucuk>
              satır = periyot (kabuk sayısı) · sütun = grup (değerlik elektronu)
            </Etiket>
          )}
          {adim >= 3 && (
            <Etiket konum={[0, 3.2, -3.4]} renk="#ffb454" kucuk>
              elektronegatiflik sağa ve yukarı doğru artar — en yüksek: F
            </Etiket>
          )}
        </Sahne>
      }
    />
  )
}

export const periyodikSistemModulu: DersModulu = {
  id: 'periyodik-sistem',
  baslik: 'Periyodik Sistem — Düzenin Mantığı',
  altBaslik: '118 elementin üç boyutlu haritası: bloklar, sınıflar ve periyodik eğilimler.',
  ders: 'kimya',
  seviye: '8. / 9. Sınıf',
  sure: 15,
  etiketler: ['periyodik tablo', 'elektron dizilimi', 'elektronegatiflik', 'metal-ametal'],
  Sahne: PeriyodikSahne,
  adimlar: [
    {
      baslik: 'Tablo neden böyle dizilmiş?',
      metin:
        'Elementler artan atom numarasına göre sıralanır. SATIRLAR (periyot) elektron kabuğu sayısını, SÜTUNLAR (grup) son kabuktaki elektron sayısını gösterir. Aynı gruptaki elementlerin kimyasal davranışı benzerdir — çünkü değerlik elektronları aynıdır. Kutucuklara tıklayarak elementleri incele.',
    },
    {
      baslik: 'Bloklar: s, p, d, f',
      metin:
        'Tablo dört bloğa ayrılır. Solda 2 sütun s bloğu, sağda 6 sütun p bloğu, ortada 10 sütun d bloğu (geçiş metalleri) ve altta 14 sütunluk f bloğu (lantanit ve aktinitler). Blok, son elektronun hangi orbitale girdiğini söyler.',
    },
    {
      baslik: 'Metal, ametal, yarı metal',
      metin:
        'Tablonun sol ve orta kısmı metaldir (elektron verir), sağ üst köşesi ametaldir (elektron alır). İkisinin arasındaki merdiven basamağı boyunca yarı metaller yer alır — yarı iletken teknolojisi (Si, Ge) tam olarak buradan çıkar.',
    },
    {
      baslik: 'Periyodik eğilimler',
      metin:
        'Kutucukların yüksekliği artık elektronegatifliği gösteriyor. Sağa gidildikçe çekirdek yükü arttığı için elektronegatiflik ARTAR; aşağı inildikçe kabuk sayısı arttığı için AZALIR. Zirve flor (F). Atom yarıçapı ise tam tersi yönde değişir.',
    },
    {
      baslik: 'Değerlik ve bileşik oluşumu',
      metin:
        '1. grup 1 elektron verir (+1), 17. grup 1 elektron alır (−1); ikisi birleşince NaCl gibi iyonik bileşikler oluşur. 18. grubun son kabuğu dolu olduğundan tepkimeye girmez. Tablodaki konum, bir elementin hangi bileşiği kuracağını önceden söyler.',
    },
  ],
  ispat: {
    baslik: 'Periyodik eğilimlerin nedeni: etkin çekirdek yükü',
    satirlar: [
      { tex: 'Z_{\\text{etkin}} = Z - S', not: 'S: iç elektronların perdeleme etkisi' },
      {
        tex: '\\text{Aynı periyotta sağa: } Z\\uparrow,\\ S\\approx\\text{sabit} \\Rightarrow Z_{\\text{etkin}}\\uparrow',
        not: 'Aynı kabuğa eklenen elektronlar iyi perdelemez',
      },
      { tex: '\\Rightarrow r_{\\text{atom}}\\downarrow,\\quad \\text{İE}\\uparrow,\\quad \\chi\\uparrow' },
      {
        tex: '\\text{Aynı grupta aşağı: } n\\uparrow,\\ S\\uparrow \\Rightarrow \\text{çekim}\\downarrow',
      },
      { tex: '\\Rightarrow r_{\\text{atom}}\\uparrow,\\quad \\text{İE}\\downarrow,\\quad \\chi\\downarrow' },
    ],
    sonuc: '\\chi:\\ \\text{sağa ve yukarı artar}\\quad r:\\ \\text{sola ve aşağı artar}',
  },
  sorular: [
    {
      soru: 'Periyodik tabloda aynı grupta bulunan elementlerin ortak özelliği nedir?',
      secenekler: [
        'Aynı sayıda kabuğa sahiptirler',
        'Değerlik elektron sayıları aynıdır',
        'Atom kütleleri eşittir',
        'Aynı bloktadırlar',
      ],
      dogru: 1,
      aciklama:
        'Grup numarası değerlik elektron sayısını verir; kimyasal benzerlik buradan gelir. Kabuk sayısı ise periyodu belirler.',
    },
    {
      soru: 'Elektronegatifliği en yüksek element hangisidir?',
      secenekler: ['Oksijen', 'Flor', 'Klor', 'Helyum'],
      dogru: 1,
      aciklama: 'Flor 3,98 Pauling değeriyle en elektronegatif elementtir.',
    },
    {
      soru: 'Bir periyotta soldan sağa gidildikçe atom yarıçapı nasıl değişir?',
      secenekler: ['Artar', 'Azalır', 'Değişmez', 'Önce azalır sonra artar'],
      dogru: 1,
      aciklama:
        'Kabuk sayısı sabit kalırken çekirdek yükü arttığı için elektronlar daha güçlü çekilir; yarıçap küçülür.',
    },
    {
      soru: 'Soy gazların tepkimeye girme isteği neden çok düşüktür?',
      secenekler: [
        'Ağır oldukları için',
        'Son kabukları dolu olduğu için',
        'Elektronegatiflikleri sıfır olduğu için',
        'Gaz hâlinde bulundukları için',
      ],
      dogru: 1,
      aciklama:
        'Son kabuk elektron dizilimi kararlıdır (oktet/dublet); elektron alma veya verme eğilimleri yoktur.',
    },
  ],
}
