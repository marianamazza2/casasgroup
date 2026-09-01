// ─────────────────────────────────────────────────────────────────────────────
// scripts/buildData.mjs  —  Paso 2 + Paso 3 de la implementación (FASE 1)
//
// Corre ANTES de `vite build`. Hace:
//   1. Lee el Google Sheet (publicado como CSV) y parsea las columnas.
//   2. Filtra las filas con `publicado = SI`.
//   3. Por cada fila, lista la carpeta de Cloudinary (inmuebles/<ref_fotos>/)
//      vía Admin API; la foto "cover" es la portada, el resto la galería.
//   4. Transforma cada `Inmueble` (esquema del Sheet) → `Property` (tipo de la web).
//   5. Escribe src/lib/generatedProperties.ts con el array tipado.
//
// No requiere dependencias externas: usa fetch nativo (Node 18+).
// Si faltan credenciales (entorno local sin setup), genera un array vacío y avisa,
// de modo que `vite build` siga funcionando.
// ─────────────────────────────────────────────────────────────────────────────

import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')
const OUT_FILE = resolve(ROOT, 'src/lib/generatedProperties.ts')
const SITEMAP_FILE = resolve(ROOT, 'public/sitemap.xml')

// Dominio del sitio para las URLs absolutas del sitemap. Configurable por env
// (SITE_URL) por si cambia; sin barra final para no duplicarla al concatenar.
const SITE_URL = (process.env.SITE_URL || 'https://groupcasas.com').replace(/\/+$/, '')

// ── Carga de .env.local / .env (Node no lo hace solo) ────────────────────────
// En Vercel las env vars ya están en process.env, así que estos archivos no
// existirán y no pasa nada. Localmente permite correr el script con tus claves.
function loadEnvFile(file) {
  const path = resolve(ROOT, file)
  if (!existsSync(path)) return
  for (const raw of readFileSync(path, 'utf8').split('\n')) {
    const line = raw.trim()
    if (!line || line.startsWith('#')) continue
    const eq = line.indexOf('=')
    if (eq === -1) continue
    const key = line.slice(0, eq).trim()
    let value = line.slice(eq + 1).trim()
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }
    if (!(key in process.env)) process.env[key] = value
  }
}
loadEnvFile('.env.local')
loadEnvFile('.env')

// El loader de arriba ya limpia los .env locales, pero en Vercel `process.env`
// llega tal cual se pegó en el panel: un salto de línea o un espacio invisible al
// final de SHEET_CSV_URL viaja dentro de la URL y Google responde HTTP 400. Por
// eso normalizamos acá, no en el loader.
const env = (key) => process.env[key]?.trim() || undefined

const SHEET_CSV_URL = env('SHEET_CSV_URL')
const CLOUD_NAME = env('VITE_CLOUDINARY_CLOUD_NAME')
const CLOUDINARY_API_KEY = env('CLOUDINARY_API_KEY')
const CLOUDINARY_API_SECRET = env('CLOUDINARY_API_SECRET')

// Carpeta raíz de los inmuebles en Cloudinary.
const CLOUDINARY_ROOT = 'inmuebles'

