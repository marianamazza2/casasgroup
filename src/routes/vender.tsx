import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useMotionTemplate, useScroll, useTransform } from 'framer-motion'
import { Footer } from '../components/Footer'
import { FormSelect } from '../components/vender/FormSelect'

export const Route = createFileRoute('/vender')({
  component: VenderPage,
})

const BENEFICIOS = [
  'Valoración gratuita y sin compromiso',
  'Basada en ventas reales en tu zona',
  'Servicio exclusivo para propietarios',
]

const PROPERTY_TYPES = ['Piso', 'Casa o chalet', 'Ático', 'Local comercial', 'Otro']

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

function VenderPage() {
  const formRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLElement>(null)
  const [ctaActive, setCtaActive] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [propertyType, setPropertyType] = useState(PROPERTY_TYPES[0])

  // Timeline "Cómo funciona": el riel dorado se "dibuja" con el scroll, igual
  // que la sección "En cuatro simples pasos" de cambio de suministros.
  const pasosRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: pasosRef,
    offset: ['start 75%', 'end 65%'],
  })
  const lineFill = useTransform(scrollYProgress, [0, 1], [0, 1])

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
          <h2 className="vender-form-heading">Descubre cuánto vale tu vivienda</h2>
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
                <FormSelect
                  name="type"
                  ariaLabel="Tipo de inmueble"
                  value={propertyType}
                  options={PROPERTY_TYPES}
                  onChange={setPropertyType}
                />
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

      {/* Cómo funciona — timeline "En cuatro simples pasos" (cambio de suministros) */}
      <section className="pasos">
        <div className="pasos-head">
          <span className="pasos-eyebrow">Proceso simple</span>
          <h2 className="pasos-title">Cómo funciona</h2>
        </div>

        <div className="pasos-timeline" ref={pasosRef}>
          <div className="pasos-line" aria-hidden="true">
            <motion.div className="pasos-line-fill" style={{ scaleY: lineFill }} />
          </div>

          {PROCESO.map((paso, i) => (
            <PasoStep key={paso.num} paso={paso} index={i} />
          ))}
        </div>
      </section>

      {/* Por qué vender con nosotros — acordeón fijado que avanza con el scroll */}
      <PorQueVender />

      {/* CTA final */}
      <section ref={ctaRef} className={`adm-cta vender-cta${ctaActive ? ' is-active' : ''}`}>
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

// "Por qué vender con nosotros": split editorial. La foto queda fija (sticky)
// mientras la lista scrollea; la ventaja que cruza el centro del viewport se
// resalta y el resto se atenúa. El número/título sobre la foto acompañan.
const VW2_IMG =
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80'

function PorQueVender() {
  const [active, setActive] = useState(0)
  const itemRefs = useRef<Array<HTMLLIElement | null>>([])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(Number((entry.target as HTMLElement).dataset.index))
          }
        }
      },
      // Banda de detección estrecha en el centro: solo una ventaja activa.
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 },
    )
    for (const el of itemRefs.current) {
      if (el) observer.observe(el)
    }
    return () => observer.disconnect()
  }, [])

  return (
    <section className="vender-why">
      <div className="vender-why-head">
        <span className="vender-eyebrow">Confianza</span>
        <h2 className="vender-why-title">Por qué vender con nosotros</h2>
        <span className="vender-line" aria-hidden="true" />
      </div>

      <div className="vw2-grid">
        <div className="vw2-media" aria-hidden="true">
          <div className="vw2-media-sticky">
            <div
              className="vw2-img"
              style={{ backgroundImage: `url(${VW2_IMG})` }}
            >
              <div className="vw2-overlay">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={active}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <span className="vw2-overlay-num">
                      {String(active + 1).padStart(2, '0')}
                    </span>
                    <span className="vw2-overlay-title">{VENTAJAS[active].title}</span>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>

        <ol className="vw2-list">
          {VENTAJAS.map((item, i) => (
            <li
              key={item.title}
              data-index={i}
              ref={(el) => {
                itemRefs.current[i] = el
              }}
              className={`vw2-item${active === i ? ' is-active' : ''}`}
            >
              <span className="vw2-num" aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className="vw2-body">
                <h3 className="vw2-title">{item.title}</h3>
                <p className="vw2-desc">{item.desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      {/* Móvil: slider horizontal de tarjetas (imagen + número/título/desc) */}
      <div className="vw2-slider">
        {VENTAJAS.map((item, i) => (
          <article
            key={item.title}
            className="vw2-slide"
            style={{ backgroundImage: `url(${VW2_IMG})` }}
          >
            <div className="vw2-slide-overlay">
              <span className="vw2-overlay-num">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="vw2-overlay-title">{item.title}</span>
              <p className="vw2-slide-desc">{item.desc}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

function PasoStep({ paso, index }: { paso: (typeof PROCESO)[number]; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  // Progreso propio de cada paso: el número se rellena cuando el scroll lo alcanza
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 72%', 'center 52%'],
  })
  const reveal = useTransform(scrollYProgress, [0, 1], [100, 0])
  const clipPath = useMotionTemplate`inset(0 0 ${reveal}% 0)`
  const num = paso.num.padStart(2, '0')

  return (
    <motion.div
      ref={ref}
      className={`paso-step paso-step--${index % 2 === 0 ? 'left' : 'right'}`}
      initial={{ opacity: 0, y: 48 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-90px' }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="paso-marker" aria-hidden="true">
        <span className="paso-dot" />
      </div>
      <div className="paso-card">
        <span className="paso-index" aria-hidden="true">
          <span className="paso-index-outline">{num}</span>
          <motion.span className="paso-index-fill" style={{ clipPath }}>
            {num}
          </motion.span>
        </span>
        <div className="paso-text">
          <h3 className="paso-card-title">{paso.title}</h3>
          <p className="paso-desc">{paso.desc}</p>
        </div>
      </div>
    </motion.div>
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
