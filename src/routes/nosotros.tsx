import { useEffect, useRef, useState } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Footer } from '../components/Footer'
import { MisionTabs } from '../components/nosotros/MisionTabs'
import { ValoresSlider } from '../components/nosotros/ValoresSlider'

export const Route = createFileRoute('/nosotros')({
  component: NosotrosPage,
})

export const TRABAJA_PUNTOS = [
  'Formación continua y plan de carrera',
  'Un equipo cercano que apuesta por las personas',
  'Proyecto en crecimiento con marca propia',
]

export const VALUES = [
  {
    title: 'Excelencia',
    desc: 'No nos conformamos con lo bueno. Cada detalle, cada gestión, cada interacción está pensada para superar expectativas. Porque creemos que la excelencia no es un destino, es un hábito.',
    image:
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Cercanía',
    desc: 'Detrás de cada operación hay personas. Te escuchamos, te entendemos y te acompañamos. No somos una empresa más, somos tu equipo.',
    image:
      'https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Transparencia',
    desc: 'Sin letras pequeñas, sin sorpresas. Te contamos todo como es, con datos reales y honestidad absoluta. Tu confianza es nuestro mayor activo.',
    image:
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Ambición',
    desc: 'Nacimos con la visión de transformar el sector inmobiliario. No venimos a ser uno más. Venimos a ser los mejores. Y cada día trabajamos para demostrarlo.',
    image:
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
  },
]

export const TABS = [
  {
    label: 'Misión',
    content:
      'Ofrecer una experiencia inmobiliaria excepcional, donde cada cliente se sienta acompañado, asesorado y respaldado en una de las decisiones más importantes de su vida. Transformar el sector con cercanía, profesionalidad y atención al detalle.',
  },
  {
    label: 'Visión',
    content:
      'Ser la referencia inmobiliaria en nuestra zona, reconocidos por la calidad de nuestro servicio, la confianza de nuestros clientes y la ambición de hacer las cosas de la mejor manera posible.',
  },
  {
    label: 'Propósito',
    content:
      'Creemos que encontrar un hogar es mucho más que una transacción. Es un momento vital. Por eso existimos: para que ese momento sea tan especial como merece.',
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
    name: 'Javi Gallego',
    role: 'Director Comercial',
    image:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Nombre Apellido',
    role: 'Agente Inmobiliario',
    image:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Nombre Apellido',
    role: 'Administración',
    image:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
  },
]

export const TIMELINE = [
  { year: '2014', text: 'Nacimiento de Red Casas' },
  { year: '2018', text: 'Expansión a nuevas zonas' },
  { year: '2023', text: 'Más de 100 operaciones' },
  { year: '2026', text: 'Rebranding: Casas Group' },
]

function NosotrosPage() {
  return (
    <main className="nosotros-page">
      <NosotrosHero />

      <section className="brand-story">
        <div className="brand-story-photo">Foto Angie / fundadora</div>
        <div className="brand-story-text">
          <span className="brand-story-eyebrow">La marca</span>
          <h2>De Red Casas a Casas Group</h2>
          <div className="nosotros-gold-line nosotros-gold-line--left" />
          <p>
            Casas Group nació de la convicción de que el sector inmobiliario podía ofrecer mucho más. Una marca
            pensada para superar expectativas, transformar la experiencia inmobiliaria y cuidar cada detalle con
            excelencia.
          </p>
          <p>
            No somos una inmobiliaria más. Somos un equipo que entiende que comprar, vender o alquilar una vivienda
            es una de las decisiones más importantes que tomamos. Y queremos que esa experiencia sea excepcional.
          </p>
        </div>
      </section>

      <MisionTabs tabs={TABS} />

      <ValoresSlider values={VALUES} />

      <section className="section team">
        <div className="section-heading section-heading--center">
          <h2>Nuestro equipo</h2>
          <p>Conoce las personas detrás de Casas Group</p>
        </div>
        <div className="team-grid">
          {TEAM.map((member, i) => (
            <article className="team-card" key={`${member.name}-${i}`}>
              <div
                className="team-photo"
                style={{ backgroundImage: `url(${member.image})` }}
                role="img"
                aria-label={member.name}
              />
              <h3 className="team-name">{member.name}</h3>
              <p className="team-role">{member.role}</p>
            </article>
          ))}
        </div>
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
              href="mailto:rrhh@casasgroup.es?subject=Candidatura espontánea"
            >
              Envíanos tu CV →
            </a>
          </div>
        </div>
      </motion.section>

      <TrayectoriaTimeline items={TIMELINE} />

      <section className="nosotros-cta">
        <h2>¿Quieres conocernos en persona?</h2>
        <p>Visítanos en nuestra oficina o contáctanos. Estaremos encantados de ayudarte.</p>
        <div className="nosotros-cta-actions">
          <Link className="button-link" to="/contacto">
            Contáctanos →
          </Link>
          <a className="button-link button-link--ghost" href="tel:+34123456789">
            Llámanos
          </a>
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
        <motion.span className="sum-hero-eyebrow" variants={heroItem}>
          Nuestra historia
        </motion.span>
        <motion.h1 className="sum-hero-title" variants={heroItem}>
          El sector necesitaba algo diferente
        </motion.h1>
        <motion.div className="sum-hero-line" variants={heroItem} />
        <motion.p className="sum-hero-subtitle" variants={heroItem}>
          Construida desde el amor, la visión, la ambición y la pasión por hacer las cosas de la
          mejor manera.
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
