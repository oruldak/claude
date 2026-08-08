import { Canvas, useFrame } from '@react-three/fiber'
import { Html, Line, OrbitControls } from '@react-three/drei'
import { Suspense, useMemo, useRef, type ComponentProps, type ReactNode } from 'react'
import * as THREE from 'three'

type V3 = [number, number, number]

/* ------------------------------------------------------------------ *
 *  Sahne kabuğu
 * ------------------------------------------------------------------ */

export function Sahne({
  children,
  kamera = [7, 5, 9],
  fov = 45,
  izgara = true,
  zeminY = 0,
  minUzaklik = 2,
  maxUzaklik = 40,
  otoDondur = false,
  uzay = false,
}: {
  children: ReactNode
  kamera?: V3
  fov?: number
  izgara?: boolean
  zeminY?: number
  minUzaklik?: number
  maxUzaklik?: number
  otoDondur?: boolean
  /** Uzay sahnesi: ortam ışığı kısılır, aydınlatmayı sahnenin kendi kaynağı yapar. */
  uzay?: boolean
}) {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl border border-gece-500/50 bg-gece-900">
      <Canvas camera={{ position: kamera, fov }} dpr={[1, 2]} gl={{ antialias: true }}>
        <color attach="background" args={['#060a13']} />
        {!uzay && <fog attach="fog" args={['#060a13', 26, 70]} />}
        {uzay ? (
          <ambientLight intensity={0.06} />
        ) : (
          <>
            <ambientLight intensity={0.75} />
            <hemisphereLight args={['#9ec9ff', '#0b1020', 0.6]} />
            <directionalLight position={[8, 12, 6]} intensity={1.5} />
            <directionalLight position={[-8, 5, -6]} intensity={0.5} color="#7dd3fc" />
          </>
        )}
        <Suspense fallback={null}>{children}</Suspense>
        {izgara && (
          <gridHelper
            args={[40, 40, '#223358', '#141d33']}
            position={[0, zeminY - 0.001, 0]}
          />
        )}
        <OrbitControls
          makeDefault
          enablePan
          minDistance={minUzaklik}
          maxDistance={maxUzaklik}
          autoRotate={otoDondur}
          autoRotateSpeed={0.6}
        />
      </Canvas>
      <div className="pointer-events-none absolute bottom-2 right-3 text-[10px] tracking-wide text-slate-500">
        döndür: sol tık · yakınlaş: tekerlek · kaydır: sağ tık
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ *
 *  Kararlı çizgi
 *
 *  drei'nin `Line` bileşeni, `points` dizisinin KİMLİĞİ her değiştiğinde
 *  yeni bir LineGeometry ayırır. Sahnelerimiz saniyede 60 kez yeniden
 *  render edildiği için, değeri hiç değişmeyen çizgiler bile (eksenler,
 *  sabit eğriler) her karede yeni GPU tamponu oluştururdu. Aşağıdaki
 *  kanca, değerler gerçekten değişmediği sürece aynı dizi referansını
 *  koruyarak bu israfı önler.
 * ------------------------------------------------------------------ */

type NoktaDizisi = readonly (readonly number[])[]

function ayniMi(a: NoktaDizisi, b: NoktaDizisi): boolean {
  if (a === b) return true
  if (a.length !== b.length) return false
  for (let i = 0; i < a.length; i++) {
    const x = a[i]
    const y = b[i]
    if (x.length !== y.length) return false
    for (let j = 0; j < x.length; j++) if (x[j] !== y[j]) return false
  }
  return true
}

export function useKararliNoktalar<T extends NoktaDizisi>(noktalar: T): T {
  const ref = useRef<T>(noktalar)
  if (!ayniMi(ref.current, noktalar)) ref.current = noktalar
  return ref.current
}

type CizgiProps = Omit<ComponentProps<typeof Line>, 'points'> & { points: V3[] }

/** drei `Line` ile aynı arayüz; yalnızca gereksiz geometri ayırmayı önler. */
export function Cizgi({ points, ...rest }: CizgiProps) {
  const kararli = useKararliNoktalar(points)
  return <Line points={kararli} {...rest} />
}

/* ------------------------------------------------------------------ *
 *  Etiketler (DOM tabanlı — yazı tipi indirmesi gerekmez)
 * ------------------------------------------------------------------ */

export function Etiket({
  konum,
  children,
  renk = '#e6ecf7',
  arka = 'rgba(8,13,25,.82)',
  kucuk = false,
  gorunur = true,
}: {
  konum: V3
  children: ReactNode
  renk?: string
  arka?: string
  kucuk?: boolean
  gorunur?: boolean
}) {
  if (!gorunur) return null
  return (
    <Html position={konum} center zIndexRange={[20, 0]}>
      <div
        className="sahne-etiket rounded-md px-1.5 py-0.5 font-medium"
        style={{
          color: renk,
          background: arka,
          fontSize: kucuk ? 10 : 12,
          border: '1px solid rgba(120,140,180,.22)',
          boxShadow: '0 2px 10px rgba(0,0,0,.45)',
        }}
      >
        {children}
      </div>
    </Html>
  )
}

/* ------------------------------------------------------------------ *
 *  Vektör oku
 * ------------------------------------------------------------------ */

export function Ok({
  baslangic,
  bitis,
  renk = '#38e1c6',
  kalinlik = 0.045,
  baslikBoyu = 0.28,
  opaklik = 1,
}: {
  baslangic: V3
  bitis: V3
  renk?: string
  kalinlik?: number
  baslikBoyu?: number
  opaklik?: number
}) {
  const { poz, quat, uzunluk } = useMemo(() => {
    const a = new THREE.Vector3(...baslangic)
    const b = new THREE.Vector3(...bitis)
    const yon = b.clone().sub(a)
    const uzunluk = yon.length()
    const quat = new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      uzunluk > 1e-6 ? yon.clone().normalize() : new THREE.Vector3(0, 1, 0),
    )
    return { poz: a, quat, uzunluk }
  }, [baslangic, bitis])

  if (uzunluk < 1e-4) return null
  const govde = Math.max(uzunluk - baslikBoyu, 0.001)

  return (
    <group position={poz} quaternion={quat}>
      <mesh position={[0, govde / 2, 0]}>
        <cylinderGeometry args={[kalinlik, kalinlik, govde, 12]} />
        <meshStandardMaterial
          color={renk}
          emissive={renk}
          emissiveIntensity={0.35}
          transparent={opaklik < 1}
          opacity={opaklik}
        />
      </mesh>
      <mesh position={[0, govde + baslikBoyu / 2, 0]}>
        <coneGeometry args={[kalinlik * 2.6, baslikBoyu, 16]} />
        <meshStandardMaterial
          color={renk}
          emissive={renk}
          emissiveIntensity={0.35}
          transparent={opaklik < 1}
          opacity={opaklik}
        />
      </mesh>
    </group>
  )
}

