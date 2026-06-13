import { Link } from '@tanstack/react-router'

type ServiceId =
  | 'administracion-de-fincas'
  | 'hipotecas'
  | 'cambio-de-suministros'
  | 'seguros'

type Service = {
  id: ServiceId
  label: string
  icon: string
  to?: string
}

const SERVICES: Service[] = [
  {
    id: 'administracion-de-fincas',
    label: 'Administración de fincas',
    icon: '▣',
    to: '/servicios/administracion-de-fincas',
  },
  { id: 'hipotecas', label: 'Hipotecas', icon: '◆', to: undefined },
  {
    id: 'cambio-de-suministros',
    label: 'Cambio de suministros',
    icon: '⚡',
    to: '/servicios/cambio-de-suministros',
  },
  { id: 'seguros', label: 'Seguros', icon: '◉', to: undefined },
]

export function ServiceFooter({ currentId }: { currentId: ServiceId }) {
  const otherServices = SERVICES.filter((svc) => svc.id !== currentId)

  return (
    <>
      <section className="otros-servicios">
        <span className="otros-servicios-eyebrow">Otros servicios</span>
        <div className="otros-servicios-grid">
          {otherServices.map((svc) =>
            svc.to ? (
              <Link key={svc.id} className="otros-servicio-card" to={svc.to}>
                <span className="otros-servicio-icon" aria-hidden="true">
                  {svc.icon}
                </span>
                <span className="otros-servicio-label">{svc.label}</span>
              </Link>
            ) : (
              <a key={svc.id} className="otros-servicio-card" href="/#servicios">
                <span className="otros-servicio-icon" aria-hidden="true">
                  {svc.icon}
                </span>
                <span className="otros-servicio-label">{svc.label}</span>
              </a>
            ),
          )}
        </div>
      </section>

      <footer className="footer">
        <div>
          <div className="logo footer-logo">
            <span>CASAS</span>
            <small>GROUP</small>
          </div>
          <p>Tu hogar empieza aqui.</p>
        </div>
        <div>
          <h3>Inmuebles</h3>
          <a href="/#propiedades">Comprar</a>
          <a href="/#propiedades">Alquilar</a>
          <a href="/#valoracion">Vender</a>
        </div>
        <div>
          <h3>Contacto</h3>
          <a href="mailto:info@casasgroup.es">info@casasgroup.es</a>
          <a href="tel:+34123456789">+34 123 456 789</a>
          <span>Esplugues de Llobregat</span>
        </div>
      </footer>

      <div className="volver-home">
        <Link className="button-link button-link--ghost" to="/">
          ← Volver a la Home
        </Link>
      </div>
    </>
  )
}
