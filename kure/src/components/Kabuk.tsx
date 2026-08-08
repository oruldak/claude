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
    document.title = `Küre · ${okul.kisaAd}`
  }, [okul.kisaAd])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [konum.pathname])

  const bag = ({ isActive }: { isActive: boolean }) =>
    `relative rounded-lg px-3 py-2 text-[13.5px] font-medium transition ${
      isActive
        ? 'bg-kagit-2 text-murekkep'
        : 'text-murekkep-2 hover:bg-kagit-2/70 hover:text-murekkep'
    }`

  return (
    <div className="flex min-h-full flex-col">
      <header className="sticky top-0 z-30 border-b border-cizgi bg-white/88 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1440px] flex-wrap items-center gap-3 px-5 py-3">
          <Link to="/" className="flex items-center gap-2.5">
            <span
              className="grid h-9 w-9 place-items-center rounded-[11px] text-[15px] font-black text-white shadow-sm"
              style={{ background: `linear-gradient(140deg, ${okul.vurgu}, #4338ca)` }}
            >
              K
            </span>
            <span className="leading-tight">
              <span className="block text-[15px] font-bold tracking-tight">Küre</span>
              <span className="block text-[11px] text-murekkep-3">{okul.ad}</span>
            </span>
          </Link>

          <nav className="ml-3 flex flex-wrap items-center gap-0.5">
            {KADEMELER.filter((k) => okul.kademeler.includes(k)).map((k) => (
              <NavLink key={k} to={`/kademe/${k}`} className={bag}>
                {KADEME_ADI[k]}
              </NavLink>
            ))}
            <NavLink to="/moduller" className={bag}>
              3B Dersler
            </NavLink>
            <NavLink to="/odevler" className={bag}>
              Ödevler
            </NavLink>
            <NavLink to="/panel" className={bag}>
              Panel
            </NavLink>
          </nav>

          <form
            className="ml-auto flex items-center gap-3"
            onSubmit={(e) => {
              e.preventDefault()
              if (sorgu.trim().length > 1) nav(`/ara?q=${encodeURIComponent(sorgu.trim())}`)
            }}
          >
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-murekkep-3">
                ⌕
              </span>
              <input
                value={sorgu}
                onChange={(e) => setSorgu(e.target.value)}
                placeholder="konu ya da kazanım ara"
                className="w-60 rounded-xl border border-cizgi bg-kagit/60 py-2 pl-8 pr-3 text-[13px] outline-none transition placeholder:text-murekkep-3 focus:border-murekkep-3/60 focus:bg-white"
              />
            </div>
            {ogrenci && (
              <span className="hidden items-center gap-2 text-[12.5px] text-murekkep-2 sm:flex">
                <span className="grid h-7 w-7 place-items-center rounded-full bg-kagit-2 text-[11px] font-bold">
                  {ogrenci.slice(0, 2).toLocaleUpperCase('tr')}
                </span>
                {ogrenci}
              </span>
            )}
          </form>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1440px] flex-1 px-5 py-7">
        <Outlet />
      </main>

      <footer className="border-t border-cizgi px-5 py-6">
        <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-3 text-[12px] text-murekkep-3">
          <span>
            Küre · MEB Türkiye Yüzyılı Maarif Modeli müfredat yapısına göre düzenlenmiştir
          </span>
          <span>Gök cismi dokuları NASA görüntülerinden türetilmiştir</span>
        </div>
      </footer>
    </div>
  )
}
