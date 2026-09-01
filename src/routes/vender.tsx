import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'
import { motion, useMotionTemplate, useScroll, useTransform } from 'framer-motion'
import { Footer } from '../components/Footer'
import { FormSelect } from '../components/vender/FormSelect'
import { TextToggle } from '../components/TextToggle'
import { absoluteUrl } from '../lib/structuredData'

export const Route = createFileRoute('/vender')({
  head: () => ({
    meta: [
      { title: 'Vende tu vivienda | Valoración gratis | Group Casas' },
      {
        name: 'description',
        content:
          '¿Quieres vender tu casa en Barcelona? Te damos una valoración gratuita y te acompañamos en todo el proceso. Descubre cuánto vale.',
      },
      { property: 'og:title', content: 'Vende tu vivienda | Valoración gratis | Group Casas' },
      {
        property: 'og:description',
        content:
          'Valoración gratuita y sin compromiso de tu vivienda en Barcelona. Te acompañamos en todo el proceso de venta.',
      },
      { property: 'og:url', content: absoluteUrl('/vender') },
    ],
    links: [{ rel: 'canonical', href: absoluteUrl('/vender') }],
  }),
  component: VenderPage,
})

const BENEFICIOS = [
  'Sin compromiso',
  'Datos reales de mercado',
  'Respuesta en 24h',
]

const PROPERTY_TYPES = ['Piso', 'Casa o chalet', 'Ático', 'Local comercial', 'Otro']

const PROCESO = [
  {
    num: '1',
    title: 'Informe de valoración',
    desc: 'Completa el formulario con los datos de tu vivienda y nos pondremos en contacto contigo.',
  },
  {
    num: '2',
    title: 'Valoración profesional',
    desc: 'Analizamos tu vivienda para ofrecerte una valoración precisa y basada en datos reales.',
  },
  {
    num: '3',
    title: 'Entrega del informe',
    desc: 'Te entregamos el informe de valoración y te explicamos por qué ese es el precio de tu vivienda.',
  },
  {
    num: '4',
    title: 'Venta de tu vivienda',
    desc: 'Una vez analizada la información, si decides vender, comenzamos a trabajar para gestionar todo el proceso de venta de principio a fin.',
  },
]

// "Por qué vender con nosotros": el cliente pidió texto corrido en lugar de un
// listado. Cada párrafo arranca con una frase clave (en dorado) que hace de
// ancla para quien lee en diagonal, pero se lee como un solo texto.
const WHY_PARRAFOS = [
  {
    key: 'portales',
    lead: 'Publicación en los principales portales inmobiliarios de España.',
    text: 'Tu vivienda se anuncia allí donde busca la mayoría de compradores del país, además de en nuestros propios canales y entre los clientes que ya tenemos en cartera, para que tenga la máxima visibilidad desde el primer día.',
  },
  {
    key: 'asesor',
    lead: 'Acompañamiento de un asesor personalizado durante todo el proceso.',
    text: 'Una única persona que conoce tu vivienda, resuelve tus dudas, organiza las visitas y te mantiene informado desde la valoración hasta la firma en notaría.',
  },
  {
    key: 'financiero',
    lead: 'Colaboración estrecha con nuestro departamento financiero para seleccionar a los mejores compradores.',
    text: 'Estudiamos junto a ellos la solvencia de cada interesado antes de aceptar una oferta, para cerrar con quien de verdad puede comprar y evitar operaciones que se caen semanas después.',
  },
  {
    key: 'marketing',
    lead: 'Realización de una campaña de marketing específica para cada vivienda.',
    text: 'Ninguna casa se vende igual que la de al lado: fotografía profesional, presentación cuidada del inmueble y un mensaje pensado para el perfil de comprador que buscamos en cada caso.',
  },
]

function VenderPage() {
  const formRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLElement>(null)
  const [ctaActive, setCtaActive] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [formOpen, setFormOpen] = useState(false)
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
    // Al venir de un CTA el usuario ya quiere el formulario: lo desplegamos (móvil)
    setFormOpen(true)
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

        <div className={`vender-form-card${formOpen ? ' is-open' : ''}`}>
          {submitted ? (
            <div className="vender-form-done" role="status">
              <span className="vender-form-done-icon" aria-hidden="true">
                ✓
              </span>
              <h3>¡Solicitud recibida!</h3>
              <p>Te contactaremos en menos de 24 horas con tu valoración.</p>
            </div>
          ) : (
            <>
              {/* Móvil: el formulario arranca colapsado tras este CTA para no ocupar
                  toda la pantalla; se despliega al pulsarlo. En desktop está oculto. */}
              <button
                type="button"
                className="vender-form-trigger"
                aria-expanded={formOpen}
                onClick={() => setFormOpen(true)}
              >
                <span>Quiero solicitar mi valoración</span>
                <span aria-hidden="true">→</span>
              </button>
              <div className="vender-form-reveal">
                <div className="vender-form-reveal-inner">
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
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Cómo funciona — timeline "En cuatro simples pasos" (cambio de suministros) */}
      <section className="pasos">
        <div className="pasos-head">
          <span className="pasos-eyebrow">Proceso sencillo</span>
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
            Solicita tu valoración gratuita →
          </button>
        </div>
      </section>

      <Footer />
    </main>
  )
}

// "Por qué vender con nosotros": bloque editorial. Una foto en sticky a la
// izquierda y, a la derecha, el texto corrido que explica el servicio (sin
// listado, tal y como pidió el cliente). En móvil la foto pasa arriba y el
// texto se colapsa tras el segundo párrafo con "Ver más".
const VW3_IMG =
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80'

function PorQueVender() {
  const [expanded, setExpanded] = useState(false)

  return (
    <section className="vender-why">
      <div className="vender-why-head">
        <span className="vender-eyebrow">Confianza</span>
        <h2 className="vender-why-title">Por qué vender con nosotros</h2>
        <span className="vender-line" aria-hidden="true" />
      </div>

      <div className="vw3-grid">
        <div className="vw3-media">
          <div className="vw3-media-sticky">
            <div className="vw3-frame">
              <span className="vw3-frame-outline" aria-hidden="true" />
              <div className="vw3-img" style={{ backgroundImage: `url(${VW3_IMG})` }} />
            </div>
          </div>
        </div>

        <div className="vw3-copy">
          <div
            id="vender-why-text"
            className={`vw3-text${expanded ? ' is-expanded' : ' is-collapsed'}`}
          >
            {WHY_PARRAFOS.map((item) => (
              <motion.p
                key={item.key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              >
                <strong>{item.lead}</strong> {item.text}
              </motion.p>
            ))}
          </div>

          <TextToggle
            expanded={expanded}
            onToggle={() => setExpanded((v) => !v)}
            controls="vender-why-text"
            className="vw3-toggle"
          />
        </div>
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
          Conoce el valor de tu vivienda
        </motion.h1>
        <motion.div className="sum-hero-line" variants={heroItem} />
        <motion.p className="sum-hero-subtitle" variants={heroItem}>
          Conoce el valor real de tu vivienda mediante una valoración profesional, gratuita y sin compromiso, basada en un análisis preciso del mercado y en un estudio personalizado de tu inmueble.
        </motion.p>
        <motion.div variants={heroItem}>
          <button type="button" className="button-link" onClick={onCta}>
            Solicita tu valoración gratuita →
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
