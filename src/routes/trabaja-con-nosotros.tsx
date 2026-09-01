import { useEffect, useRef, useState } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Footer } from '../components/Footer'
import { JsonLd } from '../components/JsonLd'
import { breadcrumbSchema, absoluteUrl } from '../lib/structuredData'

export const Route = createFileRoute('/trabaja-con-nosotros')({
  head: () => ({
    meta: [
      { title: 'Trabaja con nosotros | Group Casas' },
      {
        name: 'description',
        content:
          'Únete a Group Casas: formación continua, acompañamiento y un plan de carrera real como asesor, responsable de equipo o franquiciado en Barcelona.',
      },
      { property: 'og:title', content: 'Trabaja con nosotros | Group Casas' },
      {
        property: 'og:description',
        content:
          'Crece con nosotros: formación continua, acompañamiento y un plan de carrera real dentro del sector inmobiliario.',
      },
      { property: 'og:url', content: absoluteUrl('/trabaja-con-nosotros') },
    ],
    links: [{ rel: 'canonical', href: absoluteUrl('/trabaja-con-nosotros') }],
  }),
  component: TrabajaPage,
})

/** Dirección a la que llegan las candidaturas espontáneas. */
const RRHH_MAILTO =
  'mailto:rrhh@groupcasas.com?subject=Candidatura%20espont%C3%A1nea%20%E2%80%94%20Group%20Casas'

// El texto largo que aprobó el cliente, troceado en preguntas: cada bloque
// responde a una sola cosa. La pregunta va como entradilla dorada dentro del
// propio párrafo (mismo recurso que "Por qué vender con nosotros"): sirve de
// ancla para quien lee en diagonal sin romper el texto corrido.
export const PREGUNTAS = [
  {
    q: '¿A quién buscamos?',
    a: 'En Group Casas no buscamos simplemente incorporar profesionales, sino personas que quieran crecer, aprender y construir una trayectoria dentro del sector inmobiliario.',
  },
  {
    q: '¿Qué te ofrecemos?',
    a: 'Formación continua, acompañamiento y las herramientas necesarias para que puedas desarrollar todo tu potencial. Formarás parte de un equipo comprometido, cercano y exigente, donde el esfuerzo se reconoce, las ideas se escuchan y cada persona tiene la oportunidad de avanzar.',
  },
  {
    q: '¿Hasta dónde puedes llegar?',
    a: 'Hasta donde tú quieras. Si tu objetivo es emprender, podrás desarrollar tu propio proyecto inmobiliario a través de nuestro modelo de franquicias, contando con la experiencia, la metodología y el apoyo de Group Casas durante todo el camino.',
  },
] as const

// Los tres pasos de la carrera dentro de Group Casas. Fotos del cliente
// (public/trabaja-con-nosotros), convertidas a WebP con `npm run images`.
export const PUESTOS = [
  {
    title: 'Asesor/a',
    desc: 'Acompañas a los clientes en todo el proceso de compra, venta o alquiler con formación continua y el respaldo del equipo desde el primer día.',
    image: '/trabaja-con-nosotros/asesor.webp',
  },
  {
    title: 'Responsable de equipo',
    desc: 'El siguiente paso. Formas, lideras y haces crecer a tu propio equipo de asesores con la metodología y el acompañamiento de Group Casas.',
    image: '/trabaja-con-nosotros/responsable.webp',
  },
  {
    title: 'Franquiciado/a',
    desc: 'Abres tu oficina con nuestra marca y desarrollas tu negocio inmobiliario con nuestra experiencia, metodología y apoyo en cada etapa.',
    image: '/trabaja-con-nosotros/franquiciado.webp',
  },
] as const

function TrabajaPage() {
  return (
    <main className="tcn-page">
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Inicio', path: '/' },
          { name: 'Nosotros', path: '/nosotros' },
          { name: 'Trabaja con nosotros', path: '/trabaja-con-nosotros' },
        ])}
      />
      <TrabajaHero />
      <Preguntas />
      <Puestos />
      <TrabajaCta />
      <Footer />
    </main>
  )
}

const heroContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.16, delayChildren: 0.1 } },
}

