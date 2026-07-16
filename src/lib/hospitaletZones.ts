// ── Taxonomía de L'Hospitalet de Llobregat ──────────────────────────────────
//
// A diferencia de Barcelona ciudad (distrito → barrio), Hospitalet se ofrece en
// UN solo nivel: el municipio se despliega directamente en sus 13 barrios. Sus
// "distritos" oficiales se llaman igual que los barrios que agrupan, así que el
// nivel intermedio no aporta y se omite (ver decisión de UX del picker).
//
// Encaja en el modelo de tokens del picker sin distrito: "todo el municipio" usa
// el token `m:`; cada barrio usa `b:`. Ver [[project-zone-filters]].

import type { ZoneTaxonomy } from './barcelonaZones'

export const HOSPITALET_MUNICIPIO = "L'Hospitalet de Llobregat"

/** Los 13 barrios oficiales de Hospitalet, en orden alfabético para el picker. */
export const HOSPITALET_BARRIOS: string[] = [
  'Bellvitge',
  'Can Serra',
  'Centre',
  'Collblanc',
  'el Gornal',
  'Granvia Sud',
  'la Florida',
  'la Torrassa',
  'les Planes',
  'Pubilla Cases',
  'Sanfeliu',
  'Sant Josep',
  'Santa Eulàlia',
]

/**
 * Traduce la etiqueta `zone` de cada inmueble a su barrio oficial. La clave es
 * el texto EXACTO tal como lo carga el cliente en el Sheet; el `barrio` del valor
 * es el nombre canónico que usa el árbol del picker (`HOSPITALET_BARRIOS`), para
 * que el inmueble haga match al seleccionar su barrio o "todo el municipio".
 *
 * Incluye el nombre canónico + las variantes informales que ya aparecen en los
 * datos ("La Florida", "La Torrasa"…). Añadir aquí cualquier etiqueta nueva.
 */
export const HOSPITALET_ZONE_TAXONOMY: Record<string, ZoneTaxonomy> = {
  // Nombres canónicos
  Bellvitge: { municipio: HOSPITALET_MUNICIPIO, barrio: 'Bellvitge' },
  'Can Serra': { municipio: HOSPITALET_MUNICIPIO, barrio: 'Can Serra' },
  Centre: { municipio: HOSPITALET_MUNICIPIO, barrio: 'Centre' },
  Collblanc: { municipio: HOSPITALET_MUNICIPIO, barrio: 'Collblanc' },
  'el Gornal': { municipio: HOSPITALET_MUNICIPIO, barrio: 'el Gornal' },
  'Granvia Sud': { municipio: HOSPITALET_MUNICIPIO, barrio: 'Granvia Sud' },
  'la Florida': { municipio: HOSPITALET_MUNICIPIO, barrio: 'la Florida' },
  'la Torrassa': { municipio: HOSPITALET_MUNICIPIO, barrio: 'la Torrassa' },
  'les Planes': { municipio: HOSPITALET_MUNICIPIO, barrio: 'les Planes' },
  'Pubilla Cases': { municipio: HOSPITALET_MUNICIPIO, barrio: 'Pubilla Cases' },
  Sanfeliu: { municipio: HOSPITALET_MUNICIPIO, barrio: 'Sanfeliu' },
  'Sant Josep': { municipio: HOSPITALET_MUNICIPIO, barrio: 'Sant Josep' },
  'Santa Eulàlia': { municipio: HOSPITALET_MUNICIPIO, barrio: 'Santa Eulàlia' },
  // Variantes informales que usa el cliente en el Sheet
  'La Florida': { municipio: HOSPITALET_MUNICIPIO, barrio: 'la Florida' },
  'La Torrasa': { municipio: HOSPITALET_MUNICIPIO, barrio: 'la Torrassa' },
  'La Torrassa': { municipio: HOSPITALET_MUNICIPIO, barrio: 'la Torrassa' },
  'El Gornal': { municipio: HOSPITALET_MUNICIPIO, barrio: 'el Gornal' },
  'Les Planes': { municipio: HOSPITALET_MUNICIPIO, barrio: 'les Planes' },
  'Pubilla Casas': { municipio: HOSPITALET_MUNICIPIO, barrio: 'Pubilla Cases' },
  'Santa Eulalia': { municipio: HOSPITALET_MUNICIPIO, barrio: 'Santa Eulàlia' },
}
