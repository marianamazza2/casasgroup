import { createFileRoute, Link } from '@tanstack/react-router'
import { ServiceFooter } from '../../components/servicios/ServiceFooter'

export const Route = createFileRoute('/servicios/cambio-de-suministros')({
  component: CambioDeSuministrosPage,
})

export const SUMINISTROS = [
  {
    icon: '⚡',
    title: 'Electricidad',
    desc: 'Cambio de titularidad y selección de la mejor tarifa.',
  },
  {
    icon: '🔥',
    title: 'Gas natural',
    desc: 'Gestión del cambio de titular y revisión de instalación.',
  },
  {
    icon: '💧',
    title: 'Agua',
    desc: 'Tramitación del cambio con tu compañía local.',
  },
  {
    icon: '🌐',
    title: 'Internet y teléfono',
    desc: 'Comparamos y contratamos la mejor oferta.',
  },
  {
    icon: '🛡',
    title: 'Seguros de hogar',
    desc: 'Comparamos opciones y te asesoramos.',
  },
  {
    icon: '✓',
    title: 'Domiciliaciones',
    desc: 'Configuramos los pagos automáticos.',
  },
]

export const PASOS = [
  {
    num: '1',
    title: 'Dinos qué necesitas',
    desc: 'Qué suministros y los datos de tu vivienda.',
  },
  {
    num: '2',
    title: 'Nos encargamos',
    desc: 'Gestionamos todo el papeleo.',
  },
  {
    num: '3',
    title: 'Te confirmamos',
    desc: 'Recibes confirmación de cada gestión.',
  },
  {
    num: '4',
    title: 'Todo listo',
    desc: 'Llegas con todo funcionando.',
  },
]

function CambioDeSuministrosPage() {
  return (
    <main className="servicio-page">
      <section className="servicio-hero">
        <div className="servicio-hero-content">
          <span className="servicio-hero-eyebrow">Cambio de suministros</span>
          <h1 className="servicio-hero-title">Nos encargamos del papeleo por ti</h1>
          <div className="nosotros-gold-line" />
          <p className="servicio-hero-subtitle">
            Cuando compras o alquilas una vivienda, gestionar luz, gas, agua y seguros puede ser un
            dolor de cabeza. Nosotros lo hacemos por ti.
          </p>
        </div>
      </section>

      <section className="suministros-grid-section">
        <div className="suministros-grid">
          {SUMINISTROS.map((item) => (
            <div key={item.title} className="suministros-card">
              <span className="suministros-card-icon" aria-hidden="true">
                {item.icon}
              </span>
              <h3 className="suministros-card-title">{item.title}</h3>
              <p className="suministros-card-desc">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="pasos">
        <span className="pasos-eyebrow">Así de fácil</span>
        <div className="pasos-grid">
          {PASOS.map((paso) => (
            <div key={paso.num} className="paso-card">
              <span className="paso-num">{paso.num}</span>
              <h3 className="paso-title">{paso.title}</h3>
              <p className="paso-desc">{paso.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="servicio-cta servicio-cta--plain">
        <h2>No pierdas tiempo con el papeleo</h2>
        <p>Contáctanos y nos encargamos de todo.</p>
        <Link className="button-link" to="/contacto">
          Solicitar gestión →
        </Link>
      </section>

      <ServiceFooter currentId="cambio-de-suministros" />
    </main>
  )
}
