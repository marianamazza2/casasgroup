import { useEffect, useRef, useState } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { motion, useMotionTemplate, useScroll, useTransform } from 'framer-motion'
import { ServiceFooter } from '../../components/servicios/ServiceFooter'

export const Route = createFileRoute('/servicios/hipotecas')({
  component: HipotecasPage,
})

export const BENEFICIOS = [
  'Analizamos tu perfil financiero y capacidad de endeudamiento',
  'Negociamos con múltiples bancos para conseguir las mejores condiciones',
  'Te asesoramos sobre hipoteca fija, variable o mixta',
  'Preparamos y presentamos toda la documentación',
  'Te acompañamos a la firma en notaría',
  'Sin costes ocultos ni letra pequeña',
]

export const PROCESO = [
  {
    num: '1',
    title: 'Primera consulta',
    desc: 'Analizamos tu situación.',
  },
  {
    num: '2',
    title: 'Búsqueda de ofertas',
    desc: 'Negociamos con los bancos.',
  },
  {
    num: '3',
    title: 'Selección y trámites',
    desc: 'Eliges y gestionamos todo.',
  },
  {
    num: '4',
    title: 'Firma en notaría',
    desc: 'Te acompañamos hasta el final.',
  },
]

function HipotecasPage() {
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
    <main className="servicio-page">
      <HipotecasHero />

      <QueHacemos />

      <section className="cf">
        <div className="cf-glow" aria-hidden="true" />
        <div className="cf-head">
          <span className="cf-eyebrow">Cómo funciona</span>
          <h2 className="cf-title">En cuatro pasos</h2>
          <p className="cf-intro">
            Un proceso claro y acompañado, desde la primera consulta hasta la firma.
          </p>
        </div>

        <motion.ol
          className="cf-steps"
          variants={cfGrid}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
        >
          <div className="cf-rail" aria-hidden="true">
            <motion.div className="cf-rail-fill" variants={cfRail} />
          </div>

          {PROCESO.map((step) => (
            <CfStep key={step.num} step={step} />
          ))}
        </motion.ol>
      </section>

      <section ref={ctaRef} className={`adm-cta${ctaActive ? ' is-active' : ''}`}>
        <div
          className="adm-cta-bg"
          aria-hidden="true"
          style={{
            backgroundImage:
              'url(https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1600&q=80)',
          }}
        />
        <div className="adm-cta-inner">
          <span className="adm-cta-eyebrow">Consulta gratuita</span>
          <h2 className="adm-cta-title">¿Quieres saber cuánto puedes financiar?</h2>
          <p className="adm-cta-text">Primera consulta gratuita y sin compromiso.</p>
          <Link className="button-link" to="/contacto">
            Hablar con un asesor →
          </Link>
        </div>
      </section>

      <ServiceFooter currentId="hipotecas" />
    </main>
  )
}

const cfGrid = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
}

const cfCard = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  },
}

// Cada paso: en desktop el número va en su nodo circular; en móvil mostramos el
// número grande en serif que se "pinta" de dorado conforme el scroll lo alcanza,
// igual que la sección "En cuatro simples pasos" de suministros.
function CfStep({ step }: { step: (typeof PROCESO)[number] }) {
  const ref = useRef<HTMLLIElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 80%', 'center 55%'],
  })
  const reveal = useTransform(scrollYProgress, [0, 1], [100, 0])
  const clipPath = useMotionTemplate`inset(0 0 ${reveal}% 0)`
  const num = step.num.padStart(2, '0')

  return (
    <motion.li ref={ref} className="cf-step" variants={cfCard}>
      <span className="cf-node" aria-hidden="true">
        <span className="cf-node-num">{step.num}</span>
      </span>
      <span className="cf-index" aria-hidden="true">
        <span className="cf-index-outline">{num}</span>
        <motion.span className="cf-index-fill" style={{ clipPath }}>
          {num}
        </motion.span>
      </span>
      <div className="cf-step-body">
        <h3 className="cf-step-title">{step.title}</h3>
        <p className="cf-step-desc">{step.desc}</p>
      </div>
    </motion.li>
  )
}

// Línea dorada que "avanza" conectando los cuatro pasos al entrar en viewport
const cfRail = {
  hidden: { scaleX: 0 },
  show: {
    scaleX: 1,
    transition: { duration: 1.1, ease: [0.22, 1, 0.36, 1] as const },
  },
}

const heroContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.16, delayChildren: 0.1 } },
}

// Aparición suave como el brand "CASAS GROUP" de la home: solo opacidad,
// 2.8s con la misma curva `ease` de CSS, nada brusca
const heroItem = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { duration: 2.8, ease: [0.25, 0.1, 0.25, 1] as const },
  },
}

function HipotecasHero() {
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
              'url(https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?auto=format&fit=crop&w=1920&q=80)',
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
          Hipotecas
        </motion.span>
        <motion.h1 className="sum-hero-title" variants={heroItem}>
          Conseguimos tu mejor hipoteca
        </motion.h1>
        <motion.div className="sum-hero-line" variants={heroItem} />
        <motion.p className="sum-hero-subtitle" variants={heroItem}>
          Trabajamos con los principales bancos para conseguirte las mejores condiciones
          hipotecarias.
        </motion.p>
        <motion.div variants={heroItem}>
          <Link className="button-link" to="/contacto">
            Hablar con un asesor →
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

// "Qué hacemos por ti" — timeline horizontal con scroll pinned:
// la sección se fija a pantalla completa y el track avanza en horizontal
// a medida que el usuario hace scroll vertical; al llegar al último punto
// se libera y continúa hacia la siguiente sección.
function QueHacemos() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const viewportRef = useRef<HTMLDivElement>(null)
  const [range, setRange] = useState(0)
  const [pinned, setPinned] = useState(false)
  const [active, setActive] = useState(0)

  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ['start start', 'end end'],
  })
  const x = useTransform(scrollYProgress, [0, 1], [0, -range])
  const fill = useTransform(scrollYProgress, [0, 1], [0, 1])

  // En móvil (sin pin) el viewport es un slider horizontal con scroll-snap:
  // el paso activo se deduce de la posición de scroll y los dots saltan a cada uno.
  const onViewportScroll = () => {
    if (pinned) return
    const el = viewportRef.current
    if (!el || el.clientWidth === 0) return
    const idx = Math.round(el.scrollLeft / el.clientWidth)
    setActive(Math.max(0, Math.min(BENEFICIOS.length - 1, idx)))
  }

  const goTo = (i: number) => {
    const el = viewportRef.current
    if (!el) return
    el.scrollTo({ left: i * el.clientWidth, behavior: 'smooth' })
  }

  // 1) Decidir si pinnamos según el ancho de pantalla.
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)')
    const update = () => setPinned(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  // 2) Medir el recorrido SOLO una vez aplicada la clase .is-pinned, para que
  // el track ya esté en layout horizontal (si no, mide el layout vertical y da 0).
  useEffect(() => {
    if (!pinned) {
      setRange(0)
      return
    }
    const measure = () => {
      if (trackRef.current) {
        setRange(Math.max(0, trackRef.current.scrollWidth - window.innerWidth))
      }
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [pinned])

  return (
    <section
      className="qh"
      ref={wrapRef}
      style={pinned ? { height: `calc(100vh + ${range}px)` } : undefined}
    >
      <div className={`qh-sticky${pinned ? ' is-pinned' : ''}`}>
        <div className="qh-head">
          <span className="qh-eyebrow">Qué hacemos por ti</span>
          <h2 className="qh-title">Te acompañamos</h2>
        </div>

        <div className="qh-viewport" ref={viewportRef} onScroll={onViewportScroll}>
          <motion.div className="qh-track" ref={trackRef} style={pinned ? { x } : undefined}>
            <div className="qh-rail" aria-hidden="true">
              <motion.div
                className="qh-rail-fill"
                style={pinned ? { scaleX: fill } : undefined}
              />
            </div>

            {BENEFICIOS.map((texto, i) => (
              <div key={texto} className={`qh-item qh-item--${i % 2 === 0 ? 'up' : 'down'}`}>
                <span className="qh-stem" aria-hidden="true" />
                <span className="qh-dot" aria-hidden="true" />
                <div className="qh-card">
                  <span className="qh-num">{String(i + 1).padStart(2, '0')}</span>
                  <p className="qh-text">{texto}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        <div className="qh-dots" role="tablist" aria-label="Pasos">
          {BENEFICIOS.map((texto, i) => (
            <button
              key={texto}
              type="button"
              className={`qh-dot-btn${active === i ? ' is-active' : ''}`}
              aria-label={`Ver paso ${i + 1}`}
              aria-selected={active === i}
              onClick={() => goTo(i)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
