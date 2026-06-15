import { createFileRoute, Link } from '@tanstack/react-router'
import { ServiceFooter } from '../../components/servicios/ServiceFooter'

export const Route = createFileRoute('/servicios/hipotecas')({
  component: HipotecasPage,
})

export const BENEFICIOS = [
  'Analizamos tu perfil financiero y capacidad de endeudamiento',
  'Negociamos con múltiples bancos para conseguir las mejores condiciones',
  'Te asesoramos sobre hipoteca fija, variable o mixta',
  'Preparamos y presentamos toda la documentación',
  'Te acompañamos a la firma en notaría',
  'Sin costes ocultos ni letra pequeña',
]

export const STATS = [
  { n: '95%', l: 'Hipotecas aprobadas' },
  { n: '0,3%', l: 'Mejor diferencial medio' },
  { n: '48h', l: 'Respuesta de los bancos' },
]

export const PROCESO = [
  {
    num: '1',
    title: 'Primera consulta',
    desc: 'Analizamos tu situación y el inmueble.',
  },
  {
    num: '2',
    title: 'Búsqueda de ofertas',
    desc: 'Negociamos con los bancos.',
  },
  {
    num: '3',
    title: 'Selección y trámites',
    desc: 'Eliges y gestionamos todo.',
  },
  {
    num: '4',
    title: 'Firma en notaría',
    desc: 'Te acompañamos hasta el final.',
  },
]

function HipotecasPage() {
  return (
    <main className="servicio-page">
      <section className="servicio-split servicio-split--reverse">
        <div className="servicio-hero-split-content">
          <span className="servicio-hero-eyebrow">Hipotecas</span>
          <h1 className="servicio-hero-title">Te ayudamos a encontrar la mejor financiación</h1>
          <div className="nosotros-gold-line" />
          <p className="servicio-hero-subtitle servicio-hero-subtitle--left">
            Trabajamos con los principales bancos para conseguirte las mejores condiciones
            hipotecarias.
          </p>
          <Link className="button-link" to="/contacto">
            Hablar con un asesor →
          </Link>
        </div>
        <div className="servicio-photo">Foto firma / asesoría</div>
      </section>

      <section className="beneficios">
        <span className="beneficios-eyebrow">Qué hacemos por ti</span>
        <div className="beneficios-list">
          {BENEFICIOS.map((texto, i) => (
            <div key={texto} className="beneficio-item">
              <span className="beneficio-num">0{i + 1}</span>
              <p className="beneficio-text">{texto}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="stats stats--3">
        {STATS.map((stat) => (
          <div key={stat.l}>
            <strong>{stat.n}</strong>
            <span>{stat.l}</span>
          </div>
        ))}
      </section>

      <section className="proceso">
        <span className="proceso-eyebrow">Cómo funciona</span>
        <div className="proceso-grid">
          <div className="proceso-line" aria-hidden="true" />
          {PROCESO.map((step) => (
            <div key={step.num} className="proceso-step">
              <span className="proceso-num">{step.num}</span>
              <h3 className="proceso-title">{step.title}</h3>
              <p className="proceso-desc">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="servicio-cta">
        <h2>¿Quieres saber cuánto puedes financiar?</h2>
        <p>Primera consulta gratuita y sin compromiso.</p>
        <Link className="button-link" to="/contacto">
          Hablar con un asesor →
        </Link>
      </section>

      <ServiceFooter currentId="hipotecas" />
    </main>
  )
}
