import katex from 'katex'
import { useMemo, type ReactNode } from 'react'

/* ------------------------------- Formül ------------------------------- */

export function Tex({ children, blok = false }: { children: string; blok?: boolean }) {
  const html = useMemo(() => {
    try {
      return katex.renderToString(children, {
        displayMode: blok,
        throwOnError: false,
        output: 'html',
      })
    } catch {
      return children
    }
  }, [children, blok])
  return (
    <span
      className={blok ? 'block overflow-x-auto py-1' : 'inline-block align-middle'}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}

/* ------------------------------ Kontroller ---------------------------- */

export function KontrolCubugu({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-3 rounded-2xl border border-gece-500/50 bg-gece-800/70 px-4 py-3">
      {children}
    </div>
  )
}

export function Kaydirac({
  etiket,
  deger,
  min,
  max,
  adim = 0.01,
  onChange,
  birim = '',
  basamak = 2,
  renk = '#38e1c6',
  genislik = 'w-40',
}: {
  etiket: ReactNode
  deger: number
  min: number
  max: number
  adim?: number
  onChange: (v: number) => void
  birim?: string
  basamak?: number
  renk?: string
  genislik?: string
}) {
  return (
    <label className="flex flex-col gap-1 text-xs text-slate-300">
      <span className="flex items-center justify-between gap-3">
        <span>{etiket}</span>
        <span className="font-mono tabular-nums" style={{ color: renk }}>
          {deger.toFixed(basamak)}
          {birim}
        </span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={adim}
        value={deger}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className={`${genislik} h-1.5 cursor-pointer appearance-none rounded-full bg-gece-600 accent-[var(--kure-vurgu)]`}
        style={{ ['--kure-vurgu' as string]: renk }}
      />
    </label>
  )
}

export function Dugme({
  children,
  onClick,
  aktif = false,
  renk = '#38e1c6',
  boyut = 'md',
  baslik,
}: {
  children: ReactNode
  onClick: () => void
  aktif?: boolean
  renk?: string
  boyut?: 'sm' | 'md'
  baslik?: string
}) {
  return (
    <button
      type="button"
      title={baslik}
      onClick={onClick}
      className={`rounded-lg border font-medium transition ${
        boyut === 'sm' ? 'px-2.5 py-1 text-[11px]' : 'px-3.5 py-1.5 text-xs'
      }`}
      style={{
        borderColor: aktif ? renk : 'rgba(120,140,180,.32)',
        background: aktif ? `${renk}22` : 'rgba(15,22,40,.7)',
        color: aktif ? renk : '#cbd5e1',
      }}
    >
      {children}
    </button>
  )
}

export function Anahtar({
  etiket,
  deger,
  onChange,
  renk = '#8b7dff',
}: {
  etiket: ReactNode
  deger: boolean
  onChange: (v: boolean) => void
  renk?: string
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!deger)}
      className="flex items-center gap-2 text-xs text-slate-300"
    >
      <span
        className="relative h-4 w-8 rounded-full transition"
        style={{ background: deger ? renk : '#26324f' }}
      >
        <span
          className="absolute top-0.5 h-3 w-3 rounded-full bg-white transition-all"
          style={{ left: deger ? 18 : 3 }}
        />
      </span>
      {etiket}
    </button>
  )
}

export function Rozet({
  children,
  renk = '#38e1c6',
}: {
  children: ReactNode
  renk?: string
}) {
  return (
    <span
      className="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
      style={{ background: `${renk}1f`, color: renk, border: `1px solid ${renk}44` }}
    >
      {children}
    </span>
  )
}

/** Ders modüllerinin ortak yerleşimi: üstte sahne, altta kontrol çubuğu. */
export function Duzen({
  sahne,
  kontrol,
  gosterge,
}: {
  sahne: ReactNode
  kontrol?: ReactNode
  gosterge?: ReactNode
}) {
  return (
    <div className="flex h-full min-h-0 flex-col gap-3">
      <div className="relative min-h-0 flex-1">
        {sahne}
        {gosterge}
      </div>
      {kontrol ? <KontrolCubugu>{kontrol}</KontrolCubugu> : null}
    </div>
  )
}

/** Sahne üstünde duran küçük bilgi kutusu (ölçüm göstergesi). */
export function Gosterge({
  satirlar,
  konum = 'sol-ust',
}: {
  satirlar: { ad: ReactNode; deger: ReactNode; renk?: string }[]
  konum?: 'sol-ust' | 'sag-ust'
}) {
  return (
    <div
      className={`pointer-events-none absolute top-3 ${
        konum === 'sol-ust' ? 'left-3' : 'right-3'
      } space-y-1 rounded-xl border border-gece-500/60 bg-gece-900/85 px-3 py-2 text-[11px] backdrop-blur`}
    >
      {satirlar.map((s, i) => (
        <div key={i} className="flex items-center justify-between gap-4">
          <span className="text-slate-400">{s.ad}</span>
          <span className="font-mono tabular-nums" style={{ color: s.renk ?? '#e6ecf7' }}>
            {s.deger}
          </span>
        </div>
      ))}
    </div>
  )
}
