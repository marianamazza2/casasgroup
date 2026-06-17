// ── Búsqueda de ubicaciones de España (provincias + municipios + barrios) ─────
//
// El dataset (≈8.100 entradas, ~420 KB) se carga de forma diferida: solo cuando
// el usuario interactúa por primera vez con un buscador. Así no pesa en la carga
// inicial de la home. Fuente: INE vía codeforspain/ds-organizacion-administrativa.
//
// A las provincias/municipios del INE se les suma `barrios.json`: una lista
// CURADA a mano de distritos y barrios de las grandes ciudades (Barcelona,
// Madrid, Valencia, Sevilla…). Va aparte porque `spainLocations.json` se
// regenera desde el INE y machacaría cualquier barrio añadido aquí. El INE no
// publica barrios, así que es un mantenimiento manual y de cobertura limitada.

export type LocationType = 'provincia' | 'municipio' | 'distrito' | 'barrio'

export interface Location {
  /** Nombre en forma natural, ej. "Barcelona", "L'Hospitalet de Llobregat" */
  name: string
  type: LocationType
  /** Provincia a la que pertenece (municipios, distritos y barrios) */
  province?: string
  /** Ciudad/municipio que contiene el distrito o barrio */
  city?: string
}

// Forma compacta tal como viven en los JSON
type RawLocation = { n: string; t: LocationType; p?: string }
type RawBarrio = { n: string; t: 'distrito' | 'barrio'; c: string; p: string }

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
  loading = Promise.all([
    import('./spainLocations.json'),
    import('./barrios.json'),
  ]).then(([locMod, barrioMod]) => {
    const rawLocs = ((locMod.default ?? locMod) as RawLocation[]).map((r) => ({
      name: r.n,
      type: r.t,
      province: r.p,
    }))
    const rawBarrios = ((barrioMod.default ?? barrioMod) as RawBarrio[]).map((r) => ({
      name: r.n,
      type: r.t,
      province: r.p,
      city: r.c,
    }))
    cache = [...rawLocs, ...rawBarrios]
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
    // A igualdad de match, ordenamos por amplitud del ámbito:
    // provincia > distrito > municipio/barrio.
    if (loc.type === 'provincia') score -= 0.5
    else if (loc.type === 'distrito') score -= 0.25
    scored.push({ loc, score })
  }

  scored.sort((a, b) => {
    if (a.score !== b.score) return a.score - b.score
    return a.loc.name.localeCompare(b.loc.name, 'es')
  })

  return scored.slice(0, limit).map((s) => s.loc)
}
