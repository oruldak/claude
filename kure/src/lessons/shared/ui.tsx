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
    <div className="flex flex-wrap items-center gap-x-6 gap-y-3 rounded-2xl border border-cizgi bg-yuzey px-4 py-3 shadow-[0_1px_2px_rgba(25,29,36,.04)]">
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
  renk = '#0f766e',
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
    <label className="flex flex-col gap-1.5 text-xs text-murekkep-2">
      <span className="flex items-center justify-between gap-3">
        <span className="font-medium">{etiket}</span>
        <span className="font-mono text-[12px] font-semibold tabular-nums" style={{ color: renk }}>
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
        className={`${genislik} cursor-pointer`}
        style={{ ['--kure-vurgu' as string]: renk }}
      />
    </label>
  )
}

export function Dugme({
  children,
  onClick,
  aktif = false,
  renk = '#0f766e',
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
      className={`rounded-lg border font-semibold transition ${
        boyut === 'sm' ? 'px-2.5 py-1.5 text-[11.5px]' : 'px-3.5 py-2 text-xs'
      }`}
      style={{
        borderColor: aktif ? renk : '#ddd5c8',
        background: aktif ? renk : '#fff',
        color: aktif ? '#fff' : '#4a5260',
        boxShadow: aktif ? `0 2px 8px -2px ${renk}88` : '0 1px 2px rgba(25,29,36,.05)',
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
  renk = '#4338ca',
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
      className="flex items-center gap-2 text-xs font-medium text-murekkep-2"
    >
      <span
        className="relative h-[18px] w-[32px] rounded-full transition"
        style={{ background: deger ? renk : '#d3c9b8' }}
      >
        <span
          className="absolute top-[3px] h-3 w-3 rounded-full bg-white shadow transition-all"
          style={{ left: deger ? 17 : 3 }}
        />
      </span>
      {etiket}
    </button>
  )
}

export function Rozet({ children, renk = '#0f766e' }: { children: ReactNode; renk?: string }) {
  return (
    <span
      className="etiket-kucuk rounded-full px-2.5 py-1"
      style={{ background: `${renk}14`, color: renk }}
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

/** Sahne üstünde duran ölçüm paneli — gerçek bir ölçüm cihazı gibi. */
export function Gosterge({
  satirlar,
  konum = 'sol-ust',
  baslik = 'ölçümler',
}: {
  satirlar: { ad: ReactNode; deger: ReactNode; renk?: string }[]
  konum?: 'sol-ust' | 'sag-ust'
  baslik?: string
}) {
  return (
    <div
      className={`pointer-events-none absolute top-3 ${
        konum === 'sol-ust' ? 'left-3' : 'right-3'
      } min-w-[204px] overflow-hidden rounded-xl border border-cizgi bg-white/92 shadow-[0_6px_24px_-12px_rgba(25,29,36,.4)] backdrop-blur`}
    >
      <div className="etiket-kucuk border-b border-cizgi bg-kagit-2/70 px-3 py-1.5 text-murekkep-3">
        {baslik}
      </div>
      <div className="space-y-1 px-3 py-2 text-[11.5px]">
        {satirlar.map((s, i) => (
          <div key={i} className="flex items-center justify-between gap-5">
            <span className="text-murekkep-3">{s.ad}</span>
            <span className="font-mono font-semibold tabular-nums" style={{ color: s.renk ?? '#191d24' }}>
              {s.deger}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
