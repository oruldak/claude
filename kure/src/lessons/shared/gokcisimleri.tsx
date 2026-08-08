import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'
import { DOKU, type V3 } from './sahne'

/**
 * Gerçek gök cismi dokularıyla çizilen küreler.
 * Dünya ve Ay dokuları NASA görüntülerinden türetilmiş, three.js deposunda
 * dağıtılan açık kaynak dokulardır (public/doku/ altında).
 */

function sRGB(d: THREE.Texture) {
  d.colorSpace = THREE.SRGBColorSpace
  d.anisotropy = 8
  return d
}

export function Dunya({
  konum = [0, 0, 0],
  r = 1,
  egim = 0,
  donsun = true,
  bulut = true,
  atmosfer = true,
}: {
  konum?: V3
  r?: number
  /** Eksen eğikliği (radyan) — z ekseni etrafında */
  egim?: number
  donsun?: boolean
  bulut?: boolean
  atmosfer?: boolean
}) {
  const [renk, normal, parlaklik, bulutDoku] = useTexture([
    DOKU.dunyaRenk,
    DOKU.dunyaNormal,
    DOKU.dunyaParlaklik,
    DOKU.dunyaBulut,
  ])
  useMemo(() => {
    sRGB(renk)
    sRGB(bulutDoku)
  }, [renk, bulutDoku])

  const kure = useRef<THREE.Mesh>(null)
  const bulutRef = useRef<THREE.Mesh>(null)
  useFrame((_, dt) => {
    if (!donsun) return
    if (kure.current) kure.current.rotation.y += dt * 0.16
    if (bulutRef.current) bulutRef.current.rotation.y += dt * 0.2
  })

  return (
    <group position={konum} rotation={[0, 0, egim]}>
      <mesh ref={kure} castShadow receiveShadow>
        <sphereGeometry args={[r, 64, 48]} />
        <meshStandardMaterial
          map={renk}
          normalMap={normal}
          normalScale={new THREE.Vector2(0.85, 0.85)}
          metalnessMap={parlaklik}
          metalness={0.42}
          roughness={0.72}
        />
      </mesh>
      {bulut && (
        <mesh ref={bulutRef}>
          <sphereGeometry args={[r * 1.012, 48, 32]} />
          <meshStandardMaterial
            map={bulutDoku}
            transparent
            opacity={0.55}
            depthWrite={false}
            roughness={1}
          />
        </mesh>
      )}
      {atmosfer && (
        <mesh>
          <sphereGeometry args={[r * 1.07, 40, 28]} />
          <meshBasicMaterial
            color="#5fa8ff"
            transparent
            opacity={0.14}
            side={THREE.BackSide}
            depthWrite={false}
          />
        </mesh>
      )}
    </group>
  )
}

export function Ay({ konum, r = 0.3 }: { konum: V3; r?: number }) {
  const doku = useTexture(DOKU.ay)
  useMemo(() => sRGB(doku), [doku])
  return (
    <mesh position={konum} castShadow receiveShadow>
      <sphereGeometry args={[r, 48, 32]} />
      <meshStandardMaterial map={doku} roughness={0.98} metalness={0} />
    </mesh>
  )
}

/** Radyal parlaklık dokusu — Güneş halesi için. */
function useHaleDokusu() {
  return useMemo(() => {
    const c = document.createElement('canvas')
    c.width = c.height = 256
    const g = c.getContext('2d')!
    const grad = g.createRadialGradient(128, 128, 0, 128, 128, 128)
    grad.addColorStop(0, 'rgba(255,244,214,0.95)')
    grad.addColorStop(0.25, 'rgba(255,206,110,0.5)')
    grad.addColorStop(0.55, 'rgba(255,160,60,0.16)')
    grad.addColorStop(1, 'rgba(255,140,40,0)')
    g.fillStyle = grad
    g.fillRect(0, 0, 256, 256)
    const t = new THREE.CanvasTexture(c)
    t.colorSpace = THREE.SRGBColorSpace
    return t
  }, [])
}

export function Gunes({
  konum = [0, 0, 0],
  r = 1,
  isik = 300,
  hale = 4.2,
}: {
  konum?: V3
  r?: number
  /** Nokta ışık şiddeti */
  isik?: number
  /** Hale yarıçapı (r'nin katı değil, mutlak) */
  hale?: number
}) {
  const doku = useTexture(DOKU.gunes)
  const haleDoku = useHaleDokusu()
  const ref = useRef<THREE.Mesh>(null)
  useMemo(() => {
    sRGB(doku)
    doku.wrapS = doku.wrapT = THREE.RepeatWrapping
    doku.repeat.set(3, 2)
  }, [doku])
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += dt * 0.03
  })

  return (
    <group position={konum}>
      <pointLight intensity={isik} distance={0} decay={2} color="#fff2d8" castShadow />
      <mesh ref={ref}>
        <sphereGeometry args={[r, 48, 32]} />
        <meshBasicMaterial map={doku} color="#ffd88a" toneMapped={false} />
      </mesh>
      <sprite scale={[hale, hale, 1]}>
        <spriteMaterial
          map={haleDoku}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </sprite>
    </group>
  )
}

/** Basit renkli gezegen (gerçek doku bulunmayanlar için inandırıcı malzeme). */
export function Gezegen({
  konum,
  r,
  renk,
  puruz = 0.9,
  halka,
}: {
  konum: V3
  r: number
  renk: string
  puruz?: number
  halka?: { ic: number; dis: number; renk: string }
}) {
  return (
    <group position={konum}>
      <mesh castShadow receiveShadow>
        <sphereGeometry args={[r, 40, 28]} />
        <meshStandardMaterial color={renk} roughness={puruz} metalness={0.05} />
      </mesh>
      {halka && (
        <mesh rotation={[Math.PI / 2 - 0.42, 0, 0.12]}>
          <ringGeometry args={[r * halka.ic, r * halka.dis, 96]} />
          <meshStandardMaterial
            color={halka.renk}
            side={THREE.DoubleSide}
            transparent
            opacity={0.72}
            roughness={0.9}
          />
        </mesh>
      )}
    </group>
  )
}
