import { Canvas, useFrame } from '@react-three/fiber'
import {
  ContactShadows,
  Environment,
  Html,
  Line,
  OrbitControls,
  useTexture,
} from '@react-three/drei'
import {
  Suspense,
  useMemo,
  useRef,
  type ComponentProps,
  type ReactNode,
} from 'react'
import * as THREE from 'three'

type V3 = [number, number, number]

/** public/ altındaki varlıklara temel yola göre erişim. */
export const varlik = (yol: string) => `${import.meta.env.BASE_URL}${yol}`

export const DOKU = {
  dunyaRenk: varlik('doku/dunya-renk.jpg'),
  dunyaNormal: varlik('doku/dunya-normal.jpg'),
  dunyaParlaklik: varlik('doku/dunya-parlaklik.jpg'),
  dunyaBulut: varlik('doku/dunya-bulut.png'),
  ay: varlik('doku/ay.jpg'),
  gunes: varlik('doku/gunes.jpg'),
  ahsap: varlik('doku/ahsap.jpg'),
  tugla: varlik('doku/tugla.jpg'),
  cim: varlik('doku/cim.jpg'),
  suNormal: varlik('doku/su-normal.jpg'),
} as const

/** Tekrarlayan (tiled) doku yükler. */
export function useTekrarDoku(url: string, tekrar = 4) {
  const doku = useTexture(url)
  return useMemo(() => {
    const d = doku.clone()
    d.wrapS = d.wrapT = THREE.RepeatWrapping
    d.repeat.set(tekrar, tekrar)
    d.anisotropy = 8
    d.colorSpace = THREE.SRGBColorSpace
    d.needsUpdate = true
    return d
  }, [doku, tekrar])
}

/* ------------------------------------------------------------------ *
 *  Zeminler — sahnedeki nesnelerin "bir yere ait" görünmesini sağlar
 * ------------------------------------------------------------------ */

export type ZeminTuru = 'studyo' | 'cim' | 'ahsap' | 'yok'

function Zemin({ tur, y }: { tur: ZeminTuru; y: number }) {
  if (tur === 'yok') return null
  return (
    <group position={[0, y, 0]}>
      {tur === 'studyo' ? (
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[120, 120]} />
          <meshStandardMaterial color="#efe9df" roughness={0.95} metalness={0} />
        </mesh>
      ) : (
        <Suspense fallback={null}>
          <DokuluZemin url={tur === 'cim' ? DOKU.cim : DOKU.ahsap} tekrar={tur === 'cim' ? 26 : 10} />
        </Suspense>
      )}
      <ContactShadows
        position={[0, 0.012, 0]}
        opacity={tur === 'studyo' ? 0.42 : 0.55}
        scale={38}
        blur={2.4}
        far={14}
        resolution={1024}
        color="#2a2016"
      />
    </group>
  )
}

function DokuluZemin({ url, tekrar }: { url: string; tekrar: number }) {
  const doku = useTekrarDoku(url, tekrar)
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[120, 120]} />
      <meshStandardMaterial map={doku} roughness={0.92} metalness={0} />
    </mesh>
  )
}

/* ------------------------------------------------------------------ *
 *  Kareli kâğıt — matematik sahnelerinin arka düzlemi
 *
 *  Grafikler boşlukta yüzen çizgiler gibi değil, gerçek bir defter
 *  yaprağı üzerine çizilmiş gibi görünsün.
 * ------------------------------------------------------------------ */

function useKagitDokusu(kalinAralik = 5) {
  return useMemo(() => {
    const b = 512
    const c = document.createElement('canvas')
    c.width = c.height = b
    const g = c.getContext('2d')!
    g.fillStyle = '#fdfbf7'
    g.fillRect(0, 0, b, b)
    const adim = b / kalinAralik
    // ince çizgiler
    g.strokeStyle = 'rgba(120,150,180,.22)'
    g.lineWidth = 1
    for (let i = 0; i <= kalinAralik * 5; i++) {
      const p = (i * adim) / 5
      g.beginPath()
      g.moveTo(p, 0)
      g.lineTo(p, b)
      g.moveTo(0, p)
      g.lineTo(b, p)
      g.stroke()
    }
    // kalın çizgiler
    g.strokeStyle = 'rgba(90,125,165,.42)'
    g.lineWidth = 2
    for (let i = 0; i <= kalinAralik; i++) {
      const p = i * adim
      g.beginPath()
      g.moveTo(p, 0)
      g.lineTo(p, b)
      g.moveTo(0, p)
      g.lineTo(b, p)
      g.stroke()
    }
    const t = new THREE.CanvasTexture(c)
    t.wrapS = t.wrapT = THREE.RepeatWrapping
    t.colorSpace = THREE.SRGBColorSpace
    t.anisotropy = 8
    return t
  }, [kalinAralik])
}

