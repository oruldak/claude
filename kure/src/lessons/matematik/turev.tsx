import { useMemo, useState } from 'react'
import { Cizgi as Line, Egri, Eksenler, Etiket, Nokta, Sahne, type V3 } from '../shared/sahne'
import { Dugme, Duzen, Gosterge, Kaydirac, Anahtar } from '../shared/ui'
import { dongusel, useGecis, useZaman } from '../shared/animasyon'
import type { DersModulu, SahneProps } from '../types'

interface FonksiyonTanimi {
  ad: string
  f: (x: number) => number
  tf: (x: number) => number
  tex: string
  ttex: string
  kritik: number[]
}

const FONKSIYONLAR: FonksiyonTanimi[] = [
  {
    ad: 'x²/2',
    f: (x) => (x * x) / 2,
    tf: (x) => x,
    tex: 'f(x)=\\dfrac{x^{2}}{2}',
    ttex: "f'(x)=x",
    kritik: [0],
  },
  {
    ad: 'x³/3 − x',
    f: (x) => x ** 3 / 3 - x,
    tf: (x) => x * x - 1,
    tex: 'f(x)=\\dfrac{x^{3}}{3}-x',
    ttex: "f'(x)=x^{2}-1",
    kritik: [-1, 1],
  },
  {
    ad: 'sin x',
    f: Math.sin,
    tf: Math.cos,
    tex: 'f(x)=\\sin x',
    ttex: "f'(x)=\\cos x",
    kritik: [-Math.PI / 2, Math.PI / 2],
  },
]

const X0 = -4.2
const X1 = 4.2
const TUREV_Z = -2.6