// Misma aparición suave (solo opacidad) que el resto de heros del sitio.
const heroItem = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { duration: 2.8, ease: [0.25, 0.1, 0.25, 1] as const },
  },
}

function TrabajaHero() {
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
              'url(https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1920&q=80)',
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
          Únete al equipo
        </motion.span>
        <motion.h1 className="sum-hero-title" variants={heroItem}>
          Crece con nosotros
        </motion.h1>
        <motion.div className="sum-hero-line" variants={heroItem} />
        <motion.p className="sum-hero-subtitle" variants={heroItem}>
          Buscamos crecer juntos, compartiendo una misma forma de trabajar
          basada en la profesionalidad, la confianza, la excelencia y la pasión
          por lo que hacemos.
        </motion.p>
        <motion.div variants={heroItem}>
          <a className="button-link" href={RRHH_MAILTO}>
            Envíanos tu CV →
          </a>
        </motion.div>
      </motion.div>

      <div className="sum-hero-scroll" aria-hidden="true">
        <span>Descúbrelo</span>
        <span className="sum-hero-scroll-line" />
      </div>
    </section>
  )
}

// Bloque de preguntas. Mismo tratamiento editorial que "Por qué vender con
// nosotros": antetítulo dorado, titular en tinta y filete dorado debajo, con el
// texto corrido en una sola columna centrada.
function Preguntas() {
  return (
    <section className="tcn-qa-section">
      <div className="tcn-qa-head">
        <span className="tcn-eyebrow">Carrera profesional</span>
        <h2 className="tcn-qa-title">Por qué trabajar con nosotros</h2>
        <span className="tcn-line" aria-hidden="true" />
      </div>

      <div className="tcn-qa">
        {PREGUNTAS.map((item) => (
          <motion.p
            key={item.q}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <strong>{item.q}</strong> {item.a}
          </motion.p>
        ))}
      </div>
    </section>
  )
}

// Los tres puestos, numerados como el recorrido que son: 01 → 02 → 03.
function Puestos() {
  return (
    <section className="tcn-puestos">
      <div className="section-heading section-heading--center">
        <span>Tu recorrido</span>
        <h2>Tres formas de crecer</h2>
        <p>
          Puedes empezar acompañando a clientes y llegar a tener tu propia
          oficina. El camino lo marcas tú; nosotros ponemos la formación y el
          acompañamiento.
        </p>
      </div>

      <div className="tcn-puestos-grid">
        {PUESTOS.map((puesto, i) => (
          <motion.article
            className="tcn-puesto"
            key={puesto.title}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{
              duration: 0.6,
              delay: i * 0.1,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <div
              className="tcn-puesto-img"
              style={{ backgroundImage: `url(${puesto.image})` }}
              aria-hidden="true"
            />
            <div className="tcn-puesto-overlay" aria-hidden="true" />
            <div className="tcn-puesto-body">
              <span className="tcn-puesto-num" aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="tcn-puesto-title">{puesto.title}</h3>
              <p className="tcn-puesto-desc">{puesto.desc}</p>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  )
}

// Mismo CTA revelado por scroll que el resto de páginas (.adm-cta).
function TrabajaCta() {
  const ref = useRef<HTMLElement>(null)
  const [active, setActive] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => setActive(entry.isIntersecting),
      { threshold: 0.45, rootMargin: '0px 0px -25% 0px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={ref} className={`adm-cta tcn-cta${active ? ' is-active' : ''}`}>
      <div
        className="adm-cta-bg"
        aria-hidden="true"
        style={{
          backgroundImage:
            'url(https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?auto=format&fit=crop&w=1600&q=80)',
        }}
      />
      <div className="adm-cta-inner">
        <span className="adm-cta-eyebrow">Únete al equipo</span>
        <h2 className="adm-cta-title">Forma parte de Group Casas</h2>
        <p className="adm-cta-text">
          Escríbenos con tu CV y cuéntanos qué te gustaría desarrollar. Te
          responderemos personalmente.
        </p>
        <div className="tcn-cta-actions">
          <a className="button-link" href={RRHH_MAILTO}>
            Envíanos tu CV →
          </a>
          <Link className="tcn-cta-link" to="/contacto">
            O contáctanos
          </Link>
        </div>
      </div>
    </section>
  )
}