/** Grafiklerin arkasına konan kareli kâğıt yaprağı. */
export function KareliKagit({
  genislik = 13,
  yukseklik = 10,
  z = -0.06,
  /** Bir kalın karenin kaç birim olduğu */
  birim = 1,
}: {
  genislik?: number
  yukseklik?: number
  z?: number
  birim?: number
}) {
  const doku = useKagitDokusu()
  const d = useMemo(() => {
    const k = doku.clone()
    k.repeat.set(genislik / (birim * 5), yukseklik / (birim * 5))
    k.needsUpdate = true
    return k
  }, [doku, genislik, yukseklik, birim])

  return (
    <group position={[0, 0, z]}>
      <mesh>
        <planeGeometry args={[genislik, yukseklik]} />
        <meshStandardMaterial
          map={d}
          color="#ffffff"
          roughness={1}
          metalness={0}
          envMapIntensity={0.18}
        />
      </mesh>
      {/* kâğıt kenarı */}
      <mesh position={[0, 0, -0.02]}>
        <planeGeometry args={[genislik + 0.16, yukseklik + 0.16]} />
        <meshStandardMaterial color="#ddd5c8" roughness={1} envMapIntensity={0.15} />
      </mesh>
    </group>
  )
}

/* ------------------------------------------------------------------ *
 *  Yıldız alanı (uzay sahneleri)
 * ------------------------------------------------------------------ */

function Yildizlar({ adet = 1400, yaricap = 90 }: { adet?: number; yaricap?: number }) {
  const { konumlar, boyutlar } = useMemo(() => {
    const k = new Float32Array(adet * 3)
    const b = new Float32Array(adet)
    for (let i = 0; i < adet; i++) {
      const u = Math.random() * 2 - 1
      const th = Math.random() * Math.PI * 2
      const r = yaricap * (0.7 + Math.random() * 0.3)
      const s = Math.sqrt(1 - u * u)
      k[i * 3] = r * s * Math.cos(th)
      k[i * 3 + 1] = r * u
      k[i * 3 + 2] = r * s * Math.sin(th)
      b[i] = Math.random() < 0.06 ? 0.9 : 0.28 + Math.random() * 0.3
    }
    return { konumlar: k, boyutlar: b }
  }, [adet, yaricap])

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[konumlar, 3]} />
        <bufferAttribute attach="attributes-size" args={[boyutlar, 1]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.5}
        sizeAttenuation
        color="#fdf6e3"
        transparent
        opacity={0.85}
        depthWrite={false}
      />
    </points>
  )
}

/* ------------------------------------------------------------------ *
 *  Sahne kabuğu
 * ------------------------------------------------------------------ */

