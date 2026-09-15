import { createFileRoute, Link } from '@tanstack/react-router'
import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useScroll,
  useTransform,
} from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import type { TouchEvent } from 'react'
import { ServiceFooter } from '../../components/servicios/ServiceFooter'
import { absoluteUrl } from '../../lib/structuredData'

export const Route = createFileRoute('/servicios/alarmas')({
  head: () => ({
    meta: [
      { title: 'Alarmas para tu vivienda | Group Casas' },
      {
        name: 'description',
        content:
          'Sistemas de alarma gestionados por quien conoce tu vivienda. Protege tu hogar en Barcelona con el acompañamiento de Group Casas.',
      },
      { property: 'og:title', content: 'Alarmas para tu vivienda | Group Casas' },
      {
        property: 'og:description',
        content:
          'Sistemas de alarma gestionados por quien conoce tu vivienda. Protege tu hogar en Barcelona con Group Casas.',
      },
      { property: 'og:url', content: absoluteUrl('/servicios/alarmas') },
    ],
    links: [{ rel: 'canonical', href: absoluteUrl('/servicios/alarmas') }],
  }),
  component: AlarmasPage,
})

export const TIPOS_ALARMA = [
  {
    title: 'Tu vivienda',
    headline: 'Protección para tu hogar, estés dentro o fuera.',
    desc: 'Sistemas de alarma conectados 24/7 para detectar posibles intrusiones, verificar las alertas y actuar cuando sea necesario.',
    image:
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Tu local',
    headline: 'Tu negocio protegido las 24 horas.',
    desc: 'Sistemas de seguridad adaptados a tu local para detectar posibles intrusiones y actuar ante cualquier incidencia.',
    image:
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Tu comunidad',
    headline: 'Protección para los espacios que compartís.',
    desc: 'Soluciones de seguridad adaptadas a accesos y zonas comunes para reforzar la protección de tu comunidad.',
    image:
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
  },
] as const

// Prestaciones que puede incluir el sistema, bajo el showcase de "¿Qué quieres
// proteger?" como cierre de la sección.
export const INCLUYE = [
  'Conexión 24/7 a Central Receptora de Alarmas',
  'Verificación de alertas',
  'Aviso a Policía cuando proceda',
  'Control desde el móvil',
  'Detectores de movimiento y acceso',
  'Cámaras y verificación por imagen',
  'Protección frente a sabotajes e inhibición',
  'Mantenimiento y supervisión del sistema',
] as const

export const VENTAJAS = [
  {
    title: 'DETECCIÓN',
    desc: 'El sistema detecta una posible intrusión y envía una señal de alerta.',
  },
  {
    title: 'VERIFICACIÓN',
    desc: 'La Central Receptora recibe la señal y comprueba qué está ocurriendo mediante los sistemas de verificación disponibles.',
  },
  {
    title: 'ACTUACIÓN',
    desc: 'Una vez analizada la alerta, se activa el protocolo de seguridad correspondiente y se contacta contigo cuando proceda.',
  },
  {
    title: 'AVISO A LA POLICÍA',
    desc: 'Una vez verificada la alarma y confirmada una posible intrusión, se avisa inmediatamente a la Policía, facilitando la información necesaria para que pueda intervenir lo antes posible.',
  },
] as const

