// ── Helper de Cloudinary ─────────────────────────────────────────────────────
// Centraliza cómo se construyen las URLs de entrega de imágenes de Cloudinary.
// El `cloud_name` es público; el cliente solo recibe URLs ya construidas.
//
// Funciona en dos contextos:
//   • Cliente (Vite)   → lee el cloud name de import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
//   • Build en Node    → lo reutiliza scripts/buildData.mjs vía process.env (Paso 2)
//
// Formato de URL: https://res.cloudinary.com/<cloud>/image/upload/<transform>/<publicId>

const BASE = 'https://res.cloudinary.com'

/** Resuelve el cloud name según el entorno (cliente Vite o Node en build). */
function resolveCloudName(): string {
  // import.meta.env solo existe bajo Vite; en Node cae al catch.
  try {
    const fromVite = import.meta.env?.VITE_CLOUDINARY_CLOUD_NAME
    if (fromVite) return fromVite
  } catch {
    /* import.meta.env no disponible (entorno Node) */
  }
  // En Node accedemos a process vía globalThis para no depender de @types/node
  // en el build del cliente.
  const env = (globalThis as { process?: { env?: Record<string, string | undefined> } })
    .process?.env
  return env?.VITE_CLOUDINARY_CLOUD_NAME ?? ''
}

const CLOUD_NAME = resolveCloudName()

/** Contexto de uso de la imagen → transformación aplicada por Cloudinary. */
export type ImageContext = 'card' | 'gallery' | 'preview' | 'thumbnail' | 'placeholder'

// `f_auto` (formato óptimo: WebP/AVIF) y `q_auto` (calidad óptima) en todos los casos.
const TRANSFORMS: Record<ImageContext, string> = {
  // Tarjeta del listado: recorte 4:3, ancho razonable para el grid.
  card: 'c_fill,ar_4:3,w_900,f_auto,q_auto',
  // Galería de la ficha: imagen grande sin recorte forzado.
  gallery: 'c_limit,w_1600,f_auto,q_auto',
  // Miniaturas de la grid desktop de la ficha (~285×230 CSS px, x2 por retina).
  preview: 'c_fill,ar_4:3,w_600,f_auto,q_auto',
  // Thumbnail (popup del mapa / tira del lightbox): cuadrado pequeño.
  thumbnail: 'c_fill,ar_1:1,w_200,f_auto,q_auto',
  // LQIP: versión diminuta y desenfocada (~1 KB) que se pinta de fondo mientras
  // baja la grande, para que el hueco no se vea vacío.
  placeholder: 'c_fill,ar_4:3,w_40,e_blur:600,q_auto:low,f_auto',
}

/**
 * Construye la URL de entrega de una imagen de Cloudinary.
 *
 * @param publicId  ej. "inmuebles/rc-042/01-salon" (sin extensión)
 * @param context   preset de transformación según dónde se muestra la imagen
 * @returns         URL completa, o el `publicId` tal cual si falta el cloud name
 *                  (permite trabajar en local sin credenciales sin romper la UI)
 */
export function cloudinaryUrl(publicId: string, context: ImageContext = 'card'): string {
  if (!CLOUD_NAME) return publicId
  const cleanId = publicId.replace(/^\/+/, '')
  return `${BASE}/${CLOUD_NAME}/image/upload/${TRANSFORMS[context]}/${cleanId}`
}

/** Imagen para la tarjeta del listado (4:3, ~900px). */
export const cardImage = (publicId: string) => cloudinaryUrl(publicId, 'card')

/** Imagen grande para la galería de la ficha (~1600px). */
export const galleryImage = (publicId: string) => cloudinaryUrl(publicId, 'gallery')

/** Miniatura cuadrada para el popup del mapa o thumbnails de la ficha (~200px). */
export const thumbnailImage = (publicId: string) => cloudinaryUrl(publicId, 'thumbnail')

// ── Reescritura de URLs ya construidas ───────────────────────────────────────
// Los inmuebles llegan del build (`generatedProperties.ts`) con las URLs de
// galería ya resueltas, no con el publicId suelto. Para pedir el MISMO asset en
// otro tamaño (miniatura, placeholder, srcset) hay que cambiar el segmento de
// transformación dentro de la URL.

const UPLOAD_URL = /^(https:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\/)(.+)$/
// Un segmento de transformación son parámetros `xx_valor` separados por comas
// ("c_limit,w_1600,f_auto"). Un publicId nunca empieza así: "cover_yd6ija" no
// matchea porque exige el `_` dentro de las 3 primeras letras.
const TRANSFORM_SEGMENT = /^[a-z]{1,3}_[^/]+$/

/** Extrae `[prefijo hasta /upload/, publicId]` de una URL de Cloudinary. */
function splitUploadUrl(url: string): [string, string] | null {
  const m = UPLOAD_URL.exec(url)
  if (!m) return null
  const [, prefix, rest] = m
  const slash = rest.indexOf('/')
  if (slash === -1) return [prefix, rest]
  const first = rest.slice(0, slash)
  // Sin segmento de transformación, `rest` ya es el publicId completo.
  return TRANSFORM_SEGMENT.test(first) ? [prefix, rest.slice(slash + 1)] : [prefix, rest]
}

/**
 * Devuelve la misma imagen con otra transformación.
 * Si la URL no es de Cloudinary (en local, sin cloud name, viaja el publicId
 * crudo) se devuelve intacta para no romper la UI.
 */
export function withTransform(url: string, context: ImageContext): string {
  const parts = splitUploadUrl(url)
  if (!parts) return url
  const [prefix, publicId] = parts
  return `${prefix}${TRANSFORMS[context]}/${publicId}`
}

/** Anchos ofrecidos al navegador para las fotos de la ficha. */
const GALLERY_WIDTHS = [640, 960, 1280, 1600]

/**
 * `srcset` de la galería: deja que el navegador elija el ancho según pantalla y
 * densidad. Sin esto, un móvil de 390 px descarga igual el archivo de 1600 px.
 */
export function gallerySrcSet(url: string): string | undefined {
  const parts = splitUploadUrl(url)
  if (!parts) return undefined
  const [prefix, publicId] = parts
  return GALLERY_WIDTHS.map(
    (w) => `${prefix}c_limit,w_${w},f_auto,q_auto/${publicId} ${w}w`,
  ).join(', ')
}
