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
        <p className="etiket-kucuk text-murekkep-3">Kademe</p>
        <h1 className="mt-1 text-[30px] font-bold tracking-tight">{KADEME_ADI[k]}</h1>
        <p className="okuma mt-1">
          {KADEME_SINIFLARI[k].join('., ')}. sınıflar · {dersler.length} ders
        </p>
      </header>

      <div className="space-y-4">
        {dersler.map((d) => {
          const siniflar = dersSiniflari(d, k)
          return (
            <section key={d.kod} className="kart overflow-hidden">
              <div className="flex items-start gap-4 border-b border-cizgi px-5 py-4">
                <span
                  className="grid h-12 w-12 shrink-0 place-items-center rounded-xl text-[22px]"
                  style={{ background: `${d.renk}12`, color: d.renk }}
                >
                  {d.ikon}
                </span>
                <div className="min-w-0">
                  <h2 className="text-[17px] font-bold">{d.ad}</h2>
                  <p className="okuma mt-0.5 max-w-3xl text-[13.5px]">{d.ozet}</p>
                </div>
              </div>

              <div className="grid gap-2 p-4 sm:grid-cols-2 lg:grid-cols-4">
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
                      className="kart kart-tik hover:kart-tik-hover px-4 py-3"
                    >
                      <p className="text-[15px] font-bold">{s}. Sınıf</p>
                      <p className="mt-0.5 text-[11.5px] text-murekkep-3">
                        {sp?.uniteler.length ?? 0} ünite · {konuSayisi} konu
                      </p>
                      {modulSayisi > 0 && (
                        <p className="mt-1.5 text-[11.5px] font-semibold" style={{ color: d.renk }}>
                          {modulSayisi} konuda 3B ders
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
