import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Kabuk } from './components/Kabuk'
import { AnaSayfa } from './pages/AnaSayfa'
import { KademeSayfasi } from './pages/KademeSayfasi'
import { DersSayfasi } from './pages/DersSayfasi'
import { ModulSayfasi } from './pages/ModulSayfasi'
import { ModullerSayfasi } from './pages/ModullerSayfasi'
import { AramaSayfasi } from './pages/AramaSayfasi'
import { PanelSayfasi } from './pages/PanelSayfasi'
import { OdevlerSayfasi } from './pages/OdevlerSayfasi'
import { OdevSayfasi } from './pages/OdevSayfasi'

export function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Kabuk />}>
          <Route path="/" element={<AnaSayfa />} />
          <Route path="/kademe/:kademe" element={<KademeSayfasi />} />
          <Route path="/ders/:kod/:sinif" element={<DersSayfasi />} />
          <Route path="/moduller" element={<ModullerSayfasi />} />
          <Route path="/modul/:id" element={<ModulSayfasi />} />
          <Route path="/ara" element={<AramaSayfasi />} />
          <Route path="/odevler" element={<OdevlerSayfasi />} />
          <Route path="/odev/:id" element={<OdevSayfasi />} />
          <Route path="/panel" element={<PanelSayfasi />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </HashRouter>
  )
}
