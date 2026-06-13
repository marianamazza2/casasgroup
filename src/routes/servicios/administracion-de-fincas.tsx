import { createFileRoute, Link } from '@tanstack/react-router'
import { ServicioAccordion } from '../../components/servicios/ServicioAccordion'
import { ServiceFooter } from '../../components/servicios/ServiceFooter'

export const Route = createFileRoute('/servicios/administracion-de-fincas')({
  component: AdministracionDeFincasPage,
})

export const ACCORDION_ITEMS = [
  {
    title: 'Gestión económica',
    desc: 'Control presupuestario, cobro de recibos, gestión de morosidad y cuentas claras cada trimestre.',
  },
  {
    title: 'Mantenimiento preventivo',
    desc: 'Plan de mantenimiento del edificio, gestión de averías 24h y coordinación con proveedores homologados.',
  },
  {
    title: 'Atención personalizada',
    desc: 'Un administrador dedicado a tu finca que conoce tu comunidad y está disponible cuando lo necesites.',
  },
  {
    title: 'Juntas y documentación',
    desc: 'Preparación, convocatoria y seguimiento de juntas. Actas claras y accesibles.',
  },
  {
    title: 'Cumplimiento normativo',
    desc: 'ITE, certificados energéticos, protección de datos — te mantenemos al día.',
  },
  {
    title: 'Portal online',
    desc: 'Acceso a toda la documentación, presupuestos y comunicados desde cualquier dispositivo.',
  },
]

function AdministracionDeFincasPage() {
  return (
    <main className="servicio-page">
      <section className="servicio-hero">
        <div className="servicio-hero-content">
          <span className="servicio-hero-eyebrow">Administración de fincas</span>
          <h1 className="servicio-hero-title">Tu comunidad en las mejores manos</h1>
          <div className="nosotros-gold-line" />
          <p className="servicio-hero-subtitle">
            Gestión integral de tu comunidad de vecinos con total transparencia, eficiencia y
            atención personalizada.
          </p>
          <Link className="button-link" to="/contacto">
            Solicitar auditoría gratuita →
          </Link>
        </div>
      </section>

      <ServicioAccordion items={ACCORDION_ITEMS} />

      <section className="servicio-cta">
        <h2>¿Quieres mejorar la gestión de tu comunidad?</h2>
        <p>Te hacemos una auditoría gratuita y sin compromiso.</p>
        <Link className="button-link" to="/contacto">
          Contáctanos →
        </Link>
      </section>

      <ServiceFooter currentId="administracion-de-fincas" />
    </main>
  )
}
