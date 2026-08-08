import { useEffect, useRef, useState } from 'react'

/**
 * React tarafında dönen basit zaman sayacı.
 * Sahne içi (R3F) animasyonlar için `useFrame` tercih edilir; bu kanca ise
 * hem HTML kontrollerini hem sahneyi birlikte süren animasyonlar içindir.
 */
export function useZaman(calisiyor: boolean, hiz = 1) {
  const [t, setT] = useState(0)
  const hizRef = useRef(hiz)
  hizRef.current = hiz

  useEffect(() => {
    if (!calisiyor) return
    let raf = 0
    let son = performance.now()
    // React ağacını her karede yeniden çizmek yerine ~40 fps ile sınırlıyoruz:
    // görsel olarak akıcı, ama sahne yeniden oluşturma maliyeti belirgin biçimde düşük.
    const ENAZ = 1 / 42
    const dongu = (now: number) => {
      raf = requestAnimationFrame(dongu)
      const dt = (now - son) / 1000
      if (dt < ENAZ) return
      son = now
      setT((v) => v + Math.min(dt, 0.05) * hizRef.current)
    }
    raf = requestAnimationFrame(dongu)
    return () => cancelAnimationFrame(raf)
  }, [calisiyor])

  return [t, setT] as const
}

/** 0 → 1 arası tek yönlü geçiş (adım değiştiğinde yeniden başlar). */
export function useGecis(anahtar: unknown, sure = 0.9) {
  const [p, setP] = useState(0)
  useEffect(() => {
    setP(0)
    let raf = 0
    const bas = performance.now()
    const dongu = (now: number) => {
      const o = Math.min((now - bas) / (sure * 1000), 1)
      setP(o < 1 ? 1 - Math.pow(1 - o, 3) : 1)
      if (o < 1) raf = requestAnimationFrame(dongu)
    }
    raf = requestAnimationFrame(dongu)
    return () => cancelAnimationFrame(raf)
  }, [anahtar, sure])
  return p
}

/** Testere dişi döngü: 0 → 1 → 0 → 1 … */
export function dongusel(t: number, periyot = 3) {
  return (t % periyot) / periyot
}

/** Gidip gelen değer: 0 → 1 → 0 */
export function gitGel(t: number, periyot = 3) {
  const u = dongusel(t, periyot)
  return u < 0.5 ? u * 2 : 2 - u * 2
}
