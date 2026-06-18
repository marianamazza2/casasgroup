import { createFileRoute, Link } from '@tanstack/react-router'
import { motion, useMotionTemplate, useScroll, useTransform } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { ServiceFooter } from '../../components/servicios/ServiceFooter'

export const Route = createFileRoute('/servicios/cambio-de-suministros')({
  component: CambioDeSuministrosPage,
})

export const SUMINISTROS = [
  {
    title: 'Electricidad',
    desc: 'Cambio de titularidad y selección de la mejor tarifa para tu nueva vivienda, sin cortes ni complicaciones.',
    tag: 'Energía',
    image:
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Gas natural',
    desc: 'Gestión del cambio de titular y revisión de la instalación con las compañías de tu zona.',
    tag: 'Energía',
    image:
      'https://images.unsplash.com/photo-1448630360428-65456885c650?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Agua',
    desc: 'Tramitamos el cambio con tu compañía local para que el suministro esté listo el día que llegas.',
    tag: 'Suministros',
    image:
      'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Internet y teléfono',
    desc: 'Comparamos las ofertas del mercado y contratamos la que mejor encaja con tu ritmo de vida.',
    tag: 'Conectividad',
    image:
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Seguros de hogar',
    desc: 'Coberturas personalizadas con las mejores compañías para proteger tu vivienda desde el primer día.',
    tag: 'Protección',
    image:
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Domiciliaciones',
    desc: 'Configuramos los pagos automáticos de cada suministro para que no tengas que pensar en nada.',
    tag: 'Gestión',
    image:
      'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1200&q=80',
  },
]

export const PASOS = [
  {
    num: '1',
    title: 'Dinos qué necesitas',
    desc: 'Qué suministros quieres y los datos de tu vivienda.',
  },
  {
    num: '2',
    title: 'Nos encargamos',
    desc: 'Gestionamos todo el papeleo con cada compañía.',
  },
  {
    num: '3',
    title: 'Te confirmamos',
    desc: 'Recibes confirmación de cada gestión realizada.',
  },
  {
    num: '4',
    title: 'Todo listo',
    desc: 'Llegas a tu nuevo hogar con todo funcionando.',
  },
]

function CambioDeSuministrosPage() {
  const pasosRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: pasosRef,
    offset: ['start 75%', 'end 65%'],
  })
  const lineFill = useTransform(scrollYProgress, [0, 1], [0, 1])

  // En móvil las tarjetas se convierten en un slider horizontal con dots:
  // el activo se deduce de la posición de scroll y los dots saltan a cada uno.
  const cardsRef = useRef<HTMLDivElement>(null)
  const [activeCard, setActiveCard] = useState(0)

  const onCardsScroll = () => {
    const el = cardsRef.current
    if (!el || el.clientWidth === 0) return
    const idx = Math.round(el.scrollLeft / el.clientWidth)
    setActiveCard(Math.max(0, Math.min(SUMINISTROS.length - 1, idx)))
  }

  const goToCard = (i: number) => {
    const el = cardsRef.current
    if (!el) return
    el.scrollTo({ left: i * el.clientWidth, behavior: 'smooth' })
  }

  return (
    <main className="servicio-page">
      <SumHero />

      <section className="section services">
        <div className="services-inner">
          <div className="section-heading">
            <span>Qué gestionamos</span>
            <h2>Todo bajo control</h2>
            <p>Nos ocupamos de cada suministro para que tú solo pienses en instalarte.</p>
          </div>

          <div className="suministros-cards" ref={cardsRef} onScroll={onCardsScroll}>
            {SUMINISTROS.map((item, i) => {
              const col = i % 3
              const row = Math.floor(i / 3)
              return (
                <motion.article
                  key={item.title}
                  className="suministro-card"
                  initial={{ opacity: 0, x: -36, y: 36 }}
                  whileInView={{ opacity: 1, x: 0, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{
                    duration: 0.6,
                    delay: (col + row) * 0.1,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <div
                    className="suministro-card-media"
                    style={{ backgroundImage: `url(${item.image})` }}
                  >
                    <span className="suministro-card-num">{String(i + 1).padStart(2, '0')}</span>
                    <span className="suministro-card-tag">{item.tag}</span>
                  </div>
                  <div className="suministro-card-body">
                    <h3>{item.title}</h3>
                    <p>{item.desc}</p>
                  </div>
                </motion.article>
              )
            })}
          </div>

          <div className="suministros-dots" role="tablist" aria-label="Suministros">
            {SUMINISTROS.map((item, i) => (
              <button
                key={item.title}
                type="button"
                className={`suministros-dot${activeCard === i ? ' is-active' : ''}`}
                aria-label={`Ver ${item.title}`}
                aria-selected={activeCard === i}
                onClick={() => goToCard(i)}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="pasos">
        <div className="pasos-head">
          <span className="pasos-eyebrow">Así de fácil</span>
          <h2 className="pasos-title">En cuatro simples pasos</h2>
        </div>

        <div className="pasos-timeline" ref={pasosRef}>
          <div className="pasos-line" aria-hidden="true">
            <motion.div className="pasos-line-fill" style={{ scaleY: lineFill }} />
          </div>

          {PASOS.map((paso, i) => (
            <PasoStep key={paso.num} paso={paso} index={i} />
          ))}
        </div>
      </section>

      <CtaBanner />

      <ServiceFooter currentId="cambio-de-suministros" />
    </main>
  )
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

function SumHero() {
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
              'url(https://images.unsplash.com/photo-1600210492493-0946911123ea?auto=format&fit=crop&w=1920&q=80)',
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
          Cambio de suministros
        </motion.span>
        <motion.h1 className="sum-hero-title" variants={heroItem}>
          Nos encargamos del papeleo por ti
        </motion.h1>
        <motion.div className="sum-hero-line" variants={heroItem} />
        <motion.p className="sum-hero-subtitle" variants={heroItem}>
          Luz, gas, agua e internet listos el día que llegas a tu nuevo hogar.
        </motion.p>
        <motion.div variants={heroItem}>
          <Link className="button-link" to="/contacto">
            Solicitar gestión →
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

function CtaBanner() {
  const ref = useRef<HTMLElement>(null)
  const [active, setActive] = useState(false)

  // Misma mecánica que la home / administración de fincas:
  // al entrar en viewport revela la imagen de fondo y aclara el texto
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => setActive(entry.isIntersecting),
      { threshold: 0.45 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={ref} className={`adm-cta${active ? ' is-active' : ''}`}>
      <div
        className="adm-cta-bg"
        aria-hidden="true"
        style={{
          backgroundImage:
            'url(https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1600&q=80)',
        }}
      />
      <div className="adm-cta-inner">
        <span className="adm-cta-eyebrow">Cambio de suministros</span>
        <h2 className="adm-cta-title">No pierdas tiempo con el papeleo</h2>
        <p className="adm-cta-text">Contáctanos y nos encargamos de todo.</p>
        <Link className="button-link" to="/contacto">
          Solicitar gestión →
        </Link>
      </div>
    </section>
  )
}

function PasoStep({ paso, index }: { paso: (typeof PASOS)[number]; index: number }) {
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
