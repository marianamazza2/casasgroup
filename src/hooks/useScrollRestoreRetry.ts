import { useEffect, useRef } from 'react'
import { useElementScrollRestoration, useRouterState } from '@tanstack/react-router'

type ScrollTarget = Window | HTMLElement | null | undefined

/**
 * Reintenta la restauración de scroll al volver atrás.
 *
 * TanStack guarda la posición de cada pantalla y la reaplica en su evento
 * `onRendered`, pero ese evento se dispara **antes** de que el DOM de la
 * pantalla a la que volvemos esté montado: el documento todavía mide lo que
 * medía la ficha (~1.300px), así que un `scrollTo(3199)` se recorta al máximo
 * de esa altura (~680px) y la home aparece a media página. Con los scrollers
 * internos es peor: el elemento aún no existe, así que la posición se pierde
 * del todo y la lista de propiedades vuelve arriba.
 *
 * Este hook lee la MISMA entrada cacheada por TanStack y la vuelve a aplicar
 * frame a frame hasta que el contenido es lo bastante alto (o hasta agotar el
 * tiempo límite). Cualquier gesto del usuario cancela el reintento: nunca
 * peleamos contra su dedo.
 *
 * Para un scroller interno hay que pasar `id` y marcar el elemento con
 * `data-scroll-restoration-id={id}`, porque en el primer render la ref aún es
 * null y sin el id no habría forma de localizar su entrada en la caché.
 */
export function useScrollRestoreRetry(options: {
  id?: string
  getElement: () => ScrollTarget
}) {
  const { getElement } = options
  // Los llamantes pasan una arrow inline: la guardamos en una ref para que el
  // reintento no se reinicie en cada render del padre (solo por navegación).
  const getElementRef = useRef(getElement)
  getElementRef.current = getElement
  // Reintentamos una vez por entrada del historial (no por cambio de query
  // params: ahí no hay restauración que arreglar).
  const locationKey = useRouterState(
    { select: (s) => s.location.state.__TSR_key ?? s.location.href },
  )
  const entry = useElementScrollRestoration(
    options.id ? { id: options.id, getElement } : { getElement },
  )
  const targetY = entry?.scrollY ?? 0
  const targetX = entry?.scrollX ?? 0

  useEffect(() => {
    // Sin posición guardada (navegación hacia delante) no hay nada que hacer:
    // el reset al top de TanStack ya es correcto.
    if (targetY <= 0) return

    let raf = 0
    let stopped = false
    const startedAt = performance.now()
    const stop = () => {
      stopped = true
      cancelAnimationFrame(raf)
    }

    const tick = () => {
      if (stopped) return
      const el = getElementRef.current()
      if (el) {
        const isWindow = el === window
        const current = isWindow ? window.scrollY : (el as HTMLElement).scrollTop
        // Ya está en su sitio (caso normal: TanStack acertó)
        if (Math.abs(current - targetY) <= 1) return stop()
        const max = Math.max(
          isWindow
            ? document.documentElement.scrollHeight - window.innerHeight
            : (el as HTMLElement).scrollHeight - (el as HTMLElement).clientHeight,
          0,
        )
        // Perseguimos el destino conforme la pantalla crece: al volver, las
        // imágenes lazy aún no han cargado y el documento mide menos que
        // cuando nos fuimos, así que de momento nos quedamos lo más cerca que
        // permita la altura actual y seguimos empujando frame a frame.
        const desired = Math.min(targetY, max)
        if (Math.abs(current - desired) > 1) {
          if (isWindow) {
            window.scrollTo({ top: desired, left: targetX, behavior: 'instant' as ScrollBehavior })
          } else {
            ;(el as HTMLElement).scrollTop = desired
            ;(el as HTMLElement).scrollLeft = targetX
          }
        }
        if (desired >= targetY - 1) return stop()
      }
      // Imágenes lazy, mapa, fuentes...: damos margen a que la pantalla crezca
      if (performance.now() - startedAt > 2000) return stop()
      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    window.addEventListener('touchstart', stop, { passive: true })
    window.addEventListener('wheel', stop, { passive: true })
    window.addEventListener('keydown', stop)
    return () => {
      stop()
      window.removeEventListener('touchstart', stop)
      window.removeEventListener('wheel', stop)
      window.removeEventListener('keydown', stop)
    }
  }, [locationKey, targetX, targetY])
}
