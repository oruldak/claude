import { useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { dersBul, dersSiniflari, sinifProgrami } from '../curriculum'
import { KADEME_ADI, sinifKademesi } from '../lib/types'
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
          <Link
            to={`/kademe/${sinifKademesi(s)}`}
            className="text-[12.5px] text-murekkep-3 hover:text-murekkep"
          >
            ← {KADEME_ADI[sinifKademesi(s)]}
          </Link>
          <h1 className="mt-1.5 flex items-center gap-3 text-[28px] font-bold tracking-tight">
            <span
              className="grid h-11 w-11 place-items-center rounded-xl text-[21px]"
              style={{ background: `${ders.renk}12`, color: ders.renk }}
            >
              {ders.ikon}
            </span>
            {ders.ad} · {s}. Sınıf
          </h1>
          <p className="okuma mt-1">
            {program.uniteler.length} ünite · {toplamKonu} konu ·{' '}
            <span className="font-semibold" style={{ color: ders.renk }}>
              {modulluKonu} konuda 3B ders
            </span>
          </p>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {dersSiniflari(ders).map((x) => (
            <Link
              key={x}
              to={`/ders/${ders.kod}/${x}`}
              className="rounded-xl border px-3 py-2 text-[12.5px] font-semibold transition"
              style={
                x === s
                  ? { borderColor: ders.renk, background: ders.renk, color: '#fff' }
                  : { borderColor: '#e4ddd1', background: '#fff', color: '#4a5260' }
              }
            >
              {x}
            </Link>
          ))}
        </div>
      </header>

      <div className="space-y-3">
        {program.uniteler.map((u) => {
          const secili = acik === u.id
          const modulVar = u.konular.some((k) => modulBul(k.sahne))
          return (
            <section key={u.id} className="kart overflow-hidden">
              <button
                type="button"
                onClick={() => setAcik(secili ? null : u.id)}
                className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left transition hover:bg-kagit/60"
              >
                <div>
                  <h2 className="text-[15.5px] font-semibold">{u.ad}</h2>
                  <p className="mt-0.5 text-[11.5px] text-murekkep-3">
                    {u.konular.length} konu
                    {u.sure ? ` · ${u.sure} ders saati` : ''}
                    {modulVar && (
                      <span className="font-semibold" style={{ color: ders.renk }}>
                        {' '}
                        · 3B ders var
                      </span>
                    )}
                  </p>
                </div>
                <span className="text-[18px] text-murekkep-3">{secili ? '−' : '+'}</span>
              </button>

              {secili && (
                <div className="space-y-2 border-t border-cizgi bg-kagit/40 px-4 py-4">
                  {u.konular.map((k) => {
                    const m = modulBul(k.sahne)
                    const durum = konular[konuAnahtari(ders.kod, s, k.id)]
                    return (
                      <div key={k.id} className="rounded-xl border border-cizgi bg-white p-4">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <h3 className="text-[14.5px] font-semibold">{k.ad}</h3>
                          {m ? (
                            <Link
                              to={`/modul/${m.id}`}
                              className="rounded-lg px-3 py-1.5 text-[11.5px] font-semibold text-white"
                              style={{ background: ders.renk }}
                            >
                              3B dersi aç →
                            </Link>
                          ) : (
                            <span className="rounded-lg border border-cizgi px-2.5 py-1 text-[10.5px] text-murekkep-3">
                              içerik planlanıyor
                            </span>
                          )}
                        </div>
                        <ul className="mt-2 space-y-1">
                          {k.kazanimlar.map((kz, i) => (
                            <li key={i} className="text-[12.5px] leading-relaxed text-murekkep-2">
                              • {kz}
                            </li>
                          ))}
                        </ul>
                        {durum && (
                          <p className="mt-2 text-[11.5px] font-semibold" style={{ color: ders.renk }}>
                            %{durum.ilerleme} tamamlandı
                          </p>
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
