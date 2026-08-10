import { Link } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { Footer } from '../Footer'

type ServiceId =
  | 'administracion-de-fincas'
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
  to?: string
}

// Servicios promocionados en "Seguimos a tu lado". Cambio de suministros sigue
// siendo una página válida (y pasa su propio currentId), pero no se muestra
// como tarjeta. Como cada página se excluye a sí misma, la rejilla queda
// siempre en cuatro tarjetas.
const SERVICES: Service[] = [
  {
    id: 'administracion-de-fincas',
    label: 'Administración de fincas',
    tag: 'Comunidades',
    image:
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1000&q=80',
    to: '/servicios/administracion-de-fincas',
  },
  {
    id: 'hipotecas',
    label: 'Hipotecas',
    tag: 'Financiación',
    image:
      'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1000&q=80',
    to: '/servicios/hipotecas',
  },
  {
    id: 'reformas',
    label: 'Reformas',
    tag: 'Obras',
    image:
      'https://images.unsplash.com/photo-1613545325278-f24b0cae1224?auto=format&fit=crop&w=1000&q=80',
    to: '/servicios/reformas',
  },
  {
    id: 'seguros',
    label: 'Seguros',
    tag: 'Protección',
    image:
      'https://images.unsplash.com/photo-1448630360428-65456885c650?auto=format&fit=crop&w=1000&q=80',
    to: '/servicios/seguros',
  },
  {
    id: 'alarmas',
    label: 'Alarmas',
    tag: 'Seguridad',
    image:
      'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=1000&q=80',
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
  const otherServices = SERVICES.filter((svc) => svc.id !== currentId)

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
                  <img src={svc.image} alt="" loading="lazy" />
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
