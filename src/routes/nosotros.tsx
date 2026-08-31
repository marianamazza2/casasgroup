import { useEffect, useRef, useState } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Footer } from '../components/Footer'
import { MisionTabs } from '../components/nosotros/MisionTabs'
import { ValoresManifiesto } from '../components/nosotros/ValoresManifiesto'
import { TeamSlider } from '../components/nosotros/TeamSlider'
import { JsonLd } from '../components/JsonLd'
import { breadcrumbSchema, organizationSchema, absoluteUrl } from '../lib/structuredData'

export const Route = createFileRoute('/nosotros')({
  head: () => ({
    meta: [
      { title: 'Sobre nosotros | Group Casas' },
      {
        name: 'description',
        content:
          'Conoce a Group Casas: nuestro equipo, nuestra trayectoria y cómo trabajamos en el sector inmobiliario en Barcelona.',
      },
      { property: 'og:title', content: 'Sobre nosotros | Group Casas' },
      {
        property: 'og:description',
        content:
          'Group Casas: nuestro equipo, nuestra trayectoria y cómo trabajamos en el sector inmobiliario en Barcelona.',
      },
      { property: 'og:url', content: absoluteUrl('/nosotros') },
    ],
    links: [{ rel: 'canonical', href: absoluteUrl('/nosotros') }],
  }),
  component: NosotrosPage,
})

export const TRABAJA_PUNTOS = [
  'Formación continua y plan de carrera',
  'Un equipo cercano que apuesta por las personas',
  'Proyecto en crecimiento con marca propia',
]

// Valores: un solo texto corrido (literal, tal y como lo aprobó Angie). Los
// cortes de párrafo son solo para darle aire de lectura, no secciones.
export const VALORES_TEXTO = [
  'Creemos que la confianza se construye con hechos. Por eso trabajamos con honestidad y transparencia, cuidando cada detalle y tratando cada decisión con la responsabilidad que merece.',
  'Nos mueve el amor por lo que hacemos, por lo que priorizamos estar cerca de las personas para escuchar, entender sus necesidades y acompañarlas con la tranquilidad de saber que siempre tendrán a alguien a su lado.',
  'Nos implicamos en cada proceso como si fuera propio, buscando siempre lo mejor para nuestros clientes y actuando con respeto, profesionalidad y compromiso.',
  'No nos conformamos con hacer las cosas bien; creemos en dar un paso más, en superarnos cada día y en ofrecer un servicio a la altura de la confianza que depositan en nosotros. Porque para Group Casas, la excelencia no es solo una forma de trabajar, es nuestra forma de hacer las cosas.',
]

export const TABS = [
  {
    label: 'Misión',
    content:
      'Que nuestros clientes encuentren en Group Casas todo lo que necesitan para su vivienda y la tranquilidad de saber que están en las mejores manos. Acompañarlos en cada etapa, cuidar cada detalle y trabajar con la excelencia que nos define, para que al final del camino su felicidad sea también la nuestra.',
  },
  {
    label: 'Visión',
    content:
      'Nuestra visión es transformar la manera de vivir el sector inmobiliario, ofreciendo una experiencia integral en todo lo relacionado con la vivienda. Queremos construir un futuro en el que nuestros clientes no tengan que recurrir a distintos lugares para resolver cada necesidad, sino que puedan encontrar en Group Casas un único equipo capaz de acompañarlos en todo el proceso. Porque todo lo relacionado con tu vivienda puede empezar y terminar en un mismo lugar: Group Casas.',
  },
]

export const TEAM = [
  {
    name: 'Angie Caballero',
    role: 'Fundadora & CEO',
    image:
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Betsabé Caballero',
    role: 'Asesora Inmobiliaria',
    image:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Rafael Caballero',
    role: 'Administrador de Comunidades',
    image:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Iker Rentero',
    role: 'Asesor Financiero',
    image:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Marcos Gómez',
    role: 'Asesor Inmobiliario',
    image:
      'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Nicolle Pinzón',
    role: 'Administradora',
    image:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=600&q=80',
  },
]

export const TIMELINE = [
  { year: '2014', text: 'Nacimiento de Group Casas' },
  { year: '2018', text: 'Expansión a nuevas zonas' },
  { year: '2023', text: 'Más de 100 operaciones' },
  { year: '2026', text: 'Rebranding: Group Casas' },
]

