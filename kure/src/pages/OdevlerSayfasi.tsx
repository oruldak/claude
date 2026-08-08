import { Link } from 'react-router-dom'
import { tumOdevler, useOdev } from '../lib/odev'
import { dersBul } from '../curriculum'
import { soruBul } from '../soru/banka'

export function OdevlerSayfasi() {
  const { ozelOdevler, sonuclar } = useOdev()
  const odevler = tumOdevler(ozelOdevler)
  const bugun = Date.now()

  return (
    <div className="space-y-7">
      <header className="max-w-2xl">
        <p className="etiket-kucuk text-murekkep-3">Ödevler</p>
        <h1 className="mt-1 text-[30px] font-bold leading-tight tracking-tight">
          Yanlışın cevabı değil, çözümü gösterilir
        </h1>
        <p className="okuma mt-2">
          Öğretmenin verdiği ödevi çöz. Teslim ettiğinde her sorunun doğru/yanlış durumunu
          görürsün; yanlış yaptıklarında ise adım adım çözüm açılır ve konuyu üç boyutlu olarak
          gösteren derse bağlanır.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        {odevler.map((o) => {
          const ders = dersBul(o.ders)
          const renk = ders?.renk ?? '#0f766e'
          const s = sonuclar[o.id]
          const cevaplanan = o.soruIdler.filter((sid) => (s?.cevaplar[sid] ?? '') !== '').length
          const gecikti = new Date(o.sonTarih).getTime() < bugun && !s?.teslim
          const konular = [...new Set(o.soruIdler.map((id) => soruBul(id)?.konu).filter(Boolean))]

          return (
            <Link
              key={o.id}
              to={`/odev/${o.id}`}
              className="kart kart-tik hover:kart-tik-hover flex flex-col p-5"
            >
              <div className="mb-2 flex items-center justify-between gap-3">
                <span
                  className="etiket-kucuk rounded-full px-2.5 py-1"
                  style={{ background: `${renk}14`, color: renk }}
                >
                  {ders?.ad} · {o.sinif}
                </span>
                <span
                  className="text-[11.5px] font-semibold"
                  style={{ color: gecikti ? '#be185d' : '#7d8696' }}
                >
                  {new Date(o.sonTarih).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })}
                  {gecikti ? ' · gecikti' : ''}
                </span>
              </div>

              <h2 className="text-[17px] font-semibold leading-snug">{o.baslik}</h2>
              <p className="okuma mt-1.5 flex-1 text-[13.5px]">{o.aciklama}</p>

              <div className="mt-3 flex flex-wrap gap-1.5">
                {konular.map((k) => (
                  <span
                    key={k}
                    className="rounded-md border border-cizgi px-2 py-0.5 text-[11px] text-murekkep-3"
                  >
                    {k}
                  </span>
                ))}
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-cizgi pt-3">
                <span className="text-[12px] text-murekkep-3">{o.soruIdler.length} soru</span>
                {s?.teslim ? (
                  <span
                    className="rounded-full px-2.5 py-1 text-[11.5px] font-bold"
                    style={{
                      background: s.puan >= 75 ? '#15803d14' : '#b4530914',
                      color: s.puan >= 75 ? '#15803d' : '#b45309',
                    }}
                  >
                    teslim · %{s.puan}
                  </span>
                ) : cevaplanan > 0 ? (
                  <span className="text-[12px] font-semibold" style={{ color: renk }}>
                    {cevaplanan}/{o.soruIdler.length} yanıtlandı
                  </span>
                ) : (
                  <span className="text-[12px] font-semibold" style={{ color: renk }}>
                    başla →
                  </span>
                )}
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
