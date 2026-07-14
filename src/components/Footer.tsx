import { useState } from 'react'
import { Link } from '@tanstack/react-router'

// Sección de enlaces del footer. En desktop se muestra siempre expandida; en
// mobile el <h3> se vuelve un botón que despliega/colapsa los enlaces (acordeón)
// para que el footer no ocupe casi toda la pantalla.
function FooterSection({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  return (
    <div className={`footer-col${open ? ' is-open' : ''}`}>
      <button
        type="button"
        className="footer-col-toggle"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <h3>{title}</h3>
        <span className="footer-chevron" aria-hidden="true" />
      </button>
      <div className="footer-col-links">{children}</div>
    </div>
  )
}

// Footer único reutilizado en todas las páginas. El logo va con GROUP arriba y
// CASAS abajo (orden del marcado: <small> antes que <span>).
export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div className="footer-brand">
          <Link className="logo logo-small footer-logo" to="/" aria-label="Casas Group">
            <small>GROUP</small>
            <span>CASAS</span>
          </Link>
          <p>Tu hogar empieza aqui.</p>
        </div>
        <FooterSection title="Inmuebles">
          <a href="/#propiedades">Alquilar</a>
          <a href="/#propiedades">Comprar</a>
          <a href="/#valoracion">Vender</a>
        </FooterSection>
        <FooterSection title="Servicios">
          <Link to="/servicios/administracion-de-fincas">Administración de fincas</Link>
          <Link to="/servicios/alarmas">Alarmas</Link>
          <Link to="/servicios/cambio-de-suministros">Cambio de suministros</Link>
          <Link to="/servicios/hipotecas">Hipotecas</Link>
          <Link to="/servicios/seguros">Seguros</Link>
        </FooterSection>
        <FooterSection title="Contacto">
          <a href="mailto:info@casasgroup.es">info@casasgroup.es</a>
          <a href="tel:+34930119056">+34 930 119 056</a>
          <Link to="/nosotros" hash="trabaja">Trabaja con nosotros</Link>
        </FooterSection>
      </div>
      <div className="footer-legal">
        <span className="footer-copyright">
          © {new Date().getFullYear()} Casas Group. Todos los derechos reservados.
        </span>
        <nav className="footer-legal-links" aria-label="Páginas legales">
          <a href="/aviso-legal">Aviso legal</a>
          <a href="/politica-de-cookies">Política de cookies</a>
          <a href="/politica-de-privacidad">Política de privacidad</a>
        </nav>
      </div>
    </footer>
  )
}
