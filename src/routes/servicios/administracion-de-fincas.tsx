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

  const trackRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)

  // Paso de scroll = ancho de una card + el gap del track. Se mide del DOM para
  // que funcione con los anchos responsive (clamp) sin duplicar valores en JS.
  const stepFor = (el: HTMLDivElement) => {
    const first = el.firstElementChild as HTMLElement | null
    if (!first) return el.clientWidth
    const gap = parseFloat(getComputedStyle(el).columnGap || '0') || 0
    return first.offsetWidth + gap
  }

  const onTrackScroll = () => {
    const el = trackRef.current
    if (!el) return
    const idx = Math.round(el.scrollLeft / stepFor(el))
    setActive(Math.max(0, Math.min(FEATURES.length - 1, idx)))
  }

  const goTo = (i: number) => {
    const el = trackRef.current
    if (!el) return
    el.scrollTo({ left: i * stepFor(el), behavior: 'smooth' })
  }

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

        <motion.div
          className="adm-feature-track"
          ref={trackRef}
          onScroll={onTrackScroll}
          variants={gridVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
        >
          {FEATURES.map((item) => (
            <motion.article key={item.title} className="adm-feature-card" variants={cardVariants}>
              <div className="adm-feature-media">
                <img src={item.image} alt="" loading="lazy" />
              </div>
              <div className="adm-feature-body">
                <h3 className="adm-feature-title">{item.title}</h3>
                <p className="adm-feature-desc">{item.desc}</p>
              </div>
            </motion.article>
          ))}
        </motion.div>

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
          Tu comunidad en buenas manos
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