/* ------------------------------------------------------------------ *
 *  Eksen takımı
 * ------------------------------------------------------------------ */

export function Eksenler({
  boy = 5,
  eksiBoy = 5,
  zBoy = 0,
  adlar = ['x', 'y', 'z'],
  bolme = 1,
  renk = '#5b6b8c',
}: {
  boy?: number
  eksiBoy?: number
  zBoy?: number
  adlar?: [string, string, string] | string[]
  bolme?: number
  renk?: string
}) {
  const tikler = useMemo(() => {
    const t: { p: V3; d: string }[] = []
    // bolme = 0 → tik gösterme (sıfıra bölme sonsuz döngüye yol açar)
    if (!(bolme > 0)) return t
    for (let i = -Math.floor(eksiBoy / bolme); i <= Math.floor(boy / bolme); i++) {
      if (i === 0) continue
      const v = +(i * bolme).toFixed(2)
      t.push({ p: [v, -0.28, 0], d: String(v) })
      t.push({ p: [-0.32, v, 0], d: String(v) })
    }
    return t
  }, [boy, eksiBoy, bolme])

  return (
    <group>
      <Cizgi points={[[-eksiBoy, 0, 0], [boy, 0, 0]]} color={renk} lineWidth={1.5} />
      <Cizgi points={[[0, -eksiBoy, 0], [0, boy, 0]]} color={renk} lineWidth={1.5} />
      {zBoy > 0 && <Cizgi points={[[0, 0, -zBoy], [0, 0, zBoy]]} color={renk} lineWidth={1.5} />}
      {adlar[0] ? (
        <Etiket konum={[boy + 0.4, 0, 0]} renk="#94a3b8" kucuk>
          {adlar[0]}
        </Etiket>
      ) : null}
      {adlar[1] ? (
        <Etiket konum={[0, boy + 0.4, 0]} renk="#94a3b8" kucuk>
          {adlar[1]}
        </Etiket>
      ) : null}
      {zBoy > 0 && (
        <Etiket konum={[0, 0, zBoy + 0.4]} renk="#94a3b8" kucuk>
          {adlar[2]}
        </Etiket>
      )}
      {bolme > 0 &&
        tikler.map((t, i) => (
          <Etiket key={i} konum={t.p} renk="#64748b" arka="transparent" kucuk>
            {t.d}
          </Etiket>
        ))}
    </group>
  )
}

