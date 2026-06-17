import { createFileRoute, Link } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Footer } from '../components/Footer'

export const Route = createFileRoute('/vender')({
  component: VenderPage,
})

const BENEFICIOS = [
  'Valoración gratuita y sin compromiso',
  'Basada en ventas reales en tu zona',
  'Servicio exclusivo para propietarios',
]

const PROPERTY_TYPES = ['Piso', 'Casa o chalet', 'Ático', 'Local comercial', 'Otro']

const STATS = [
  { n: '+500', l: 'Pisos vendidos' },
  { n: '30', l: 'Días de venta media' },
  { n: '98%', l: 'Clientes satisfechos' },
  { n: '+10', l: 'Años de experiencia' },
]

const PROCESO = [
  {
    num: '1',
    title: 'Completa el formulario',
    desc: 'Rellena los datos de tu vivienda y nos pondremos en contacto contigo.',
  },
  {
    num: '2',
    title: 'Valoración profesional',
    desc: 'Analizamos tu inmueble y la zona para darte una valoración basada en datos reales.',
  },
  {
    num: '3',
    title: 'Te explicamos el valor',
    desc: 'Te contactamos para explicarte el resultado y resolver todas tus dudas.',
  },
  {
    num: '4',
    title: 'Si decides vender',
    desc: 'Si tras la valoración decides vender, te acompañamos hasta la firma.',
  },
]

const VENTAJAS = [
  { icon: '★', title: 'Valoración profesional', desc: 'Estudio de mercado exhaustivo para determinar el precio óptimo.' },
  { icon: '⌂', title: 'Marketing premium', desc: 'Fotografía profesional, tours virtuales y difusión en portales.' },
  { icon: '♡', title: 'Gestión de visitas', desc: 'Filtramos y gestionamos visitas con compradores cualificados.' },
  { icon: '⚖', title: 'Asesoría legal', desc: 'Te acompañamos hasta la firma en notaría.' },
  { icon: '✦', title: 'Negociación experta', desc: 'Conseguimos las mejores condiciones para tu venta.' },
  { icon: '⚡', title: 'Rapidez', desc: 'Vendemos tu inmueble en el menor tiempo posible al mejor precio.' },
]

const gridVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
}

const cardVariants = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
  },
}

