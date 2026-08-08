import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { DERSLER, dersBul, istatistikler, tumKonular } from '../curriculum'
import { MODULLER, modulBul } from '../lessons/registry'
import { okuluYukle } from '../lib/okul'
import { useIlerleme } from '../lib/ilerleme'
import { tumOdevler, useOdev, type Odev } from '../lib/odev'
import { BANKA } from '../soru/banka'

function OdevOlustur() {
  const { odevEkle } = useOdev()
  const [ders, setDers] = useState('matematik')
  const [sinif, setSinif] = useState(12)
  const [baslik, setBaslik] = useState('')
  const [tarih, setTarih] = useState(() => {
    const d = new Date()
    d.setDate(d.getDate() + 7)
    return d.toISOString().slice(0, 10)
  })
  const [secili, setSecili] = useState<string[]>([])

  const dersKodlari = useMemo(() => [...new Set(BANKA.map((s) => s.ders))], [])
  const siniflar = useMemo(
    () => [...new Set(BANKA.filter((s) => s.ders === ders).map((s) => s.sinif))].sort((a, b) => a - b),
    [ders],
  )
  const adaylar = BANKA.filter((s) => s.ders === ders && s.sinif === sinif)

  const kaydet = () => {
    if (!baslik.trim() || secili.length === 0) return
    const o: Odev = {
      id: `od-ozel-${Date.now()}`,
      baslik: baslik.trim(),
      ders,
      sinif,
      ogretmen: 'Öğretmen',
      sonTarih: tarih,
      aciklama: 'Öğretmen tarafından oluşturuldu. Yanlış cevaplarda çözüm adımları açılır.',
      soruIdler: secili,
    }
    odevEkle(o)
    setBaslik('')
    setSecili([])
  }

  return (
    <div className="kart space-y-4 p-5">
      <div>
        <h2 className="text-[16px] font-bold">Ödev oluştur</h2>
        <p className="okuma mt-0.5 text-[13px]">
          Soru bankasından soru seç; öğrenci yanlış yaptığında çözüm adımları ve ilgili 3B ders
          otomatik olarak açılır.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <label className="flex flex-col gap-1 text-[12px] text-murekkep-2">
          Ders
          <select
            value={ders}
            onChange={(e) => {
              setDers(e.target.value)
              setSecili([])
            }}
            className="rounded-xl border border-cizgi bg-white px-3 py-2 text-[13.5px] outline-none"
          >
            {dersKodlari.map((k) => (
              <option key={k} value={k}>
                {dersBul(k)?.ad ?? k}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-[12px] text-murekkep-2">
          Sınıf
          <select
            value={sinif}
            onChange={(e) => {
              setSinif(Number(e.target.value))
              setSecili([])
            }}
            className="rounded-xl border border-cizgi bg-white px-3 py-2 text-[13.5px] outline-none"
          >
            {siniflar.map((s) => (
              <option key={s} value={s}>
                {s}. Sınıf
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-[12px] text-murekkep-2">
          Ödev başlığı
          <input
            value={baslik}
            onChange={(e) => setBaslik(e.target.value)}
            placeholder="ör. Türev Tekrarı"
            className="rounded-xl border border-cizgi bg-white px-3 py-2 text-[13.5px] outline-none"
          />
        </label>
        <label className="flex flex-col gap-1 text-[12px] text-murekkep-2">
          Son teslim
          <input
            type="date"
            value={tarih}
            onChange={(e) => setTarih(e.target.value)}
            className="rounded-xl border border-cizgi bg-white px-3 py-2 text-[13.5px] outline-none"
          />
        </label>
      </div>

      <div className="space-y-1.5">
        {adaylar.length === 0 && (
          <p className="text-[12.5px] text-murekkep-3">Bu ders ve sınıf için bankada soru yok.</p>
        )}
        {adaylar.map((s) => {
          const isaretli = secili.includes(s.id)
          return (
            <button
              key={s.id}
              type="button"
              onClick={() =>
                setSecili((o) => (isaretli ? o.filter((x) => x !== s.id) : [...o, s.id]))
              }
              className="flex w-full items-start gap-3 rounded-xl border px-3.5 py-2.5 text-left transition"
              style={{
                borderColor: isaretli ? '#0f766e' : '#e4ddd1',
                background: isaretli ? '#0f766e0d' : '#fff',
              }}
            >
              <span
                className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded border text-[10px] font-bold"
                style={{
                  borderColor: isaretli ? '#0f766e' : '#d3c9b8',
                  background: isaretli ? '#0f766e' : '#fff',
                  color: '#fff',
                }}
              >
                {isaretli ? '✓' : ''}
              </span>
              <span className="min-w-0">
                <span className="block text-[13.5px] leading-snug text-murekkep">{s.soru}</span>
                <span className="mt-0.5 block text-[11px] text-murekkep-3">
                  {s.konu} · zorluk {'●'.repeat(s.zorluk)}
                  {'○'.repeat(3 - s.zorluk)} · {s.cozum.length} adımlı çözüm
                </span>
              </span>
            </button>
          )
        })}
      </div>

      <button
        type="button"
        disabled={!baslik.trim() || secili.length === 0}
        onClick={kaydet}
        className="rounded-xl bg-mat px-4 py-2.5 text-[13px] font-semibold text-white disabled:bg-cizgi-2"
      >
        {secili.length > 0 ? `${secili.length} soruluk ödevi ver` : 'soru seç'}
      </button>
    </div>
  )
}

export function PanelSayfasi() {
  const okul = okuluYukle()
  const ist = istatistikler()
  const { ogrenci, ogrenciAta, konular, sifirla } = useIlerleme()
  const { ozelOdevler, sonuclar, odevSil } = useOdev()

  const kapsam = DERSLER.map((d) => {
    let toplam = 0
    let modullu = 0
    for (const k of tumKonular()) {
      if (k.ders.kod !== d.kod) continue
      toplam++
      if (modulBul(k.konu.sahne)) modullu++
    }
    return { d, toplam, modullu }
  }).filter((x) => x.toplam > 0)

  const calisilan = Object.entries(konular)
    .filter(([k]) => k.startsWith('modul:'))
    .map(([k, v]) => ({ modul: modulBul(k.slice(6)), durum: v }))
    .filter((x) => x.modul)
    .sort((a, b) => b.durum.sonZiyaret - a.durum.sonZiyaret)

  const odevler = tumOdevler(ozelOdevler)

  return (
    <div className="space-y-9">
      <header>
        <p className="etiket-kucuk text-murekkep-3">Okul paneli</p>
        <h1 className="mt-1 text-[30px] font-bold tracking-tight">{okul.ad}</h1>
        <p className="okuma mt-1">{okul.slogan}</p>
      </header>

      <section className="kart p-5">
        <h2 className="text-[16px] font-bold">Öğrenci</h2>
        <p className="okuma mt-0.5 text-[13px]">
          İlerleme şimdilik bu tarayıcıda saklanır. Okul sunucusu devreye alındığında aynı
          kayıtlar öğrenci hesabına taşınacaktır.
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <input
            value={ogrenci}
            onChange={(e) => ogrenciAta(e.target.value)}
            placeholder="ad soyad / numara"
            className="w-64 rounded-xl border border-cizgi bg-white px-3.5 py-2.5 text-[13.5px] outline-none"
          />
          <button
            type="button"
            onClick={() => {
              if (confirm('Tüm ilerleme kayıtları silinsin mi?')) sifirla()
            }}
            className="rounded-xl border border-cizgi px-3.5 py-2.5 text-[12.5px] font-semibold text-murekkep-2 hover:border-sozel hover:text-sozel"
          >
            ilerlemeyi sıfırla
          </button>
        </div>
      </section>

      <OdevOlustur />

      <section>
        <h2 className="mb-3 text-[20px] font-bold tracking-tight">Verilen ödevler</h2>
        <div className="space-y-2">
          {odevler.map((o) => {
            const d = dersBul(o.ders)
            const s = sonuclar[o.id]
            const ozel = ozelOdevler.some((x) => x.id === o.id)
            return (
              <div key={o.id} className="kart flex flex-wrap items-center gap-4 px-5 py-4">
                <div className="min-w-0 flex-1">
                  <p className="text-[11.5px] font-semibold" style={{ color: d?.renk }}>
                    {d?.ad} · {o.sinif}. Sınıf
                  </p>
                  <Link to={`/odev/${o.id}`} className="text-[15px] font-semibold hover:underline">
                    {o.baslik}
                  </Link>
                  <p className="text-[11.5px] text-murekkep-3">
                    {o.soruIdler.length} soru · son teslim{' '}
                    {new Date(o.sonTarih).toLocaleDateString('tr-TR')}
                  </p>
                </div>
                <span
                  className="rounded-full px-2.5 py-1 text-[11.5px] font-bold"
                  style={{
                    background: s?.teslim ? '#15803d14' : '#efeae1',
                    color: s?.teslim ? '#15803d' : '#7d8696',
                  }}
                >
                  {s?.teslim ? `teslim · %${s.puan}` : 'bekliyor'}
                </span>
                {ozel && (
                  <button
                    type="button"
                    onClick={() => odevSil(o.id)}
                    className="text-[11.5px] font-semibold text-murekkep-3 hover:text-sozel"
                  >
                    kaldır
                  </button>
                )}
              </div>
            )
          })}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-[20px] font-bold tracking-tight">Çalışılan dersler</h2>
        {calisilan.length === 0 ? (
          <p className="okuma">
            Henüz kayıt yok.{' '}
            <Link to="/moduller" className="font-semibold text-mat hover:underline">
              Bir ders aç
            </Link>{' '}
            ve ilerleme burada görünsün.
          </p>
        ) : (
          <div className="space-y-2">
            {calisilan.map(({ modul, durum }) => (
              <Link
                key={modul!.id}
                to={`/modul/${modul!.id}`}
                className="kart kart-tik hover:kart-tik-hover flex items-center justify-between gap-4 px-5 py-4"
              >
                <div>
                  <p className="text-[14.5px] font-semibold">{modul!.baslik}</p>
                  <p className="text-[11.5px] text-murekkep-3">
                    {modul!.seviye} · son çalışma {new Date(durum.sonZiyaret).toLocaleDateString('tr-TR')}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  {durum.puan !== undefined && (
                    <span
                      className="text-[12.5px] font-semibold"
                      style={{ color: durum.puan >= 75 ? '#15803d' : '#b45309' }}
                    >
                      quiz %{durum.puan}
                    </span>
                  )}
                  <div className="h-2 w-28 overflow-hidden rounded-full bg-kagit-2">
                    <div className="h-full bg-mat" style={{ width: `${durum.ilerleme}%` }} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-1 text-[20px] font-bold tracking-tight">İçerik kapsamı</h2>
        <p className="mb-3 text-[12.5px] text-murekkep-3">
          Müfredattaki {ist.konu} konu başlığı için {MODULLER.length} adet 3B ders üretildi;
          kalanların içerik planlaması sürüyor.
        </p>
        <div className="space-y-2">
          {kapsam.map(({ d, toplam, modullu }) => (
            <div key={d.kod} className="kart flex items-center gap-4 px-5 py-4">
              <span
                className="grid h-10 w-10 shrink-0 place-items-center rounded-xl text-[19px]"
                style={{ background: `${d.renk}12`, color: d.renk }}
              >
                {d.ikon}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[14.5px] font-semibold">{d.ad}</p>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-kagit-2">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${(modullu / toplam) * 100}%`, background: d.renk }}
                  />
                </div>
              </div>
              <span className="shrink-0 text-[12.5px] text-murekkep-3">
                {modullu} / {toplam} konu
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="kart p-5">
        <h2 className="text-[16px] font-bold">Sıradaki aşamalar</h2>
        <ol className="okuma mt-3 space-y-2 text-[13.5px]">
          <li>
            <span className="font-bold text-mat">1.</span> Kalan müfredat başlıkları için 3B ders
            üretimi (öncelik: fen bilimleri ve matematik).
          </li>
          <li>
            <span className="font-bold text-mat">2.</span> Okul bazlı giriş paneli, sınıf–şube ve
            öğretmen yönetimi; ödevlerin sunucuda tutulması.
          </li>
          <li>
            <span className="font-bold text-mat">3.</span> Okul başına ayrı sunucu / alt alan adı,
            marka ve tema özelleştirmesi (<code>src/lib/okul.ts</code>).
          </li>
          <li>
            <span className="font-bold text-mat">4.</span> Sınav, karne raporlaması ve veli
            görünümü.
          </li>
        </ol>
      </section>
    </div>
  )
}
