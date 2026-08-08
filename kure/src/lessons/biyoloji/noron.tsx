import { useMemo, useState } from 'react'
import { Cizgi as Line, Etiket, Nokta, Sahne, type V3 } from '../shared/sahne'
import { Anahtar, Dugme, Duzen, Gosterge, Kaydirac } from '../shared/ui'
import { useZaman } from '../shared/animasyon'
import type { DersModulu, SahneProps } from '../types'

const SOMA: V3 = [-5.2, 0, 0]
const AKSON_BAS = -4.4
const AKSON_SON = 4.4
const DUGUM_SAYISI = 7

function NoronSahne({ adim }: SahneProps) {
  const [miyelin, setMiyelin] = useState(true)
  const [oynat, setOynat] = useState(true)
  const [uyaranSiddeti, setUyaranSiddeti] = useState(1.2)
  const [t] = useZaman(oynat, 1)

  // Miyelinli akson sıçrayarak iletir → çok daha hızlı
  const hiz = miyelin ? 2.6 : 0.9
  const esikAsildi = uyaranSiddeti >= 1
  const dongu = (AKSON_SON - AKSON_BAS) / hiz + 0.8
  const yerelT = t % dongu
  const ham = AKSON_BAS + yerelT * hiz

  const dugumler = useMemo(
    () =>
      Array.from(
        { length: DUGUM_SAYISI },
        (_, i) => AKSON_BAS + ((AKSON_SON - AKSON_BAS) * i) / (DUGUM_SAYISI - 1),
      ),
    [],
  )

  // Miyelinliyse impuls yalnızca düğümlerde görünür (saltatorik iletim)
  const impulsX = miyelin
    ? dugumler.reduce((en, d) => (d <= ham ? d : en), dugumler[0])
    : ham
  const aktif = esikAsildi && ham <= AKSON_SON

  const dendritler = useMemo(() => {
    const d: V3[][] = []
    for (let i = 0; i < 6; i++) {
      const a = Math.PI * 0.55 + (i / 5) * Math.PI * 0.9
      const uz = 1.4 + (i % 3) * 0.4
      const orta: V3 = [SOMA[0] + Math.cos(a) * uz * 0.6, Math.sin(a) * uz * 0.6, (i % 2 ? 0.4 : -0.4) * 0.6]
      const uc: V3 = [SOMA[0] + Math.cos(a) * uz, Math.sin(a) * uz, i % 2 ? 0.6 : -0.6]
      d.push([SOMA, orta, uc])
    }
    return d
  }, [])

  const potansiyel = !aktif
    ? -70
    : Math.abs(ham - impulsX) < 0.35
      ? 35
      : -70

  return (
    <Duzen
      gosterge={
        <Gosterge
          satirlar={[
            { ad: 'dinlenim potansiyeli', deger: '−70 mV', renk: '#0369a1' },
            { ad: 'eşik değeri', deger: '−55 mV', renk: '#b45309' },
            { ad: 'anlık potansiyel', deger: `${potansiyel} mV`, renk: potansiyel > 0 ? '#be185d' : '#0369a1' },
            { ad: 'iletim', deger: miyelin ? 'sıçrayarak (saltatorik)' : 'sürekli', renk: miyelin ? '#15803d' : '#6b7280' },
            { ad: 'bağıl hız', deger: miyelin ? '≈ 100 m/s' : '≈ 1 m/s', renk: '#0f766e' },
            { ad: 'uyaran', deger: esikAsildi ? 'eşik aşıldı → impuls var' : 'eşik altı → impuls yok', renk: esikAsildi ? '#15803d' : '#be185d' },
          ]}
        />
      }
      kontrol={
        <>
          <Kaydirac
            etiket="uyaran şiddeti"
            deger={uyaranSiddeti}
            min={0}
            max={2}
            onChange={setUyaranSiddeti}
            basamak={2}
            renk={esikAsildi ? '#15803d' : '#be185d'}
          />
          <Anahtar etiket="miyelin kılıf" deger={miyelin} onChange={setMiyelin} renk="#15803d" />
          <Dugme onClick={() => setOynat(!oynat)} aktif={oynat} boyut="sm">
            {oynat ? '⏸ durdur' : '▶ oynat'}
          </Dugme>
        </>
      }
      sahne={
        <Sahne kamera={[0, 2, 11]} zemin="yok" maxUzaklik={30}>
          {/* Dendritler */}
          {dendritler.map((d, i) => (
            <Line key={i} points={d} color="#4338ca" lineWidth={2.4} />
          ))}
          {adim >= 0 && (
            <Etiket konum={[-6.6, 1.9, 0]} renk="#4338ca" kucuk>
              dendritler — uyarıyı alır
            </Etiket>
          )}

          {/* Soma (hücre gövdesi) */}
          <mesh position={SOMA}>
            <sphereGeometry args={[0.75, 32, 24]} />
            <meshStandardMaterial color="#7c3aed" roughness={0.45} />
          </mesh>
          <mesh position={[SOMA[0], SOMA[1], SOMA[2] + 0.1]}>
            <sphereGeometry args={[0.3, 20, 20]} />
            <meshStandardMaterial color="#5b21b6" />
          </mesh>
          <Etiket konum={[SOMA[0], SOMA[1] - 1.1, 0]} renk="#7c3aed" kucuk>
            gövde (soma) + çekirdek
          </Etiket>

          {/* Akson */}
          <mesh position={[(AKSON_BAS + AKSON_SON) / 2, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.17, 0.17, AKSON_SON - AKSON_BAS, 20]} />
            <meshStandardMaterial color="#7a8290" roughness={0.5} />
          </mesh>
          <Etiket konum={[0, -0.95, 0]} renk="#6b7280" kucuk>
            akson — impulsu taşır
          </Etiket>

          {/* Miyelin kılıflar ve Ranvier boğumları */}
          {adim >= 3 &&
            miyelin &&
            dugumler.slice(0, -1).map((d, i) => {
              const g = dugumler[i + 1] - d
              return (
                <mesh key={i} position={[d + g / 2, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                  <capsuleGeometry args={[0.34, g * 0.72, 6, 18]} />
                  <meshStandardMaterial color="#f2ede3" transparent opacity={0.6} roughness={0.35} />
                </mesh>
              )
            })}
          {adim >= 3 &&
            miyelin &&
            dugumler.map((d, i) => (
              <Nokta key={i} konum={[d, 0, 0]} renk="#b45309" r={0.1} />
            ))}
          {adim >= 3 && miyelin && (
            <Etiket konum={[0, 1.15, 0]} renk="#f2ede3" kucuk>
              miyelin kılıf · turuncu noktalar: Ranvier boğumları
            </Etiket>
          )}

          {/* İmpuls */}
          {adim >= 2 && aktif && (
            <>
              <mesh position={[impulsX, 0, 0]}>
                <sphereGeometry args={[0.42, 24, 24]} />
                <meshStandardMaterial color="#be185d" transparent opacity={0.55} emissive="#be185d" emissiveIntensity={0.25} />
              </mesh>
              <Etiket konum={[impulsX, 0.95, 0]} renk="#be185d" kucuk>
                +35 mV (depolarizasyon)
              </Etiket>
              {/* Na⁺ içeri, K⁺ dışarı */}
              {[0, 1, 2].map((i) => {
                const s = ((t * 2 + i * 0.33) % 1)
                return (
                  <group key={i}>
                    <Nokta konum={[impulsX - 0.2 + i * 0.2, 0.9 - s * 0.85, 0.2]} renk="#b45309" r={0.075} />
                    <Nokta konum={[impulsX - 0.2 + i * 0.2, -0.05 - s * 0.85, -0.2]} renk="#0369a1" r={0.075} />
                  </group>
                )
              })}
              <Etiket konum={[impulsX + 1.1, 0.6, 0]} renk="#b45309" kucuk>
                Na⁺ içeri
              </Etiket>
              <Etiket konum={[impulsX + 1.1, -0.75, 0]} renk="#0369a1" kucuk>
                K⁺ dışarı
              </Etiket>
            </>
          )}

          {/* Akson ucu ve sinaps */}
          <mesh position={[AKSON_SON + 0.35, 0, 0]}>
            <sphereGeometry args={[0.45, 24, 24]} />
            <meshStandardMaterial color="#7a8290" roughness={0.5} />
          </mesh>
          <mesh position={[AKSON_SON + 1.7, 0, 0]}>
            <sphereGeometry args={[0.62, 24, 24]} />
            <meshStandardMaterial color="#4338ca" transparent opacity={0.6} roughness={0.5} />
          </mesh>
          <Etiket konum={[AKSON_SON + 1.75, -1.1, 0]} renk="#4338ca" kucuk>
            sonraki nöronun dendriti
          </Etiket>

          {/* Nörotransmitter salınımı */}
          {adim >= 4 &&
            aktif &&
            ham > AKSON_SON - 0.6 &&
            Array.from({ length: 10 }, (_, i) => {
              const s = ((t * 1.6 + i * 0.1) % 1)
              const y = Math.sin(i * 1.7) * 0.3
              const z = Math.cos(i * 2.3) * 0.3
              return (
                <Nokta
                  key={i}
                  konum={[AKSON_SON + 0.75 + s * 0.75, y * (1 - s * 0.4), z * (1 - s * 0.4)]}
                  renk="#15803d"
                  r={0.075}
                />
              )
            })}
          {adim >= 4 && (
            <Etiket konum={[AKSON_SON + 1.1, 1.1, 0]} renk="#15803d" kucuk>
              nörotransmitter (sinaptik boşluk)
            </Etiket>
          )}

          {adim === 1 && (
            <Etiket konum={[0, 2.2, 0]} renk="#0369a1" kucuk>
              dinlenim hâlinde: dışarısı (+), içerisi (−) → −70 mV · Na⁺/K⁺ pompası ATP harcar
            </Etiket>
          )}
        </Sahne>
      }
    />
  )
}

export const noronModulu: DersModulu = {
  id: 'noron',
  baslik: 'Nöron ve Sinirsel İletim',
  altBaslik: 'Bir düşünce, kolun kasına nasıl ulaşıyor? İmpulsu akson boyunca takip et.',
  ders: 'biyoloji',
  seviye: '11. Sınıf',
  sure: 18,
  etiketler: ['sinir sistemi', 'impuls', 'miyelin', 'sinaps'],
  Sahne: NoronSahne,
  adimlar: [
    {
      baslik: 'Nöronun yapısı',
      metin:
        'Nöron üç ana bölümden oluşur: uyarıyı alan DENDRİTLER, çekirdeği barındıran GÖVDE (soma) ve impulsu ileten AKSON. Akson metrelerce uzayabilir — omurilikten ayak parmağına giden tek bir hücre gibi.',
    },
    {
      baslik: 'Dinlenim potansiyeli: −70 mV',
      metin:
        'Uyarı yokken zarın dışı pozitif, içi negatiftir. Bu farkı Na⁺/K⁺ pompası ATP harcayarak korur: 3 Na⁺ dışarı, 2 K⁺ içeri. Yani hücre "boşta" dururken bile enerji harcar — sinir sistemi vücudun en pahalı organıdır.',
    },
    {
      baslik: 'İmpuls: ya hep ya hiç',
      metin:
        'Uyaran eşiği (−55 mV) aşarsa Na⁺ kanalları açılır, sodyum içeri dolar ve potansiyel +35 mV\'a fırlar (depolarizasyon). Hemen ardından K⁺ dışarı çıkar ve zar eski hâline döner. Uyaran şiddetini eşiğin altına çekersen hiçbir şey olmaz: impuls ya tam oluşur ya hiç oluşmaz.',
    },
    {
      baslik: 'Miyelin: neden bu kadar hızlıyız?',
      metin:
        'Miyelin kılıf aksonu yalıtır; impuls kılıfın altından geçemez ve boğumdan boğuma SIÇRAR. Miyelin anahtarını kapatıp açarak hız farkını izle: miyelinsiz ≈ 1 m/s, miyelinli ≈ 100 m/s. MS hastalığında bozulan tam olarak bu kılıftır.',
    },
    {
      baslik: 'Sinaps: hücreler nasıl konuşur?',
      metin:
        'Akson ucu ile sonraki hücre arasında fiziksel bir boşluk (sinaptik aralık) vardır; elektrik oradan atlayamaz. İmpuls uca ulaşınca keseciklerdeki NÖROTRANSMİTTER moleküller boşluğa salınır, karşı zardaki reseptörlere bağlanır ve yeni bir impuls başlatır. Sinyal elektrikten kimyaya, sonra tekrar elektriğe döner.',
    },
  ],
  ispat: {
    baslik: 'Zar potansiyeli: Nernst denklemi',
    satirlar: [
      { tex: 'E_{\\text{iyon}}=\\frac{RT}{zF}\\ln\\frac{[C]_{\\text{dış}}}{[C]_{\\text{iç}}}', not: 'Bir iyonun denge potansiyeli' },
      { tex: 'E_{K^{+}}\\approx -90\\ \\text{mV},\\qquad E_{Na^{+}}\\approx +60\\ \\text{mV}' },
      {
        tex: 'V_m=\\frac{g_K E_K + g_{Na} E_{Na}}{g_K+g_{Na}}',
        not: 'Zar potansiyeli, geçirgenliklere göre ağırlıklı ortalamadır',
      },
      { tex: '\\text{Dinlenimde } g_K \\gg g_{Na} \\Rightarrow V_m \\approx -70\\ \\text{mV}' },
      { tex: '\\text{Uyarılınca } g_{Na} \\gg g_K \\Rightarrow V_m \\to +35\\ \\text{mV}' },
    ],
    sonuc: 'İmpuls, zar geçirgenliğinin hızla yer değiştirmesidir.',
  },
  sorular: [
    {
      soru: 'Dinlenim hâlindeki bir nöronda zarın iç kısmı nasıldır?',
      secenekler: ['Pozitif yüklü', 'Negatif yüklü', 'Yüksüz', 'Değişkendir'],
      dogru: 1,
      aciklama: 'Dinlenim potansiyeli −70 mV\'dur; iç kısım dışa göre negatiftir.',
    },
    {
      soru: '"Ya hep ya hiç" ilkesi ne anlama gelir?',
      secenekler: [
        'İmpuls şiddeti uyaran şiddetiyle artar',
        'Eşik aşılırsa impuls hep aynı büyüklükte oluşur',
        'İmpuls yalnızca miyelinli aksonlarda oluşur',
        'Nöron ya yaşar ya ölür',
      ],
      dogru: 1,
      aciklama:
        'Eşik aşılmazsa impuls oluşmaz; aşılırsa uyaran ne kadar güçlü olursa olsun impuls hep aynı büyüklüktedir. Şiddet, impuls SIKLIĞI ile kodlanır.',
    },
    {
      soru: 'Miyelin kılıf iletim hızını neden artırır?',
      secenekler: [
        'Aksonu kalınlaştırdığı için',
        'İmpuls boğumdan boğuma sıçradığı için',
        'Daha çok ATP ürettiği için',
        'Na⁺ kanallarını kapattığı için',
      ],
      dogru: 1,
      aciklama: 'Miyelinli bölgede depolarizasyon olmaz; impuls yalnızca Ranvier boğumlarında yenilenerek sıçrar.',
    },
    {
      soru: 'Sinapsta sinyal nasıl aktarılır?',
      secenekler: [
        'Elektrik akımı doğrudan atlar',
        'Nörotransmitter molekülleriyle kimyasal olarak',
        'Kan yoluyla',
        'Miyelin kılıf üzerinden',
      ],
      dogru: 1,
      aciklama:
        'Sinaptik aralıkta sinyal, kesecikten salınan nörotransmitterlerle kimyasal olarak taşınır.',
    },
  ],
}