function TurevSahne({ adim }: SahneProps) {
  const [fi, setFi] = useState(1)
  const [a, setA] = useState(1.2)
  const [h, setH] = useState(2)
  const [oynat, setOynat] = useState(true)
  const [turevGoster, setTurevGoster] = useState(false)

  const fn = FONKSIYONLAR[fi]
  const gecis = useGecis(`${adim}-${fi}`, 1.6)
  const [t] = useZaman(oynat && adim >= 3, 1)

  // 2. adımdan itibaren h → 0: sekant, teğete dönüşür.
  const hEt = adim >= 2 ? Math.max(0.0012, h * (1 - gecis)) : h
  // 3. adımda a ekseni tarar; türev fonksiyonu böylece nokta nokta doğar.
  const aEt = adim >= 3 && oynat ? X0 + 0.4 + (X1 - X0 - 0.8) * dongusel(t, 9) : a

  const A: V3 = [aEt, fn.f(aEt), 0]
  const B: V3 = [aEt + hEt, fn.f(aEt + hEt), 0]
  const egim = (fn.f(aEt + hEt) - fn.f(aEt)) / hEt
  const gercekEgim = fn.tf(aEt)

  const dogru = useMemo(() => {
    const y = (x: number) => fn.f(aEt) + egim * (x - aEt)
    return [
      [X0, y(X0), 0],
      [X1, y(X1), 0],
    ] as V3[]
  }, [aEt, egim, fn])

  // 3. adımda çizilen türev eğrisinin "izi"
  const izSonu = adim >= 3 ? aEt : X1

  return (
    <Duzen
      gosterge={
        <Gosterge
          satirlar={[
            { ad: 'a', deger: aEt.toFixed(2) },
            { ad: 'h', deger: hEt < 0.01 ? hEt.toExponential(1) : hEt.toFixed(3) },
            {
              ad: 'Δy/Δx',
              deger: Number.isFinite(egim) ? egim.toFixed(3) : '—',
              renk: '#ffb454',
            },
            { ad: "f′(a)", deger: gercekEgim.toFixed(3), renk: '#38e1c6' },
          ]}
        />
      }
      kontrol={
        <>
          <div className="flex gap-1.5">
            {FONKSIYONLAR.map((f, i) => (
              <Dugme key={f.ad} onClick={() => setFi(i)} aktif={i === fi} boyut="sm">
                {f.ad}
              </Dugme>
            ))}
          </div>
          <Kaydirac
            etiket="a (dokunma noktası)"
            deger={a}
            min={-3.8}
            max={3.8}
            onChange={setA}
            renk="#38e1c6"
          />
          <Kaydirac
            etiket="h (artış)"
            deger={h}
            min={0.05}
            max={2.5}
            onChange={setH}
            renk="#ffb454"
          />
          <Anahtar etiket="türev eğrisi" deger={turevGoster} onChange={setTurevGoster} />
          <Dugme onClick={() => setOynat(!oynat)} aktif={oynat} boyut="sm">
            {oynat ? '⏸ durdur' : '▶ oynat'}
          </Dugme>
        </>
      }
      sahne={
        <Sahne kamera={[5.4, 2.6, 9.6]} izgara={false} maxUzaklik={30}>
          <Eksenler boy={4.4} eksiBoy={4.4} bolme={1} />

          {/* f(x) eğrisi */}
          <Egri f={fn.f} x0={X0} x1={X1} renk="#7dd3fc" kalinlik={3.4} sinirY={5.5} />

          {/* Kesen doğru (sekant) → h→0 iken teğet */}
          {adim >= 1 && (
            <Line
              points={dogru}
              color={hEt < 0.05 ? '#38e1c6' : '#ffb454'}
              lineWidth={2.6}
            />
          )}

          {/* Δx – Δy üçgeni */}
          {adim >= 1 && hEt > 0.06 && (
            <>
              <Line
                points={[A, [B[0], A[1], 0]] as V3[]}
                color="#ffb454"
                lineWidth={2}
                dashed
                dashSize={0.14}
                gapSize={0.1}
              />
              <Line
                points={[[B[0], A[1], 0], B] as V3[]}
                color="#ffb454"
                lineWidth={2}
                dashed
                dashSize={0.14}
                gapSize={0.1}
              />
              <Etiket konum={[(A[0] + B[0]) / 2, A[1] - 0.34, 0]} renk="#ffb454" kucuk>
                Δx = h
              </Etiket>
              <Etiket konum={[B[0] + 0.42, (A[1] + B[1]) / 2, 0]} renk="#ffb454" kucuk>
                Δy
              </Etiket>
            </>
          )}

          <Nokta konum={A} renk="#38e1c6" r={0.12} />
          <Etiket konum={[A[0], A[1] + 0.5, 0]} renk="#38e1c6" kucuk>
            A(a, f(a))
          </Etiket>
          {adim >= 1 && hEt > 0.06 && (
            <>
              <Nokta konum={B} renk="#ffb454" r={0.1} />
              <Etiket konum={[B[0], B[1] + 0.48, 0]} renk="#ffb454" kucuk>
                B(a+h, f(a+h))
              </Etiket>
            </>
          )}

          {/* Türev fonksiyonu — ayrı bir düzlemde çizilir */}
          {(adim >= 3 || turevGoster) && (
            <group position={[0, 0, TUREV_Z]}>
              <Eksenler boy={4.4} eksiBoy={4.4} bolme={0} adlar={['', "f'(x)", '']} />
              <Egri
                f={fn.tf}
                x0={X0}
                x1={izSonu}
                renk="#8b7dff"
                kalinlik={3.2}
                sinirY={5.5}
              />
              <Nokta konum={[aEt, gercekEgim, 0]} renk="#8b7dff" r={0.11} />
              <Etiket konum={[-3.4, 3.6, 0]} renk="#8b7dff" kucuk>
                türev fonksiyonu
              </Etiket>
            </group>
          )}

          {/* İki düzlemi bağlayan izdüşüm çizgisi: eğim → değer */}
          {adim >= 3 && (
            <Line
              points={[
                [aEt, fn.f(aEt), 0],
                [aEt, gercekEgim, TUREV_Z],
              ]}
              color="#8b7dff"
              lineWidth={1.4}
              dashed
              dashSize={0.16}
              gapSize={0.12}
            />
          )}

          {/* Kritik noktalar ve artan/azalan bölgeler */}
          {adim >= 4 &&
            fn.kritik.map((k) => (
              <group key={k}>
                <Nokta konum={[k, fn.f(k), 0]} renk="#f472b6" r={0.13} />
                <Line
                  points={[
                    [k, fn.f(k), 0],
                    [k, 0, TUREV_Z],
                  ]}
                  color="#f472b6"
                  lineWidth={1.2}
                  dashed
                  dashSize={0.14}
                  gapSize={0.1}
                />
                <Etiket konum={[k, fn.f(k) + 0.55, 0]} renk="#f472b6" kucuk>
                  f′ = 0
                </Etiket>
              </group>
            ))}
        </Sahne>
      }
    />
  )
}

