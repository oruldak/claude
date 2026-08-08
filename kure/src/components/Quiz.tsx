import { useState } from 'react'
import type { Soru } from '../lessons/types'

export function Quiz({
  sorular,
  renk = '#0f766e',
  onBitti,
}: {
  sorular: Soru[]
  renk?: string
  onBitti?: (yuzde: number) => void
}) {
  const [secim, setSecim] = useState<Record<number, number>>({})
  const [gonderildi, setGonderildi] = useState(false)

  const dogruSayisi = sorular.reduce((s, q, i) => s + (secim[i] === q.dogru ? 1 : 0), 0)
  const yuzde = Math.round((dogruSayisi / sorular.length) * 100)
  const eksik = sorular.length - Object.keys(secim).length

  return (
    <div className="space-y-3">
      {sorular.map((q, i) => {
        const s = secim[i]
        return (
          <div key={i} className="kart px-5 py-4">
            <p className="mb-3 text-[14.5px] font-medium leading-relaxed">
              <span className="mr-1.5 font-bold" style={{ color: renk }}>
                {i + 1}.
              </span>
              {q.soru}
            </p>
            <div className="space-y-1.5">
              {q.secenekler.map((sec, j) => {
                const secili = s === j
                const dogru = gonderildi && j === q.dogru
                const yanlis = gonderildi && secili && j !== q.dogru
                return (
                  <button
                    key={j}
                    type="button"
                    disabled={gonderildi}
                    onClick={() => setSecim((o) => ({ ...o, [i]: j }))}
                    className="flex w-full items-center gap-3 rounded-xl border px-3 py-2 text-left text-[13.5px] transition"
                    style={{
                      borderColor: dogru ? '#15803d' : yanlis ? '#be185d' : secili ? renk : '#e4ddd1',
                      background: dogru
                        ? '#15803d10'
                        : yanlis
                          ? '#be185d10'
                          : secili
                            ? `${renk}0d`
                            : '#fff',
                      color: '#4a5260',
                    }}
                  >
                    <span
                      className="grid h-5 w-5 shrink-0 place-items-center rounded-full border text-[10.5px] font-bold"
                      style={{
                        borderColor: dogru ? '#15803d' : yanlis ? '#be185d' : secili ? renk : '#d3c9b8',
                        color: dogru ? '#15803d' : yanlis ? '#be185d' : secili ? renk : '#7d8696',
                      }}
                    >
                      {'ABCD'[j]}
                    </span>
                    {sec}
                  </button>
                )
              })}
            </div>
            {gonderildi && (
              <p className="mt-3 rounded-xl bg-kagit-2/70 px-3.5 py-2.5 text-[12.5px] leading-relaxed text-murekkep-2">
                <span className="font-semibold">Neden: </span>
                {q.aciklama}
              </p>
            )}
          </div>
        )
      })}

      {!gonderildi ? (
        <button
          type="button"
          disabled={eksik > 0}
          onClick={() => {
            setGonderildi(true)
            onBitti?.(yuzde)
          }}
          className="w-full rounded-2xl px-4 py-3 text-[13.5px] font-semibold text-white transition disabled:cursor-not-allowed disabled:bg-cizgi-2"
          style={eksik === 0 ? { background: renk } : undefined}
        >
          {eksik > 0 ? `${eksik} soru daha yanıtla` : 'cevapları kontrol et'}
        </button>
      ) : (
        <div className="kart flex items-center justify-between px-5 py-4">
          <div>
            <p className="text-[12.5px] text-murekkep-3">
              {dogruSayisi} / {sorular.length} doğru
            </p>
            <p
              className="text-[26px] font-bold leading-tight"
              style={{ color: yuzde >= 75 ? '#15803d' : yuzde >= 50 ? '#b45309' : '#be185d' }}
            >
              %{yuzde}
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setSecim({})
              setGonderildi(false)
            }}
            className="rounded-xl border border-cizgi px-3.5 py-2 text-[12.5px] font-semibold text-murekkep-2 hover:border-murekkep-3"
          >
            tekrar dene
          </button>
        </div>
      )}
    </div>
  )
}
