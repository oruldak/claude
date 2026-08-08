/**
 * Ders kartlarının kapak görsellerini üretir.
 *
 * Yapay bir stok fotoğraf yerine, her dersin KENDİ 3B sahnesinden gerçek bir
 * kare alınır: tarayıcı açılır, ders yüklenir, anlatım ilgili adıma getirilir
 * ve yalnızca sahne alanı kırpılarak public/kapak/<id>.jpg olarak kaydedilir.
 *
 * Kullanım:  npm run preview   (ayrı bir kabukta)
 *            npm run kapaklar
 */
import { chromium } from 'playwright'
import { mkdirSync } from 'node:fs'

const KOK = process.env.KURE_URL || 'http://127.0.0.1:4321'
const CIKTI = 'public/kapak'

/** [modül kimliği, kapak için gidilecek adım] */
const HEDEFLER = [
  ['turev', 3],
  ['integral', 2],
  ['donel-cisim', 2],
  ['birim-cember', 4],
  ['fonksiyon-grafik', 3],
  ['pisagor', 3],
  ['geometrik-cisimler', 0],
  ['kesirler', 4],
  ['egik-atis', 3],
  ['sarkac', 2],
  ['egik-duzlem', 2],
  ['elektrik-alan', 2],
  ['mercek', 3],
  ['atom-modeli', 1],
  ['molekul-geometri', 2],
  ['periyodik-sistem', 3],
  ['hucre', 2],
  ['kalp', 3],
  ['noron', 3],
  ['dna', 2],
  ['iskelet', 3],
  ['gunes-sistemi', 2],
  ['mevsimler', 3],
]

mkdirSync(CIKTI, { recursive: true })

const tarayici = await chromium.launch({
  executablePath: process.env.PLAYWRIGHT_CHROMIUM || '/opt/pw-browsers/chromium',
  args: [
    '--use-gl=angle',
    '--use-angle=swiftshader',
    '--enable-unsafe-swiftshader',
    '--disable-dev-shm-usage',
    '--no-sandbox',
  ],
})

for (const [id, adim] of HEDEFLER) {
  const sayfa = await tarayici.newPage({ viewport: { width: 1280, height: 820 } })
  try {
    await sayfa.goto(`${KOK}/#/modul/${id}`, { waitUntil: 'networkidle', timeout: 45000 })
    for (let i = 0; i < adim; i++) {
      const dugme = sayfa.getByRole('button', { name: /sonraki/ })
      if (await dugme.count()) {
        await dugme.first().dispatchEvent('click')
        await sayfa.waitForTimeout(420)
      }
    }
    // Dokular ve animasyonlar yerleşsin
    await sayfa.waitForTimeout(2600)
    const tuval = sayfa.locator('canvas').first()
    const kutu = await tuval.boundingBox()
    if (!kutu) throw new Error('sahne bulunamadı')
    // 16:9 oranında, sahnenin üst kısmına yakın kırp (nesneler orada)
    const genislik = kutu.width
    const yukseklik = Math.min(kutu.height, Math.round(genislik * (9 / 16)))
    const ustBosluk = Math.round((kutu.height - yukseklik) * 0.28)
    await sayfa.screenshot({
      path: `${CIKTI}/${id}.jpg`,
      quality: 78,
      type: 'jpeg',
      clip: {
        x: Math.round(kutu.x),
        y: Math.round(kutu.y + ustBosluk),
        width: Math.round(genislik),
        height: yukseklik,
      },
    })
    console.log(' ok ', id)
  } catch (h) {
    console.log('HATA', id, String(h).slice(0, 120))
  }
  await sayfa.close()
}

await tarayici.close()
console.log('\nkapaklar hazır →', CIKTI)
