import { createFileRoute, Link } from '@tanstack/react-router'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { ServiceFooter } from '../../components/servicios/ServiceFooter'

export const Route = createFileRoute('/servicios/administracion-de-fincas')({
  component: AdministracionDeFincasPage,
})

export const FEATURES = [
  {
    title: 'Gestión económica',
    desc: 'Control presupuestario, cobro de recibos, gestión de morosidad y cuentas claras cada trimestre.',
    image:
      'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1000&q=80',
  },
  {
    title: 'Mantenimiento preventivo',
    desc: 'Plan de mantenimiento del edificio, gestión de averías 24h y coordinación con proveedores homologados.',
    image:
      'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1000&q=80',
  },
  {
    title: 'Atención personalizada',
    desc: 'Un administrador dedicado a tu finca que conoce tu comunidad y está disponible cuando lo necesites.',
    image:
      'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1000&q=80',
  },
  {
    title: 'Juntas y documentación',
    desc: 'Preparación, convocatoria y seguimiento de juntas. Actas claras y accesibles.',
    image:
      'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1000&q=80',
  },
  {
    title: 'Cumplimiento normativo',
    desc: 'ITE, certificados energéticos, protección de datos — te mantenemos al día.',
    image:
      'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1000&q=80',
  },
  {
    title: 'Portal online',
    desc: 'Acceso a toda la documentación, presupuestos y comunicados desde cualquier dispositivo.',
    image:
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1000&q=80',
  },
]

const heroContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.16, delayChildren: 0.1 } },
}

const heroItem = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { duration: 2.8, ease: [0.25, 0.1, 0.25, 1] as const },
  },
}

const gridVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08 },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  },
}

