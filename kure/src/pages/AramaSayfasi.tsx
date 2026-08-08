import { Link, useSearchParams } from 'react-router-dom'
import { ara } from '../curriculum'
import { modulBul } from '../lessons/registry'

export function AramaSayfasi() {
  const [params, setParams] = useSearchParams()
  const q = params.get('q') ?? ''
  const sonuc = ara(q)

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <header>
        <h1 className="text-[28px] font-bold tracking-tight">Arama</h1>
        <input
          autoFocus
          value={q}
          onChange={(e) => setParams(e.target.value ? { q: e.target.value } : {})}
          placeholder="konu, kazanım ya da ders adı"
          className="mt-3 w-full rounded-2xl border border-cizgi bg-white px-4 py-3 text-[15px] outline-none transition placeholder:text-murekkep-3 focus:border-murekkep-3"
        />
        <p className="mt-2 text-[12.5px] text-murekkep-3">
          {q.length < 2 ? 'En az iki harf yaz.' : `${sonuc.length} sonuç`}
        </p>
      </header>

      <div className="space-y-2.5">
        {sonuc.map((k, i) => {
          const m = modulBul(k.konu.sahne)
          return (
            <div key={i} className="kart px-5 py-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[11.5px] font-semibold" style={{ color: k.ders.renk }}>
                    {k.ders.ad} · {k.sinif}. Sınıf · {k.unite.ad}
                  </p>
                  <h2 className="mt-0.5 text-[15.5px] font-semibold">{k.konu.ad}</h2>
                  <ul className="mt-1.5 space-y-1">
                    {k.konu.kazanimlar.map((kz, j) => (
                      <li key={j} className="text-[12.5px] leading-relaxed text-murekkep-2">
                        • {kz}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex shrink-0 flex-col gap-1.5">
                  <Link
                    to={`/ders/${k.ders.kod}/${k.sinif}`}
                    className="rounded-lg border border-cizgi px-3 py-1.5 text-center text-[11.5px] font-semibold text-murekkep-2 hover:border-murekkep-3"
                  >
                    müfredatta gör
                  </Link>
                  {m && (
                    <Link
                      to={`/modul/${m.id}`}
                      className="rounded-lg px-3 py-1.5 text-center text-[11.5px] font-semibold text-white"
                      style={{ background: k.ders.renk }}
                    >
                      3B dersi aç
                    </Link>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
