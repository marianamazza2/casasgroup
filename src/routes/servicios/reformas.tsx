import { createFileRoute, Link } from '@tanstack/react-router'
import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useScroll,
  useTransform,
} from 'framer-motion'
import { useCallback, useEffect, useRef, useState } from 'react'
import type { KeyboardEvent, PointerEvent } from 'react'
import { ServiceFooter } from '../../components/servicios/ServiceFooter'
import { absoluteUrl } from '../../lib/structuredData'

export const Route = createFileRoute('/servicios/reformas')({
  head: () => ({
    meta: [
      { title: 'Reformas integrales en Barcelona | Group Casas' },
      {
        name: 'description',
        content:
          'Reformas integrales, cocinas, baños y zonas comunes en Barcelona. Presupuesto cerrado, plazos por contrato y un único interlocutor. Group Casas.',
      },
      { property: 'og:title', content: 'Reformas integrales en Barcelona | Group Casas' },
      {
        property: 'og:description',
        content:
          'Reformas integrales, cocinas, baños y zonas comunes en Barcelona. Presupuesto cerrado y un único interlocutor con Group Casas.',
      },
      { property: 'og:url', content: absoluteUrl('/servicios/reformas') },
    ],
    links: [{ rel: 'canonical', href: absoluteUrl('/servicios/reformas') }],
  }),
  component: ReformasPage,
})

export const TIPOS_REFORMA = [
  {
    title: 'Reforma integral',
    desc: 'Renovamos la vivienda completa: distribución, instalaciones, acabados y mobiliario. Un solo equipo, un solo presupuesto y una única fecha de entrega.',
    image: '/reformas/reforma_integral.webp',
  },
  {
    title: 'Cocinas',
    desc: 'Diseñamos y ejecutamos la cocina de principio a fin: mobiliario, encimeras, electrodomésticos e iluminación, aprovechando cada centímetro del espacio.',
    image: '/reformas/reforma_cocina.webp',
  },
  {
    title: 'Baños',
    desc: 'Cambiamos sanitarios, alicatados y fontanería con soluciones que ganan espacio, reducen el consumo de agua y se mantienen impecables con los años.',
    image: '/reformas/reforma_bano.webp',
  },
  {
    title: 'Pintura y acabados',
    desc: 'Alisado de paredes, pintura, parquet, puertas y carpintería. La reforma más rápida y la que más cambia la sensación de tu casa.',
    image: '/reformas/pintura.webp',
  },
  {
    title: 'Zonas comunes',
    desc: 'Rehabilitación de portales, escaleras, fachadas y ascensores, coordinada con la administración de la finca y con los plazos acordados en junta.',
    image: '/reformas/zonas_comunes.webp',
  },
] as const

export const VENTAJAS = [
  'Presupuesto cerrado y por escrito: sabes lo que cuesta antes de empezar',
  'Un único interlocutor que coordina a todos los gremios',
  'Plazos de entrega comprometidos por contrato',
  'Garantía sobre materiales y mano de obra al terminar la obra',
]

// Proyectos del comparador: los tres son pares antes/después reales del mismo
// espacio, con las fotos del cliente en /public/reformas. El baño va primero
// porque es el que se muestra al abrir la página.
export const PROYECTOS = [
  {
    label: 'Baño',
    zona: 'Sant Gervasi, Barcelona',
    meta: '6 m² · 3 semanas',
    antes: '/reformas/bano-antes.webp',
    despues: '/reformas/bano-despues.webp',
  },
  {
    label: 'Reforma',
    zona: 'Eixample, Barcelona',
    meta: '92 m² · 9 semanas',
    antes: '/reformas/salon-antes.webp',
    despues: '/reformas/salon-despues.webp',
  },
  {
    label: 'Cocina',
    zona: 'Gràcia, Barcelona',
    meta: '14 m² · 4 semanas',
    antes: '/reformas/cocina-antes.webp',
    despues: '/reformas/cocina-despues.webp',
  },
] as const

export const PASOS = [
  {
    num: '1',
    title: 'Visita y medición',
    desc: 'Vamos a tu vivienda, tomamos medidas y escuchamos qué quieres conseguir.',
  },
  {
    num: '2',
    title: 'Proyecto y presupuesto',
    desc: 'Te presentamos la propuesta con materiales, plazos y un precio cerrado.',
  },
  {
    num: '3',
    title: 'Ejecución de la obra',
    desc: 'Coordinamos a todos los gremios y te informamos del avance cada semana.',
  },
  {
    num: '4',
    title: 'Entrega y garantía',
    desc: 'Revisamos contigo cada detalle y te entregamos la vivienda lista para vivir.',
  },
]

