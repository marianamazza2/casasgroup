// ── Búsqueda de ubicaciones de España (provincias + municipios) ──────────────
//
// El dataset (≈8.100 entradas, ~420 KB) se carga de forma diferida: solo cuando
// el usuario interactúa por primera vez con un buscador. Así no pesa en la carga
// inicial de la home. Fuente: INE vía codeforspain/ds-organizacion-administrativa.

export type LocationType = 'provincia' | 'municipio'

export interface Location {
  /** Nombre en forma natural, ej. "Barcelona", "L'Hospitalet de Llobregat" */
  name: string
  type: LocationType
  /** Provincia a la que pertenece (solo para municipios) */
  province?: string
}

// Forma compacta tal como vive en el JSON
type RawLocation = { n: string; t: LocationType; p?: string }

/** Normaliza para comparar: minúsculas y sin acentos/diacríticos. */
export function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
}

let cache: Location[] | null = null
let loading: Promise<Location[]> | null = null

/** Carga (una sola vez) y cachea el dataset de ubicaciones. */
export function loadLocations(): Promise<Location[]> {
  if (cache) return Promise.resolve(cache)
  if (loading) return loading
  loading = import('./spainLocations.json').then((mod) => {
    const raw = (mod.default ?? mod) as RawLocation[]
    cache = raw.map((r) => ({ name: r.n, type: r.t, province: r.p }))
    return cache
  })
  return loading
}

/**
 * Busca ubicaciones que coincidan con `query`, ordenadas por relevancia.
 * Devuelve [] mientras el dataset aún no está cargado en memoria.
 */
export function searchLocations(query: string, limit = 8): Location[] {
  if (!cache) return []
  const q = normalize(query)
  if (q.length < 2) return []

  const scored: { loc: Location; score: number }[] = []
  for (const loc of cache) {
    const name = normalize(loc.name)
    let score = -1

    if (name === q) score = 0
    else if (name.startsWith(q)) score = 1
    // Coincidencia al inicio de cualquier palabra del nombre ("born" → "El Born")
    else if (name.split(/[\s/'-]+/).some((w) => w.startsWith(q))) score = 2
    else if (name.includes(q)) score = 3

    if (score === -1) continue
    // Las provincias pesan un poco más que los municipios a igualdad de match
    if (loc.type === 'provincia') score -= 0.5
    scored.push({ loc, score })
  }

  scored.sort((a, b) => {
    if (a.score !== b.score) return a.score - b.score
    return a.loc.name.localeCompare(b.loc.name, 'es')
  })

  return scored.slice(0, limit).map((s) => s.loc)
}