function AdministracionDeFincasPage() {
  const ctaRef = useRef<HTMLElement>(null)
  const [ctaActive, setCtaActive] = useState(false)

  const wrapRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)

  // El dot activo refleja la card centrada en el viewport del track (mismo
  // criterio que el rail de propiedades de la home).
  const onTrackScroll = () => {
    const el = trackRef.current
    if (!el) return
    const cards = Array.from(el.querySelectorAll<HTMLElement>('.adm-feature-card'))
    if (!cards.length) return
    const center = el.scrollLeft + el.clientWidth / 2
    let closestIdx = 0
    let closestDist = Infinity
    cards.forEach((card, i) => {
      const cardCenter = card.offsetLeft + card.offsetWidth / 2
      const dist = Math.abs(cardCenter - center)
      if (dist < closestDist) {
        closestDist = dist
        closestIdx = i
      }
    })
    setActive(closestIdx)
  }

  // Dots (mobile): centra la card pulsada.
  const goTo = (i: number) => {
    const el = trackRef.current
    if (!el) return
    const card = el.querySelectorAll<HTMLElement>('.adm-feature-card')[i]
    if (!card) return
    el.scrollTo({
      left: card.offsetLeft + card.offsetWidth / 2 - el.clientWidth / 2,
      behavior: 'smooth',
    })
  }

  // Arrastre con el mouse (desktop): click-and-drag para mover las cards. En
  // mobile el scroll táctil ya funciona, así que solo lo activamos con ratón.
  const drag = useRef({ active: false, startX: 0, startScroll: 0 })

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse') return
    const el = trackRef.current
    if (!el) return
    drag.current = { active: true, startX: e.clientX, startScroll: el.scrollLeft }
    el.classList.add('is-grabbing')
    el.setPointerCapture(e.pointerId)
  }

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = trackRef.current
    if (!el || !drag.current.active) return
    el.scrollLeft = drag.current.startScroll - (e.clientX - drag.current.startX)
  }

  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = trackRef.current
    if (!el || !drag.current.active) return
    drag.current.active = false
    el.classList.remove('is-grabbing')
    try {
      el.releasePointerCapture(e.pointerId)
    } catch {
      // pointer ya liberado
    }
  }

  // Flechas (desktop): avanza/retrocede una card (ancho + gap, medido del DOM).
  const scrollAdm = (direction: -1 | 1) => {
    const el = trackRef.current
    if (!el) return
    const card = el.querySelector<HTMLElement>('.adm-feature-card')
    const gap = parseFloat(getComputedStyle(el).columnGap || '0') || 0
    const cardWidth = card ? card.getBoundingClientRect().width : 320
    el.scrollBy({ left: direction * (cardWidth + gap), behavior: 'smooth' })
  }

  // Desktop: arranca desplazado una card, así el padding lateral deja asomar un
  // "pedacito" de la card anterior a la izquierda (igual que el rail de la home).
  useEffect(() => {
    if (window.innerWidth <= 1024) return
    const el = trackRef.current
    if (!el) return
    const card = el.querySelector<HTMLElement>('.adm-feature-card')
    if (!card) return
    const gap = parseFloat(getComputedStyle(el).columnGap || '0') || 0
    el.scrollLeft = card.getBoundingClientRect().width + gap
  }, [])

  // Centra las flechas verticalmente sobre la imagen de la card (no sobre toda
  // la altura, que incluye el texto). Se recalcula al cambiar el tamaño.
  useEffect(() => {
    const setArrowY = () => {
      const wrap = wrapRef.current
      const media = wrap?.querySelector<HTMLElement>('.adm-feature-media')
      if (!wrap || !media) return
      wrap.style.setProperty('--adm-arrow-y', `${media.offsetHeight / 2}px`)
    }
    setArrowY()
    window.addEventListener('resize', setArrowY)
    return () => window.removeEventListener('resize', setArrowY)
  }, [])

  useEffect(() => {
    const el = ctaRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => setCtaActive(entry.isIntersecting),
      { threshold: 0.45 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <main className="servicio-page">
      <AdmHero />

      <section className="section adm-features">
        <div className="section-heading">
          <span>El servicio</span>
          <h2>Qué incluye</h2>
          <p>Todo lo que tu comunidad necesita, gestionado de principio a fin.</p>
        </div>

        <div className="adm-feature-wrap" ref={wrapRef}>
          <button
            type="button"
            className="rail-nav rail-nav-prev"
            aria-label="Anterior"
            onClick={() => scrollAdm(-1)}
          >
            <span aria-hidden="true">←</span>
          </button>
          <motion.div
            className="adm-feature-track"
            ref={trackRef}
            onScroll={onTrackScroll}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            variants={gridVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
          >
            {FEATURES.map((item) => (
              <motion.article key={item.title} className="adm-feature-card" variants={cardVariants}>
                <div className="adm-feature-media">
                  <img src={item.image} alt="" loading="lazy" draggable={false} />
                </div>
                <div className="adm-feature-body">
                  <h3 className="adm-feature-title">{item.title}</h3>
                  <p className="adm-feature-desc">{item.desc}</p>
                </div>
              </motion.article>
            ))}
          </motion.div>
          <button
            type="button"
            className="rail-nav rail-nav-next"
            aria-label="Siguiente"
            onClick={() => scrollAdm(1)}
          >
            <span aria-hidden="true">→</span>
          </button>
        </div>

        <div className="adm-feature-dots" role="tablist" aria-label="Servicios incluidos">
          {FEATURES.map((item, i) => (
            <button
              key={item.title}
              type="button"
              className={`adm-feature-dot${active === i ? ' is-active' : ''}`}
              aria-label={`Ver ${item.title}`}
              aria-selected={active === i}
              onClick={() => goTo(i)}
            />
          ))}
        </div>
      </section>

      <section ref={ctaRef} className={`adm-cta${ctaActive ? ' is-active' : ''}`}>
        <div
          className="adm-cta-bg"
          aria-hidden="true"
          style={{
            backgroundImage:
              'url(https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1600&q=80)',
          }}
        />
        <div className="adm-cta-inner">
          <span className="adm-cta-eyebrow">Auditoría gratuita</span>
          <h2 className="adm-cta-title">¿Quieres mejorar la gestión de tu comunidad?</h2>
          <p className="adm-cta-text">Te hacemos una auditoría gratuita y sin compromiso.</p>
          <Link className="button-link" to="/contacto">
            Contáctanos →
          </Link>
        </div>
      </section>

      <ServiceFooter currentId="administracion-de-fincas" />
    </main>
  )
}

function AdmHero() {
  const ref = useRef<HTMLElement>(null)
  // Parallax: el fondo se mueve más lento y el contenido se eleva/desvanece al salir
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '20%'])
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '34%'])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0])

  return (
    <section className="sum-hero" ref={ref}>
      <motion.div className="sum-hero-bg" style={{ y: bgY }} aria-hidden="true">
        <div
          className="sum-hero-bg-img"
          style={{
            backgroundImage:
              'url(https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=1920&q=80)',
          }}
        />
      </motion.div>
      <div className="sum-hero-overlay" aria-hidden="true" />

      <motion.div
        className="sum-hero-content"
        style={{ y: contentY, opacity: contentOpacity }}
        variants={heroContainer}
        initial="hidden"
        animate="show"
      >
        <motion.span className="sum-hero-eyebrow" variants={heroItem}>
          Administración de fincas
        </motion.span>
        <motion.h1 className="sum-hero-title" variants={heroItem}>
          Tu comunidad<br />en buenas manos
        </motion.h1>
        <motion.div className="sum-hero-line" variants={heroItem} />
        <motion.p className="sum-hero-subtitle" variants={heroItem}>
          Gestión transparente y cercana de tu comunidad de vecinos.
        </motion.p>
        <motion.div variants={heroItem}>
          <Link className="button-link" to="/contacto">
            Solicitar auditoría gratuita →
          </Link>
        </motion.div>
      </motion.div>

      <div className="sum-hero-scroll" aria-hidden="true">
        <span>Descúbrelo</span>
        <span className="sum-hero-scroll-line" />
      </div>
    </section>
  )
}