function ReformasPage() {
  return (
    <main className="servicio-page">
      <ReformasHero />
      <QueReformamos />
      <PorQueNosotros />
      <AntesDespues />
      <ComoTrabajamos />
      <CtaBanner />
      <ServiceFooter currentId="reformas" />
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

function ReformasHero() {
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
              'url(https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1920&q=80)',
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
          Reformas
        </motion.span>
        <motion.h1 className="sum-hero-title" variants={heroItem}>
          Damos vida a tu espacio
        </motion.h1>
        <motion.div className="sum-hero-line" variants={heroItem} />
        <motion.p className="sum-hero-subtitle" variants={heroItem}>
          Proyecto, obra y acabados con presupuesto cerrado. Tú decides cómo
          quieres vivir; del resto nos ocupamos nosotros.
        </motion.p>
        <motion.div variants={heroItem}>
          <Link className="button-link" to="/contacto">
            Solicitar presupuesto →
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

const panelsReveal = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  },
}

// "Qué reformamos" — paneles de imagen que se expanden en acordeón horizontal.
// En desktop el panel activo se abre con hover/foco; en móvil el acordeón pasa a
// vertical y la tarjeta abierta la marca el scroll (por eso el estado vive aquí
// y no en CSS puro).
function QueReformamos() {
  const [active, setActive] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const panelsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 860px)')
    const update = () => setIsMobile(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  // En móvil el acordeón lo mueve el scroll, pero de forma continua: en vez de
  // saltar de una tarjeta a la siguiente al cruzar un umbral, el "peso" de
  // apertura (--w) pasa de una a otra acompañando al dedo. Los pesos siempre
  // suman 1, así que el alto total del acordeón no cambia y nada da un salto
  // bajo el dedo. Escribimos las variables en el DOM (no en el estado) para no
  // re-renderizar en cada frame.
  useEffect(() => {
    if (!isMobile) return
    const el = panelsRef.current
    if (!el) return

    const panels = Array.from(el.children) as HTMLElement[]
    const n = TIPOS_REFORMA.length
    let frame = 0

    const smooth = (t: number) => t * t * (3 - 2 * t)
    const clamp01 = (t: number) => Math.min(1, Math.max(0, t))
    // Zona muerta al principio y al final de cada banda: la tarjeta se queda
    // abierta un tramo y el relevo ocurre en el centro, sin sensación de tirón.
    const relay = (t: number) => smooth(clamp01((t - 0.22) / 0.56))

    const measure = () => {
      frame = 0
      const rect = el.getBoundingClientRect()
      if (!rect.height) return
      const progress = (window.innerHeight * 0.5 - rect.top) / rect.height
      // La primera tarjeta ya está abierta al entrar y la última al salir.
      const pos = Math.min(n - 1, Math.max(0, progress * n - 0.5))
      const i = Math.floor(pos)
      const e = relay(pos - i)

      for (let k = 0; k < n; k += 1) {
        const w = k === i ? 1 - e : k === i + 1 ? e : 0
        // El texto entra sólo cuando la tarjeta ya está mayormente abierta,
        // para que no se vean dos bloques a medio desvanecer a la vez.
        const t = smooth(clamp01((w - 0.45) / 0.4))
        panels[k].style.setProperty('--w', w.toFixed(4))
        panels[k].style.setProperty('--t', t.toFixed(4))
      }
      setActive(Math.round(pos))
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure)
    }

    measure()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) cancelAnimationFrame(frame)
      panels.forEach((p) => {
        p.style.removeProperty('--w')
        p.style.removeProperty('--t')
      })
    }
  }, [isMobile])

  return (
    <section className="section reformas-tipos">
      <div className="services-inner">
        <div className="section-heading section-heading--center">
          <span>Qué reformamos</span>
          <h2>
            Cada rincón de <span className="ref-tipos-h2-break">tu casa</span>
          </h2>
        </div>

        <motion.div
          className="ref-panels"
          ref={panelsRef}
          variants={panelsReveal}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
        >
          {TIPOS_REFORMA.map((tipo, i) => {
            const open = i === active
            return (
              <button
                key={tipo.title}
                type="button"
                className={`ref-panel${open && !isMobile ? ' is-active' : ''}`}
                aria-expanded={open}
                onClick={() => !isMobile && setActive(i)}
                onMouseEnter={() => !isMobile && setActive(i)}
                onFocus={() => !isMobile && setActive(i)}
              >
                <span
                  className="ref-panel-img"
                  style={{ backgroundImage: `url(${tipo.image})` }}
                  aria-hidden="true"
                />
                <span className="ref-panel-overlay" aria-hidden="true" />
                <span className="ref-panel-label" aria-hidden="true">
                  {tipo.title}
                </span>
                <span className="ref-panel-body">
                  <span className="ref-panel-num" aria-hidden="true">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="ref-panel-title">{tipo.title}</span>
                  <span className="ref-panel-desc">{tipo.desc}</span>
                </span>
              </button>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}

// Mismo split oscuro que alarmas/seguros: foto a un lado y ventajas numeradas
// que se revelan una a una al entrar en pantalla.
function PorQueNosotros() {
  return (
    <section className="seguros-porque">
      <div className="seguros-porque-media" aria-hidden="true">
        <div
          className="seguros-porque-img"
          style={{
            backgroundImage:
              'url(https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80)',
          }}
        />
      </div>

      <div className="seguros-porque-content">
        <div className="section-heading">
          <span>Por qué con nosotros</span>
          <h2>Una obra sin sorpresas ni sobrecostes</h2>
        </div>
        <ul className="seguros-ventajas">
          {VENTAJAS.map((item, i) => (
            <VentajaRow
              key={item}
              texto={item}
              num={String(i + 1).padStart(2, '0')}
            />
          ))}
        </ul>
      </div>
    </section>
  )
}

function VentajaRow({ texto, num }: { texto: string; num: string }) {
  const ref = useRef<HTMLLIElement>(null)
  // Mismo relleno que PasoStep: el número se "dibuja" en dorado cuando el scroll
  // lo alcanza y luego queda relleno (clamp).
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 82%', 'center 58%'],
  })
  const reveal = useTransform(scrollYProgress, [0, 1], [100, 0])
  const clipPath = useMotionTemplate`inset(0 0 ${reveal}% 0)`

  return (
    <motion.li
      ref={ref}
      className="seguros-ventaja"
      initial={{ opacity: 0, x: -24 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <span className="paso-index seguros-ventaja-num" aria-hidden="true">
        <span className="paso-index-outline">{num}</span>
        <motion.span className="paso-index-fill" style={{ clipPath }}>
          {num}
        </motion.span>
      </span>
      <span className="seguros-ventaja-text">{texto}</span>
    </motion.li>
  )
}

// Amplitud (% del ancho hacia cada lado) y duración de un ciclo del vaivén
const HINT_AMPLITUDE = 9
const HINT_PERIOD = 3400

// Comparador de dos fotos (obra / resultado) con un divisor que se arrastra
// (ratón, dedo o flechas del teclado). Mientras el usuario no lo toca, el
// divisor se balancea en bucle a un lado y a otro para invitar a arrastrarlo.
function AntesDespues() {
  const [proyecto, setProyecto] = useState(0)
  // La posición del divisor se escribe directamente en la variable CSS: durante
  // el vaivén cambia en cada frame y pasarla por el estado obligaría a React a
  // re-renderizar 60 veces por segundo. El estado solo guarda el valor que ve
  // el lector de pantalla, y por eso únicamente se actualiza al interactuar.
  const [ariaSplit, setAriaSplit] = useState(50)
  const splitRef = useRef(50)
  const stageRef = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)
  const interacted = useRef(false)
  const hintFrame = useRef<number | null>(null)

  const item = PROYECTOS[proyecto]

  const applySplit = useCallback((value: number, syncAria = true) => {
    const clamped = Math.min(97, Math.max(3, value))
    splitRef.current = clamped
    stageRef.current?.style.setProperty('--ref-split', `${clamped}%`)
    if (syncAria) setAriaSplit(Math.round(clamped))
  }, [])

  // El vaivén se detiene en cuanto el usuario mueve el divisor, y ya no vuelve.
  const stopHint = useCallback(() => {
    interacted.current = true
    if (hintFrame.current !== null) {
      cancelAnimationFrame(hintFrame.current)
      hintFrame.current = null
    }
  }, [])

  const setFromClientX = useCallback(
    (clientX: number) => {
      const el = stageRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      applySplit(((clientX - rect.left) / rect.width) * 100)
    },
    [applySplit],
  )

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    stopHint()
    dragging.current = true
    e.currentTarget.setPointerCapture(e.pointerId)
    setFromClientX(e.clientX)
  }

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!dragging.current) return
    setFromClientX(e.clientX)
  }

  const endDrag = (e: PointerEvent<HTMLDivElement>) => {
    dragging.current = false
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId)
    }
  }

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    const step = e.shiftKey ? 10 : 4
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      stopHint()
      applySplit(splitRef.current + (e.key === 'ArrowLeft' ? -step : step))
      e.preventDefault()
    }
  }

  // Vaivén en bucle mientras la sección esté a la vista y nadie la haya tocado.
  // Se pausa al salir de pantalla para no dejar un rAF corriendo de fondo.
  useEffect(() => {
    const el = stageRef.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let startedAt = 0
    const tick = (now: number) => {
      if (!startedAt) startedAt = now
      const phase = ((now - startedAt) / HINT_PERIOD) * Math.PI * 2
      applySplit(50 + Math.sin(phase) * HINT_AMPLITUDE, false)
      hintFrame.current = requestAnimationFrame(tick)
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (interacted.current) return
        if (entry.isIntersecting) {
          if (hintFrame.current === null) {
            startedAt = 0
            hintFrame.current = requestAnimationFrame(tick)
          }
        } else if (hintFrame.current !== null) {
          cancelAnimationFrame(hintFrame.current)
          hintFrame.current = null
        }
      },
      { threshold: 0.35 },
    )
    observer.observe(el)
    return () => {
      observer.disconnect()
      if (hintFrame.current !== null) cancelAnimationFrame(hintFrame.current)
    }
  }, [applySplit])

  return (
    <section className="section ref-ba">
      <div className="services-inner">
        <div className="section-heading section-heading--center">
          <span>Obras recientes</span>
          <h2>El cambio, en una foto</h2>
        </div>

        <div className="ref-ba-tabs" role="tablist" aria-label="Proyectos">
          {PROYECTOS.map((p, i) => (
            <button
              key={p.label}
              type="button"
              role="tab"
              aria-selected={i === proyecto}
              className={`ref-ba-tab${i === proyecto ? ' is-active' : ''}`}
              onClick={() => {
                setProyecto(i)
                // Cambiar de proyecto no cuenta como "mover el divisor": si el
                // vaivén sigue vivo lo dejamos correr; si ya lo pararon, la
                // comparación arranca centrada.
                if (interacted.current) applySplit(50)
              }}
            >
              {p.label}
            </button>
          ))}
        </div>

        <div
          className="ref-ba-stage"
          ref={stageRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={item.label}
              className="ref-ba-media"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <div
                className="ref-ba-img"
                style={{ backgroundImage: `url(${item.antes})` }}
                aria-hidden="true"
              />
              <div
                className="ref-ba-img ref-ba-img--after"
                style={{ backgroundImage: `url(${item.despues})` }}
                aria-hidden="true"
              />
            </motion.div>
          </AnimatePresence>

          <span className="ref-ba-tag ref-ba-tag--antes">Antes</span>
          <span className="ref-ba-tag ref-ba-tag--despues">Después</span>

          <span className="ref-ba-divider" aria-hidden="true" />
          <button
            type="button"
            className="ref-ba-knob"
            role="slider"
            aria-label={`Comparar antes y después — ${item.label} en ${item.zona}`}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={ariaSplit}
            aria-valuetext={`${ariaSplit}% de la foto "antes" visible`}
            onKeyDown={onKeyDown}
          >
            <span aria-hidden="true">↔</span>
          </button>

          <div className="ref-ba-caption">
            <span className="ref-ba-caption-title">
              {item.label} · {item.zona}
            </span>
            <span className="ref-ba-caption-meta">{item.meta}</span>
          </div>
        </div>
      </div>
    </section>
  )
}

