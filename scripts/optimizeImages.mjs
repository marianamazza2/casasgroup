// Convierte a WebP las imágenes locales de /public (JPG/PNG) para que pesen
// menos en la web. Correr manualmente cuando se añadan imágenes nuevas:
//   node scripts/optimizeImages.mjs           → convierte lo que falte
//   node scripts/optimizeImages.mjs --force   → reconvierte todo
//
// NOTA: las fotos de los inmuebles NO pasan por aquí. Vienen de Cloudinary y ya
// se sirven en WebP/AVIF gracias a `f_auto` (ver src/lib/cloudinary.ts). Este
// script es solo para los assets estáticos del repo.
//
// Rasteriza con Chromium (ya instalado vía Playwright), igual que genIcons.mjs,
// para no añadir dependencias nativas de compresión al proyecto.
import { readdir, readFile, writeFile, stat } from 'node:fs/promises'
import { dirname, extname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const PUB = join(ROOT, 'public')

// Calidad WebP. 82 es el punto habitual donde no se nota la diferencia a ojo
// en fotografía y el archivo baja bastante respecto al JPG original.
const QUALITY = 82

// Ancho máximo: nada en la web se muestra por encima de esto, así que
// reescalamos lo que venga más grande (los renders suelen llegar a 2400px).
const MAX_WIDTH = 1920

const FORCE = process.argv.includes('--force')
const SOURCE_EXT = new Set(['.jpg', '.jpeg', '.png'])

// Los iconos y la imagen Open Graph los genera genIcons.mjs y deben seguir
// siendo PNG/JPG: las plataformas que los consumen no aceptan WebP de forma
// fiable (apple-touch-icon, manifest, previsualizaciones al compartir).
const SKIP = new Set([
  'apple-touch-icon.png',
  'icon-192.png',
  'icon-512.png',
  'og-default.jpg',
])

/** Lista recursiva de archivos bajo `dir`. */
async function walk(dir) {
  const out = []
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) out.push(...(await walk(full)))
    else out.push(full)
  }
  return out
}

const mimeOf = (ext) => (ext === '.png' ? 'image/png' : 'image/jpeg')
const kb = (bytes) => `${(bytes / 1024).toFixed(0)} KB`

const files = (await walk(PUB))
  .filter((f) => SOURCE_EXT.has(extname(f).toLowerCase()))
  .filter((f) => !SKIP.has(relative(PUB, f).split('/').pop()))
  .sort()

if (files.length === 0) {
  console.log('No hay JPG/PNG que convertir en /public.')
  process.exit(0)
}

const browser = await chromium.launch()
const page = await browser.newPage()

let totalBefore = 0
let totalAfter = 0
let converted = 0

for (const file of files) {
  const rel = relative(PUB, file)
  const target = file.replace(/\.(jpe?g|png)$/i, '.webp')

  // Si el .webp ya existe y es más nuevo que el original, no rehacemos el trabajo.
  if (!FORCE) {
    try {
      const [src, dst] = await Promise.all([stat(file), stat(target)])
      if (dst.mtimeMs >= src.mtimeMs) {
        console.log(`· ${rel} → ya convertido (usa --force para rehacerlo)`)
        continue
      }
    } catch {
      /* el .webp no existe todavía: seguimos y lo generamos */
    }
  }

  const buf = await readFile(file)
  const ext = extname(file).toLowerCase()
  const dataUri = `data:${mimeOf(ext)};base64,${buf.toString('base64')}`

  // El encoding ocurre dentro de Chromium: dibujamos la imagen en un canvas
  // (reescalando si hace falta) y la exportamos como WebP.
  const { dataUrl, width, height } = await page.evaluate(
    async ({ src, quality, maxWidth }) => {
      const img = new Image()
      img.src = src
      await img.decode()

      const scale = Math.min(1, maxWidth / img.naturalWidth)
      const width = Math.round(img.naturalWidth * scale)
      const height = Math.round(img.naturalHeight * scale)

      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')
      ctx.imageSmoothingQuality = 'high'
      ctx.drawImage(img, 0, 0, width, height)

      return { dataUrl: canvas.toDataURL('image/webp', quality), width, height }
    },
    { src: dataUri, quality: QUALITY / 100, maxWidth: MAX_WIDTH },
  )

  if (!dataUrl.startsWith('data:image/webp')) {
    console.error(`✖ ${rel} → Chromium no devolvió WebP, se omite`)
    continue
  }

  const out = Buffer.from(dataUrl.split(',')[1], 'base64')
  await writeFile(target, out)

  const saved = ((1 - out.length / buf.length) * 100).toFixed(0)
  totalBefore += buf.length
  totalAfter += out.length
  converted++
  console.log(
    `✔ ${rel} → ${relative(PUB, target)}  ${kb(buf.length)} → ${kb(out.length)} (−${saved}%)  ${width}×${height}`,
  )
}

await browser.close()

if (converted > 0) {
  const saved = ((1 - totalAfter / totalBefore) * 100).toFixed(0)
  console.log(`\n${converted} imagen(es): ${kb(totalBefore)} → ${kb(totalAfter)} (−${saved}%)`)
  console.log('Recordá apuntar el CSS/HTML a los .webp y borrar los originales que ya no se usen.')
}
