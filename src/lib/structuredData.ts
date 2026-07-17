// Builders de datos estructurados (schema.org / JSON-LD) — auditoria-seo.md §1.4.
//
// Cada función devuelve un objeto plano listo para <JsonLd data={...} />. No
// tocan el DOM; eso lo hace el componente. Mantener aquí la lógica permite
// reutilizar los mismos schemas cuando se active prerender/SSR.

import type { Property } from './types'

/** Dominio canónico del sitio (mismo que public/sitemap.xml). Sobrescribible por
 *  entorno para previews/staging. Sin barra final para poder concatenar rutas. */
export const SITE_URL = (import.meta.env.VITE_SITE_URL ?? 'https://casasgroup.es').replace(/\/$/, '')

/** URL absoluta a partir de una ruta del sitio ('/propiedades' → 'https://…/propiedades'). */
export const absoluteUrl = (path: string) => `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`

// ── Datos NAP del negocio ────────────────────────────────────────────────────
// Fuente única de verdad para nombre, teléfono, email y dirección, replicando lo
// que se muestra en contacto.tsx (consistencia NAP — §5.2).
// La oficina está en Esplugues de Llobregat (municipio propio del área de
// Barcelona), por eso `locality` ≠ `areaServed`: la localidad postal es Esplugues,
// pero la zona de servicio comercial es Barcelona. `geo` coincide con el marcador
// del mapa en contacto.tsx.
const BUSINESS = {
  name: 'Group Casas',
  telephone: '+34 930 119 056',
  email: 'info@casasgroup.es',
  street: 'Carrer Verge de la Mercè, 49, Loc 16',
  postalCode: '08950',
  locality: 'Esplugues de Llobregat',
  region: 'Barcelona',
  country: 'ES',
  geo: { lat: 41.3766, lng: 2.0829 },
  areaServed: 'Barcelona',
} as const

/**
 * RealEstateAgent (superset de LocalBusiness/Organization) para la home — §1.4, §5.2.
 * Da a Google la identidad del negocio, su contacto, horario y zona de servicio.
 */
export function organizationSchema(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'RealEstateAgent',
    '@id': `${SITE_URL}/#organization`,
    name: BUSINESS.name,
    // Group Casas es el rebranding (2026) de Red Casas, fundada en 2014 —
    // misma entidad. Datos reales del timeline de /nosotros (§4.5).
    alternateName: 'Red Casas',
    foundingDate: '2014',
    url: SITE_URL,
    // Google prefiere logo raster (PNG/JPG) a SVG para el knowledge panel.
    logo: absoluteUrl('/icon-512.png'),
    image: absoluteUrl('/og-default.jpg'),
    telephone: BUSINESS.telephone,
    email: BUSINESS.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: BUSINESS.street,
      postalCode: BUSINESS.postalCode,
      addressLocality: BUSINESS.locality,
      addressRegion: BUSINESS.region,
      addressCountry: BUSINESS.country,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: BUSINESS.geo.lat,
      longitude: BUSINESS.geo.lng,
    },
    areaServed: { '@type': 'City', name: BUSINESS.areaServed },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '19:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Saturday',
        opens: '10:00',
        closes: '14:00',
      },
    ],
    // sameAs: [...] — añadir perfiles reales (Instagram, Facebook, LinkedIn)
    // cuando existan; hoy el sitio no enlaza redes sociales.
  }
}

// ── Detalle de propiedad ─────────────────────────────────────────────────────

const CATEGORY_SCHEMA_TYPE: Record<Property['category'], string> = {
  piso: 'Apartment',
  chalet: 'House',
  local: 'Accommodation',
  parking: 'Accommodation',
}

/** Estado comercial → disponibilidad schema.org. */
function availabilityFor(status: Property['status']): string {
  switch (status) {
    case 'RESERVADO':
      return 'https://schema.org/LimitedAvailability'
    case 'VENDIDO':
    case 'ALQUILADO':
      return 'https://schema.org/SoldOut'
    default:
      return 'https://schema.org/InStock'
  }
}

/**
 * RealEstateListing para /propiedades/$id — §1.4, §4.3.
 * Incluye precio, superficie, habitaciones, imágenes y ubicación de la finca.
 */
export function realEstateListingSchema(p: Property): Record<string, unknown> {
  const url = absoluteUrl(`/propiedades/${p.id}`)
  const images = p.images?.length ? p.images : [p.image]
  const locality = p.zone || p.city

  const accommodation: Record<string, unknown> = {
    '@type': CATEGORY_SCHEMA_TYPE[p.category],
    name: p.title,
    numberOfRooms: p.beds,
    numberOfBathroomsTotal: p.baths,
    floorSize: { '@type': 'QuantitativeValue', value: p.m2, unitCode: 'MTK' },
    address: {
      '@type': 'PostalAddress',
      addressLocality: locality,
      addressRegion: BUSINESS.region,
      addressCountry: BUSINESS.country,
    },
  }
  if (p.coords) {
    accommodation.geo = {
      '@type': 'GeoCoordinates',
      latitude: p.coords.lat,
      longitude: p.coords.lng,
    }
  }

  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    '@id': `${url}#listing`,
    url,
    name: `${p.title} en ${locality}`,
    description: p.desc,
    image: images,
    about: accommodation,
    offers: {
      '@type': 'Offer',
      price: p.price,
      priceCurrency: 'EUR',
      availability: availabilityFor(p.status),
      // compra → venta; alquiler → arrendamiento (vocabulario GoodRelations).
      businessFunction:
        p.mode === 'alquiler'
          ? 'http://purl.org/goodrelations/v1#LeaseOut'
          : 'http://purl.org/goodrelations/v1#Sell',
      url,
    },
  }
  if (p.dateAdded) schema.datePosted = p.dateAdded
  return schema
}

// ── Migas de pan ─────────────────────────────────────────────────────────────

/**
 * BreadcrumbList a partir de pares [nombre, ruta] — §1.4.
 * El último ítem suele ser la página actual (sin necesidad de que sea enlazable).
 */
export function breadcrumbSchema(items: Array<{ name: string; path: string }>): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  }
}
