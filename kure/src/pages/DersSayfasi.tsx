import { useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { dersBul, dersSiniflari, sinifProgrami } from '../curriculum'
import { sinifKademesi } from '../lib/types'
import { modulBul } from '../lessons/registry'
import { konuAnahtari, useIlerleme } from '../lib/ilerleme'

export function DersSayfasi() {
  const { kod, sinif } = useParams()
  const ders = dersBul(kod ?? '')
  const s = Number(sinif)
  const [acik, setAcik] = useState<string | null>(null)
  const konular = useIlerleme((st) => st.konular)

  if (!ders || !Number.isFinite(s)) return <Navigate to="/" replace />
  const program = sinifProgrami(ders, s)
  if (!program) return <Navigate to={`/kademe/${sinifKademesi(s)}`} replace />

  const toplamKonu = program.uniteler.reduce((a, u) => a + u.konular.length, 0)
  const modulluKonu = program.uniteler.reduce(
    (a, u) => a + u.konular.filter((k) => modulBul(k.sahne)).length,
    0,
  )

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Link to={`/kademe/${sinifKademesi(s)}`} className="text-xs text-slate-400 hover:text-white">
            ← {sinifKademesi(s) === 'lise' ? 'Lise' : sinifKademesi(s) === 'ortaokul' ? 'Ortaokul' : 'İlkokul'}
          </Link>
          <h1 className="mt-1 flex items-center gap-2.5 text-2xl font-bold text-white">
            <span
              className="grid h-10 w-10 place-items-center rounded-xl text-xl"
              style={{ background: `${ders.renk}1a`, color: ders.renk }}
            >
              {ders.ikon}
            </span>
            {ders.ad} · {s}. Sınıf
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            {program.uniteler.length} ünite · {toplamKonu} konu ·{' '}
            <span style={{ color: ders.renk }}>{modulluKonu} konuda 3B modül</span>
          </p>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {dersSiniflari(ders).map((x) => (
            <Link
              key={x}
              to={`/ders/${ders.kod}/${x}`}
              className={`rounded-lg border px-2.5 py-1.5 text-xs transition ${
                x === s
                  ? 'border-transparent text-gece-900'
                  : 'border-gece-500/50 text-slate-300 hover:border-camgobegi/50'
              }`}
              style={x === s ? { background: ders.renk } : undefined}
            >
              {x}
            </Link>
          ))}
        </div>
      </header>

      <div className="space-y-3">
        {program.uniteler.map((u) => {
          const secili = acik === u.id
          return (
            <section key={u.id} className="kart overflow-hidden">
              <button
                type="button"
                onClick={() => setAcik(secili ? null : u.id)}
                className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
              >
                <div>
                  <h2 className="text-sm font-semibold text-white">{u.ad}</h2>
                  <p className="mt-0.5 text-[11px] text-slate-500">
                    {u.konular.length} konu
                    {u.sure ? ` · ${u.sure} ders saati` : ''}
                    {u.konular.some((k) => modulBul(k.sahne)) && (
                      <span style={{ color: ders.renk }}> · 3B modül var</span>
                    )}
                  </p>
                </div>
                <span className="text-slate-500">{secili ? '−' : '+'}</span>
              </button>

              {secili && (
                <div className="space-y-2 border-t border-gece-500/40 px-5 py-4">
                  {u.konular.map((k) => {
                    const m = modulBul(k.sahne)
                    const durum = konular[konuAnahtari(ders.kod, s, k.id)]
                    return (
                      <div key={k.id} className="rounded-xl border border-gece-500/40 bg-gece-900/50 p-4">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <h3 className="text-sm font-medium text-slate-100">{k.ad}</h3>
                          {m ? (
                            <Link
                              to={`/modul/${m.id}`}
                              className="rounded-lg px-3 py-1.5 text-[11px] font-semibold text-gece-900"
                              style={{ background: ders.renk }}
                            >
                              3B modülü aç →
                            </Link>
                          ) : (
                            <span className="rounded-lg border border-gece-500/50 px-2.5 py-1 text-[10px] text-slate-500">
                              modül planlanıyor
                            </span>
                          )}
                        </div>
                        <ul className="mt-2 space-y-1">
                          {k.kazanimlar.map((kz, i) => (
                            <li key={i} className="text-[12px] leading-relaxed text-slate-400">
                              • {kz}
                            </li>
                          ))}
                        </ul>
                        {durum && (
                          <p className="mt-2 text-[11px] text-camgobegi">%{durum.ilerleme} tamamlandı</p>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </section>
          )
        })}
      </div>
    </div>
  )
}
