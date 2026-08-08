import { Link, Navigate, useParams } from 'react-router-dom'
import { dersSiniflari, kademeDersleri, sinifProgrami } from '../curriculum'
import { KADEME_ADI, KADEME_SINIFLARI, type Kademe } from '../lib/types'
import { modulVarMi } from '../lessons/registry'

export function KademeSayfasi() {
  const { kademe } = useParams()
  if (!kademe || !(kademe in KADEME_ADI)) return <Navigate to="/" replace />
  const k = kademe as Kademe
  const dersler = kademeDersleri(k)

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs uppercase tracking-[0.2em] text-camgobegi">Kademe</p>
        <h1 className="text-2xl font-bold text-white">{KADEME_ADI[k]}</h1>
        <p className="mt-1 text-sm text-slate-400">
          {KADEME_SINIFLARI[k].join('., ')}. sınıflar · {dersler.length} ders
        </p>
      </header>

      <div className="space-y-4">
        {dersler.map((d) => {
          const siniflar = dersSiniflari(d, k)
          return (
            <section key={d.kod} className="kart p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <span
                    className="grid h-11 w-11 shrink-0 place-items-center rounded-xl text-xl"
                    style={{ background: `${d.renk}1a`, color: d.renk }}
                  >
                    {d.ikon}
                  </span>
                  <div>
                    <h2 className="text-base font-semibold text-white">{d.ad}</h2>
                    <p className="mt-0.5 max-w-2xl text-[13px] leading-relaxed text-slate-400">{d.ozet}</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                {siniflar.map((s) => {
                  const sp = sinifProgrami(d, s)
                  const konuSayisi = sp?.uniteler.reduce((a, u) => a + u.konular.length, 0) ?? 0
                  const modulSayisi =
                    sp?.uniteler.reduce(
                      (a, u) => a + u.konular.filter((kk) => modulVarMi(kk.sahne)).length,
                      0,
                    ) ?? 0
                  return (
                    <Link
                      key={s}
                      to={`/ders/${d.kod}/${s}`}
                      className="rounded-xl border border-gece-500/50 bg-gece-900/50 px-4 py-3 transition hover:border-camgobegi/50"
                    >
                      <p className="text-sm font-semibold text-white">{s}. Sınıf</p>
                      <p className="mt-0.5 text-[11px] text-slate-500">
                        {sp?.uniteler.length ?? 0} ünite · {konuSayisi} konu
                      </p>
                      {modulSayisi > 0 && (
                        <p className="mt-1 text-[11px] font-medium" style={{ color: d.renk }}>
                          {modulSayisi} adet 3B modül
                        </p>
                      )}
                    </Link>
                  )
                })}
              </div>
            </section>
          )
        })}
      </div>
    </div>
  )
}
