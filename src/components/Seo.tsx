import { useEffect } from 'react'

// Gestión de <head> por ruta en cliente: title, meta description, canonical y
// (opcional) robots noindex. Mismo enfoque que <JsonLd> — efecto que crea/actualiza
// las etiquetas al montar y las revierte al desmontar, de modo que cada página
// deja el <head> con solo sus valores. Cuando se active prerender/SSR (auditoria
// §1.1), esto se sustituye por `head()` de TanStack sin tocar las páginas.

type SeoProps = {
  title: string
  description?: string
  /** URL absoluta canónica de esta vista. */
  canonical?: string
  /** true → añade <meta name="robots" content="noindex, follow"> (vistas sin valor de indexación). */
  noindex?: boolean
  /** Imagen absoluta para Open Graph / Twitter (miniatura al compartir en WhatsApp,
   *  Facebook, X…). Al pasarla se emiten og:title/description/image/url + twitter:*.
   *  og:site_name/og:type/og:locale/twitter:card ya vienen del head() global (__root). */
  image?: string
  /** URL absoluta para og:url. Por defecto = canonical. */
  url?: string
}

/** Crea o actualiza un <meta>, devolviendo una función que restaura el estado previo. */
function upsertMeta(name: string, content: string): () => void {
  const selector = `meta[name="${name}"]`
  let el = document.head.querySelector<HTMLMetaElement>(selector)
  const created = !el
  const prev = el?.getAttribute('content') ?? null
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute('name', name)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
  return () => {
    if (created) el.remove()
    else if (prev !== null) el.setAttribute('content', prev)
  }
}

/** Igual que upsertMeta pero indexado por `property` (Open Graph usa property, no name). */
function upsertMetaProp(property: string, content: string): () => void {
  const selector = `meta[property="${property}"]`
  let el = document.head.querySelector<HTMLMetaElement>(selector)
  const created = !el
  const prev = el?.getAttribute('content') ?? null
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute('property', property)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
  return () => {
    if (created) el.remove()
    else if (prev !== null) el.setAttribute('content', prev)
  }
}

/** Crea o actualiza un <link rel>, devolviendo una función que restaura el estado previo. */
function upsertLink(rel: string, href: string): () => void {
  const selector = `link[rel="${rel}"]`
  let el = document.head.querySelector<HTMLLinkElement>(selector)
  const created = !el
  const prev = el?.getAttribute('href') ?? null
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
  return () => {
    if (created) el.remove()
    else if (prev !== null) el.setAttribute('href', prev)
  }
}

export function Seo({ title, description, canonical, noindex, image, url }: SeoProps) {
  useEffect(() => {
    const prevTitle = document.title
    document.title = title
    const cleanups: Array<() => void> = [() => { document.title = prevTitle }]

    if (description) cleanups.push(upsertMeta('description', description))
    if (canonical) cleanups.push(upsertLink('canonical', canonical))
    if (noindex) cleanups.push(upsertMeta('robots', 'noindex, follow'))

    // Open Graph / Twitter: solo cuando la página aporta una imagen para compartir
    // (p. ej. la portada de una propiedad). Sin imagen, los defaults globales del
    // head() del root bastan y no ensuciamos el <head> de las demás vistas.
    if (image) {
      const ogUrl = url ?? canonical
      cleanups.push(upsertMetaProp('og:title', title))
      if (description) cleanups.push(upsertMetaProp('og:description', description))
      cleanups.push(upsertMetaProp('og:image', image))
      if (ogUrl) cleanups.push(upsertMetaProp('og:url', ogUrl))
      cleanups.push(upsertMeta('twitter:title', title))
      if (description) cleanups.push(upsertMeta('twitter:description', description))
      cleanups.push(upsertMeta('twitter:image', image))
    }

    return () => cleanups.forEach((fn) => fn())
  }, [title, description, canonical, noindex, image, url])

  return null
}
