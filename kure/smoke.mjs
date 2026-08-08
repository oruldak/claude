import { chromium } from 'playwright'

const KOK = 'http://127.0.0.1:4321'
const DIZIN = process.argv[2] || '.'

const sayfalar = [
  ['ana', '/'],
  ['lise', '/#/kademe/lise'],
  ['matematik12', '/#/ders/matematik/12'],
  ['moduller', '/#/moduller'],
  ['turev', '/#/modul/turev'],
  ['integral', '/#/modul/integral'],
  ['donel', '/#/modul/donel-cisim'],
  ['pisagor', '/#/modul/pisagor'],
  ['birim-cember', '/#/modul/birim-cember'],
  ['fonksiyon', '/#/modul/fonksiyon-grafik'],
  ['kesirler', '/#/modul/kesirler'],
  ['cisimler', '/#/modul/geometrik-cisimler'],
  ['egik-atis', '/#/modul/egik-atis'],
  ['sarkac', '/#/modul/sarkac'],
  ['egik-duzlem', '/#/modul/egik-duzlem'],
  ['elektrik', '/#/modul/elektrik-alan'],
  ['mercek', '/#/modul/mercek'],
  ['atom', '/#/modul/atom-modeli'],
  ['molekul', '/#/modul/molekul-geometri'],
  ['periyodik', '/#/modul/periyodik-sistem'],
  ['hucre', '/#/modul/hucre'],
  ['kalp', '/#/modul/kalp'],
  ['noron', '/#/modul/noron'],
  ['dna', '/#/modul/dna'],
  ['iskelet', '/#/modul/iskelet'],
  ['gunes', '/#/modul/gunes-sistemi'],
  ['mevsimler', '/#/modul/mevsimler'],
  ['panel', '/#/panel'],
]

const tarayici = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium',
  args: [
    '--use-gl=angle',
    '--use-angle=swiftshader',
    '--enable-unsafe-swiftshader',
    '--disable-dev-shm-usage',
    '--no-sandbox',
  ],
})
const hatalar = []

for (const [ad, yol] of sayfalar) {
  const once = hatalar.length
  // Her sayfa için yeni sekme: WebGL bağlamları birikmesin
  const sayfa = await tarayici.newPage({ viewport: { width: 1440, height: 900 } })
  sayfa.on('console', (m) => {
    if (m.type() === 'error') hatalar.push(`[konsol] ${m.text().slice(0, 300)}`)
  })
  sayfa.on('pageerror', (e) => hatalar.push(`[sayfa] ${String(e).slice(0, 300)}`))
  await sayfa.goto(KOK + yol, { waitUntil: 'networkidle' })
  // Modül sayfalarında son adıma kadar ilerle
  if (yol.includes('/modul/')) {
    for (let i = 0; i < 6; i++) {
      const dugme = sayfa.getByRole('button', { name: /sonraki/ })
      if (await dugme.count()) {
        await dugme.first().dispatchEvent('click')
        await sayfa.waitForTimeout(350)
      }
    }
    const sorular = sayfa.getByRole('button', { name: /soruları çöz/ })
    if (await sorular.count()) await sorular.first().dispatchEvent('click')
    await sayfa.waitForTimeout(300)
  }
  await sayfa.waitForTimeout(500)
  await sayfa.screenshot({ path: `${DIZIN}/${ad}.png` })
  await sayfa.close()
  const yeni = hatalar.slice(once)
  console.log(`${yeni.length ? 'HATA' : ' ok '}  ${ad.padEnd(14)} ${yol}${yeni.length ? '\n      ' + yeni.join('\n      ') : ''}`)
}

await tarayici.close()
console.log(`\nToplam hata: ${hatalar.length}`)
process.exit(hatalar.length ? 1 : 0)
