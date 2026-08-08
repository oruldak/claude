import { useMemo, useState } from 'react'
import { MODULLER } from '../lessons/registry'
import { DERSLER } from '../curriculum'
import { ModulKarti } from '../components/ModulKarti'

export function ModullerSayfasi() {
  const [ders, setDers] = useState<string>('hepsi')

  const dersKodlari = useMemo(() => [...new Set(MODULLER.map((m) => m.ders))], [])
  const liste = MODULLER.filter((m) => ders === 'hepsi' || m.ders === ders)

  return (
    <div className="space-y-6">
      <header className="max-w-2xl">
        <p className="etiket-kucuk text-murekkep-3">Etkileşimli içerik</p>
        <h1 className="mt-1 text-[30px] font-bold leading-tight tracking-tight">
          Üç boyutlu ders sahneleri
        </h1>
        <p className="okuma mt-2">
          Her ders bir soruyla başlar, sahnede kendi elinle denersin, sonunda ispatı ve ölçme
          sorularını görürsün. Kapak görselleri dersin kendi sahnesinden alınmış gerçek
          karelerdir.
        </p>
      </header>

      <div className="flex flex-wrap gap-1.5">
        <button
          type="button"
          onClick={() => setDers('hepsi')}
          className="rounded-xl border px-3.5 py-2 text-[12.5px] font-semibold transition"
          style={
            ders === 'hepsi'
              ? { borderColor: '#191d24', background: '#191d24', color: '#fff' }
              : { borderColor: '#e4ddd1', background: '#fff', color: '#4a5260' }
          }
        >
          Hepsi ({MODULLER.length})
        </button>
        {dersKodlari.map((kod) => {
          const d = DERSLER.find((x) => x.kod === kod)
          const sayi = MODULLER.filter((m) => m.ders === kod).length
          const aktif = ders === kod
          return (
            <button
              key={kod}
              type="button"
              onClick={() => setDers(kod)}
              className="rounded-xl border px-3.5 py-2 text-[12.5px] font-semibold transition"
              style={{
                borderColor: aktif ? d?.renk : '#e4ddd1',
                background: aktif ? d?.renk : '#fff',
                color: aktif ? '#fff' : '#4a5260',
              }}
            >
              {d?.ad ?? kod} ({sayi})
            </button>
          )
        })}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {liste.map((m) => (
          <ModulKarti key={m.id} modul={m} />
        ))}
      </div>
    </div>
  )
}
