import { useState } from 'react'
import type { Soru } from '../lessons/types'

export function Quiz({
  sorular,
  onBitti,
}: {
  sorular: Soru[]
  onBitti?: (yuzde: number) => void
}) {
  const [secim, setSecim] = useState<Record<number, number>>({})
  const [gonderildi, setGonderildi] = useState(false)

  const dogruSayisi = sorular.reduce((s, q, i) => s + (secim[i] === q.dogru ? 1 : 0), 0)
  const yuzde = Math.round((dogruSayisi / sorular.length) * 100)

  return (
    <div className="space-y-4">
      {sorular.map((q, i) => {
        const s = secim[i]
        return (
          <div key={i} className="kart p-4">
            <p className="mb-3 text-sm font-medium text-slate-100">
              <span className="mr-2 text-camgobegi">{i + 1}.</span>
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
                    className={`flex w-full items-center gap-2.5 rounded-lg border px-3 py-2 text-left text-sm transition ${
                      dogru
                        ? 'border-emerald-400/60 bg-emerald-400/10 text-emerald-200'
                        : yanlis
                          ? 'border-rose-400/60 bg-rose-400/10 text-rose-200'
                          : secili
                            ? 'border-camgobegi/60 bg-camgobegi/10 text-slate-100'
                            : 'border-gece-500/50 bg-gece-800/60 text-slate-300 hover:border-gece-500'
                    }`}
                  >
                    <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full border border-current text-[10px]">
                      {'ABCD'[j]}
                    </span>
                    {sec}
                  </button>
                )
              })}
            </div>
            {gonderildi && (
              <p className="mt-3 rounded-lg bg-gece-700/60 px-3 py-2 text-xs leading-relaxed text-slate-300">
                <span className="font-semibold text-camgobegi">Açıklama: </span>
                {q.aciklama}
              </p>
            )}
          </div>
        )
      })}

      {!gonderildi ? (
        <button
          type="button"
          disabled={Object.keys(secim).length < sorular.length}
          onClick={() => {
            setGonderildi(true)
            onBitti?.(yuzde)
          }}
          className="w-full rounded-xl bg-camgobegi/90 px-4 py-2.5 text-sm font-semibold text-gece-900 transition hover:bg-camgobegi disabled:cursor-not-allowed disabled:bg-gece-600 disabled:text-slate-400"
        >
          {Object.keys(secim).length < sorular.length
            ? `${sorular.length - Object.keys(secim).length} soru daha yanıtla`
            : 'Cevapları kontrol et'}
        </button>
      ) : (
        <div className="kart flex items-center justify-between p-4">
          <div>
            <p className="text-sm text-slate-300">
              {dogruSayisi} / {sorular.length} doğru
            </p>
            <p className="text-2xl font-bold" style={{ color: yuzde >= 75 ? '#4ade80' : yuzde >= 50 ? '#ffb454' : '#f472b6' }}>
              %{yuzde}
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setSecim({})
              setGonderildi(false)
            }}
            className="rounded-lg border border-gece-500/60 px-3 py-1.5 text-xs text-slate-300 hover:border-camgobegi/60 hover:text-white"
          >
            tekrar dene
          </button>
        </div>
      )}
    </div>
  )
}
