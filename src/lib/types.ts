// ── Search page types ──────────────────────────────────────────────────────

export type Property = {
  id: number
  city: string
  zone: string
  title: string
  beds: number
  baths: number
  m2: number
  price: number
  priceLabel: string
  mode: 'compra' | 'alquiler'
  category: 'piso' | 'chalet' | 'local' | 'parking'
  tag?: 'Nuevo' | 'Destacado' | 'Exclusiva'
  image: string
  desc: string
  features: string[]
  floor?: string
  coords?: { lat: number; lng: number }
}

export type MapPin = {
  id: number
  priceLabel: string
  top: string
  left: string
}

export type ViewMode = 'grid' | 'list'

export type FilterState = {
  mode: 'compra' | 'alquiler'
  query: string
  zone: string
  priceMin?: number
  priceMax?: number
  category?: string[]
  bedrooms?: number
  bathrooms?: number
  surfaceMin?: number
  surfaceMax?: number
}

// ── Legacy CMS types ───────────────────────────────────────────────────────

export type Operacion = 'VENTA' | 'ALQUILER'
export type TipoInmueble = 'PISO' | 'DUPLEX' | 'CHALET' | 'LOCAL' | 'PARKING'
export type EstadoInmueble = 'EN VENTA' | 'RESERVADO' | 'VENDIDO' | 'ALQUILADO'
export type EtiquetaInmueble = 'OPORTUNIDAD' | 'REBAJADO' | 'DESTACADO' | ''
export type CertificadoEnergetico = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G'

export interface Inmueble {
  ref: string
  publicado: boolean
  operacion: Operacion
  tipo: TipoInmueble
  estado: EstadoInmueble
  etiqueta: EtiquetaInmueble
  precio: number
  direccion: string
  zona: string
  ciudad: string
  habitaciones: number
  banos: number
  superficie_m2: number
  planta: string
  ascensor: boolean
  terraza: boolean
  garaje: boolean
  trastero: boolean
  certificado_energetico: CertificadoEnergetico
  descripcion_corta: string
  descripcion_larga: string
  ref_fotos: string
  lat?: number
  lng?: number
  slug: string
}

export interface FiltrosInmueble {
  operacion?: Operacion
  tipo?: TipoInmueble
  zona?: string
  precioMin?: number
  precioMax?: number
  habitacionesMin?: number
  banos?: number
  superficieMin?: number
  ascensor?: boolean
  terraza?: boolean
  garaje?: boolean
  trastero?: boolean
  ordenar?: 'reciente' | 'precio_asc' | 'precio_desc'
}