function AlarmasPage() {
  return (
    <main className="servicio-page">
      <AlarmasHero />
      <TiposAlarma />
      <Incluye />
      <PorQueNosotros />
      <CtaBanner />
      <ServiceFooter currentId="alarmas" />
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

function AlarmasHero() {
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
              'url(https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=1920&q=80)',
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
          Alarmas
        </motion.span>
        <motion.h1 className="sum-hero-title" variants={heroItem}>
          Protege lo que más importa
        </motion.h1>
        <motion.div className="sum-hero-line" variants={heroItem} />
        <motion.p className="sum-hero-subtitle" variants={heroItem}>
          Sistemas de alarma con vigilancia 24/7. La tranquilidad de saber tu
          hogar siempre protegido.
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

// Showcase interactivo: lista seleccionable (hover/clic/teclado) a la izquierda
// y un panel de imagen grande a la derecha que hace crossfade al cambiar de
// solución. La sección entera entra con una aparición suave al hacer scroll.
const showcaseReveal = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  },
}

function TiposAlarma() {
  const [active, setActive] = useState(0)
  // En móvil la sección es un slider: ocultamos la lista y navegamos con
  // los dots o deslizando sobre la imagen. En desktop sigue la lógica de scroll.
  const [isMobile, setIsMobile] = useState(false)
  const itemRefs = useRef<(HTMLLIElement | null)[]>([])
  const touchStartX = useRef<number | null>(null)
  const item = TIPOS_ALARMA[active]

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 860px)')
    const update = () => setIsMobile(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  // Igual que la sección de servicios de la home: además del hover, el item
  // activo se actualiza con el scroll (el más cercano al centro del viewport),
  // aunque el ratón no esté encima. Solo en desktop (en móvil manda el slider).
  useEffect(() => {
    if (isMobile) return
    const handleScroll = () => {
      const items = itemRefs.current.filter(Boolean) as HTMLLIElement[]
      if (!items.length) return
      const viewportCenter = window.innerHeight / 2
      let closestIdx = 0
      let closestDist = Infinity
      items.forEach((el, i) => {
        const rect = el.getBoundingClientRect()
        if (rect.bottom > 0 && rect.top < window.innerHeight) {
          const dist = Math.abs(rect.top + rect.height / 2 - viewportCenter)
          if (dist < closestDist) {
            closestDist = dist
            closestIdx = i
          }
        }
      })
      setActive(closestIdx)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isMobile])

  const goTo = (i: number) =>
    setActive((i + TIPOS_ALARMA.length) % TIPOS_ALARMA.length)

  const handleTouchStart = (e: TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }
  const handleTouchEnd = (e: TouchEvent) => {
    if (touchStartX.current === null) return
    const dx = e.changedTouches[0].clientX - touchStartX.current
    if (Math.abs(dx) > 40) goTo(active + (dx < 0 ? 1 : -1))
    touchStartX.current = null
  }

  return (
    <section className="section seguros-tipos-section">
      <div className="services-inner">
        <div className="section-heading section-heading--center">
          <span>Soluciones</span>
          <h2>¿Qué quieres proteger?</h2>
        </div>

        <motion.div
          className="seguros-showcase alarmas-showcase"
          variants={showcaseReveal}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
        >
          <ul className="seguros-list">
            {TIPOS_ALARMA.map((tipo, i) => (
              <li
                key={tipo.title}
                ref={(el) => {
                  itemRefs.current[i] = el
                }}
              >
                <button
                  type="button"
                  className={`seguros-list-item${i === active ? ' is-active' : ''}`}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onClick={() => setActive(i)}
                  aria-pressed={i === active}
                >
                  <span className="seguros-list-num">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="seguros-list-title">{tipo.title}</span>
                  <span className="seguros-list-arrow" aria-hidden="true">
                    →
                  </span>
                </button>
              </li>
            ))}
          </ul>

          <div
            className="seguros-preview"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <AnimatePresence mode="wait">
              <motion.article
                key={item.title}
                className="seguros-preview-card"
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              >
                <div
                  className="seguros-preview-img"
                  style={{ backgroundImage: `url(${item.image})` }}
                  aria-hidden="true"
                />
                <div className="seguros-preview-overlay" aria-hidden="true" />
                <div className="seguros-preview-body">
                  <span className="seguros-preview-tag">
                    {String(active + 1).padStart(2, '0')} · {item.title}
                  </span>
                  <h3>{item.headline}</h3>
                  <p>{item.desc}</p>
                </div>
              </motion.article>
            </AnimatePresence>
          </div>

          {/* Dots de navegación: solo visibles en móvil (slider) */}
          <div
            className="seguros-dots"
            role="tablist"
            aria-label="Sistemas de alarma"
          >
            {TIPOS_ALARMA.map((tipo, i) => (
              <button
                key={tipo.title}
                type="button"
                role="tab"
                aria-selected={i === active}
                aria-label={tipo.title}
                className={`seguros-dot${i === active ? ' is-active' : ''}`}
                onClick={() => goTo(i)}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// Banda a ancho completo que cierra el capítulo de "¿Qué quieres proteger?"
// enumerando lo que puede llevar el sistema. Fondo blanco entre el showcase
// (crema) y la sección oscura del protocolo, para que las tres bandas se
// distingan entre sí.
function Incluye() {
  return (
    <section className="alarmas-incluye">
      <div className="alarmas-incluye-inner">
        <motion.h2
          className="alarmas-incluye-title"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          Todo lo que puede incluir tu alarma
        </motion.h2>

        <ul className="alarmas-incluye-list">
          {INCLUYE.map((item, i) => (
            <motion.li
              key={item}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{
                duration: 0.55,
                // Escalonado por fila: las dos columnas entran a la vez
                delay: (i % 4) * 0.09,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {item}
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  )
}

// "¿Qué pasa cuando salta la alarma?" — cada paso se revela UNO A UNO al entrar en
// pantalla (con `once: true` quedan visibles para siempre) y muestra el mismo
// número que la sección "En cuatro simples pasos" (outline + relleno dorado que
// se "dibuja" con el scroll).
function PorQueNosotros() {
  return (
    <section className="seguros-porque">
      <div className="seguros-porque-media" aria-hidden="true">
        <div
          className="seguros-porque-img"
          style={{
            backgroundImage:
              'url(https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=1200&q=80)',
          }}
        />
      </div>

      <div className="seguros-porque-content">
        <div className="section-heading">
          <h2>¿Qué pasa cuando salta la alarma?</h2>
        </div>
        <ul className="seguros-ventajas">
          {VENTAJAS.map((item, i) => (
            <VentajaRow
              key={item.title}
              titulo={item.title}
              texto={item.desc}
              num={String(i + 1).padStart(2, '0')}
            />
          ))}
        </ul>
      </div>
    </section>
  )
}

function VentajaRow({
  titulo,
  texto,
  num,
}: {
  titulo: string
  texto: string
  num: string
}) {
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
      <span className="seguros-ventaja-body">
        <span className="seguros-ventaja-title">{titulo}</span>
        <span className="seguros-ventaja-text">{texto}</span>
      </span>
    </motion.li>
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
      // El margen inferior negativo recorta el viewport por abajo, así la
      // sección debe estar más arriba (scroll un poco más abajo) para activarse
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
            'url(https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=1600&q=80)',
        }}
      />
      <div className="adm-cta-inner">
        <span className="adm-cta-eyebrow">Alarmas</span>
        <h2 className="adm-cta-title">¿Quieres proteger tu hogar?</h2>
        <p className="adm-cta-text">
          Te hacemos un estudio de seguridad gratuito y sin compromiso.
        </p>
        <Link className="button-link" to="/contacto">
          Solicitar presupuesto →
        </Link>
      </div>
    </section>
  )
}