/* ------------------------------------------------------------------ *
 *  Fonksiyon eğrisi
 * ------------------------------------------------------------------ */

export function Egri({
  f,
  x0,
  x1,
  adet = 220,
  renk = '#38e1c6',
  kalinlik = 3,
  z = 0,
  kesikli = false,
  sinirY = 40,
}: {
  f: (x: number) => number
  x0: number
  x1: number
  adet?: number
  renk?: string
  kalinlik?: number
  z?: number
  kesikli?: boolean
  sinirY?: number
}) {
  const noktalar = useMemo(() => {
    const p: V3[] = []
    for (let i = 0; i <= adet; i++) {
      const x = x0 + ((x1 - x0) * i) / adet
      const y = f(x)
      if (!Number.isFinite(y) || Math.abs(y) > sinirY) continue
      p.push([x, y, z])
    }
    return p
  }, [f, x0, x1, adet, z, sinirY])

  if (noktalar.length < 2) return null
  return (
    <Cizgi
      points={noktalar}
      color={renk}
      lineWidth={kalinlik}
      dashed={kesikli}
      dashSize={0.18}
      gapSize={0.12}
    />
  )
}

/** Parametrik uzay eğrisi. */
export function UzayEgrisi({
  f,
  t0,
  t1,
  adet = 240,
  renk = '#8b7dff',
  kalinlik = 3,
  kesikli = false,
}: {
  f: (t: number) => V3
  t0: number
  t1: number
  adet?: number
  renk?: string
  kalinlik?: number
  kesikli?: boolean
}) {
  const noktalar = useMemo(() => {
    const p: V3[] = []
    for (let i = 0; i <= adet; i++) p.push(f(t0 + ((t1 - t0) * i) / adet))
    return p
  }, [f, t0, t1, adet])
  return (
    <Cizgi
      points={noktalar}
      color={renk}
      lineWidth={kalinlik}
      dashed={kesikli}
      dashSize={0.2}
      gapSize={0.14}
    />
  )
}

/* ------------------------------------------------------------------ *
 *  Küçük yardımcılar
 * ------------------------------------------------------------------ */

/** Kameraya bakan parlak nokta. */
export function Nokta({
  konum,
  renk = '#ffb454',
  r = 0.13,
}: {
  konum: V3
  renk?: string
  r?: number
}) {
  return (
    <mesh position={konum}>
      <sphereGeometry args={[r, 20, 20]} />
      <meshStandardMaterial color={renk} emissive={renk} emissiveIntensity={0.7} />
    </mesh>
  )
}

/** Yavaşça salınan/dönen grup — dikkat çekmek için. */
export function Dondur({
  hiz = 0.4,
  eksen = 'y',
  children,
}: {
  hiz?: number
  eksen?: 'x' | 'y' | 'z'
  children: ReactNode
}) {
  const ref = useRef<THREE.Group>(null)
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation[eksen] += hiz * dt
  })
  return <group ref={ref}>{children}</group>
}

/** Zamanı [0,1] aralığında ilerleten yardımcı kanca. */
export function useSaat(hiz = 1, calisiyor = true) {
  const t = useRef(0)
  useFrame((_, dt) => {
    if (calisiyor) t.current += dt * hiz
  })
  return t
}

export const KLAMP = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v))
export const LERP = (a: number, b: number, t: number) => a + (b - a) * KLAMP(t, 0, 1)
export type { V3 }
