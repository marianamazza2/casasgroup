import { useSyncExternalStore } from 'react'

/**
 * ¿Coincide la media query ahora mismo?
 *
 * Existe para poder montar UN SOLO layout cuando dos son alternativos. Ocultar
 * el que sobra con `display: none` no evita que el navegador descargue sus
 * <img>: en la ficha de propiedad eso hacía que un móvil bajara además las 5
 * fotos de la grid desktop, robándole ancho de banda a la que sí se ve.
 *
 * La app es SPA pura (sin SSR ni prerender), así que leer `matchMedia` en el
 * primer render es seguro — no hay HTML de servidor con el que discrepar.
 */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const mql = window.matchMedia(query)
      mql.addEventListener('change', onChange)
      return () => mql.removeEventListener('change', onChange)
    },
    () => window.matchMedia(query).matches,
    // Fallback de servidor: nunca se ejecuta hoy, pero deja el hook listo por si
    // se añade prerender. `false` = se asume desktop.
    () => false,
  )
}