function NosotrosPage() {
  const ctaRef = useRef<HTMLElement>(null)
  const [ctaActive, setCtaActive] = useState(false)

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
    <main className="nosotros-page">
      <JsonLd data={organizationSchema()} />
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Inicio', path: '/' },
          { name: 'Nosotros', path: '/nosotros' },
        ])}
      />
      <NosotrosHero />

      <section className="brand-story">
        <div className="brand-story-photo">Foto Angie / fundadora</div>
        <div className="brand-story-text">
          <span className="brand-story-eyebrow">La marca</span>
          <h2>Group Casas</h2>
          <div className="nosotros-gold-line nosotros-gold-line--left" />
          <p>
            Group Casas nace con un propósito: transformar la forma en la que las personas viven una de las
            decisiones más importantes de su vida.
          </p>
          <p>
            No queríamos crear una inmobiliaria más. Queríamos construir una marca capaz de transformar la
            experiencia de comprar, vender, financiar, reformar o administrar una vivienda.
          </p>
          <p>
            Todo lo que necesitas para tu vivienda, en un solo lugar.
          </p>
        </div>
      </section>

      <MisionTabs tabs={TABS} />

      <ValoresManifiesto paragraphs={VALORES_TEXTO} />

      <section className="section team">
        <div className="section-heading section-heading--center">
          <h2>Nuestro equipo</h2>
          <p>Conoce las personas detrás de Group Casas</p>
        </div>
        <TeamSlider members={TEAM} />
      </section>

      <motion.section
        id="trabaja"
        className="trabaja"
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="trabaja-media" aria-hidden="true">
          <div
            className="trabaja-img"
            style={{
              backgroundImage:
                'url(https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80)',
            }}
          />
        </div>

        <div className="trabaja-content">
          <div className="section-heading">
            <span>Únete al equipo</span>
            <h2>Trabaja con nosotros</h2>
          </div>
          <p className="trabaja-text">
            Buscamos personas que compartan nuestra forma de entender el sector:
            con ambición, cercanía y ganas de hacer las cosas excepcionalmente
            bien. Si quieres crecer en un equipo que cuida cada detalle, queremos
            conocerte.
          </p>
          <ul className="trabaja-puntos">
            {TRABAJA_PUNTOS.map((punto) => (
              <li key={punto}>{punto}</li>
            ))}
          </ul>
          <div className="trabaja-actions">
            <a
              className="button-link"
              href="mailto:rrhh@groupcasas.com?subject=Candidatura espontánea"
            >
              Envíanos tu CV →
            </a>
          </div>
        </div>
      </motion.section>

      <TrayectoriaTimeline items={TIMELINE} />

      <section ref={ctaRef} className={`adm-cta nosotros-cta${ctaActive ? ' is-active' : ''}`}>
        <div
          className="adm-cta-bg"
          aria-hidden="true"
          style={{
            backgroundImage:
              'url(https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1600&q=80)',
          }}
        />
        <div className="adm-cta-inner">
          <span className="adm-cta-eyebrow">Conócenos</span>
          <h2 className="adm-cta-title">¿Quieres conocernos en persona?</h2>
          <p className="adm-cta-text">
            Visítanos en nuestra oficina o contáctanos. Estaremos encantados de ayudarte.
          </p>
          <Link className="button-link" to="/contacto">
            Contáctanos →
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  )
}

// Línea de tiempo "Nuestra trayectoria": avanza sola de un hito al siguiente
// cuando entra en viewport. Se pausa fuera de pantalla y al pasar el ratón;
// el usuario también puede saltar a un hito haciendo clic.
function TrayectoriaTimeline({ items }: { items: typeof TIMELINE }) {
  const ref = useRef<HTMLElement>(null)
  const [active, setActive] = useState(0)
  const [inView, setInView] = useState(false)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.4 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!inView || paused) return
    const id = setInterval(() => {
      setActive((prev) => (prev + 1) % items.length)
    }, 1000)
    return () => clearInterval(id)
  }, [inView, paused, items.length])

  const progress = items.length > 1 ? (active / (items.length - 1)) * 100 : 0

  return (
    <section className="section timeline-section" ref={ref}>
      <div className="section-heading section-heading--center">
        <h2>Nuestra trayectoria</h2>
      </div>
      <div
        className="timeline"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div className="timeline-line" aria-hidden="true">
          <span className="timeline-line-fill" style={{ '--p': `${progress}%` } as React.CSSProperties} />
        </div>
        {items.map((item, i) => {
          const done = i <= active
          const current = i === active
          const state = current ? ' is-current' : done ? ' is-done' : ''
          return (
            <button
              type="button"
              className={`timeline-item${state}`}
              key={item.year}
              onClick={() => setActive(i)}
              aria-current={current ? 'step' : undefined}
            >
              <span className="timeline-dot" aria-hidden="true">
                <span className="timeline-dot-core" />
              </span>
              <span className="timeline-year">{item.year}</span>
              <span className="timeline-text">{item.text}</span>
            </button>
          )
        })}
      </div>
    </section>
  )
}

const heroContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.16, delayChildren: 0.1 } },
}

// Aparición suave (solo opacidad), igual que el hero de las páginas de servicios
const heroItem = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { duration: 2.8, ease: [0.25, 0.1, 0.25, 1] as const },
  },
}

function NosotrosHero() {
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
        {/* H1 semántico de la página. El titular visible de abajo es de marca
            (sin keyword), así que el encabezado real va oculto pero accesible. */}
        <h1 className="visually-hidden">
          Sobre Group Casas — inmobiliaria en Barcelona
        </h1>
        <motion.span className="sum-hero-eyebrow" variants={heroItem}>
          Hay otra forma de ser una inmobiliaria.
        </motion.span>
        <motion.p className="sum-hero-title sum-hero-title--two-line" variants={heroItem}>
          Y esa es<br />la nuestra.
        </motion.p>
        <motion.div className="sum-hero-line" variants={heroItem} />
        <motion.p className="sum-hero-subtitle" variants={heroItem}>
          Bienvenido a Group Casas
        </motion.p>
        <motion.div variants={heroItem}>
          <Link className="button-link" to="/contacto">
            Contáctanos →
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
