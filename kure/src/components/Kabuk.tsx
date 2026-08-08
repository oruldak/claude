import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { KADEME_ADI, type Kademe } from '../lib/types'
import { okuluYukle } from '../lib/okul'
import { useIlerleme } from '../lib/ilerleme'

const KADEMELER: Kademe[] = ['ilkokul', 'ortaokul', 'lise']

export function Kabuk() {
  const okul = okuluYukle()
  const nav = useNavigate()
  const konum = useLocation()
  const [sorgu, setSorgu] = useState('')
  const ogrenci = useIlerleme((s) => s.ogrenci)

  useEffect(() => {
    document.title = `Küre — ${okul.kisaAd} 3B Öğrenme Platformu`
  }, [okul.kisaAd])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [konum.pathname])

  const bag = ({ isActive }: { isActive: boolean }) =>
    `rounded-lg px-3 py-1.5 text-sm transition ${
      isActive ? 'bg-gece-600/70 text-white' : 'text-slate-300 hover:bg-gece-700/60 hover:text-white'
    }`

  return (
    <div className="flex min-h-full flex-col">
      <header className="sticky top-0 z-30 border-b border-gece-600/60 bg-gece-900/85 backdrop-blur">
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-center gap-3 px-4 py-3">
          <Link to="/" className="flex items-center gap-2.5">
            <span
              className="grid h-9 w-9 place-items-center rounded-xl text-lg font-black text-gece-900"
              style={{ background: `linear-gradient(140deg, ${okul.vurgu}, #8b7dff)` }}
            >
              K
            </span>
            <span className="leading-tight">
              <span className="block text-[15px] font-semibold tracking-tight text-white">Küre</span>
              <span className="block text-[11px] text-slate-400">{okul.ad}</span>
            </span>
          </Link>

          <nav className="ml-2 flex flex-wrap items-center gap-1">
            {KADEMELER.filter((k) => okul.kademeler.includes(k)).map((k) => (
              <NavLink key={k} to={`/kademe/${k}`} className={bag}>
                {KADEME_ADI[k]}
              </NavLink>
            ))}
            <NavLink to="/moduller" className={bag}>
              3B Modüller
            </NavLink>
            <NavLink to="/panel" className={bag}>
              Panel
            </NavLink>
          </nav>

          <form
            className="ml-auto flex items-center gap-2"
            onSubmit={(e) => {
              e.preventDefault()
              if (sorgu.trim().length > 1) nav(`/ara?q=${encodeURIComponent(sorgu.trim())}`)
            }}
          >
            <input
              value={sorgu}
              onChange={(e) => setSorgu(e.target.value)}
              placeholder="konu, kazanım veya ders ara…"
              className="w-56 rounded-lg border border-gece-500/60 bg-gece-800/80 px-3 py-1.5 text-sm text-slate-200 outline-none placeholder:text-slate-500 focus:border-camgobegi/60"
            />
            {ogrenci && <span className="hidden text-xs text-slate-400 sm:block">{ogrenci}</span>}
          </form>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1400px] flex-1 px-4 py-6">
        <Outlet />
      </main>

      <footer className="border-t border-gece-600/60 px-4 py-5 text-center text-xs text-slate-500">
        Küre · MEB Türkiye Yüzyılı Maarif Modeli müfredatına göre yapılandırılmıştır ·
        içerikler öğretmen onayıyla güncellenebilir
      </footer>
    </div>
  )
}
