import { createFileRoute, Link } from '@tanstack/react-router'
import { MisionTabs } from '../components/nosotros/MisionTabs'
import { ValoresSlider } from '../components/nosotros/ValoresSlider'

export const Route = createFileRoute('/nosotros')({
  component: NosotrosPage,
})

export const VALUES = [
  {
    title: 'Excelencia',
    desc: 'No nos conformamos con lo bueno. Cada detalle, cada gestión, cada interacción está pensada para superar expectativas. Porque creemos que la excelencia no es un destino, es un hábito.',
  },
  {
    title: 'Cercanía',
    desc: 'Detrás de cada operación hay personas. Te escuchamos, te entendemos y te acompañamos. No somos una empresa más, somos tu equipo.',
  },
  {
    title: 'Transparencia',
    desc: 'Sin letras pequeñas, sin sorpresas. Te contamos todo como es, con datos reales y honestidad absoluta. Tu confianza es nuestro mayor activo.',
  },
  {
    title: 'Ambición',
    desc: 'Nacimos con la visión de transformar el sector inmobiliario. No venimos a ser uno más. Venimos a ser los mejores. Y cada día trabajamos para demostrarlo.',
  },
]

export const TABS = [
  {
    label: 'Misión',
    content:
      'Ofrecer una experiencia inmobiliaria excepcional, donde cada cliente se sienta acompañado, asesorado y respaldado en una de las decisiones más importantes de su vida. Transformar el sector con cercanía, profesionalidad y atención al detalle.',
  },
  {
    label: 'Visión',
    content:
      'Ser la referencia inmobiliaria en nuestra zona, reconocidos por la calidad de nuestro servicio, la confianza de nuestros clientes y la ambición de hacer las cosas de la mejor manera posible.',
  },
  {
    label: 'Propósito',
    content:
      'Creemos que encontrar un hogar es mucho más que una transacción. Es un momento vital. Por eso existimos: para que ese momento sea tan especial como merece.',
  },
]

export const TEAM = [
  { name: 'Angie Caballero', role: 'Fundadora & CEO' },
  { name: 'Javi Gallego', role: 'Director Comercial' },
  { name: 'Nombre Apellido', role: 'Agente Inmobiliario' },
  { name: 'Nombre Apellido', role: 'Administración' },
]

export const TIMELINE = [
  { year: '2014', text: 'Nacimiento de Red Casas' },
  { year: '2018', text: 'Expansión a nuevas zonas' },
  { year: '2023', text: 'Más de 100 operaciones' },
  { year: '2026', text: 'Rebranding: Casas Group' },
]

function NosotrosPage() {
  return (
    <main className="nosotros-page">
      <section className="nosotros-hero">
        <div className="nosotros-hero-content">
          <span className="nosotros-hero-eyebrow">Nuestra historia</span>
          <h1 className="nosotros-hero-title">Porque el sector necesitaba algo diferente</h1>
          <div className="nosotros-gold-line" />
          <p className="nosotros-hero-subtitle">
            Construida desde el amor, la visión, la ambición y la pasión por hacer las cosas de la mejor manera.
          </p>
        </div>
      </section>

      <section className="brand-story">
        <div className="brand-story-photo">Foto Angie / fundadora</div>
        <div className="brand-story-text">
          <span className="brand-story-eyebrow">La marca</span>
          <h2>De Red Casas a Casas Group</h2>
          <div className="nosotros-gold-line nosotros-gold-line--left" />
          <p>
            Casas Group nació de la convicción de que el sector inmobiliario podía ofrecer mucho más. Una marca
            pensada para superar expectativas, transformar la experiencia inmobiliaria y cuidar cada detalle con
            excelencia.
          </p>
          <p>
            No somos una inmobiliaria más. Somos un equipo que entiende que comprar, vender o alquilar una vivienda
            es una de las decisiones más importantes que tomamos. Y queremos que esa experiencia sea excepcional.
          </p>
        </div>
      </section>

      <MisionTabs tabs={TABS} />

      <ValoresSlider values={VALUES} />

      <section className="section team">
        <div className="section-heading section-heading--center">
          <h2>Nuestro equipo</h2>
          <p>Las personas detrás de Casas Group</p>
        </div>
        <div className="team-grid">
          {TEAM.map((member, i) => (
            <article className="team-card" key={`${member.name}-${i}`}>
              <div className="team-photo">Foto</div>
              <h3 className="team-name">{member.name}</h3>
              <p className="team-role">{member.role}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section timeline-section">
        <div className="section-heading section-heading--center">
          <h2>Nuestra trayectoria</h2>
        </div>
        <div className="timeline">
          <div className="timeline-line" aria-hidden="true" />
          {TIMELINE.map((item, i) => (
            <div className="timeline-item" key={item.year}>
              <div className={`timeline-dot${i === TIMELINE.length - 1 ? ' timeline-dot--current' : ''}`}>✓</div>
              <div className={`timeline-year${i === TIMELINE.length - 1 ? ' timeline-year--current' : ''}`}>
                {item.year}
              </div>
              <p>{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="nosotros-cta">
        <h2>¿Quieres conocernos en persona?</h2>
        <p>Visítanos en nuestra oficina o contáctanos. Estaremos encantados de ayudarte.</p>
        <div className="nosotros-cta-actions">
          <Link className="button-link" to="/contacto">
            Contáctanos →
          </Link>
          <a className="button-link button-link--ghost" href="tel:+34123456789">
            Llámanos
          </a>
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
    </main>
  )
}
