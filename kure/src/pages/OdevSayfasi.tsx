import { useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { dogruMu, soruBul, type BankaSorusu } from '../soru/banka'
import { tumOdevler, useOdev } from '../lib/odev'
import { dersBul } from '../curriculum'
import { modulBul } from '../lessons/registry'
import { Tex } from '../lessons/shared/ui'

function Cozum({ soru, renk }: { soru: BankaSorusu; renk: string }) {
  const modul = modulBul(soru.modul)
  return (
    <div className="mt-3 overflow-hidden rounded-xl border border-cizgi bg-kagit/70">
      <div className="etiket-kucuk border-b border-cizgi bg-white px-4 py-2 text-murekkep-3">
        adım adım çözüm
      </div>
      <ol className="space-y-3 px-4 py-4">
        {soru.cozum.map((a, i) => (
          <li key={i} className="flex gap-3">
            <span
              className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full text-[10.5px] font-bold text-white"
              style={{ background: renk }}
            >
              {i + 1}
            </span>
            <div className="min-w-0">
              <p className="text-[13.5px] leading-relaxed text-murekkep-2">{a.anlat}</p>
              {a.tex && (
                <div className="mt-1.5 overflow-x-auto rounded-lg bg-white px-3 py-2 ring-1 ring-cizgi">
                  <Tex blok>{a.tex}</Tex>
                </div>
              )}
            </div>
          </li>
        ))}
      </ol>
      {modul && (
        <div className="border-t border-cizgi bg-white px-4 py-3">
          <Link
            to={`/modul/${modul.id}`}
            className="inline-flex items-center gap-2 text-[13px] font-semibold"
            style={{ color: renk }}
          >
            Bu konuyu üç boyutlu derste gör: {modul.baslik} →
          </Link>
        </div>
      )}
    </div>
  )
}

export function OdevSayfasi() {
  const { id } = useParams()
  const { ozelOdevler, sonuclar, cevapVer, teslimEt, yenidenDene } = useOdev()
  const [ipucuAcik, setIpucuAcik] = useState<Record<string, boolean>>({})

  const odev = tumOdevler(ozelOdevler).find((o) => o.id === id)
  if (!odev) return <Navigate to="/odevler" replace />

  const ders = dersBul(odev.ders)
  const renk = ders?.renk ?? '#0f766e'
  const sonuc = sonuclar[odev.id]
  const cevaplar = sonuc?.cevaplar ?? {}
  const teslim = sonuc?.teslim ?? false

  const sorular = odev.soruIdler.map(soruBul).filter(Boolean) as BankaSorusu[]
  const cevaplanan = sorular.filter((s) => (cevaplar[s.id] ?? '') !== '').length
  const dogruSayisi = sorular.filter((s) => dogruMu(s, cevaplar[s.id] ?? '')).length
  const yanlislar = sorular.filter((s) => !dogruMu(s, cevaplar[s.id] ?? ''))

  const sonTarih = new Date(odev.sonTarih).toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
  })

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <header className="space-y-2">
        <Link to="/odevler" className="text-[13px] text-murekkep-3 hover:text-murekkep">
          ← ödevler
        </Link>
        <div className="flex flex-wrap items-center gap-2">
          <span className="etiket-kucuk rounded-full px-2.5 py-1" style={{ background: `${renk}14`, color: renk }}>
            {ders?.ad}
          </span>
          <span className="text-[12.5px] text-murekkep-3">
            {odev.sinif}. Sınıf · {odev.ogretmen} · son teslim {sonTarih}
          </span>
        </div>
        <h1 className="text-[26px] font-bold leading-tight tracking-tight">{odev.baslik}</h1>
        <p className="okuma max-w-2xl">{odev.aciklama}</p>
      </header>

      {/* Durum çubuğu */}
      <div className="kart flex flex-wrap items-center justify-between gap-4 px-5 py-4">
        <div className="flex items-center gap-4">
          <div>
            <p className="etiket-kucuk text-murekkep-3">durum</p>
            <p className="text-[15px] font-semibold">
              {teslim ? `Teslim edildi · %${sonuc?.puan}` : `${cevaplanan} / ${sorular.length} soru yanıtlandı`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="h-2 w-40 overflow-hidden rounded-full bg-kagit-2">
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${teslim ? (sonuc?.puan ?? 0) : (cevaplanan / sorular.length) * 100}%`,
                background: renk,
              }}
            />
          </div>
          {teslim ? (
            <button
              type="button"
              onClick={() => yenidenDene(odev.id)}
              className="rounded-xl border border-cizgi px-4 py-2 text-[13px] font-semibold text-murekkep-2 hover:border-murekkep-3"
            >
              yeniden dene
            </button>
          ) : (
            <button
              type="button"
              disabled={cevaplanan < sorular.length}
              onClick={() => teslimEt(odev.id)}
              className="rounded-xl px-4 py-2 text-[13px] font-semibold text-white transition disabled:cursor-not-allowed disabled:bg-cizgi-2 disabled:text-white/80"
              style={cevaplanan >= sorular.length ? { background: renk } : undefined}
            >
              teslim et
            </button>
          )}
        </div>
      </div>

      {/* Teslim özeti */}
      {teslim && (
        <div
          className="kart belir space-y-2 px-5 py-4"
          style={{ borderColor: dogruSayisi === sorular.length ? '#15803d55' : '#b4530955' }}
        >
          <p className="text-[15px] font-semibold">
            {dogruSayisi} / {sorular.length} doğru
            {dogruSayisi === sorular.length ? ' — tamamı doğru 👏' : ''}
          </p>
          {yanlislar.length > 0 && (
            <p className="okuma">
              Yanlış yaptığın {yanlislar.length} sorunun çözümü aşağıda adım adım açıldı. Önce
              çözümü oku, sonra bağlantıdan üç boyutlu derse geçip aynı olayı gözlemle — asıl
              öğrenme orada oluyor.
            </p>
          )}
        </div>
      )}

      {/* Sorular */}
      <div className="space-y-4">
        {sorular.map((s, i) => {
          const cevap = cevaplar[s.id] ?? ''
          const dogru = dogruMu(s, cevap)
          const durumRengi = !teslim ? undefined : dogru ? '#15803d' : '#be185d'
          return (
            <section
              key={s.id}
              className="kart px-5 py-5"
              style={durumRengi ? { borderColor: `${durumRengi}55` } : undefined}
            >
              <div className="mb-3 flex items-start gap-3">
                <span
                  className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-lg text-[12px] font-bold text-white"
                  style={{ background: durumRengi ?? renk }}
                >
                  {teslim ? (dogru ? '✓' : '✕') : i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[15px] font-medium leading-relaxed">{s.soru}</p>
                  <p className="mt-1 text-[11.5px] text-murekkep-3">
                    {s.konu} · zorluk {'●'.repeat(s.zorluk)}
                    {'○'.repeat(3 - s.zorluk)}
                  </p>
                </div>
              </div>

              {s.tip === 'secmeli' ? (
                <div className="space-y-1.5">
                  {s.secenekler!.map((sec, j) => {
                    const secili = cevap === String(j)
                    const buDogru = teslim && j === s.dogru
                    const buYanlis = teslim && secili && j !== s.dogru
                    return (
                      <button
                        key={j}
                        type="button"
                        disabled={teslim}
                        onClick={() => cevapVer(odev.id, s.id, String(j))}
                        className="flex w-full items-center gap-3 rounded-xl border px-3.5 py-2.5 text-left text-[14px] transition"
                        style={{
                          borderColor: buDogru
                            ? '#15803d'
                            : buYanlis
                              ? '#be185d'
                              : secili
                                ? renk
                                : '#e4ddd1',
                          background: buDogru
                            ? '#15803d10'
                            : buYanlis
                              ? '#be185d10'
                              : secili
                                ? `${renk}0e`
                                : '#fff',
                        }}
                      >
                        <span
                          className="grid h-6 w-6 shrink-0 place-items-center rounded-full border text-[11px] font-bold"
                          style={{
                            borderColor: buDogru ? '#15803d' : buYanlis ? '#be185d' : secili ? renk : '#d3c9b8',
                            color: buDogru ? '#15803d' : buYanlis ? '#be185d' : secili ? renk : '#7d8696',
                          }}
                        >
                          {'ABCD'[j]}
                        </span>
                        <span className="text-murekkep-2">{sec}</span>
                      </button>
                    )
                  })}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <input
                    value={cevap}
                    disabled={teslim}
                    inputMode="decimal"
                    onChange={(e) => cevapVer(odev.id, s.id, e.target.value)}
                    placeholder="sayısal cevap"
                    className="w-44 rounded-xl border px-3.5 py-2.5 text-[15px] font-mono outline-none transition disabled:bg-kagit"
                    style={{
                      borderColor: durumRengi ?? '#e4ddd1',
                      background: teslim ? `${durumRengi}0d` : '#fff',
                    }}
                  />
                  {s.birim && <span className="text-[14px] text-murekkep-3">{s.birim}</span>}
                  {teslim && !dogru && (
                    <span className="text-[13px] font-semibold" style={{ color: '#15803d' }}>
                      doğru cevap: {s.dogru}
                      {s.birim ? ` ${s.birim}` : ''}
                    </span>
                  )}
                </div>
              )}

              {/* İpucu — teslimden önce */}
              {!teslim && (
                <div className="mt-3">
                  {ipucuAcik[s.id] ? (
                    <p className="rounded-xl bg-kagit-2/70 px-3.5 py-2.5 text-[13px] text-murekkep-2">
                      <span className="font-semibold">İpucu: </span>
                      {s.ipucu}
                    </p>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setIpucuAcik((o) => ({ ...o, [s.id]: true }))}
                      className="text-[12.5px] font-semibold text-murekkep-3 underline-offset-2 hover:underline"
                    >
                      ipucu göster
                    </button>
                  )}
                </div>
              )}

              {/* Çözüm — yanlışsa otomatik açılır, doğruysa isteğe bağlı */}
              {teslim &&
                (dogru ? (
                  <details className="mt-3">
                    <summary className="cursor-pointer text-[12.5px] font-semibold text-murekkep-3">
                      çözümü yine de görmek istiyorum
                    </summary>
                    <Cozum soru={s} renk={renk} />
                  </details>
                ) : (
                  <Cozum soru={s} renk={renk} />
                ))}
            </section>
          )
        })}
      </div>
    </div>
  )
}
