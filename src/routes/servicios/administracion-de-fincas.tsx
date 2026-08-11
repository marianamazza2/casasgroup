import { createFileRoute, Link } from '@tanstack/react-router'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { QueIncluyeCarousel } from '../../components/servicios/QueIncluyeCarousel'
import { ServiceFooter } from '../../components/servicios/ServiceFooter'
import { absoluteUrl } from '../../lib/structuredData'

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
      { property: 'og:url', content: absoluteUrl('/servicios/administracion-de-fincas') },
    ],
    links: [{ rel: 'canonical', href: absoluteUrl('/servicios/administracion-de-fincas') }],
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

function AdministracionDeFincasPage() {
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
      <AdmHero />

      <section className="section adm-features">
        <div className="section-heading section-heading--center">
          <span>El servicio</span>
          <h2>Qué incluye</h2>
          <p>
            Te ofrecemos un servicio integral de administración de comunidades. Tu comunidad, en
            buenas manos: una gestión profesional, ágil y cercana.
          </p>
        </div>

        <QueIncluyeCarousel />
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
            Solicitar valoración →
          </Link>
        </motion.div>
      </motion.div>

      <div className="sum-hero-scroll" aria-hidden="true">
        <span className="sum-hero-scroll-line" />
      </div>
    </section>
  )
}
