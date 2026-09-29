import { Link } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { Footer } from '../Footer'

type ServiceId =
  | 'administracion-de-comunidades'
  | 'hipotecas'
  | 'cambio-de-suministros'
  | 'seguros'
  | 'alarmas'
  | 'reformas'

type Service = {
  id: ServiceId
  label: string
  tag: string
  image: string
  // object-position del recorte 3:4 cuando lo importante no está centrado
  imagePosition?: string
  to?: string
}

// Servicios promocionados en "Seguimos a tu lado". Cambio de suministros sigue
// siendo una página válida (y pasa su propio currentId), pero no se muestra
// como tarjeta. Cada página se excluye a sí misma y la rejilla se limita a
// cuatro tarjetas (en Cambio de suministros no hay nada que excluir).
const SERVICES: Service[] = [
  {
    id: 'administracion-de-comunidades',
    label: 'Comunidades',
    tag: 'Administración',
    image: '/administrar/card.jpg',
    imagePosition: '75% center',
    to: '/servicios/administracion-de-comunidades',
  },
  {
    id: 'hipotecas',
    label: 'Hipotecas',
    tag: 'Financiación',
    image: '/hipotecas/card.webp',
    imagePosition: '70% center',
    to: '/servicios/hipotecas',
  },
  {
    id: 'reformas',
    label: 'Reformas',
    tag: 'Obras',
    image: '/reformas/card.webp',
    imagePosition: '65% center',
    to: '/servicios/reformas',
  },
  {
    id: 'seguros',
    label: 'Seguros',
    tag: 'Protección',
    image: '/seguros/vida.jpg',
    imagePosition: '65% center',
    to: '/servicios/seguros',
  },
  {
    id: 'alarmas',
    label: 'Alarmas',
    tag: 'Seguridad',
    image: '/alarmas/card.jpg',
    imagePosition: '90% center',
    to: '/servicios/alarmas',
  },
]

const gridVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
}

const cardVariants = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
  },
}

export function ServiceFooter({ currentId }: { currentId: ServiceId }) {
  const otherServices = SERVICES.filter((svc) => svc.id !== currentId).slice(
    0,
    4,
  )

  return (
    <>
      <section className="otros-servicios">
        <span className="otros-servicios-eyebrow">Otros servicios</span>
        <h2 className="otros-servicios-title">Seguimos a tu lado</h2>
        <motion.div
          className="otros-servicios-grid"
          variants={gridVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
        >
          {otherServices.map((svc) => {
            const inner = (
              <>
                <div className="otros-servicio-media">
                  <img
                    src={svc.image}
                    alt=""
                    loading="lazy"
                    style={
                      svc.imagePosition
                        ? { objectPosition: svc.imagePosition }
                        : undefined
                    }
                  />
                  <span className="otros-servicio-tag">{svc.tag}</span>
                </div>
                <div className="otros-servicio-foot">
                  <span className="otros-servicio-label">{svc.label}</span>
                  <span className="otros-servicio-arrow" aria-hidden="true">
                    →
                  </span>
                </div>
              </>
            )
            return (
              <motion.div key={svc.id} variants={cardVariants}>
                {svc.to ? (
                  <Link className="otros-servicio-card" to={svc.to}>
                    {inner}
                  </Link>
                ) : (
                  <a className="otros-servicio-card" href="/#servicios">
                    {inner}
                  </a>
                )}
              </motion.div>
            )
          })}
        </motion.div>
      </section>

      <Footer />
    </>
  )
}
