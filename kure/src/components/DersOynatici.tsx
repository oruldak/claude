import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import type { DersModulu } from '../lessons/types'
import { Tex } from '../lessons/shared/ui'
import { Quiz } from './Quiz'
import { dersBul, sahneKonulari } from '../curriculum'
import { useIlerleme } from '../lib/ilerleme'

type Sekme = 'anlatim' | 'ispat' | 'sorular' | 'mufredat'

export function DersOynatici({ modul }: { modul: DersModulu }) {
  const [adim, setAdim] = useState(0)
  const [sekme, setSekme] = useState<Sekme>('anlatim')
  const kaydet = useIlerleme((s) => s.kaydet)
  const sahneAc = useIlerleme((s) => s.sahneAc)

  const ders = dersBul(modul.ders)
  const renk = ders?.renk ?? '#38e1c6'
  const konular = sahneKonulari(modul.id)
  const Sahne = modul.Sahne

  useEffect(() => {
    sahneAc(modul.id)
  }, [modul.id, sahneAc])

  useEffect(() => {
    kaydet(`modul:${modul.id}`, {
      ilerleme: Math.round(((adim + 1) / modul.adimlar.length) * 100),
    })
  }, [adim, modul.id, modul.adimlar.length, kaydet])

  useEffect(() => {
    const el = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') setAdim((a) => Math.min(a + 1, modul.adimlar.length - 1))
      if (e.key === 'ArrowLeft') setAdim((a) => Math.max(a - 1, 0))
    }
    window.addEventListener('keydown', el)
    return () => window.removeEventListener('keydown', el)
  }, [modul.adimlar.length])

  const su = modul.adimlar[adim]

  return (
    <div className="space-y-4">
      {/* Başlık */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="mb-1.5 flex flex-wrap items-center gap-2 text-[11px]">
            <Link to="/moduller" className="text-slate-400 hover:text-white">
              ← tüm modüller
            </Link>
            <span
              className="rounded-full px-2 py-0.5 font-semibold uppercase tracking-wider"
              style={{ background: `${renk}1f`, color: renk, border: `1px solid ${renk}44` }}
            >
              {ders?.ad ?? modul.ders}
            </span>
            <span className="text-slate-400">{modul.seviye}</span>
            <span className="text-slate-500">· ~{modul.sure} dk</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl">{modul.baslik}</h1>
          <p className="mt-1 max-w-2xl text-sm text-slate-400">{modul.altBaslik}</p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {modul.etiketler.map((e) => (
            <span key={e} className="rounded-md border border-gece-500/50 px-2 py-1 text-[11px] text-slate-400">
              #{e}
            </span>
          ))}
        </div>
      </div>

      {/* Sahne + panel */}
      <div className="grid gap-4 lg:grid-cols-[1fr_400px]">
        <div className="h-[60vh] min-h-[440px] lg:h-[calc(100vh-230px)]">
          <Sahne adim={adim} />
        </div>

        <aside className="flex flex-col gap-3 lg:h-[calc(100vh-230px)]">
          {/* Sekmeler */}
          <div className="flex gap-1 rounded-xl border border-gece-500/50 bg-gece-800/60 p-1">
            {(
              [
                ['anlatim', 'Anlatım'],
                ['ispat', 'İspat'],
                ['sorular', 'Sorular'],
                ['mufredat', 'Müfredat'],
              ] as [Sekme, string][]
            ).map(([k, ad]) => (
              <button
                key={k}
                type="button"
                onClick={() => setSekme(k)}
                disabled={k === 'ispat' && !modul.ispat}
                className={`flex-1 rounded-lg px-2 py-1.5 text-xs font-medium transition disabled:opacity-30 ${
                  sekme === k ? 'bg-gece-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                {ad}
              </button>
            ))}
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto pr-1">
            {sekme === 'anlatim' && (
              <div className="space-y-3">
                <div className="kart p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <span
                      className="grid h-6 w-6 place-items-center rounded-lg text-xs font-bold text-gece-900"
                      style={{ background: renk }}
                    >
                      {adim + 1}
                    </span>
                    <h2 className="text-sm font-semibold text-white">{su.baslik}</h2>
                  </div>
                  <p className="text-[13px] leading-relaxed text-slate-300">{su.metin}</p>
                </div>

                <ol className="space-y-1.5">
                  {modul.adimlar.map((a, i) => (
                    <li key={i}>
                      <button
                        type="button"
                        onClick={() => setAdim(i)}
                        className={`flex w-full items-center gap-2.5 rounded-lg border px-3 py-2 text-left text-xs transition ${
                          i === adim
                            ? 'border-transparent text-white'
                            : i < adim
                              ? 'border-gece-500/40 bg-gece-800/40 text-slate-400'
                              : 'border-gece-500/40 bg-gece-800/40 text-slate-500 hover:text-slate-300'
                        }`}
                        style={i === adim ? { background: `${renk}1f`, borderColor: `${renk}66` } : undefined}
                      >
                        <span
                          className="grid h-5 w-5 shrink-0 place-items-center rounded-full border text-[10px]"
                          style={{ borderColor: i <= adim ? renk : '#334867', color: i <= adim ? renk : '#64748b' }}
                        >
                          {i + 1}
                        </span>
                        {a.baslik}
                      </button>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {sekme === 'ispat' && modul.ispat && (
              <div className="kart space-y-3 p-4">
                <h2 className="text-sm font-semibold text-white">{modul.ispat.baslik}</h2>
                {modul.ispat.giris && (
                  <p className="text-[13px] leading-relaxed text-slate-400">{modul.ispat.giris}</p>
                )}
                <div className="space-y-2.5">
                  {modul.ispat.satirlar.map((s, i) => (
                    <div key={i} className="rounded-lg border border-gece-500/40 bg-gece-900/60 px-3 py-2">
                      {s.tex && (
                        <div className="text-slate-100">
                          <Tex blok>{s.tex}</Tex>
                        </div>
                      )}
                      {s.not && <p className="mt-1 text-[11px] text-slate-400">{s.not}</p>}
                    </div>
                  ))}
                </div>
                {modul.ispat.sonuc && (
                  <div
                    className="rounded-xl border px-3 py-3 text-center"
                    style={{ borderColor: `${renk}55`, background: `${renk}12` }}
                  >
                    {modul.ispat.sonuc.match(/[\\{}^_]/) ? (
                      <Tex blok>{modul.ispat.sonuc}</Tex>
                    ) : (
                      <p className="text-sm text-slate-100">{modul.ispat.sonuc}</p>
                    )}
                  </div>
                )}
              </div>
            )}

            {sekme === 'sorular' && (
              <Quiz
                sorular={modul.sorular}
                onBitti={(y) => kaydet(`modul:${modul.id}`, { ilerleme: 100, puan: y })}
              />
            )}

            {sekme === 'mufredat' && (
              <div className="space-y-2">
                <p className="px-1 text-xs text-slate-400">
                  Bu modül aşağıdaki müfredat konularına bağlıdır:
                </p>
                {konular.map((k, i) => (
                  <Link
                    key={i}
                    to={`/ders/${k.ders.kod}/${k.sinif}`}
                    className="kart block p-3 transition hover:border-camgobegi/50"
                  >
                    <p className="text-[11px] text-slate-500">
                      {k.ders.ad} · {k.sinif}. Sınıf · {k.unite.ad}
                    </p>
                    <p className="text-sm font-medium text-slate-100">{k.konu.ad}</p>
                    <ul className="mt-1.5 space-y-0.5">
                      {k.konu.kazanimlar.map((kz, j) => (
                        <li key={j} className="text-[11px] leading-relaxed text-slate-400">
                          • {kz}
                        </li>
                      ))}
                    </ul>
                  </Link>
                ))}
                {konular.length === 0 && (
                  <p className="px-1 text-xs text-slate-500">Henüz bağlı konu yok.</p>
                )}
              </div>
            )}
          </div>

          {/* Adım gezinme */}
          {sekme === 'anlatim' && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setAdim((a) => Math.max(a - 1, 0))}
                disabled={adim === 0}
                className="rounded-lg border border-gece-500/60 px-3 py-2 text-xs text-slate-300 transition hover:border-camgobegi/60 disabled:opacity-30"
              >
                ← önceki
              </button>
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-gece-600">
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${((adim + 1) / modul.adimlar.length) * 100}%`, background: renk }}
                />
              </div>
              {adim < modul.adimlar.length - 1 ? (
                <button
                  type="button"
                  onClick={() => setAdim((a) => a + 1)}
                  className="rounded-lg px-3.5 py-2 text-xs font-semibold text-gece-900"
                  style={{ background: renk }}
                >
                  sonraki →
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setSekme('sorular')}
                  className="rounded-lg px-3.5 py-2 text-xs font-semibold text-gece-900"
                  style={{ background: renk }}
                >
                  soruları çöz
                </button>
              )}
            </div>
          )}
        </aside>
      </div>
    </div>
  )
}
