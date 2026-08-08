import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import type { DersModulu } from '../lessons/types'
import { Tex } from '../lessons/shared/ui'
import { Quiz } from './Quiz'
import { dersBul, sahneKonulari } from '../curriculum'
import { useIlerleme } from '../lib/ilerleme'

type Sekme = 'anlatim' | 'ispat' | 'sorular' | 'mufredat'

const SEKME_ADI: [Sekme, string][] = [
  ['anlatim', 'Anlatım'],
  ['ispat', 'İspat'],
  ['sorular', 'Sorular'],
  ['mufredat', 'Müfredat'],
]

export function DersOynatici({ modul }: { modul: DersModulu }) {
  const [adim, setAdim] = useState(0)
  const [sekme, setSekme] = useState<Sekme>('anlatim')
  const kaydet = useIlerleme((s) => s.kaydet)
  const sahneAc = useIlerleme((s) => s.sahneAc)

  const ders = dersBul(modul.ders)
  const renk = ders?.renk ?? '#0f766e'
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
      if (e.target instanceof HTMLInputElement) return
      if (e.key === 'ArrowRight') setAdim((a) => Math.min(a + 1, modul.adimlar.length - 1))
      if (e.key === 'ArrowLeft') setAdim((a) => Math.max(a - 1, 0))
    }
    window.addEventListener('keydown', el)
    return () => window.removeEventListener('keydown', el)
  }, [modul.adimlar.length])

  const su = modul.adimlar[adim]
  const sonAdim = adim === modul.adimlar.length - 1

  return (
    <div className="space-y-4">
      {/* Başlık */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          <div className="mb-1.5 flex flex-wrap items-center gap-2 text-[12px]">
            <Link to="/moduller" className="text-murekkep-3 hover:text-murekkep">
              ← 3B dersler
            </Link>
            <span className="etiket-kucuk rounded-full px-2.5 py-1" style={{ background: `${renk}14`, color: renk }}>
              {ders?.ad ?? modul.ders}
            </span>
            <span className="text-murekkep-3">
              {modul.seviye} · yaklaşık {modul.sure} dakika
            </span>
          </div>
          <h1 className="text-[26px] font-bold leading-tight tracking-tight sm:text-[30px]">
            {modul.baslik}
          </h1>
          <p className="okuma mt-1 max-w-2xl">{modul.altBaslik}</p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {modul.etiketler.map((e) => (
            <span key={e} className="rounded-md border border-cizgi px-2 py-1 text-[11px] text-murekkep-3">
              {e}
            </span>
          ))}
        </div>
      </div>

      {/* Sahne + defter */}
      <div className="grid gap-4 lg:grid-cols-[1fr_418px]">
        <div className="h-[62vh] min-h-[460px] lg:h-[calc(100vh-232px)]">
          <Sahne adim={adim} />
        </div>

        <aside className="flex flex-col gap-3 lg:h-[calc(100vh-232px)]">
          <div className="flex gap-1 rounded-2xl border border-cizgi bg-white p-1">
            {SEKME_ADI.map(([k, ad]) => (
              <button
                key={k}
                type="button"
                onClick={() => setSekme(k)}
                disabled={k === 'ispat' && !modul.ispat}
                className="flex-1 rounded-xl px-2 py-2 text-[12.5px] font-semibold transition disabled:opacity-30"
                style={
                  sekme === k
                    ? { background: renk, color: '#fff' }
                    : { color: '#4a5260' }
                }
              >
                {ad}
              </button>
            ))}
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto pr-1">
            {sekme === 'anlatim' && (
              <div className="space-y-3">
                <article className="kart belir px-5 py-5" key={adim}>
                  <p className="etiket-kucuk mb-2" style={{ color: renk }}>
                    {adim + 1}. adım / {modul.adimlar.length}
                  </p>
                  <h2 className="text-[19px] font-bold leading-snug tracking-tight">{su.baslik}</h2>
                  <p className="okuma mt-2.5">{su.metin}</p>
                </article>

                <ol className="space-y-1">
                  {modul.adimlar.map((a, i) => {
                    const aktif = i === adim
                    return (
                      <li key={i}>
                        <button
                          type="button"
                          onClick={() => setAdim(i)}
                          className="flex w-full items-start gap-3 rounded-xl border px-3.5 py-2.5 text-left text-[13px] transition"
                          style={{
                            borderColor: aktif ? `${renk}66` : '#e4ddd1',
                            background: aktif ? `${renk}0d` : '#fff',
                            color: aktif ? '#191d24' : '#4a5260',
                          }}
                        >
                          <span
                            className="mt-px grid h-5 w-5 shrink-0 place-items-center rounded-full text-[10.5px] font-bold"
                            style={{
                              background: i <= adim ? renk : '#efeae1',
                              color: i <= adim ? '#fff' : '#7d8696',
                            }}
                          >
                            {i + 1}
                          </span>
                          <span className="leading-snug">{a.baslik}</span>
                        </button>
                      </li>
                    )
                  })}
                </ol>
              </div>
            )}

            {sekme === 'ispat' && modul.ispat && (
              <div className="kart space-y-3 px-5 py-5">
                <div>
                  <p className="etiket-kucuk" style={{ color: renk }}>
                    ispat
                  </p>
                  <h2 className="mt-1 text-[18px] font-bold leading-snug tracking-tight">
                    {modul.ispat.baslik}
                  </h2>
                </div>
                {modul.ispat.giris && <p className="okuma">{modul.ispat.giris}</p>}
                <ol className="space-y-2.5">
                  {modul.ispat.satirlar.map((s, i) => (
                    <li key={i} className="rounded-xl border border-cizgi bg-kagit/60 px-3.5 py-2.5">
                      {s.tex && (
                        <div className="overflow-x-auto">
                          <Tex blok>{s.tex}</Tex>
                        </div>
                      )}
                      {s.not && <p className="mt-1 text-[12px] text-murekkep-3">{s.not}</p>}
                    </li>
                  ))}
                </ol>
                {modul.ispat.sonuc && (
                  <div
                    className="rounded-2xl px-4 py-3.5 text-center"
                    style={{ background: `${renk}0f`, border: `1px solid ${renk}44` }}
                  >
                    <p className="etiket-kucuk mb-1" style={{ color: renk }}>
                      sonuç
                    </p>
                    {/\\[a-zA-Z]|[_^{}]/.test(modul.ispat.sonuc) ? (
                      <Tex blok>{modul.ispat.sonuc}</Tex>
                    ) : (
                      <p className="text-[14.5px] font-medium">{modul.ispat.sonuc}</p>
                    )}
                  </div>
                )}
              </div>
            )}

            {sekme === 'sorular' && (
              <Quiz
                sorular={modul.sorular}
                renk={renk}
                onBitti={(y) => kaydet(`modul:${modul.id}`, { ilerleme: 100, puan: y })}
              />
            )}

            {sekme === 'mufredat' && (
              <div className="space-y-2">
                <p className="px-1 text-[12.5px] text-murekkep-3">
                  Bu ders aşağıdaki müfredat konularına bağlıdır:
                </p>
                {konular.map((k, i) => (
                  <Link
                    key={i}
                    to={`/ders/${k.ders.kod}/${k.sinif}`}
                    className="kart kart-tik hover:kart-tik-hover block px-4 py-3.5"
                  >
                    <p className="text-[11.5px] text-murekkep-3">
                      {k.ders.ad} · {k.sinif}. Sınıf · {k.unite.ad}
                    </p>
                    <p className="mt-0.5 text-[14.5px] font-semibold">{k.konu.ad}</p>
                    <ul className="mt-1.5 space-y-1">
                      {k.konu.kazanimlar.map((kz, j) => (
                        <li key={j} className="text-[12.5px] leading-relaxed text-murekkep-2">
                          • {kz}
                        </li>
                      ))}
                    </ul>
                  </Link>
                ))}
                {konular.length === 0 && (
                  <p className="px-1 text-[12.5px] text-murekkep-3">Henüz bağlı konu yok.</p>
                )}
              </div>
            )}
          </div>

          {sekme === 'anlatim' && (
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => setAdim((a) => Math.max(a - 1, 0))}
                disabled={adim === 0}
                className="rounded-xl border border-cizgi bg-white px-3.5 py-2.5 text-[12.5px] font-semibold text-murekkep-2 transition hover:border-murekkep-3 disabled:opacity-35"
              >
                ← önceki
              </button>
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-kagit-2">
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${((adim + 1) / modul.adimlar.length) * 100}%`, background: renk }}
                />
              </div>
              <button
                type="button"
                onClick={() => (sonAdim ? setSekme('sorular') : setAdim((a) => a + 1))}
                className="rounded-xl px-4 py-2.5 text-[12.5px] font-semibold text-white"
                style={{ background: renk }}
              >
                {sonAdim ? 'soruları çöz' : 'sonraki →'}
              </button>
            </div>
          )}
        </aside>
      </div>
    </div>
  )
}
