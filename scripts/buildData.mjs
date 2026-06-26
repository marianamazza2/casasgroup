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

const {
  SHEET_CSV_URL,
  VITE_CLOUDINARY_CLOUD_NAME: CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
} = process.env

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

// ── Mapas de enums Sheet → Property ──────────────────────────────────────────
const MODE_BY_OPERACION = { VENTA: 'compra', ALQUILER: 'alquiler' }
const CATEGORY_BY_TIPO = {
  PISO: 'piso', DUPLEX: 'piso', CHALET: 'chalet', LOCAL: 'local', PARKING: 'parking',
}
const TIPO_LABEL = {
  PISO: 'Piso', DUPLEX: 'Dúplex', CHALET: 'Chalet', LOCAL: 'Local', PARKING: 'Parking',
}
// La unión Property.tag es cerrada ('Nuevo'|'Destacado'|'Exclusiva'); mapeamos
// las etiquetas del Sheet a esos valores. Ajustable si se cambia el tipo.
const TAG_BY_ETIQUETA = {
  DESTACADO: 'Destacado', OPORTUNIDAD: 'Exclusiva', REBAJADO: 'Nuevo',
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
  const etiqueta = norm(row.etiqueta).toUpperCase()
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

  const features = []
  if (isYes(row.ascensor)) features.push('Ascensor')
  if (isYes(row.terraza)) features.push('Terraza')
  if (isYes(row.garaje)) features.push('Garaje')
  if (isYes(row.trastero)) features.push('Trastero')

  const property = {
    id,
    city: norm(row.ciudad),
    zone: norm(row.zona),
    // Título = descripción corta (la dirección exacta NUNCA se muestra). Si falta,
    // se cae a un título genérico por tipo + zona.
    title:
      norm(row.descripcion_corta) ||
      `${TIPO_LABEL[tipo] ?? 'Inmueble'} en ${norm(row.zona) || norm(row.ciudad)}`,
    beds: toNumber(row.habitaciones),
    baths: toNumber(row.banos),
    m2: toNumber(row.superficie_m2),
    price: precio,
    priceLabel: formatPrice(precio, mode),
    mode,
    category: CATEGORY_BY_TIPO[tipo] ?? 'piso',
    image,
    desc: norm(row.descripcion_larga) || norm(row.descripcion_corta),
    features,
  }
  // Campos opcionales: solo se incluyen si aplican.
  if (TAG_BY_ETIQUETA[etiqueta]) property.tag = TAG_BY_ETIQUETA[etiqueta]
  if (images.length) property.images = images
  if (norm(row.planta)) property.floor = norm(row.planta)
  const lat = toFloat(row.lat)
  const lng = toFloat(row.lng)
  if (lat !== undefined && lng !== undefined) property.coords = { lat, lng }

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

// ── Main ─────────────────────────────────────────────────────────────────────
function writeOutput(properties) {
  const banner =
    '// ⚠️  ARCHIVO GENERADO por scripts/buildData.mjs — NO EDITAR A MANO.\n' +
    '// Se regenera en cada build a partir del Google Sheet + Cloudinary.\n'
  const body =
    `import type { Property } from './types'\n\n` +
    `export const generatedProperties: Property[] = ${JSON.stringify(properties, null, 2)}\n`
  writeFileSync(OUT_FILE, banner + '\n' + body, 'utf8')
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
  if (!res.ok) throw new Error(`No se pudo leer el Sheet: HTTP ${res.status}`)
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
