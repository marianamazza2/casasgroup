// Genera los iconos PNG (apple-touch, PWA) y la imagen Open Graph por defecto a
// partir del favicon.svg y la identidad de marca. Rasteriza con Chromium (ya
// instalado vía Playwright). Correr manualmente cuando cambie la marca:
//   node scripts/genIcons.mjs
import { readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const PUB = join(ROOT, 'public')

const GOLD = '#a47b36'
const CREAM = '#f9f4ea'
const INK = '#1a1a18'

const svg = await readFile(join(PUB, 'favicon.svg'), 'utf8')
const svgDataUri = `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`

const browser = await chromium.launch()

// ── Iconos cuadrados (apple-touch 180, PWA 192/512) ──────────────────────────
async function renderIcon(size, file, pad = 0) {
  const page = await browser.newPage({ viewport: { width: size, height: size }, deviceScaleFactor: 1 })
  // Fondo oro a sangre (maskable-friendly): el SVG ya trae el fondo, pero para
  // apple-touch conviene que ocupe todo el lienzo sin transparencia.
  await page.setContent(
    `<body style="margin:0"><div style="width:${size}px;height:${size}px;background:${GOLD};display:flex;align-items:center;justify-content:center">
       <img src="${svgDataUri}" style="width:${size - pad * 2}px;height:${size - pad * 2}px"/>
     </div></body>`,
  )
  const buf = await page.screenshot({ type: 'png' })
  await writeFile(join(PUB, file), buf)
  await page.close()
  console.log(`✔ ${file} (${size}×${size})`)
}

await renderIcon(180, 'apple-touch-icon.png')
await renderIcon(192, 'icon-192.png')
await renderIcon(512, 'icon-512.png')

// ── Imagen Open Graph por defecto (1200×630) ─────────────────────────────────
const ogPage = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 })
await ogPage.setContent(`
  <body style="margin:0">
    <div style="width:1200px;height:630px;background:${INK};display:flex;flex-direction:column;
                align-items:center;justify-content:center;font-family:Georgia,'Times New Roman',serif;color:${CREAM}">
      <div style="width:132px;height:132px;border-radius:30px;background:${GOLD};display:flex;
                  align-items:center;justify-content:center;font-size:70px;font-weight:600;
                  letter-spacing:-2px;color:${CREAM};margin-bottom:38px">CG</div>
      <div style="font-size:66px;font-weight:600;letter-spacing:8px">CASAS GROUP</div>
      <div style="font-size:30px;letter-spacing:1px;color:${GOLD};margin-top:14px;font-family:'DM Sans',Arial,sans-serif">
        Inmobiliaria en Barcelona
      </div>
    </div>
  </body>`)
const ogBuf = await ogPage.screenshot({ type: 'jpeg', quality: 88 })
await writeFile(join(PUB, 'og-default.jpg'), ogBuf)
console.log('✔ og-default.jpg (1200×630)')

await browser.close()
