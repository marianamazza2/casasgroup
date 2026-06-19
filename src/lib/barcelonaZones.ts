// ── Taxonomía de zonas (provincia → municipio → distrito → barrio) ──────────
//
// Barcelona ciudad tiene 10 distritos oficiales y 73 barrios. El resto de
// localidades del dataset son municipios vecinos (sin distritos). Mantenemos
// aquí el árbol oficial y un mapa que traduce las etiquetas informales de
// `Property.zone` a su taxonomía real, sin tener que reescribir cada inmueble.

export interface District {
  name: string
  barrios: string[]
}

/** Los 10 distritos de Barcelona ciudad con sus 73 barrios oficiales. */
export const BARCELONA_DISTRICTS: District[] = [
  {
    name: 'Ciutat Vella',
    barrios: ['el Raval', 'el Barri Gòtic', 'la Barceloneta', 'Sant Pere, Santa Caterina i la Ribera'],
  },
  {
    name: "l'Eixample",
    barrios: [
      'el Fort Pienc',
      'la Sagrada Família',
      "la Dreta de l'Eixample",
      "l'Antiga Esquerra de l'Eixample",
      "la Nova Esquerra de l'Eixample",
      'Sant Antoni',
    ],
  },
  {
    name: 'Sants-Montjuïc',
    barrios: [
      'el Poble-sec',
      'la Marina del Prat Vermell',
      'la Marina de Port',
      'la Font de la Guatlla',
      'Hostafrancs',
      'la Bordeta',
      'Sants-Badal',
      'Sants',
    ],
  },
  {
    name: 'Les Corts',
    barrios: ['les Corts', 'la Maternitat i Sant Ramon', 'Pedralbes'],
  },
  {
    name: 'Sarrià-Sant Gervasi',
    barrios: [
      'Vallvidrera, el Tibidabo i les Planes',
      'Sarrià',
      'les Tres Torres',
      'Sant Gervasi - la Bonanova',
      'Sant Gervasi - Galvany',
      'el Putxet i el Farró',
    ],
  },
  {
    name: 'Gràcia',
    barrios: [
      'Vallcarca i els Penitents',
      'el Coll',
      'la Salut',
      'la Vila de Gràcia',
      "el Camp d'en Grassot i Gràcia Nova",
    ],
  },
  {
    name: 'Horta-Guinardó',
    barrios: [
      'el Baix Guinardó',
      'Can Baró',
      'el Guinardó',
      "la Font d'en Fargues",
      'el Carmel',
      'la Teixonera',
      'Sant Genís dels Agudells',
      'Montbau',
      "la Vall d'Hebron",
      'la Clota',
      'Horta',
    ],
  },
  {
    name: 'Nou Barris',
    barrios: [
      'Vilapicina i la Torre Llobeta',
      'Porta',
      'el Turó de la Peira',
      'Can Peguera',
      'la Guineueta',
      'Canyelles',
      'les Roquetes',
      'Verdun',
      'la Prosperitat',
      'la Trinitat Nova',
      'Torre Baró',
      'Ciutat Meridiana',
      'Vallbona',
    ],
  },
  {
    name: 'Sant Andreu',
    barrios: [
      'la Trinitat Vella',
      'Baró de Viver',
      'el Bon Pastor',
      'Sant Andreu',
      'la Sagrera',
      'el Congrés i els Indians',
      'Navas',
    ],
  },
  {
    name: 'Sant Martí',
    barrios: [
      "el Camp de l'Arpa del Clot",
      'el Clot',
      'el Parc i la Llacuna del Poblenou',
      'la Vila Olímpica del Poblenou',
      'el Poblenou',
      'Diagonal Mar i el Front Marítim del Poblenou',
      'el Besòs i el Maresme',
      'Provençals del Poblenou',
      'Sant Martí de Provençals',
      'la Verneda i la Pau',
    ],
  },
]

export const BARCELONA_MUNICIPIO = 'Barcelona'

// Los 310 municipios de la provincia de Barcelona (sin la capital, que ya se
// cubre con su árbol de distritos). Extraídos del dataset del INE
// (`spainLocations.json`, p === 'Barcelona'); ver [[reference-spain-locations-dataset]].
import barcelonaProvinceMunicipios from './barcelonaProvinceMunicipios.json'
export const BARCELONA_PROVINCE_MUNICIPIOS: string[] = barcelonaProvinceMunicipios

export interface ZoneTaxonomy {
  municipio: string
  distrito?: string
  barrio?: string
}

/**
 * Traduce la etiqueta `zone` de cada inmueble a su taxonomía oficial. Las que
 * no aparecen aquí se asumen municipio = su propio nombre (sin distrito).
 */
