// ─────────────────────────────────────────────────────────────────────────────
// Prerender estático del SPA (auditoría SEO §1.1 — opción B)
//
// Problema raíz: la web es una SPA (createRoot en cliente). Los crawlers reciben
// un <div id="root"> vacío; los de redes sociales (WhatsApp, Facebook, X) no
// ejecutan JS en absoluto. Este script genera un HTML real por ruta EN BUILD:
//
//   1. Sirve el dist/ recién construido con un server estático + fallback SPA.
//   2. Abre cada ruta en un Chromium headless (Playwright, ya instalado) y deja
//      que el router de TanStack renderice el contenido real.
//   3. Vuelca el DOM resultante a dist/<ruta>/index.html.
//
// Las fichas de propiedad (/propiedades/<id>) se descubren crawleando el listado,
// así el prerender es agnóstico a VITE_DATA_SOURCE (hardcoded | sheet | merge).
//
// En producción (Vercel) el sistema de ficheros se resuelve ANTES que el rewrite
// catch-all de vercel.json, de modo que cada ruta sirve su HTML prerenderizado y
// el rewrite queda solo como fallback para rutas no cubiertas. Al cargar, React
// (createRoot) limpia #root y re-renderiza: no hay hidratación ni mismatch.
//
// Uso:  node scripts/prerender.mjs   (corre automáticamente tras `vite build`)
// ─────────────────────────────────────────────────────────────────────────────
import { createServer } from 'node:http'
import { readFile, writeFile, mkdir, stat } from 'node:fs/promises'
import { join, extname, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DIST = join(__dirname, '..', 'dist')
const PORT = 4319 // puerto poco común para no chocar con dev/preview

// Rutas estáticas conocidas (todas las del routeTree salvo la dinámica $id).
// Las fichas de propiedad se añaden en runtime crawleando /propiedades.
const STATIC_ROUTES = [
  '/',
  '/propiedades',
  '/vender',
  '/nosotros',
  '/contacto',
  '/trabaja-con-nosotros',
  '/servicios/administracion-de-comunidades',
  '/servicios/alarmas',
  '/servicios/cambio-de-suministros',
  '/servicios/hipotecas',
  '/servicios/reformas',
  '/servicios/seguros',
]

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.map': 'application/json; charset=utf-8',
}

// Server estático con fallback SPA: si el path no es un fichero real, sirve
// index.html para que el router de cliente resuelva la ruta.
function startServer() {
  const indexHtmlPromise = readFile(join(DIST, 'index.html'))
  const server = createServer(async (req, res) => {
    try {
      const urlPath = decodeURIComponent((req.url || '/').split('?')[0])
      const ext = extname(urlPath)
      if (ext) {
        // Petición a un asset concreto (tiene extensión).
        const filePath = join(DIST, urlPath)
        try {
          const body = await readFile(filePath)
          res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' })
          res.end(body)
          return
        } catch {
          res.writeHead(404)
          res.end('Not found')
          return
        }
      }
      // Ruta de navegación → fallback SPA.
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
      res.end(await indexHtmlPromise)
    } catch (err) {
      res.writeHead(500)
      res.end(String(err))
    }
  })
  return new Promise((resolve) => {
    server.listen(PORT, () => resolve(server))
  })
}

// Espera a que el SPA haya renderizado contenido real y estable.
async function waitForApp(page) {
  // La cabecera se monta en todas las rutas (RootLayout → SiteNav).
  await page.waitForSelector('header.site-nav', { timeout: 15000 })
  // #root con hijos = React ya pintó el árbol.
  await page.waitForFunction(
    () => {
      const root = document.getElementById('root')
      return !!root && root.childElementCount > 0
    },
    { timeout: 15000 },
  )
  // Margen para que asienten crossfade (framer-motion) y datos asincronos.
  await page.waitForTimeout(600)
}

// Snapshotea una ruta y la escribe como <ruta>/index.html en dist/.
async function prerenderRoute(page, route) {
  const url = `http://localhost:${PORT}${route}`
  await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 }).catch(async () => {
    // networkidle puede no llegar por los mapas (tiles en streaming): reintenta
    // con un criterio más laxo y sigue.
    await page.goto(url, { waitUntil: 'load', timeout: 30000 })
  })
  await waitForApp(page)

  const html = await page.evaluate(() => '<!doctype html>\n' + document.documentElement.outerHTML)

  const outPath =
    route === '/'
      ? join(DIST, 'index.html')
      : join(DIST, route, 'index.html')
  await mkdir(dirname(outPath), { recursive: true })
  await writeFile(outPath, html, 'utf8')
  return outPath
}

// Descubre las URLs de fichas de propiedad crawleando el listado.
async function discoverPropertyRoutes(page) {
  await page.goto(`http://localhost:${PORT}/propiedades`, { waitUntil: 'networkidle', timeout: 30000 }).catch(() => {})
  await waitForApp(page)
  const hrefs = await page.evaluate(() => {
    const set = new Set()
    document.querySelectorAll('a[href^="/propiedades/"]').forEach((a) => {
      const href = a.getAttribute('href') || ''
      const m = href.match(/^\/propiedades\/\d+$/)
      if (m) set.add(m[0])
    })
    return [...set]
  })
  return hrefs.sort()
}

async function main() {
  // Verifica que exista un build.
  try {
    await stat(join(DIST, 'index.html'))
  } catch {
    console.error('[prerender] No existe dist/index.html. Ejecuta `vite build` antes.')
    process.exit(1)
  }

  const server = await startServer()
  const browser = await chromium.launch()
  const page = await browser.newPage()

  try {
    const propertyRoutes = await discoverPropertyRoutes(page)
    const routes = [...STATIC_ROUTES, ...propertyRoutes]
    console.log(
      `[prerender] ${routes.length} rutas (${STATIC_ROUTES.length} estáticas + ${propertyRoutes.length} fichas)`,
    )

    let ok = 0
    for (const route of routes) {
      try {
        await prerenderRoute(page, route)
        ok += 1
        console.log(`[prerender] ✓ ${route}`)
      } catch (err) {
        console.error(`[prerender] ✗ ${route}: ${err.message || err}`)
      }
    }
    console.log(`[prerender] Hecho: ${ok}/${routes.length} rutas prerenderizadas.`)
    if (ok < routes.length) process.exitCode = 1
  } finally {
    await browser.close()
    server.close()
  }
}

main().catch((err) => {
  console.error('[prerender] Error fatal:', err)
  process.exit(1)
})
