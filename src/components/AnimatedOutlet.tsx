import { Outlet, useRouterState } from '@tanstack/react-router'
import { motion, useReducedMotion } from 'framer-motion'

/**
 * Transición entre rutas: cada pantalla aparece con un fade-in al montarse.
 *
 * Nota: el truco antiguo de "congelar" el contexto del router (FrozenOutlet +
 * getRouterContext) ya no funciona en TanStack Router moderno. El `<Outlet/>`
 * dejó de leer los matches del contexto de React y ahora los lee de un store
 * reactivo (router.stores), así que congelar el contexto no mantiene la página
 * anterior en pantalla. Además `getRouterContext` ya no se exporta.
 *
 * Por eso usamos un enfoque simple y robusto: al cambiar el pathname, React
 * remonta el contenedor (cambia su `key`) y framer-motion lo anima de opacidad
 * 0 → 1. Solo opacidad (sin transform) para no romper el position: sticky/fixed
 * de los heros ni del mapa de propiedades.
 */
export function AnimatedOutlet() {
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const reduceMotion = useReducedMotion()
  const duration = reduceMotion ? 0 : 0.22

  return (
    <motion.div
      key={pathname}
      className="route-transition"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration, ease: 'easeInOut' }}
    >
      <Outlet />
    </motion.div>
  )
}
