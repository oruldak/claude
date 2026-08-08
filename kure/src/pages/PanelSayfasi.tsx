import { Link } from 'react-router-dom'
import { DERSLER, istatistikler, tumKonular } from '../curriculum'
import { MODULLER, modulBul } from '../lessons/registry'
import { okuluYukle } from '../lib/okul'
import { useIlerleme } from '../lib/ilerleme'

export function PanelSayfasi() {
  const okul = okuluYukle()
  const ist = istatistikler()
  const { ogrenci, ogrenciAta, konular, sifirla } = useIlerleme()

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

  return (
    <div className="space-y-8">
      <header>
        <p className="text-xs uppercase tracking-[0.2em] text-camgobegi">Okul paneli</p>
        <h1 className="text-2xl font-bold text-white">{okul.ad}</h1>
        <p className="mt-1 max-w-3xl text-sm text-slate-400">{okul.slogan}</p>
      </header>

      {/* Öğrenci */}
      <section className="kart p-5">
        <h2 className="text-sm font-semibold text-white">Öğrenci</h2>
        <p className="mt-1 text-xs text-slate-400">
          İlerleme şimdilik bu tarayıcıda saklanır. Okul sunucusu devreye alındığında aynı
          kayıtlar öğrenci hesabına taşınacaktır.
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <input
            value={ogrenci}
            onChange={(e) => ogrenciAta(e.target.value)}
            placeholder="ad soyad / numara"
            className="w-64 rounded-lg border border-gece-500/60 bg-gece-800/80 px-3 py-2 text-sm text-slate-200 outline-none placeholder:text-slate-500 focus:border-camgobegi/60"
          />
          <button
            type="button"
            onClick={() => {
              if (confirm('Tüm ilerleme kayıtları silinsin mi?')) sifirla()
            }}
            className="rounded-lg border border-gece-500/60 px-3 py-2 text-xs text-slate-300 hover:border-rose-400/60 hover:text-rose-200"
          >
            ilerlemeyi sıfırla
          </button>
        </div>
      </section>

      {/* İlerleme */}
      <section>
        <h2 className="mb-3 text-lg font-bold text-white">Çalışılan modüller</h2>
        {calisilan.length === 0 ? (
          <p className="text-sm text-slate-500">
            Henüz kayıt yok.{' '}
            <Link to="/moduller" className="text-camgobegi hover:underline">
              Bir modül aç
            </Link>{' '}
            ve ilerleme burada görünsün.
          </p>
        ) : (
          <div className="space-y-2">
            {calisilan.map(({ modul, durum }) => (
              <Link
                key={modul!.id}
                to={`/modul/${modul!.id}`}
                className="kart flex items-center justify-between gap-4 p-4 transition hover:border-camgobegi/50"
              >
                <div>
                  <p className="text-sm font-medium text-white">{modul!.baslik}</p>
                  <p className="text-[11px] text-slate-500">
                    {modul!.seviye} · son çalışma:{' '}
                    {new Date(durum.sonZiyaret).toLocaleDateString('tr-TR')}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  {durum.puan !== undefined && (
                    <span className="text-xs" style={{ color: durum.puan >= 75 ? '#4ade80' : '#ffb454' }}>
                      quiz %{durum.puan}
                    </span>
                  )}
                  <div className="h-1.5 w-28 overflow-hidden rounded-full bg-gece-600">
                    <div className="h-full bg-camgobegi" style={{ width: `${durum.ilerleme}%` }} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* İçerik kapsamı */}
      <section>
        <h2 className="mb-1 text-lg font-bold text-white">İçerik kapsamı</h2>
        <p className="mb-3 text-xs text-slate-500">
          Müfredattaki {ist.konu} konu başlığından {MODULLER.length} tanesi için 3B modül
          üretildi; kalan başlıklar için içerik planlaması sürüyor.
        </p>
        <div className="space-y-2">
          {kapsam.map(({ d, toplam, modullu }) => (
            <div key={d.kod} className="kart flex items-center gap-4 p-4">
              <span
                className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-lg"
                style={{ background: `${d.renk}1a`, color: d.renk }}
              >
                {d.ikon}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-white">{d.ad}</p>
                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-gece-600">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${(modullu / toplam) * 100}%`, background: d.renk }}
                  />
                </div>
              </div>
              <span className="shrink-0 text-xs text-slate-400">
                {modullu} / {toplam} konu
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Yol haritası */}
      <section className="kart p-5">
        <h2 className="text-sm font-semibold text-white">Sıradaki aşamalar</h2>
        <ol className="mt-3 space-y-2 text-[13px] leading-relaxed text-slate-400">
          <li>
            <span className="text-camgobegi">1.</span> Kalan müfredat başlıkları için 3B modül
            üretimi (öncelik: fen bilimleri ve matematik).
          </li>
          <li>
            <span className="text-camgobegi">2.</span> Okul bazlı giriş paneli, sınıf-şube
            yönetimi ve öğretmen atamaları.
          </li>
          <li>
            <span className="text-camgobegi">3.</span> Her okul için ayrı sunucu/alt alan adı,
            marka ve tema özelleştirmesi (<code className="text-slate-300">src/lib/okul.ts</code>).
          </li>
          <li>
            <span className="text-camgobegi">4.</span> Ödev, sınav ve karne raporlaması; veli
            görünümü.
          </li>
        </ol>
      </section>
    </div>
  )
}
