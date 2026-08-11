import { createFileRoute, Link } from '@tanstack/react-router'
import { motion, useMotionTemplate, useScroll, useTransform } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { ServiceFooter } from '../../components/servicios/ServiceFooter'
import { absoluteUrl } from '../../lib/structuredData'

export const Route = createFileRoute('/servicios/cambio-de-suministros')({
  head: () => ({
    meta: [
      { title: 'Cambio de suministros sin papeleo | Group Casas' },
      {
        name: 'description',
        content:
          'Cambia la luz, el agua y el gas de tu nueva vivienda sin papeleo. Nos encargamos de todo en cuatro simples pasos. Group Casas.',
      },
      { property: 'og:title', content: 'Cambio de suministros sin papeleo | Group Casas' },
      {
        property: 'og:description',
        content:
          'Luz, agua y gas de tu nueva vivienda sin papeleo. Nos encargamos de todo en cuatro simples pasos. Group Casas.',
      },
      { property: 'og:url', content: absoluteUrl('/servicios/cambio-de-suministros') },
    ],
    links: [{ rel: 'canonical', href: absoluteUrl('/servicios/cambio-de-suministros') }],
  }),
  component: CambioDeSuministrosPage,
})

export const SUMINISTROS = [
  {
    title: 'Agua',
    desc: 'Tramitamos el cambio con tu compañía local para que el suministro esté listo el día que llegas.',
    tag: 'Suministros',
    image:
      'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Electricidad',
    desc: 'Cambio de titularidad y selección de la mejor tarifa para tu nueva vivienda, sin cortes ni complicaciones.',
    tag: 'Energía',
    image:
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Gas',
    desc: 'Gestionamos el cambio de titular y buscamos las mejores opciones del mercado para tu vivienda.',
    tag: 'Energía',
    image:
      'https://images.unsplash.com/photo-1448630360428-65456885c650?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Telecomunicaciones',
    desc: 'Nos encargamos de gestionar tus servicios de telecomunicaciones, encontrando la mejor opción de internet y telefonía para que disfrutes de conexión desde el primer día en tu nueva vivienda.',
    tag: 'Conectividad',
    image:
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
  },
]

export const PASOS = [
  {
    num: '1',
    title: 'Solicitud',
    desc: 'Recibimos la información de tu vivienda y tus necesidades.',
  },
  {
    num: '2',
    title: 'Propuesta de gestión',
    desc: 'Preparamos un presupuesto personalizado. Tras tu aprobación, iniciamos las gestiones.',
  },
  {
    num: '3',
    title: 'Tramitación',
    desc: 'Gestionamos la contratación de principio a fin con todas las empresas suministradoras.',
  },
  {
    num: '4',
    title: 'Activación',
    desc: 'Te confirmamos cada gestión para que llegues a tu nueva vivienda con todos los servicios operativos.',
  },
]

// La animación de entrada vive en el contenedor del track y se dispara una sola
// vez (igual que el slider de administración de fincas). Así el scroll horizontal
// no vuelve a animar cada tarjeta (que daba el efecto de "aparecer desde abajo").
const cardsVariants = {
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

  // El dot activo refleja la card centrada en el viewport del track (mismo
  // criterio que el slider de administración de fincas).
  const onCardsScroll = () => {
    const el = cardsRef.current
    if (!el) return
    const cards = Array.from(el.querySelectorAll<HTMLElement>('.suministro-card'))
    if (!cards.length) return
    const center = el.scrollLeft + el.clientWidth / 2
    let closestIdx = 0
    let closestDist = Infinity
    cards.forEach((card, i) => {
      const cardCenter = card.offsetLeft + card.offsetWidth / 2
      const dist = Math.abs(cardCenter - center)
      if (dist < closestDist) {
        closestDist = dist
        closestIdx = i
      }
    })
    setActiveCard(closestIdx)
  }

  const goToCard = (i: number) => {
    const el = cardsRef.current
    if (!el) return
    const card = el.querySelectorAll<HTMLElement>('.suministro-card')[i]
    if (!card) return
    el.scrollTo({
      left: card.offsetLeft + card.offsetWidth / 2 - el.clientWidth / 2,
      behavior: 'smooth',
    })
  }

  return (
    <main className="servicio-page">
      <SumHero />

      <section className="section services">
        <div className="services-inner">
          <div className="section-heading">
            <span>Qué gestionamos</span>
            <h2>Todo lo que necesitas, en un solo lugar</h2>
            <p>
              Nos encargamos de todos los suministros para que tú solo tengas que
              disfrutar de tu nuevo hogar.
            </p>
          </div>

          <motion.div
            className="suministros-cards"
            ref={cardsRef}
            onScroll={onCardsScroll}
            variants={cardsVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
          >
            {SUMINISTROS.map((item, i) => (
              <motion.article key={item.title} className="suministro-card" variants={cardVariants}>
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
            ))}
          </motion.div>

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
          Suministros
        </motion.span>
        <motion.h1 className="sum-hero-title" variants={heroItem}>
          Todos tus suministros, una sola empresa que los gestiona
        </motion.h1>
        <motion.div className="sum-hero-line" variants={heroItem} />
        <motion.p className="sum-hero-subtitle" variants={heroItem}>
          Luz, agua, gas e internet listos desde el día que llegas a tu nuevo hogar.
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