export const turevModulu: DersModulu = {
  id: 'turev',
  baslik: 'Türev — Anlık Değişim ve Teğetin Eğimi',
  altBaslik:
    'Kesen doğrunun teğete dönüşünü izleyerek türevin neden bir limit olduğunu gör.',
  ders: 'matematik',
  seviye: '12. Sınıf',
  sure: 18,
  etiketler: ['limit', 'teğet', 'değişim oranı', 'ekstremum'],
  Sahne: TurevSahne,
  adimlar: [
    {
      baslik: 'Bir eğri ve üzerinde bir nokta',
      metin:
        'f fonksiyonunun grafiği üzerinde A(a, f(a)) noktasını işaretledik. Sorumuz şu: bu noktada eğri "ne kadar dik"? Bir doğrunun eğimini biliyoruz ama eğrinin tek bir noktasındaki eğim ne demek?',
    },
    {
      baslik: 'Ortalama değişim oranı',
      metin:
        'Eğri üzerinde ikinci bir B(a+h, f(a+h)) noktası alıp A ile birleştirelim. Bu kesen doğrunun eğimi Δy/Δx = [f(a+h) − f(a)] / h olur. Bu, a ile a+h arasındaki ORTALAMA değişim hızıdır. h kaydırıcısını değiştirip üçgenin nasıl büyüyüp küçüldüğüne bak.',
    },
    {
      baslik: 'h sıfıra giderken',
      metin:
        'Şimdi h değerini sıfıra yaklaştırıyoruz. B noktası A üzerine kayar, kesen doğru dönerek tek bir doğruya yaklaşır: teğet. Turuncu doğrunun yeşile dönüşmesi bu geçişi gösterir. İşte bu limit değeri f′(a) yani türevdir.',
    },
    {
      baslik: 'Türev de bir fonksiyondur',
      metin:
        'a noktasını eksen boyunca gezdirirsek her a için bir eğim elde ederiz. Bu eğimleri arkadaki mor düzleme taşıdığımızda ortaya yeni bir fonksiyon çıkar: f′(x). Sahneyi döndürerek iki düzlemi yan yana görebilirsin — üstteki eğrinin eğimi, alttaki eğrinin yüksekliğidir.',
    },
    {
      baslik: 'Türevin işareti ne anlatır?',
      metin:
        'f′(x) > 0 olduğu yerlerde f artar, f′(x) < 0 olduğu yerlerde azalır. f′(x) = 0 olan noktalar (pembe) yerel maksimum/minimum adaylarıdır. Maksimum–minimum problemlerinin tamamı bu tek gözlemden doğar.',
    },
  ],
  ispat: {
    baslik: 'Türevin limit tanımı ve kuvvet kuralının ispatı',
    giris:
      'Teğetin eğimini, kesen doğruların eğimlerinin limiti olarak tanımlıyoruz.',
    satirlar: [
      { tex: "f'(a)=\\lim_{h\\to 0}\\frac{f(a+h)-f(a)}{h}", not: 'Türevin tanımı' },
      { tex: 'f(x)=x^{n}\\ \\Rightarrow\\ f(a+h)=(a+h)^{n}' },
      {
        tex: '(a+h)^{n}=a^{n}+\\binom{n}{1}a^{n-1}h+\\binom{n}{2}a^{n-2}h^{2}+\\cdots+h^{n}',
        not: 'Binom açılımı',
      },
      {
        tex: '\\frac{(a+h)^{n}-a^{n}}{h}=na^{n-1}+\\binom{n}{2}a^{n-2}h+\\cdots+h^{n-1}',
        not: 'a^n sadeleşti, pay h ile bölündü',
      },
      {
        tex: "\\lim_{h\\to 0}\\left(na^{n-1}+\\underbrace{\\binom{n}{2}a^{n-2}h+\\cdots}_{\\to\\,0}\\right)=na^{n-1}",
        not: 'İçinde h bulunan tüm terimler sıfıra gider',
      },
    ],
    sonuc: "f(x)=x^{n}\\ \\Rightarrow\\ f'(x)=n\\,x^{\\,n-1}",
  },
  sorular: [
    {
      soru: 'f(x) = x³/3 − x fonksiyonunun x = 0 noktasındaki teğetinin eğimi kaçtır?',
      secenekler: ['0', '−1', '1', '3'],
      dogru: 1,
      aciklama: "f′(x) = x² − 1 olduğundan f′(0) = −1'dir. Grafikte x = 0'da eğri azalmaktadır.",
    },
    {
      soru: 'Kesen doğrunun eğimi ile teğetin eğimi arasındaki fark nedir?',
      secenekler: [
        'Kesen doğrunun eğimi her zaman daha büyüktür',
        'Kesen ortalama, teğet ise anlık değişim oranını verir',
        'İkisi de aynı şeydir',
        'Teğet yalnızca doğrusal fonksiyonlarda tanımlıdır',
      ],
      dogru: 1,
      aciklama:
        'Kesen doğru iki nokta arasındaki ortalama değişimi; teğet ise h → 0 limitindeki anlık değişimi verir.',
    },
    {
      soru: 'Bir fonksiyonun türevi bir aralıkta negatifse, fonksiyon o aralıkta nasıldır?',
      secenekler: ['Artandır', 'Azalandır', 'Sabittir', 'Tanımsızdır'],
      dogru: 1,
      aciklama:
        'f′(x) < 0 ise teğetlerin eğimi negatiftir; bu da fonksiyonun azaldığı anlamına gelir.',
    },
    {
      soru: 'f(x) = x⁵ fonksiyonunun türevi aşağıdakilerden hangisidir?',
      secenekler: ['5x⁴', 'x⁴', '5x⁶', '4x⁵'],
      dogru: 0,
      aciklama: 'Kuvvet kuralına göre (xⁿ)′ = n·xⁿ⁻¹ olduğundan (x⁵)′ = 5x⁴ olur.',
    },
  ],
}
