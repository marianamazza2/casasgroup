import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useEffect, useRef, useState } from 'react'

type Slide = {
  title: string
  desc: string
  image: string
  alt: string
}

// Orden de prioridad definido por el cliente: constitución → gestión diaria →
// economía → juntas → equipo → portal.
const SLIDES: Slide[] = [
  {
    title: 'Constitución y legalización',
    desc: 'Asesoramos en todo el proceso de constitución y legalización de la Comunidad de Propietarios, acompañando a los propietarios hasta su correcta puesta en funcionamiento.',
    image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1600&q=80',
    alt: 'Asesor revisando la documentación de constitución de una comunidad de propietarios',
  },
  {
    title: 'Gestión integral',
    desc: 'Nos encargamos de la administración completa de tu comunidad con eficacia y transparencia, velando por su correcto funcionamiento y la conservación del inmueble.',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1600&q=80',
    alt: 'Fachada luminosa de un edificio residencial administrado por Group Casas',
  },
  {
    title: 'Gestión económica',
    desc: 'Elaboramos el presupuesto anual, controlamos ingresos y gastos, emitimos y gestionamos recibos, pagamos a proveedores y reclamamos impagos de forma diligente.',
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1600&q=80',
    alt: 'Documentación económica y cuentas anuales de una comunidad de propietarios',
  },
  {
    title: 'Reuniones y acuerdos',
    desc: 'Convocamos y coordinamos las juntas de propietarios, redactamos las actas y ejecutamos los acuerdos adoptados, optimizando recursos y reduciendo costes.',
    image: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1600&q=80',
    alt: 'Junta de propietarios reunida en una sala luminosa',
  },
  {
    title: 'Equipo especializado',
    desc: 'Contamos con un administrador de fincas, un abogado especializado y un asesor dedicado que trabajan de forma coordinada para proteger los intereses de la comunidad.',
    image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1600&q=80',
    alt: 'Equipo de administración de fincas de Group Casas',
  },
  {
    title: 'Portal online 24 horas',
    desc: 'Ponemos a disposición de todos los propietarios un portal online seguro donde consultar la documentación de la comunidad, actas, estados de cuenta, recibos e incidencias en cualquier momento.',
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1600&q=80',
    alt: 'Portal online de la comunidad abierto en un ordenador portátil',
  },
]

const AUTOPLAY_MS = 6000
const EASE = [0.22, 1, 0.36, 1] as const

export function QueIncluyeCarousel() {
  const [index, setIndex] = useState(0)
  // El signo marca de qué lado entra la diapositiva nueva (+1 avanzando).
  const [direction, setDirection] = useState(1)
  const [paused, setPaused] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  // Fuera de pantalla el autoplay no aporta nada y solo quema imágenes: lo
  // congelamos hasta que la sección entra en el viewport.
  const [inView, setInView] = useState(false)

  const go = useCallback((next: number, dir: number) => {
    setDirection(dir)
    setIndex(((next % SLIDES.length) + SLIDES.length) % SLIDES.length)
  }, [])

  const prev = useCallback(() => go(index - 1, -1), [go, index])
  const next = useCallback(() => go(index + 1, 1), [go, index])

  useEffect(() => {
    const el = rootRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.3 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // Autoplay suave. Depende de `index` a propósito: cada cambio manual reinicia
  // el temporizador, así el usuario nunca ve un salto justo después de tocar.
  useEffect(() => {
    if (paused || !inView) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = window.setTimeout(() => go(index + 1, 1), AUTOPLAY_MS)
    return () => window.clearTimeout(id)
  }, [index, paused, inView, go])

  // Precargamos la siguiente foto para que el crossfade no entre en blanco.
  useEffect(() => {
    const img = new Image()
    img.src = SLIDES[(index + 1) % SLIDES.length].image
  }, [index])

  // Swipe en móvil.
  const touchStart = useRef<{ x: number; y: number } | null>(null)

  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0]
    touchStart.current = { x: t.clientX, y: t.clientY }
  }

  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart.current) return
    const t = e.changedTouches[0]
    const dx = t.clientX - touchStart.current.x
    const dy = t.clientY - touchStart.current.y
    touchStart.current = null
    // Solo gestos claramente horizontales: si no, el usuario está scrolleando.
    if (Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(dy)) return
    if (dx < 0) next()
    else prev()
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault()
      prev()
    } else if (e.key === 'ArrowRight') {
      e.preventDefault()
      next()
    }
  }

  const slide = SLIDES[index]
  const counter = `${String(index + 1).padStart(2, '0')} / ${String(SLIDES.length).padStart(2, '0')}`

  return (
    <div
      ref={rootRef}
      className="qi-carousel"
      role="group"
      aria-roledescription="carrusel"
      aria-label="Qué incluye el servicio de administración de fincas"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onKeyDown={onKeyDown}
    >
      <div className="qi-stage">
        <button
          type="button"
          className="qi-arrow qi-arrow--prev"
          onClick={prev}
          aria-label="Servicio anterior"
        >
          <span className="qi-arrow-chevron" aria-hidden="true" />
        </button>

        <div className="qi-frame" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
          {/* mode sync: las dos fotos conviven apiladas (position:absolute en el
              CSS) durante el crossfade. */}
          <AnimatePresence initial={false}>
            <motion.img
              key={slide.image}
              className="qi-photo"
              src={slide.image}
              alt={slide.alt}
              loading="lazy"
              decoding="async"
              initial={{ opacity: 0, scale: 1.04, x: direction * 24 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 1.01, x: direction * -18 }}
              transition={{ duration: 0.9, ease: EASE }}
            />
          </AnimatePresence>
        </div>

        <button
          type="button"
          className="qi-arrow qi-arrow--next"
          onClick={next}
          aria-label="Servicio siguiente"
        >
          <span className="qi-arrow-chevron" aria-hidden="true" />
        </button>
      </div>

      {/* aria-live para que un lector de pantalla anuncie el cambio de slide */}
      <div className="qi-caption" aria-live="polite">
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            key={slide.title}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.45, ease: EASE }}
          >
            <h3 className="qi-title">{slide.title}</h3>
            <p className="qi-desc">{slide.desc}</p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="qi-nav">
        <span className="qi-counter">{counter}</span>
        <div className="qi-dots">
          {SLIDES.map((s, i) => (
            <button
              key={s.title}
              type="button"
              className={`qi-dot${i === index ? ' is-active' : ''}`}
              onClick={() => go(i, i > index ? 1 : -1)}
              aria-label={s.title}
              aria-current={i === index}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