// ── Transformaciones de Cloudinary (espejo de src/lib/cloudinary.ts) ─────────
// El cliente recibe URLs ya construidas; las armamos acá en build time.
const TRANSFORMS = {
  card: 'c_fill,ar_4:3,w_900,f_auto,q_auto',
  gallery: 'c_limit,w_1600,f_auto,q_auto',
  thumbnail: 'c_fill,ar_1:1,w_200,f_auto,q_auto',
}
function cloudinaryUrl(publicId, context = 'card') {
  if (!CLOUD_NAME) return publicId
  const cleanId = String(publicId).replace(/^\/+/, '')
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${TRANSFORMS[context]}/${cleanId}`
}

// ── Parser de CSV ────────────────────────────────────────────────────────────
// Maneja campos entrecomillados con comas, comillas escapadas ("") y saltos de
// línea dentro de comillas. Devuelve un array de arrays de strings.
function parseCSV(text) {
  const rows = []
  let row = []
  let field = ''
  let inQuotes = false
  // Normaliza CRLF → LF.
  const s = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n')
  for (let i = 0; i < s.length; i++) {
    const c = s[i]
    if (inQuotes) {
      if (c === '"') {
        if (s[i + 1] === '"') { field += '"'; i++ }
        else inQuotes = false
      } else field += c
    } else if (c === '"') {
      inQuotes = true
    } else if (c === ',') {
      row.push(field); field = ''
    } else if (c === '\n') {
      row.push(field); rows.push(row); row = []; field = ''
    } else field += c
  }
  // Último campo/fila si el archivo no termina en \n.
  if (field !== '' || row.length) { row.push(field); rows.push(row) }
  return rows
}

// ── Helpers de parseo de celdas ──────────────────────────────────────────────
const norm = (v) => String(v ?? '').trim()
// Rebranding 2026: la marca antigua "Red Casas" no debe aparecer en la web.
// Se reemplaza en cualquier texto proveniente del Sheet (case-insensitive).
const rebrand = (v) => norm(v).replace(/red\s+casas/gi, 'Group Casas')
const isYes = (v) => norm(v).toUpperCase() === 'SI'
function toNumber(v) {
  // Para enteros tipo precio/m²/hab: "320000", "320.000" → quita separadores de miles.
  const cleaned = norm(v).replace(/[^\d.,-]/g, '').replace(/\.(?=\d{3}\b)/g, '')
  const n = parseFloat(cleaned.replace(',', '.'))
  return Number.isFinite(n) ? n : 0
}
function toFloat(v) {
  // Para coordenadas: el punto es decimal (41.404), no separador de miles.
  // Acepta también coma decimal (41,404).
  const n = parseFloat(norm(v).replace(',', '.'))
  return Number.isFinite(n) ? n : undefined
}
// Encuadre plausible para el ámbito del sitio (provincias de Barcelona y
// Tarragona, con margen). Cualquier coordenada fuera de acá es un error de carga,
// no un inmueble lejano: el Sheet solo tiene inmuebles de esta zona.
const AMBITO = { latMin: 40.4, latMax: 42.9, lngMin: 0.1, lngMax: 3.4 }

/**
 * Valida el par lat/lng del Sheet, que se carga a mano y llega con los errores
 * típicos: punto decimal de más ("413.9" por "41.39"), lat y lng invertidos, o
 * una celda pegada de otra fila. Una coordenada fuera de rango hace que MapLibre
 * lance ("Invalid LngLat latitude value") y tumbe el render de la ficha entera,
 * así que la descartamos acá y avisamos por consola: el inmueble se publica
 * igual, solo que sin mapa. Preferimos avisar y no adivinar: corregir el dato en
 * el Sheet es trabajo de quien lo carga, y auto-invertir en silencio taparía el
 * error hasta que un día mueva un inmueble de verdad.
 */
function validCoords(lat, lng, ref) {
  if (lat === undefined || lng === undefined) return undefined
  const dentro = (v, min, max) => v >= min && v <= max
  const { latMin, latMax, lngMin, lngMax } = AMBITO
  if (dentro(lat, latMin, latMax) && dentro(lng, lngMin, lngMax)) return { lat, lng }
  if (dentro(lng, latMin, latMax) && dentro(lat, lngMin, lngMax)) {
    console.warn(
      `  ⚠️  ${ref}: lat y lng parecen invertidos (lat ${lat}, lng ${lng}) → se ignoran. ` +
      `En el Sheet deberían ser lat=${lng}, lng=${lat}. El inmueble se publica sin mapa.`,
    )
    return undefined
  }
  console.warn(
    `  ⚠️  ${ref}: coordenadas fuera del ámbito del sitio (lat ${lat}, lng ${lng}) → se ignoran. ` +
    `Revisá el punto decimal en el Sheet. El inmueble se publica sin mapa.`,
  )
  return undefined
}

function parseDate(v) {
  // Normaliza a ISO 'YYYY-MM-DD'. Acepta 'YYYY-MM-DD' o 'DD/MM/YYYY' (o con '-').
  const s = norm(v)
  let m = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/)
  if (m) return `${m[1]}-${m[2].padStart(2, '0')}-${m[3].padStart(2, '0')}`
  m = s.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/)
  if (m) return `${m[3]}-${m[2].padStart(2, '0')}-${m[1].padStart(2, '0')}`
  return undefined
}

const ESTADOS_VALIDOS = ['EN VENTA', 'RESERVADO', 'VENDIDO', 'ALQUILADO']

// Columnas SI/NO del Sheet → etiqueta que se muestra en la ficha ("Características").
// El orden de esta lista es el orden en que aparecen las etiquetas en la web.
//
// Sumar una característica nueva = agregar la columna al Sheet (con el nombre exacto
// de la izquierda, en minúsculas y sin tildes) + una línea acá. No hay que tocar
// nada más: la ficha las pinta como etiquetas de texto, sin iconos por nombre.
const FEATURES_POR_COLUMNA = [
  ['ascensor', 'Ascensor'],
  ['terraza', 'Terraza'],
  ['balcon', 'Balcón'],
  ['galeria', 'Galería'],
  ['patio', 'Patio'],
  ['jardin_privado', 'Jardín privado'],
  ['garaje', 'Garaje'],
  ['trastero', 'Trastero'],
  ['cocina_equipada', 'Cocina equipada'],
  ['cocina_office', 'Cocina office'],
  ['electrodomesticos', 'Electrodomésticos'],
  ['aire_acondicionado', 'Aire acondicionado'],
  ['armarios_empotrados', 'Armarios empotrados'],
  ['transporte_publico', 'Cerca de transporte público'],
]

// ── Mapas de enums Sheet → Property ──────────────────────────────────────────
const MODE_BY_OPERACION = { VENTA: 'compra', ALQUILER: 'alquiler' }
const CATEGORY_BY_TIPO = {
  PISO: 'piso', DUPLEX: 'piso', CHALET: 'chalet', LOCAL: 'local', PARKING: 'parking',
}
const TIPO_LABEL = {
  PISO: 'Piso', DUPLEX: 'Dúplex', CHALET: 'Chalet', LOCAL: 'Local', PARKING: 'Parking',
}
function formatPrice(precio, mode) {
  const formatted = new Intl.NumberFormat('es-ES').format(precio)
  return mode === 'alquiler' ? `${formatted} €/mes` : `${formatted} €`
}

// ── Cloudinary Admin API: listar fotos de una carpeta ────────────────────────
// Usa la Search API por `asset_folder` (no por prefijo de public_id). Esto soporta
// las "carpetas dinámicas" — el modo por defecto de las cuentas nuevas — donde la
// carpeta visual está separada del public_id (que queda aleatorio). La portada y el
// orden se resuelven con el `display_name` (el nombre que ves en la Media Library:
// cover.jpg, 01-salon.jpg, …), no con el public_id.
// Devuelve [{ id: public_id (para la URL), name: display_name en minúscula }] ordenado.
async function listPhotos(refFotos) {
  if (!CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) return []
  const folder = `${CLOUDINARY_ROOT}/${refFotos}`
  const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/resources/search`
  const auth = Buffer.from(`${CLOUDINARY_API_KEY}:${CLOUDINARY_API_SECRET}`).toString('base64')
  // `asset_folder` cubre carpetas dinámicas; `folder` cubre cuentas con carpetas fijas.
  const expression = `asset_folder="${folder}" OR folder="${folder}"`
  const res = await fetch(url, {
    method: 'POST',
    headers: { Authorization: `Basic ${auth}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ expression, max_results: 200 }),
  })
  if (!res.ok) {
    console.warn(`  ⚠️  Cloudinary ${res.status} para "${folder}" — sin fotos`)
    return []
  }
  const data = await res.json()
  return (data.resources ?? [])
    .map((r) => ({
      id: r.public_id,
      name: String(r.display_name || r.filename || r.public_id).toLowerCase(),
    }))
    .sort((a, b) => a.name.localeCompare(b.name, 'es', { numeric: true }))
}

// ── Transformación Inmueble → Property (Paso 3) ──────────────────────────────
async function toProperty(row, usedIds) {
  const ref = norm(row.ref)
  const operacion = norm(row.operacion).toUpperCase()
  const tipo = norm(row.tipo).toUpperCase()
  // Texto libre: se muestra tal cual se escriba en el Sheet (sin mapeos).
  const etiqueta = norm(row.etiqueta)
  const mode = MODE_BY_OPERACION[operacion] ?? 'compra'
  const precio = toNumber(row.precio)

  // id numérico estable a partir de los dígitos del ref (RC-042 → 42).
  let id = parseInt(ref.replace(/\D/g, ''), 10)
  if (!Number.isFinite(id) || usedIds.has(id)) {
    // Fallback: siguiente id libre, para no colisionar.
    id = Math.max(0, ...usedIds) + 1
    console.warn(`  ⚠️  ref "${ref}" sin id numérico único → asignado ${id}`)
  }
  usedIds.add(id)

  const photos = await listPhotos(norm(row.ref_fotos) || ref.toLowerCase())
  // La foto cuyo display_name empieza con "cover" es la portada; el resto va a la
  // galería en su orden (01-, 02-…). Si no hay ninguna "cover", la primera ordenada
  // hace de portada (compatibilidad hacia atrás).
  const coverIdx = photos.findIndex((p) => p.name.startsWith('cover'))
  const ordered = coverIdx >= 0
    ? [photos[coverIdx], ...photos.filter((_, i) => i !== coverIdx)]
    : photos
  const image = ordered.length ? cloudinaryUrl(ordered[0].id, 'card') : ''
  const images = ordered.map((p) => cloudinaryUrl(p.id, 'gallery'))

  const features = FEATURES_POR_COLUMNA
    .filter(([columna]) => isYes(row[columna]))
    .map(([, etiqueta]) => etiqueta)

  const property = {
    id,
    city: norm(row.ciudad),
    zone: norm(row.zona),
    // Título = descripción corta (la dirección exacta NUNCA se muestra). Si falta,
    // se cae a un título genérico por tipo + zona.
    title:
      rebrand(row.descripcion_corta) ||
      `${TIPO_LABEL[tipo] ?? 'Inmueble'} en ${norm(row.zona) || norm(row.ciudad)}`,
    beds: toNumber(row.habitaciones),
    baths: toNumber(row.banos),
    m2: toNumber(row.superficie_m2),
    price: precio,
    priceLabel: formatPrice(precio, mode),
    mode,
    category: CATEGORY_BY_TIPO[tipo] ?? 'piso',
    image,
    desc: rebrand(row.descripcion_larga) || rebrand(row.descripcion_corta),
    features,
  }
  // Campos opcionales: solo se incluyen si aplican.
  if (etiqueta) property.tag = etiqueta
  if (images.length) property.images = images
  if (norm(row.planta)) property.floor = norm(row.planta)
  const coords = validCoords(toFloat(row.lat), toFloat(row.lng), ref)
  if (coords) property.coords = coords

  // Estado, certificado y fecha de alta. La dirección exacta (row.direccion) se
  // omite a propósito: nunca debe mostrarse ni viajar al cliente (privacidad).
  const estado = norm(row.estado).toUpperCase()
  if (ESTADOS_VALIDOS.includes(estado)) property.status = estado
  const cert = norm(row.certificado_energetico).toUpperCase()
  if (/^[A-G]$/.test(cert)) property.cert = cert
  const fecha = parseDate(row.fecha_alta)
  if (fecha) property.dateAdded = fecha

  return property
}

// ── Sitemap.xml ──────────────────────────────────────────────────────────────
// Rutas estáticas del sitio (deben reflejar src/routes/*). El detalle de
// propiedad (/propiedades/$id) se añade dinámicamente, una <url> por inmueble.
const STATIC_ROUTES = [
  { path: '/', changefreq: 'weekly', priority: '1.0' },
  { path: '/propiedades', changefreq: 'daily', priority: '0.9' },
  { path: '/vender', changefreq: 'monthly', priority: '0.8' },
  { path: '/contacto', changefreq: 'monthly', priority: '0.7' },
  { path: '/nosotros', changefreq: 'monthly', priority: '0.6' },
  { path: '/servicios/administracion-de-comunidades', changefreq: 'monthly', priority: '0.7' },
  { path: '/servicios/alarmas', changefreq: 'monthly', priority: '0.7' },
  { path: '/servicios/cambio-de-suministros', changefreq: 'monthly', priority: '0.7' },
  { path: '/servicios/hipotecas', changefreq: 'monthly', priority: '0.7' },
  { path: '/servicios/reformas', changefreq: 'monthly', priority: '0.7' },
  { path: '/servicios/seguros', changefreq: 'monthly', priority: '0.7' },
]

const xmlEscape = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

function writeSitemap(properties) {
  const today = new Date().toISOString().slice(0, 10) // YYYY-MM-DD para rutas estáticas
  const urls = []

  for (const r of STATIC_ROUTES) {
    urls.push(
      `  <url>\n` +
      `    <loc>${xmlEscape(SITE_URL + r.path)}</loc>\n` +
      `    <lastmod>${today}</lastmod>\n` +
      `    <changefreq>${r.changefreq}</changefreq>\n` +
      `    <priority>${r.priority}</priority>\n` +
      `  </url>`
    )
  }

  for (const p of properties) {
    // dateAdded (ISO YYYY-MM-DD) si existe; si no, la fecha del build.
    const lastmod = /^\d{4}-\d{2}-\d{2}$/.test(String(p.dateAdded)) ? p.dateAdded : today
    urls.push(
      `  <url>\n` +
      `    <loc>${xmlEscape(`${SITE_URL}/propiedades/${p.id}`)}</loc>\n` +
      `    <lastmod>${lastmod}</lastmod>\n` +
      `    <changefreq>weekly</changefreq>\n` +
      `    <priority>0.8</priority>\n` +
      `  </url>`
    )
  }

  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    urls.join('\n') + '\n' +
    `</urlset>\n`
  writeFileSync(SITEMAP_FILE, xml, 'utf8')
  console.log(`✔ sitemap.xml escrito (${STATIC_ROUTES.length} rutas + ${properties.length} inmuebles).`)
}

// ── Main ─────────────────────────────────────────────────────────────────────
function writeOutput(properties) {
  const banner =
    '// ⚠️  ARCHIVO GENERADO por scripts/buildData.mjs — NO EDITAR A MANO.\n' +
    '// Se regenera en cada build a partir del Google Sheet + Cloudinary.\n'
  const body =
    `import type { Property } from './types'\n\n` +
    `export const generatedProperties: Property[] = ${JSON.stringify(properties, null, 2)}\n`
  writeFileSync(OUT_FILE, banner + '\n' + body, 'utf8')
  // El sitemap se deriva de las mismas propiedades → se regenera siempre en sync.
  writeSitemap(properties)
}

async function main() {
  console.log('▶ buildData: generando datos de inmuebles…')

  if (!SHEET_CSV_URL) {
    console.warn('  ⚠️  Falta SHEET_CSV_URL — genero generatedProperties.ts vacío.')
    writeOutput([])
    console.log('✔ generatedProperties.ts escrito (0 inmuebles).')
    return
  }
  if (!CLOUD_NAME) {
    console.warn('  ⚠️  Falta VITE_CLOUDINARY_CLOUD_NAME — las fotos quedarán vacías.')
  }

  const res = await fetch(SHEET_CSV_URL)
  if (!res.ok) {
    // Pistas para los códigos que devuelve Google al publicar un Sheet como CSV:
    // 400 = URL malformada (típico: caracteres de más pegados en la env var),
    // 401/404 = el Sheet dejó de estar publicado o el gid ya no existe.
    const hint =
      res.status === 400
        ? ' Revisá el valor de SHEET_CSV_URL en Vercel: suele ser un espacio o salto de línea de más al pegarla.'
        : res.status === 401 || res.status === 404
          ? ' El Sheet dejó de estar publicado en la web, o el gid de la pestaña cambió (Archivo → Compartir → Publicar en la web).'
          : ''
    throw new Error(`No se pudo leer el Sheet: HTTP ${res.status}.${hint}`)
  }
  const rows = parseCSV(await res.text()).filter((r) => r.some((c) => norm(c) !== ''))
  if (!rows.length) throw new Error('El Sheet está vacío.')

  const headers = rows[0].map((h) => norm(h).toLowerCase())
  const records = rows.slice(1).map((cells) => {
    const obj = {}
    headers.forEach((h, i) => { obj[h] = cells[i] ?? '' })
    return obj
  })

  const published = records.filter((r) => isYes(r.publicado))
  console.log(`  ${records.length} filas · ${published.length} publicadas`)

  // ── Blindaje 1: evitar el "build vacío" ────────────────────────────────────
  // Llegamos acá solo tras leer el Sheet con éxito (si falta SHEET_CSV_URL se
  // retorna antes con un array vacío para builds locales). Por eso, 0 inmuebles
  // publicados acá significa que el Sheet leído daría una web vacía: casi seguro un
  // error humano (todo en publicado=NO, columna `publicado` rota, o filas borradas),
  // no algo intencional. En vez de publicar sin inmuebles, fallamos a propósito:
  // Vercel descarta este build y deja en vivo la última versión buena.
  if (published.length === 0) {
    throw new Error(
      `El Sheet tiene ${records.length} fila(s) de datos pero 0 publicadas. ` +
      `Aborto para no publicar una web vacía (revisá la columna "publicado"). ` +
      `Se conserva en vivo la última versión buena.`
    )
  }

  const usedIds = new Set()
  const properties = []
  for (const row of published) {
    properties.push(await toProperty(row, usedIds))
  }

  writeOutput(properties)
  console.log(`✔ generatedProperties.ts escrito (${properties.length} inmuebles).`)
}

main().catch((err) => {
  console.error('✖ buildData falló:', err.message)
  process.exit(1)
})