export function Sahne({
  children,
  kamera = [7, 5, 9],
  hedef = [0, 0, 0],
  fov = 42,
  zemin = 'studyo',
  zeminY = 0,
  minUzaklik = 2,
  maxUzaklik = 40,
  otoDondur = false,
  uzay = false,
}: {
  children: ReactNode
  kamera?: V3
  hedef?: V3
  fov?: number
  zemin?: ZeminTuru
  zeminY?: number
  minUzaklik?: number
  maxUzaklik?: number
  otoDondur?: boolean
  /** Uzay sahnesi: yıldız alanı, koyu fon, tek ışık kaynağı sahnenin kendisi. */
  uzay?: boolean
}) {
  return (
    <div
      className="relative h-full w-full overflow-hidden rounded-2xl border border-cizgi"
      style={{
        background: uzay
          ? 'radial-gradient(120% 90% at 50% 10%, #101a2e 0%, #05070d 65%)'
          : 'linear-gradient(180deg, #fbf9f5 0%, #ece5d9 100%)',
      }}
    >
      <Canvas
        shadows
        camera={{ position: kamera, fov }}
        dpr={[1, 2]}
        gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.05 }}
      >
        {uzay ? (
          <>
            <ambientLight intensity={0.05} />
            <Yildizlar />
          </>
        ) : (
          <>
            <ambientLight intensity={0.42} />
            <directionalLight
              position={[9, 13, 7]}
              intensity={2.1}
              castShadow
              shadow-mapSize={[2048, 2048]}
              shadow-bias={-0.0004}
            >
              <orthographicCamera attach="shadow-camera" args={[-14, 14, 14, -14, 0.1, 50]} />
            </directionalLight>
            <directionalLight position={[-8, 6, -7]} intensity={0.55} color="#cfe3ff" />
            <Suspense fallback={null}>
              <Environment files={varlik('hdr/studyo.hdr')} environmentIntensity={0.55} />
            </Suspense>
            <Zemin tur={zemin} y={zeminY} />
          </>
        )}

        <Suspense fallback={null}>{children}</Suspense>

        <OrbitControls
          makeDefault
          enablePan
          enableDamping
          dampingFactor={0.08}
          target={hedef}
          minDistance={minUzaklik}
          maxDistance={maxUzaklik}
          maxPolarAngle={uzay || zemin === 'yok' ? Math.PI : Math.PI * 0.495}
          autoRotate={otoDondur}
          autoRotateSpeed={0.5}
        />
      </Canvas>

      <div
        className="pointer-events-none absolute bottom-2.5 right-3 rounded-full px-2.5 py-1 text-[10px] font-medium"
        style={{
          background: uzay ? 'rgba(255,255,255,.08)' : 'rgba(255,255,255,.7)',
          color: uzay ? '#9db0cc' : '#7d8696',
          backdropFilter: 'blur(6px)',
        }}
      >
        sürükle · döndür &nbsp;·&nbsp; tekerlek · yakınlaş
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ *
 *  Kararlı çizgi
 *
 *  drei'nin `Line` bileşeni, `points` dizisinin KİMLİĞİ her değiştiğinde
 *  yeni bir LineGeometry ayırır. Sahneler saniyede onlarca kez yeniden
 *  render edildiği için, değeri hiç değişmeyen çizgiler bile her karede
 *  yeni GPU tamponu oluştururdu. Bu kanca, değerler gerçekten değişmediği
 *  sürece aynı dizi referansını koruyarak o israfı önler.
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
  renk = '#191d24',
  arka = 'rgba(255,255,255,.94)',
  kucuk = false,
  gorunur = true,
  koyu = false,
}: {
  konum: V3
  children: ReactNode
  renk?: string
  arka?: string
  kucuk?: boolean
  gorunur?: boolean
  /** Uzay sahnelerinde koyu zemin üzerinde okunaklı etiket. */
  koyu?: boolean
}) {
  if (!gorunur) return null
  return (
    <Html position={konum} center zIndexRange={[20, 0]}>
      <div
        className="sahne-etiket rounded-lg px-2 py-1 font-semibold"
        style={{
          color: koyu ? '#eaf1ff' : renk,
          background: koyu ? 'rgba(10,16,30,.72)' : arka,
          fontSize: kucuk ? 11 : 12.5,
          border: koyu ? '1px solid rgba(150,175,220,.28)' : '1px solid rgba(25,29,36,.1)',
          boxShadow: koyu ? '0 2px 12px rgba(0,0,0,.5)' : '0 2px 10px rgba(25,29,36,.14)',
          backdropFilter: 'blur(4px)',
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
  renk = '#0f766e',
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
      <mesh position={[0, govde / 2, 0]} castShadow>
        <cylinderGeometry args={[kalinlik, kalinlik, govde, 14]} />
        <meshStandardMaterial
          color={renk}
          roughness={0.35}
          metalness={0.1}
          transparent={opaklik < 1}
          opacity={opaklik}
        />
      </mesh>
      <mesh position={[0, govde + baslikBoyu / 2, 0]} castShadow>
        <coneGeometry args={[kalinlik * 2.6, baslikBoyu, 18]} />
        <meshStandardMaterial
          color={renk}
          roughness={0.35}
          metalness={0.1}
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
  renk = '#8b8577',
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
      t.push({ p: [v, -0.3, 0], d: String(v) })
      t.push({ p: [-0.34, v, 0], d: String(v) })
    }
    return t
  }, [boy, eksiBoy, bolme])

  return (
    <group>
      <Cizgi points={[[-eksiBoy, 0, 0], [boy, 0, 0]]} color={renk} lineWidth={1.6} />
      <Cizgi points={[[0, -eksiBoy, 0], [0, boy, 0]]} color={renk} lineWidth={1.6} />
      {zBoy > 0 && <Cizgi points={[[0, 0, -zBoy], [0, 0, zBoy]]} color={renk} lineWidth={1.6} />}
      {adlar[0] ? (
        <Etiket konum={[boy + 0.4, 0, 0]} renk="#6b7280" kucuk>
          {adlar[0]}
        </Etiket>
      ) : null}
      {adlar[1] ? (
        <Etiket konum={[0, boy + 0.4, 0]} renk="#6b7280" kucuk>
          {adlar[1]}
        </Etiket>
      ) : null}
      {zBoy > 0 && adlar[2] ? (
        <Etiket konum={[0, 0, zBoy + 0.4]} renk="#6b7280" kucuk>
          {adlar[2]}
        </Etiket>
      ) : null}
      {tikler.map((t, i) => (
        <Etiket key={i} konum={t.p} renk="#9aa2b1" arka="transparent" kucuk>
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
  renk = '#0f766e',
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
  renk = '#4338ca',
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

export function Nokta({
  konum,
  renk = '#b45309',
  r = 0.13,
}: {
  konum: V3
  renk?: string
  r?: number
}) {
  return (
    <mesh position={konum} castShadow>
      <sphereGeometry args={[r, 24, 24]} />
      <meshStandardMaterial color={renk} roughness={0.3} metalness={0.15} />
    </mesh>
  )
}

/** Yavaşça dönen grup. */
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

export const KLAMP = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v))
export const LERP = (a: number, b: number, t: number) => a + (b - a) * KLAMP(t, 0, 1)
export type { V3 }
