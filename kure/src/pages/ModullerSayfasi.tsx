import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { MODULLER } from '../lessons/registry'
import { DERSLER, sahneKonulari } from '../curriculum'
import { useIlerleme } from '../lib/ilerleme'

export function ModullerSayfasi() {
  const [ders, setDers] = useState<string>('hepsi')
  const konular = useIlerleme((s) => s.konular)

  const dersKodlari = useMemo(
    () => [...new Set(MODULLER.map((m) => m.ders))],
    [],
  )
  const liste = MODULLER.filter((m) => ders === 'hepsi' || m.ders === ders)

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs uppercase tracking-[0.2em] text-camgobegi">Etkileşimli içerik</p>
        <h1 className="text-2xl font-bold text-white">3B Ders Modülleri</h1>
        <p className="mt-1 max-w-3xl text-sm text-slate-400">
          Her modül; adım adım anlatım, döndürülebilir üç boyutlu sahne, canlı parametreler,
          ispat paneli ve ölçme sorularından oluşur. Toplam {MODULLER.length} modül.
        </p>
      </header>

      <div className="flex flex-wrap gap-1.5">
        <button
          type="button"
          onClick={() => setDers('hepsi')}
          className={`rounded-lg border px-3 py-1.5 text-xs transition ${
            ders === 'hepsi' ? 'border-camgobegi bg-camgobegi/15 text-camgobegi' : 'border-gece-500/50 text-slate-300'
          }`}
        >
          Hepsi ({MODULLER.length})
        </button>
        {dersKodlari.map((kod) => {
          const d = DERSLER.find((x) => x.kod === kod)
          const sayi = MODULLER.filter((m) => m.ders === kod).length
          const aktif = ders === kod
          return (
            <button
              key={kod}
              type="button"
              onClick={() => setDers(kod)}
              className="rounded-lg border px-3 py-1.5 text-xs transition"
              style={{
                borderColor: aktif ? d?.renk : 'rgba(120,140,180,.32)',
                background: aktif ? `${d?.renk}1f` : 'transparent',
                color: aktif ? d?.renk : '#cbd5e1',
              }}
            >
              {d?.ad ?? kod} ({sayi})
            </button>
          )
        })}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {liste.map((m) => {
          const d = DERSLER.find((x) => x.kod === m.ders)
          const durum = konular[`modul:${m.id}`]
          const bagli = sahneKonulari(m.id)
          return (
            <Link key={m.id} to={`/modul/${m.id}`} className="kart group flex flex-col p-5 transition hover:border-camgobegi/50">
              <div className="mb-2.5 flex items-center gap-2">
                <span
                  className="grid h-9 w-9 place-items-center rounded-lg text-lg"
                  style={{ background: `${d?.renk}1a`, color: d?.renk }}
                >
                  {d?.ikon}
                </span>
                <div className="leading-tight">
                  <p className="text-[11px] font-medium" style={{ color: d?.renk }}>
                    {d?.ad}
                  </p>
                  <p className="text-[11px] text-slate-500">{m.seviye}</p>
                </div>
              </div>
              <h2 className="text-sm font-semibold leading-snug text-white">{m.baslik}</h2>
              <p className="mt-1.5 flex-1 text-[12px] leading-relaxed text-slate-400">{m.altBaslik}</p>

              <div className="mt-3 flex flex-wrap gap-1">
                {m.etiketler.slice(0, 3).map((e) => (
                  <span key={e} className="rounded border border-gece-500/40 px-1.5 py-0.5 text-[10px] text-slate-500">
                    {e}
                  </span>
                ))}
              </div>

              <div className="mt-3 flex items-center justify-between border-t border-gece-500/30 pt-3 text-[11px] text-slate-500">
                <span>
                  {m.adimlar.length} adım · {m.sorular.length} soru · {bagli.length} konu
                </span>
                {durum ? <span className="text-camgobegi">%{durum.ilerleme}</span> : <span>~{m.sure} dk</span>}
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
