import { Link } from 'react-router-dom'
import type { DersModulu } from '../lessons/types'
import { dersBul } from '../curriculum'
import { useIlerleme } from '../lib/ilerleme'

/**
 * Ders kartı. Kapak görseli, modülün kendi 3B sahnesinden alınmış GERÇEK bir
 * ekran görüntüsüdür (public/kapak/, `npm run kapaklar` ile üretilir). Görsel
 * yoksa dersin rengiyle boyanmış bir alan gösterilir.
 */
export function ModulKarti({ modul, kompakt = false }: { modul: DersModulu; kompakt?: boolean }) {
  const ders = dersBul(modul.ders)
  const renk = ders?.renk ?? '#0f766e'
  const durum = useIlerleme((s) => s.konular[`modul:${modul.id}`])

  return (
    <Link
      to={`/modul/${modul.id}`}
      className="kart kart-tik hover:kart-tik-hover group flex flex-col overflow-hidden"
    >
      <div
        className="relative aspect-[16/9] overflow-hidden border-b border-cizgi"
        style={{ background: `linear-gradient(150deg, ${renk}22, ${renk}08)` }}
      >
        <img
          src={`${import.meta.env.BASE_URL}kapak/${modul.id}.jpg`}
          alt=""
          loading="lazy"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
          onError={(e) => {
            ;(e.currentTarget as HTMLImageElement).style.visibility = 'hidden'
          }}
        />
        <span
          className="absolute left-3 top-3 rounded-full px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-wider text-white shadow-sm"
          style={{ background: renk }}
        >
          {ders?.ad}
        </span>
        {durum && (
          <span className="absolute bottom-3 right-3 rounded-full bg-white/92 px-2.5 py-1 text-[10.5px] font-bold text-murekkep-2 shadow-sm">
            %{durum.ilerleme}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col px-4 py-3.5">
        <p className="text-[11.5px] text-murekkep-3">{modul.seviye}</p>
        <h3 className="mt-0.5 text-[15.5px] font-semibold leading-snug">{modul.baslik}</h3>
        {!kompakt && (
          <p className="okuma mt-1.5 flex-1 text-[13px]">{modul.altBaslik}</p>
        )}
        <div className="mt-3 flex items-center justify-between border-t border-cizgi pt-2.5 text-[11.5px] text-murekkep-3">
          <span>
            {modul.adimlar.length} adım · {modul.sorular.length} soru
          </span>
          <span>~{modul.sure} dk</span>
        </div>
      </div>
    </Link>
  )
}
