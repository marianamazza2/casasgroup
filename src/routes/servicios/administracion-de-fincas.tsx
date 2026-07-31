import { createFileRoute, Link } from '@tanstack/react-router'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { ServiceFooter } from '../../components/servicios/ServiceFooter'

export const Route = createFileRoute('/servicios/administracion-de-fincas')({
  head: () => ({
    meta: [
      { title: 'Administración de fincas en Barcelona | Group Casas' },
      {
        name: 'description',
        content:
          'Gestión profesional de comunidades de propietarios en Barcelona. Transparencia, cercanía y todo bajo control con Group Casas.',
      },
      { property: 'og:title', content: 'Administración de fincas en Barcelona | Group Casas' },
      {
        property: 'og:description',
        content:
          'Gestión profesional de comunidades de propietarios en Barcelona. Transparencia y cercanía con Group Casas.',
      },
      { property: 'og:url', content: 'https://casasgroup.es/servicios/administracion-de-fincas' },
    ],
    links: [{ rel: 'canonical', href: 'https://casasgroup.es/servicios/administracion-de-fincas' }],
  }),
  component: AdministracionDeFincasPage,
})

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

const proseVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08 },
  },
}

const proseItem = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  },
}

const SERVICE_PARAGRAPHS = [
  'Cada comunidad cuenta con un equipo de formado por un administrador de fincas, un abogado especializado y un asesor dedicado, que trabajan de forma coordinada para proteger los intereses de la comunidad y ofrecer un servicio cercano, eficaz y personalizado.',
  'Asesoramos en el proceso de constitución y legalización de la Comunidad de Propietarios, acompañando a los propietarios durante todo el proceso hasta su correcta puesta en funcionamiento. Una vez constituida, nos encargamos de su gestión y administración diaria, velando por el buen funcionamiento de la comunidad y la conservación del inmueble.',
  'Gestionamos la economía de la comunidad mediante la elaboración del presupuesto anual, el control de ingresos y gastos, la emisión y gestión de recibos, el pago a proveedores y la reclamación de impagos. Además, convocamos y coordinamos las reuniones de la comunidad, redactamos las actas, ejecutamos los acuerdos adoptados y buscamos de forma continua las mejores condiciones con los proveedores para optimizar los recursos y reducir los gastos de la comunidad.',
  'Ponemos a disposición de todos los propietarios un portal online donde podrán consultar la documentación de la comunidad, actas, convocatorias, estados de cuenta, recibos, incidencias y toda la información relevante, con acceso rápido, seguro y disponible las 24 horas del día.',
  'Gestionamos comunidades de propietarios en régimen de propiedad horizontal y propiedades en régimen de propiedad vertical, ofreciendo un servicio personalizado adaptado a las necesidades de cada finca.',
]

// Líneas del segundo párrafo que asoman difuminándose. La rampa entera cae
// dentro de ellas: el primer párrafo se lee opaco de principio a fin, la
// primera línea de "Asesoramos..." arranca el degradado, la segunda lo termina
// y de la tercera ya no se ve nada (si no, el botón "Ver más" se le superpone).
const PROSE_FADE_LINES = 2

function AdministracionDeFincasPage() {
  const ctaRef = useRef<HTMLElement>(null)
  const [ctaActive, setCtaActive] = useState(false)

  // Mobile: el texto arranca colapsado (el clamp lo aplica el CSS, en desktop se
  // ve entero pase lo que pase con este estado).
  const proseRef = useRef<HTMLDivElement>(null)
  const [proseOpen, setProseOpen] = useState(false)

  const toggleProse = () => {
    // Al plegar, el contenido de arriba se encoge y el botón "salta" fuera de
    // vista: devolvemos al usuario al principio del bloque.
    if (proseOpen) proseRef.current?.scrollIntoView({ block: 'start', behavior: 'smooth' })
    setProseOpen((v) => !v)
  }

  // Plegado, el primer párrafo se lee entero y el degradado arranca justo donde
  // empieza el segundo ("Asesoramos en el proceso..."), del que asoman
  // PROSE_FADE_LINES líneas cada vez más tenues hasta el corte. Medimos en vez
  // de fijar altos porque el número de líneas cambia con el ancho. El CSS solo
  // usa estas variables dentro del media query mobile.
  useEffect(() => {
    const el = proseRef.current
    if (!el) return

    const measure = () => {
      // offsetTop/Height y no getBoundingClientRect: los párrafos entran con un
      // transform y los rects lo incluirían, falseando la medida.
      const second = el.children[1] as HTMLElement | undefined
      if (!second) return

      const styles = getComputedStyle(second)
      const parsed = Number.parseFloat(styles.lineHeight)
      // line-height: normal no da un número: reconstruimos la línea desde el
      // font-size con el mismo 1.85 del CSS.
      const line = Number.isFinite(parsed)
        ? parsed
        : Number.parseFloat(styles.fontSize) * 1.85

      // El degradado empieza en la primera línea del segundo párrafo y el corte
      // cae PROSE_FADE_LINES líneas más abajo: toda la rampa queda ahí dentro.
      const fade = second.offsetTop - el.offsetTop
      const cut = fade + line * PROSE_FADE_LINES
      el.style.setProperty('--adm-prose-fade', `${fade}px`)
      el.style.setProperty('--adm-prose-clamp', `${cut}px`)
    }

    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    return () => observer.disconnect()
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
          <p>
            Te ofrecemos un servicio integral de administración de comunidades. Tu comunidad, en
            buenas manos: una gestión profesional, ágil y cercana.
          </p>
        </div>

        <motion.div
          id="adm-prose"
          ref={proseRef}
          className={`adm-prose${proseOpen ? ' is-expanded' : ' is-clamped'}`}
          variants={proseVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
        >
          {SERVICE_PARAGRAPHS.map((text) => (
            <motion.p key={text.slice(0, 40)} variants={proseItem}>
              {text}
            </motion.p>
          ))}
        </motion.div>

        <button
          type="button"
          className="adm-prose-toggle"
          aria-expanded={proseOpen}
          aria-controls="adm-prose"
          onClick={toggleProse}
        >
          {proseOpen ? 'Ver menos' : 'Ver más'}
          <span
            className={`adm-prose-chevron${proseOpen ? ' is-up' : ''}`}
            aria-hidden="true"
          />
        </button>
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
          <span className="adm-cta-eyebrow">Valoración gratuita</span>
          <h2 className="adm-cta-title">¿Quieres que administremos tu comunidad?</h2>
          <p className="adm-cta-text">Te hacemos una valoración gratuita y sin compromiso.</p>
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
        <motion.h1 className="sum-hero-title sum-hero-title--two-line" variants={heroItem}>
          Tu comunidad<br />en buenas manos
        </motion.h1>
        <motion.div className="sum-hero-line" variants={heroItem} />
        <motion.p className="sum-hero-subtitle" variants={heroItem}>
          Administramos tu comunidad
        </motion.p>
        <motion.p className="sum-hero-subtitle sum-hero-subtitle--body" variants={heroItem}>
          Ofrecemos una gestión integral de comunidades basada en la organización y la excelencia
          operativa. Supervisamos cada aspecto de la administración, desde la gestión financiera y el
          mantenimiento general hasta la atención personalizada a propietarios y proveedores,
          asegurando un servicio eficiente, cercano y de confianza.
        </motion.p>
        <motion.div variants={heroItem}>
          <Link className="button-link" to="/contacto">
            Solicitar presupuesto →
          </Link>
        </motion.div>
      </motion.div>

      <div className="sum-hero-scroll" aria-hidden="true">
        <span className="sum-hero-scroll-line" />
      </div>
    </section>
  )
}
