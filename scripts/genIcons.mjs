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
// Render dorado del hero + velo #0000007a y la marca como en la home: GROUP
// pequeño arriba, CASAS grande abajo, Cormorant Garamond 300 en crema.
// Si cambia el diseño, cambiar también el nombre del archivo (y sus usos):
// WhatsApp/Meta cachean la imagen por URL.
const OG_FILE = 'og-group-casas-2.jpg'
const heroImg = (await readFile(join(PUB, 'hero-building-gold.webp'))).toString('base64')
const ogPage = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 })
await ogPage.setContent(`
  <head>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300&family=DM+Sans:wght@400&display=swap" />
  </head>
  <body style="margin:0">
    <div style="width:1200px;height:630px;position:relative;background:url(data:image/webp;base64,${heroImg}) center/cover">
      <div style="position:absolute;inset:0;background:#0000007a"></div>
      <div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;
                  color:${CREAM};font-family:'Cormorant Garamond';font-weight:300;-webkit-text-stroke:1px ${CREAM};paint-order:stroke fill">
        <div style="font-size:52px;letter-spacing:.3em;margin-left:.3em;line-height:.95;margin-bottom:10px">GROUP</div>
        <div style="font-size:144px;letter-spacing:.34em;margin-left:.34em;line-height:.95;-webkit-text-stroke-width:1.5px">CASAS</div>
        <div style="font-family:'DM Sans';font-size:22px;letter-spacing:6px;margin-top:34px;text-transform:uppercase;-webkit-text-stroke:0">
          Inmobiliaria en Barcelona
        </div>
      </div>
    </div>
  </body>`)
await ogPage.waitForLoadState('networkidle')
await ogPage.evaluate(() => document.fonts.ready)
if (!(await ogPage.evaluate(() => document.fonts.check("300 52px 'Cormorant Garamond'"))))
  throw new Error('genIcons: Cormorant Garamond no cargó (¿sin red?)')
const ogBuf = await ogPage.screenshot({ type: 'jpeg', quality: 85 })
await writeFile(join(PUB, OG_FILE), ogBuf)
console.log(`✔ ${OG_FILE} (1200×630)`)

await browser.close()
