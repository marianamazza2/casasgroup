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
export type ImageContext = 'card' | 'gallery' | 'thumbnail'

// `f_auto` (formato óptimo: WebP/AVIF) y `q_auto` (calidad óptima) en todos los casos.
const TRANSFORMS: Record<ImageContext, string> = {
  // Tarjeta del listado: recorte 4:3, ancho razonable para el grid.
  card: 'c_fill,ar_4:3,w_900,f_auto,q_auto',
  // Galería de la ficha: imagen grande sin recorte forzado.
  gallery: 'c_limit,w_1600,f_auto,q_auto',
  // Thumbnail (popup del mapa / miniaturas de la ficha): cuadrado pequeño.
  thumbnail: 'c_fill,ar_1:1,w_200,f_auto,q_auto',
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