// Mismo timeline dorado que "En cuatro simples pasos" de suministros
function ComoTrabajamos() {
  const pasosRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: pasosRef,
    offset: ['start 75%', 'end 65%'],
  })
  const lineFill = useTransform(scrollYProgress, [0, 1], [0, 1])

  return (
    <section className="pasos">
      <div className="pasos-head">
        <span className="pasos-eyebrow">Cómo trabajamos</span>
        <h2 className="pasos-title">De la idea a las llaves</h2>
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

function CtaBanner() {
  const ref = useRef<HTMLElement>(null)
  const [active, setActive] = useState(false)

  // Misma mecánica que las demás páginas de servicios:
  // al entrar en viewport revela la imagen de fondo y aclara el texto
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => setActive(entry.isIntersecting),
      { threshold: 0.45, rootMargin: '0px 0px -35% 0px' },
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
            'url(https://images.unsplash.com/photo-1615873968403-89e068629265?auto=format&fit=crop&w=1600&q=80)',
        }}
      />
      <div className="adm-cta-inner">
        <span className="adm-cta-eyebrow">Reformas</span>
        <h2 className="adm-cta-title">¿Tienes una reforma en mente?</h2>
        <p className="adm-cta-text">
          Visitamos tu vivienda y te preparamos un presupuesto cerrado, gratuito y
          sin compromiso.
        </p>
        <Link className="button-link" to="/contacto">
          Solicitar presupuesto →
        </Link>
      </div>
    </section>
  )
}