export const ZONE_TAXONOMY: Record<string, ZoneTaxonomy> = {
  // ── Barcelona ciudad ──────────────────────────────────────────────────────
  Eixample: { municipio: BARCELONA_MUNICIPIO, distrito: "l'Eixample" },
  Gràcia: { municipio: BARCELONA_MUNICIPIO, distrito: 'Gràcia' },
  'Sant Martí': { municipio: BARCELONA_MUNICIPIO, distrito: 'Sant Martí' },
  Poblenou: { municipio: BARCELONA_MUNICIPIO, distrito: 'Sant Martí', barrio: 'el Poblenou' },
  Sants: { municipio: BARCELONA_MUNICIPIO, distrito: 'Sants-Montjuïc', barrio: 'Sants' },
  'Poble Sec': { municipio: BARCELONA_MUNICIPIO, distrito: 'Sants-Montjuïc', barrio: 'el Poble-sec' },
  'Les Corts': { municipio: BARCELONA_MUNICIPIO, distrito: 'Les Corts', barrio: 'les Corts' },
  Pedralbes: { municipio: BARCELONA_MUNICIPIO, distrito: 'Les Corts', barrio: 'Pedralbes' },
  Sarrià: { municipio: BARCELONA_MUNICIPIO, distrito: 'Sarrià-Sant Gervasi', barrio: 'Sarrià' },
  'Sant Gervasi': { municipio: BARCELONA_MUNICIPIO, distrito: 'Sarrià-Sant Gervasi', barrio: 'Sant Gervasi - Galvany' },
  Horta: { municipio: BARCELONA_MUNICIPIO, distrito: 'Horta-Guinardó', barrio: 'Horta' },
  "Vall d'Hebron": { municipio: BARCELONA_MUNICIPIO, distrito: 'Horta-Guinardó', barrio: "la Vall d'Hebron" },
  Barceloneta: { municipio: BARCELONA_MUNICIPIO, distrito: 'Ciutat Vella', barrio: 'la Barceloneta' },
  'El Born': { municipio: BARCELONA_MUNICIPIO, distrito: 'Ciutat Vella', barrio: 'Sant Pere, Santa Caterina i la Ribera' },
  'El Raval': { municipio: BARCELONA_MUNICIPIO, distrito: 'Ciutat Vella', barrio: 'el Raval' },
  'Nou Barris': { municipio: BARCELONA_MUNICIPIO, distrito: 'Nou Barris' },
  'Sant Andreu': { municipio: BARCELONA_MUNICIPIO, distrito: 'Sant Andreu', barrio: 'Sant Andreu' },
  // ── Municipios vecinos (sin distritos) ────────────────────────────────────
  Esplugues: { municipio: 'Esplugues de Llobregat' },
  'Sant Just Desvern': { municipio: 'Sant Just Desvern' },
  Cornella: { municipio: 'Cornellà de Llobregat' },
  'Sant Joan Despi': { municipio: 'Sant Joan Despí' },
  'Sant Feliu de Llobregat': { municipio: 'Sant Feliu de Llobregat' },
}

/** Municipios distintos de Barcelona ciudad presentes en el dataset. */
export const OTHER_MUNICIPIOS: string[] = Array.from(
  new Set(
    Object.values(ZONE_TAXONOMY)
      .map((t) => t.municipio)
      .filter((m) => m !== BARCELONA_MUNICIPIO),
  ),
).sort((a, b) => a.localeCompare(b, 'es'))

/** Taxonomía de un inmueble a partir de su etiqueta `zone` (con fallback). */
export function taxonomyForZone(zone: string, fallbackCity = BARCELONA_MUNICIPIO): ZoneTaxonomy {
  return ZONE_TAXONOMY[zone] ?? { municipio: fallbackCity }
}

// ── Tokens de selección ─────────────────────────────────────────────────────
// Prefijados para no confundir niveles (un nombre puede ser distrito y barrio):
//   m:<municipio>   d:<distrito>   b:<barrio>
export const tok = {
  municipio: (n: string) => `m:${n}`,
  distrito: (n: string) => `d:${n}`,
  barrio: (n: string) => `b:${n}`,
}

/** ¿El inmueble (por su taxonomía) cae dentro del set de tokens seleccionados? */
export function matchesZoneSelection(tax: ZoneTaxonomy, selected: Set<string>): boolean {
  if (selected.size === 0) return true
  if (selected.has(tok.municipio(tax.municipio))) return true
  if (tax.distrito && selected.has(tok.distrito(tax.distrito))) return true
  if (tax.barrio && selected.has(tok.barrio(tax.barrio))) return true
  return false
}
