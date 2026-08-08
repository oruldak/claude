import { Link, useSearchParams } from 'react-router-dom'
import { ara } from '../curriculum'
import { modulBul } from '../lessons/registry'

export function AramaSayfasi() {
  const [params, setParams] = useSearchParams()
  const q = params.get('q') ?? ''
  const sonuc = ara(q)

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-2xl font-bold text-white">Arama</h1>
        <input
          autoFocus
          value={q}
          onChange={(e) => setParams(e.target.value ? { q: e.target.value } : {})}
          placeholder="konu, kazanım, ders adı…"
          className="mt-3 w-full max-w-xl rounded-xl border border-gece-500/60 bg-gece-800/80 px-4 py-2.5 text-sm text-slate-200 outline-none placeholder:text-slate-500 focus:border-camgobegi/60"
        />
        <p className="mt-2 text-xs text-slate-500">
          {q.length < 2 ? 'En az iki harf yaz.' : `${sonuc.length} sonuç bulundu.`}
        </p>
      </header>

      <div className="space-y-2">
        {sonuc.map((k, i) => {
          const m = modulBul(k.konu.sahne)
          return (
            <div key={i} className="kart p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-[11px]" style={{ color: k.ders.renk }}>
                    {k.ders.ad} · {k.sinif}. Sınıf · {k.unite.ad}
                  </p>
                  <h2 className="mt-0.5 text-sm font-semibold text-white">{k.konu.ad}</h2>
                  <ul className="mt-1.5 space-y-0.5">
                    {k.konu.kazanimlar.map((kz, j) => (
                      <li key={j} className="text-[12px] leading-relaxed text-slate-400">
                        • {kz}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex shrink-0 flex-col gap-1.5">
                  <Link
                    to={`/ders/${k.ders.kod}/${k.sinif}`}
                    className="rounded-lg border border-gece-500/50 px-3 py-1.5 text-[11px] text-slate-300 hover:border-camgobegi/50"
                  >
                    müfredatta gör
                  </Link>
                  {m && (
                    <Link
                      to={`/modul/${m.id}`}
                      className="rounded-lg px-3 py-1.5 text-center text-[11px] font-semibold text-gece-900"
                      style={{ background: k.ders.renk }}
                    >
                      3B modül
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
