import type { ElementType } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

// Entrada compartida de los titulares de marca (wordmark "Group Casas" de la
// home y "Nuestros valores" de nosotros): la misma receta que la foto del hero
// (@keyframes hero-media-in) — desenfocada y al fondo, se acerca y se enfoca.
// Sin desplazamiento vertical: la marca no sube, avanza. El viraje de champan a
// dorado va despues, en un segundo tiempo (ver mas abajo).
// Los colores van literales: framer-motion no interpola custom properties.
const FROM = '#e4d5b2'
const TO = '#a47b36'
// El easing del hero.
const EASE = [0.16, 1, 0.3, 1] as const
// El viraje al dorado es un segundo tiempo, no simultaneo: primero la marca
// termina de acercarse y enfocarse, ya quieta y nitida, y recien ahi se dora.
// Mezclados no se percibia el cambio de color, porque ocurria mientras el
// texto todavia estaba desenfocado. El easing es plano (no el exponencial del
// hero) para que el oscurecimiento sea parejo de principio a fin.
const COLOR_EASE = [0.37, 0, 0.63, 1] as const
const DURATION = 2.2
const COLOR_DELAY = 1.2
const COLOR_DURATION = 1.5

export function RevealTitle({
  text,
  className,
  as = 'p',
}: {
  text: string
  className?: string
  /** Etiqueta real: la home lo usa como <p> (la marca) y nosotros como <h2>. */
  as?: 'p' | 'h2'
}) {
  const reduceMotion = useReducedMotion()

  if (reduceMotion) {
    const Tag = as as ElementType
    return <Tag className={className}>{text}</Tag>
  }

  const MotionTag = as === 'h2' ? motion.h2 : motion.p

  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, scale: 0.94, filter: 'blur(12px)', color: FROM }}
      whileInView={{ opacity: 1, scale: 1, filter: 'blur(0px)', color: TO }}
      // El margen inferior POSITIVO adelanta el disparo: la animacion arranca con
      // el titulo todavia un 12% de pantalla por debajo del pliegue, asi que
      // cuando la seccion entra ya se esta formando y nunca se ve el hueco sin
      // titulo. Con un umbral tardio la seccion llegaba vacia y el titulo
      // tardaba un par de segundos en aparecer.
      viewport={{ once: true, amount: 0, margin: '0px 0px 12% 0px' }}
      transition={{
        opacity: { duration: DURATION, ease: EASE },
        scale: { duration: DURATION, ease: EASE },
        filter: { duration: DURATION, ease: EASE },
        color: { duration: COLOR_DURATION, delay: COLOR_DELAY, ease: COLOR_EASE },
      }}
    >
      {text}
    </MotionTag>
  )
}
