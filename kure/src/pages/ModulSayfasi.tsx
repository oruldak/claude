import { Navigate, useParams } from 'react-router-dom'
import { modulBul } from '../lessons/registry'
import { DersOynatici } from '../components/DersOynatici'

export function ModulSayfasi() {
  const { id } = useParams()
  const modul = modulBul(id)
  if (!modul) return <Navigate to="/moduller" replace />
  return <DersOynatici key={modul.id} modul={modul} />
}