function VenderPage() {
  const formRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLElement>(null)
  const [ctaActive, setCtaActive] = useState(false)
  const [submitted, setSubmitted] = useState(false)

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

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <main className="servicio-page">
      <VenderHero onCta={scrollToForm} />

      {/* Valoración: intro + formulario */}
      <section className="vender-form-section" ref={formRef} id="valoracion-form">
        <div className="vender-form-intro">
          <span className="vender-eyebrow">Valoración gratuita</span>
          <h2 className="vender-form-heading">Descubre cuánto vale tu piso o casa</h2>
          <span className="vender-line" aria-hidden="true" />
          <p className="vender-form-lead">
            Obtén una valoración inmobiliaria gratuita y sin compromiso, basada en precios reales
            de mercado en tu zona.
          </p>
          <ul className="vender-checklist">
            {BENEFICIOS.map((item) => (
              <li key={item}>
                <span aria-hidden="true">✓</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="vender-form-card">
          {submitted ? (
            <div className="vender-form-done" role="status">
              <span className="vender-form-done-icon" aria-hidden="true">
                ✓
              </span>
              <h3>¡Solicitud recibida!</h3>
              <p>Te contactaremos en menos de 24 horas con tu valoración.</p>
            </div>
          ) : (
            <form
              className="vender-form"
              onSubmit={(event) => {
                event.preventDefault()
                setSubmitted(true)
              }}
            >
              <div className="vender-form-head">
                <h3>Solicita tu valoración gratuita</h3>
                <p>Te contactamos en menos de 24 horas</p>
              </div>
              <label>
                Nombre *
                <input name="name" placeholder="Tu nombre" required />
              </label>
              <label>
                Teléfono *
                <input name="phone" type="tel" placeholder="+34 6XX XXX XXX" required />
              </label>
              <label>
                Email *
                <input name="email" type="email" placeholder="tu@email.com" required />
              </label>
              <label>
                Tipo de inmueble *
                <select name="type" defaultValue={PROPERTY_TYPES[0]} required>
                  {PROPERTY_TYPES.map((type) => (
                    <option value={type} key={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Dirección del inmueble *
                <input name="address" placeholder="Calle, número, ciudad..." required />
              </label>
              <button type="submit">Enviar →</button>
              <p className="vender-form-fine">Sin compromiso de venta. Solo para propietarios.</p>
            </form>
          )}
        </div>
      </section>

      {/* Estadísticas */}
      <section className="vender-stats" aria-label="Resultados">
        {STATS.map((stat) => (
          <div key={stat.l} className="vender-stat">
            <strong>{stat.n}</strong>
            <span>{stat.l}</span>
          </div>
        ))}
      </section>

      {/* Cómo funciona — reutiliza la timeline de los servicios */}
      <section className="cf">
        <div className="cf-glow" aria-hidden="true" />
        <div className="cf-head">
          <span className="cf-eyebrow">Proceso simple</span>
          <h2 className="cf-title">Cómo funciona</h2>
          <p className="cf-intro">
            Desde la primera solicitud hasta la valoración, te acompañamos en cada paso.
          </p>
        </div>

        <motion.ol
          className="cf-steps"
          variants={gridVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
        >
          <div className="cf-rail" aria-hidden="true">
            <motion.div
              className="cf-rail-fill"
              variants={{ hidden: { scaleX: 0 }, show: { scaleX: 1, transition: { duration: 1.1, ease: [0.22, 1, 0.36, 1] as const } } }}
            />
          </div>

          {PROCESO.map((step) => (
            <motion.li key={step.num} className="cf-step" variants={cardVariants}>
              <span className="cf-node" aria-hidden="true">
                <span className="cf-node-num">{step.num}</span>
              </span>
              <div className="cf-step-body">
                <h3 className="cf-step-title">{step.title}</h3>
                <p className="cf-step-desc">{step.desc}</p>
              </div>
            </motion.li>
          ))}
        </motion.ol>
      </section>

      {/* Por qué vender con nosotros */}
      <section className="vender-why">
        <div className="vender-why-head">
          <span className="vender-eyebrow">Confianza</span>
          <h2 className="vender-why-title">Por qué vender con nosotros</h2>
          <span className="vender-line" aria-hidden="true" />
        </div>
        <motion.div
          className="vender-why-grid"
          variants={gridVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
        >
          {VENTAJAS.map((item) => (
            <motion.article key={item.title} className="vender-why-card" variants={cardVariants}>
              <span className="vender-why-icon" aria-hidden="true">
                {item.icon}
              </span>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </motion.article>
          ))}
        </motion.div>
      </section>

      {/* CTA final */}
      <section ref={ctaRef} className={`adm-cta${ctaActive ? ' is-active' : ''}`}>
        <div
          className="adm-cta-bg"
          aria-hidden="true"
          style={{
            backgroundImage:
              'url(https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1600&q=80)',
          }}
        />
        <div className="adm-cta-inner">
          <span className="adm-cta-eyebrow">Valoración gratuita</span>
          <h2 className="adm-cta-title">¿Quieres saber cuánto vale?</h2>
          <p className="adm-cta-text">
            La valoración es gratuita y no implica ningún compromiso de venta.
          </p>
          <button type="button" className="button-link" onClick={scrollToForm}>
            Solicitar valoración gratuita →
          </button>
        </div>
      </section>

      <Footer />
    </main>
  )
}

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

function VenderHero({ onCta }: { onCta: () => void }) {
  const ref = useRef<HTMLElement>(null)
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
              'url(https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=80)',
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
          Vender
        </motion.span>
        <motion.h1 className="sum-hero-title" variants={heroItem}>
          Descubre el valor real de tu vivienda
        </motion.h1>
        <motion.div className="sum-hero-line" variants={heroItem} />
        <motion.p className="sum-hero-subtitle" variants={heroItem}>
          Valoración profesional, gratuita y sin compromiso, basada en datos reales de tu zona.
        </motion.p>
        <motion.div variants={heroItem}>
          <button type="button" className="button-link" onClick={onCta}>
            Solicitar valoración gratuita →
          </button>
        </motion.div>
      </motion.div>

      <div className="sum-hero-scroll" aria-hidden="true">
        <span>Descúbrelo</span>
        <span className="sum-hero-scroll-line" />
      </div>
    </section>
  )
}
