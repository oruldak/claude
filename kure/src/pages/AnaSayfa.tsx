import { Link } from 'react-router-dom'
import { istatistikler, kademeDersleri } from '../curriculum'
import { KADEME_ADI, KADEME_SINIFLARI, type Kademe } from '../lib/types'
import { MODULLER, modulBul } from '../lessons/registry'
import { okuluYukle } from '../lib/okul'
import { useIlerleme } from '../lib/ilerleme'
import { ModulKarti } from '../components/ModulKarti'
import { tumOdevler, useOdev } from '../lib/odev'
import { dersBul } from '../curriculum'

const KADEME_ACIKLAMA: Record<Kademe, string> = {
  ilkokul: 'Elle tutulur modeller, somut karşılaştırmalar ve oyunlaştırılmış keşif.',
  ortaokul: 'Deney düzenekleri, sistem modelleri ve “neden böyle” sorusuna verilen ilk cevaplar.',
  lise: 'Türetimler ve ispatlar; her formülün nereden çıktığı sahnede gösterilir.',
}

const ONE_CIKAN = ['mevsimler', 'turev', 'kalp', 'egik-atis', 'dna', 'molekul-geometri']

export function AnaSayfa() {
  const okul = okuluYukle()
  const ist = istatistikler()
  const sonSahneler = useIlerleme((s) => s.sonSahneler)
  const { ozelOdevler, sonuclar } = useOdev()
  const bekleyen = tumOdevler(ozelOdevler).filter((o) => !sonuclar[o.id]?.teslim)

  const oneCikan = ONE_CIKAN.map((id) => modulBul(id)).filter(Boolean)

  return (
    <div className="space-y-12">
      {/* Giriş */}
      <section className="grid items-center gap-8 lg:grid-cols-[1.05fr_1fr]">
        <div>
          <p className="etiket-kucuk text-murekkep-3">{okul.ad}</p>
          <h1 className="mt-2 text-[34px] font-black leading-[1.08] tracking-tight sm:text-[46px]">
            Ezberlemeden öğrenmek:
            <br />
            <span style={{ color: okul.vurgu }}>gör, çevir, dene, ispatla.</span>
          </h1>
          <p className="okuma mt-4 max-w-xl text-[16px]">
            Küre; ilkokul, ortaokul ve lise müfredatını üç boyutlu ders sahneleriyle anlatır.
            Her konu bir soruyla başlar — <em>neden böyle?</em>, <em>nasıl oluyor?</em> — ve
            öğrenci parametreleri kendi eliyle değiştirerek cevabı bulur. Sonunda ispat ve
            ölçme soruları gelir.
          </p>

          <div className="mt-6 flex flex-wrap gap-2.5">
            <Link
              to="/moduller"
              className="rounded-xl px-4 py-2.5 text-[13.5px] font-semibold text-white shadow-sm transition hover:brightness-110"
              style={{ background: okul.vurgu }}
            >
              3B dersleri gez
            </Link>
            {(['ilkokul', 'ortaokul', 'lise'] as Kademe[])
              .filter((k) => okul.kademeler.includes(k))
              .map((k) => (
                <Link
                  key={k}
                  to={`/kademe/${k}`}
                  className="rounded-xl border border-cizgi bg-white px-4 py-2.5 text-[13.5px] font-semibold text-murekkep-2 transition hover:border-murekkep-3"
                >
                  {KADEME_ADI[k]}
                </Link>
              ))}
          </div>

          <dl className="mt-8 grid grid-cols-2 gap-x-8 gap-y-4 sm:grid-cols-4">
            {[
              ['Ders', ist.ders],
              ['Konu başlığı', ist.konu],
              ['Kazanım', ist.kazanim],
              ['3B ders', MODULLER.length],
            ].map(([ad, deger]) => (
              <div key={ad as string}>
                <dd className="text-[26px] font-bold leading-none">{deger as number}</dd>
                <dt className="mt-1 text-[11.5px] text-murekkep-3">{ad}</dt>
              </div>
            ))}
          </dl>
        </div>

        {/* Kapak: gerçek bir ders sahnesinin görüntüsü */}
        <div className="kart overflow-hidden">
          <img
            src={`${import.meta.env.BASE_URL}kapak/mevsimler.jpg`}
            alt="Mevsimler dersinden bir kare"
            className="aspect-[16/10] w-full object-cover"
            onError={(e) => {
              ;(e.currentTarget as HTMLImageElement).style.display = 'none'
            }}
          />
          <div className="flex items-center justify-between gap-3 px-4 py-3">
            <div>
              <p className="text-[11.5px] text-murekkep-3">Fen Bilimleri · 8. Sınıf</p>
              <p className="text-[14.5px] font-semibold">Mevsimler neden oluşur?</p>
            </div>
            <Link
              to="/modul/mevsimler"
              className="rounded-xl bg-fen px-3.5 py-2 text-[12.5px] font-semibold text-white"
            >
              dersi aç →
            </Link>
          </div>
        </div>
      </section>

      {/* Bekleyen ödevler */}
      {bekleyen.length > 0 && (
        <section>
          <div className="mb-3 flex items-baseline justify-between">
            <h2 className="text-[20px] font-bold tracking-tight">Bekleyen ödevler</h2>
            <Link to="/odevler" className="text-[12.5px] font-semibold text-murekkep-2 hover:text-murekkep">
              tümü →
            </Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {bekleyen.slice(0, 3).map((o) => {
              const d = dersBul(o.ders)
              return (
                <Link key={o.id} to={`/odev/${o.id}`} className="kart kart-tik hover:kart-tik-hover px-4 py-3.5">
                  <p className="etiket-kucuk" style={{ color: d?.renk }}>
                    {d?.ad} · {o.sinif}
                  </p>
                  <p className="mt-1 text-[14.5px] font-semibold leading-snug">{o.baslik}</p>
                  <p className="mt-1.5 text-[12px] text-murekkep-3">
                    {o.soruIdler.length} soru · son teslim{' '}
                    {new Date(o.sonTarih).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })}
                  </p>
                </Link>
              )
            })}
          </div>
        </section>
      )}

      {/* Kademeler */}
      <section>
        <h2 className="mb-3 text-[20px] font-bold tracking-tight">Kademeler</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {(['ilkokul', 'ortaokul', 'lise'] as Kademe[]).map((k) => {
            const dersler = kademeDersleri(k)
            return (
              <Link key={k} to={`/kademe/${k}`} className="kart kart-tik hover:kart-tik-hover p-5">
                <div className="flex items-baseline justify-between">
                  <h3 className="text-[17px] font-bold">{KADEME_ADI[k]}</h3>
                  <span className="text-[12px] text-murekkep-3">
                    {KADEME_SINIFLARI[k][0]}–{KADEME_SINIFLARI[k].at(-1)}. sınıf
                  </span>
                </div>
                <p className="okuma mt-1.5 text-[13.5px]">{KADEME_ACIKLAMA[k]}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {dersler.slice(0, 6).map((d) => (
                    <span
                      key={d.kod}
                      className="rounded-md px-2 py-0.5 text-[11.5px] font-medium"
                      style={{ background: `${d.renk}12`, color: d.renk }}
                    >
                      {d.ad}
                    </span>
                  ))}
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* Öne çıkan dersler */}
      <section>
        <div className="mb-3 flex items-baseline justify-between">
          <h2 className="text-[20px] font-bold tracking-tight">Öne çıkan üç boyutlu dersler</h2>
          <Link to="/moduller" className="text-[12.5px] font-semibold text-murekkep-2 hover:text-murekkep">
            {MODULLER.length} dersin tümü →
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {oneCikan.map((m) => (
            <ModulKarti key={m!.id} modul={m!} />
          ))}
        </div>
      </section>

      {/* Son çalışılanlar */}
      {sonSahneler.length > 0 && (
        <section>
          <h2 className="mb-3 text-[20px] font-bold tracking-tight">Son çalıştıkların</h2>
          <div className="flex flex-wrap gap-2">
            {sonSahneler.map((id) => {
              const m = modulBul(id)
              if (!m) return null
              return (
                <Link
                  key={id}
                  to={`/modul/${id}`}
                  className="rounded-xl border border-cizgi bg-white px-3.5 py-2 text-[13px] font-medium text-murekkep-2 transition hover:border-murekkep-3"
                >
                  {m.baslik}
                </Link>
              )
            })}
          </div>
        </section>
      )}
    </div>
  )
}
