import { Link } from 'react-router-dom'
import { DERSLER, istatistikler, kademeDersleri } from '../curriculum'
import { KADEME_ADI, KADEME_SINIFLARI, type Kademe } from '../lib/types'
import { MODULLER, modulBul } from '../lessons/registry'
import { okuluYukle } from '../lib/okul'
import { useIlerleme } from '../lib/ilerleme'

const KADEME_ACIKLAMA: Record<Kademe, string> = {
  ilkokul: 'Somut modeller, oyunlaştırılmış keşif ve elle tutulur üç boyutlu nesneler.',
  ortaokul: 'Deney düzenekleri, sistem modelleri ve kavram haritalarıyla derinleşme.',
  lise: 'İspatlar, türetimler ve sınav odaklı analiz — ama ezber değil, gerekçesiyle.',
}

export function AnaSayfa() {
  const okul = okuluYukle()
  const ist = istatistikler()
  const sonSahneler = useIlerleme((s) => s.sonSahneler)
  const konular = useIlerleme((s) => s.konular)

  const oneCikan = ['turev', 'kalp', 'egik-atis', 'dna', 'molekul-geometri', 'mevsimler']
    .map((id) => modulBul(id))
    .filter(Boolean)

  return (
    <div className="space-y-10">
      {/* Hero */}
      <section className="cam relative overflow-hidden rounded-3xl px-6 py-10 sm:px-10 sm:py-14">
        <div
          className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full blur-3xl"
          style={{ background: `${okul.vurgu}22` }}
        />
        <div
          className="pointer-events-none absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-mor/10 blur-3xl"
        />
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-camgobegi">
          {okul.ad}
        </p>
        <h1 className="max-w-3xl text-3xl font-black leading-tight tracking-tight text-white sm:text-5xl">
          Ezberlemeden öğren:
          <span className="text-camgobegi"> gör, döndür, dene, ispatla.</span>
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-base">
          Küre; ilkokul, ortaokul ve lise müfredatını üç boyutlu ve animasyonlu ders
          modülleriyle anlatan bir öğrenme platformudur. Her konu, kendi grafiği,
          deney düzeneği ve ispatıyla birlikte gelir. Öğrenci kaydırır, döndürür,
          değiştirir; sonucu anında görür.
        </p>

        <div className="mt-7 flex flex-wrap gap-3">
          {(['ilkokul', 'ortaokul', 'lise'] as Kademe[])
            .filter((k) => okul.kademeler.includes(k))
            .map((k) => (
              <Link
                key={k}
                to={`/kademe/${k}`}
                className="rounded-xl border border-camgobegi/40 bg-camgobegi/10 px-4 py-2.5 text-sm font-semibold text-camgobegi transition hover:bg-camgobegi/20"
              >
                {KADEME_ADI[k]} →
              </Link>
            ))}
          <Link
            to="/moduller"
            className="rounded-xl border border-gece-500/60 px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:border-mor/60 hover:text-white"
          >
            3B modülleri gez
          </Link>
        </div>

        <dl className="mt-9 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            ['Ders', ist.ders],
            ['Konu başlığı', ist.konu],
            ['Kazanım', ist.kazanim],
            ['3B ders modülü', MODULLER.length],
          ].map(([ad, deger]) => (
            <div key={ad as string} className="rounded-2xl border border-gece-500/40 bg-gece-900/50 px-4 py-3">
              <dt className="text-[11px] uppercase tracking-wider text-slate-500">{ad}</dt>
              <dd className="text-2xl font-bold text-white">{deger as number}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Kademeler */}
      <section>
        <h2 className="mb-4 text-lg font-bold text-white">Kademeler</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {(['ilkokul', 'ortaokul', 'lise'] as Kademe[]).map((k) => {
            const dersler = kademeDersleri(k)
            return (
              <Link key={k} to={`/kademe/${k}`} className="kart group p-5 transition hover:border-camgobegi/50">
                <div className="mb-2 flex items-baseline justify-between">
                  <h3 className="text-base font-semibold text-white">{KADEME_ADI[k]}</h3>
                  <span className="text-xs text-slate-500">
                    {KADEME_SINIFLARI[k][0]}–{KADEME_SINIFLARI[k].at(-1)}. sınıf
                  </span>
                </div>
                <p className="text-[13px] leading-relaxed text-slate-400">{KADEME_ACIKLAMA[k]}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {dersler.slice(0, 6).map((d) => (
                    <span
                      key={d.kod}
                      className="rounded-md px-2 py-0.5 text-[11px]"
                      style={{ background: `${d.renk}15`, color: d.renk }}
                    >
                      {d.ad}
                    </span>
                  ))}
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* Öne çıkan modüller */}
      <section>
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="text-lg font-bold text-white">Öne çıkan 3B modüller</h2>
          <Link to="/moduller" className="text-xs text-camgobegi hover:underline">
            tümü ({MODULLER.length})
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {oneCikan.map((m) => {
            const ders = DERSLER.find((d) => d.kod === m!.ders)
            const durum = konular[`modul:${m!.id}`]
            return (
              <Link key={m!.id} to={`/modul/${m!.id}`} className="kart group flex flex-col p-5 transition hover:border-camgobegi/50">
                <div className="mb-2 flex items-center gap-2">
                  <span
                    className="grid h-8 w-8 place-items-center rounded-lg text-base"
                    style={{ background: `${ders?.renk}1a`, color: ders?.renk }}
                  >
                    {ders?.ikon}
                  </span>
                  <div className="leading-tight">
                    <p className="text-[11px] text-slate-500">
                      {ders?.ad} · {m!.seviye}
                    </p>
                  </div>
                </div>
                <h3 className="text-sm font-semibold text-white">{m!.baslik}</h3>
                <p className="mt-1.5 flex-1 text-[12px] leading-relaxed text-slate-400">{m!.altBaslik}</p>
                <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500">
                  <span>{m!.adimlar.length} adım · {m!.sorular.length} soru</span>
                  {durum ? (
                    <span className="text-camgobegi">%{durum.ilerleme} tamamlandı</span>
                  ) : (
                    <span>~{m!.sure} dk</span>
                  )}
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* Son kaldığın yer */}
      {sonSahneler.length > 0 && (
        <section>
          <h2 className="mb-4 text-lg font-bold text-white">Son çalıştıkların</h2>
          <div className="flex flex-wrap gap-2">
            {sonSahneler.map((id) => {
              const m = modulBul(id)
              if (!m) return null
              return (
                <Link
                  key={id}
                  to={`/modul/${id}`}
                  className="rounded-lg border border-gece-500/50 bg-gece-800/60 px-3 py-2 text-xs text-slate-300 transition hover:border-camgobegi/50 hover:text-white"
                >
                  {m.baslik}
                </Link>
              )
            })}
          </div>
        </section>
      )}
    </div>
  )
}
