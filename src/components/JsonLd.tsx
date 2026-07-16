import { useEffect } from 'react'

// Inyecta un bloque <script type="application/ld+json"> en <head>.
//
// Por qué un efecto y no `head()` de TanStack: la web es hoy una SPA sin SSR
// (ver auditoria-seo.md §1.1). Este componente añade/quita el script al montar
// y desmontar la ruta, de modo que cada página expone solo su propio schema y no
// se acumulan bloques al navegar. Cuando se active prerender/SSR (§1.1 opción B),
// esta pieza se puede sustituir por `head({ scripts })` sin tocar los builders.
//
// El schema se re-serializa en cada render, pero como el efecto depende del JSON
// resultante (un string), solo vuelve a tocar el DOM cuando el contenido cambia.
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  const json = JSON.stringify(data)
  useEffect(() => {
    const el = document.createElement('script')
    el.type = 'application/ld+json'
    el.textContent = json
    document.head.appendChild(el)
    return () => {
      el.remove()
    }
  }, [json])
  return null
}
