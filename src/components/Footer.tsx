import { useState } from 'react'
import { Link } from '@tanstack/react-router'

// Sección de enlaces del footer. En desktop se muestra siempre expandida; en
// mobile el <h3> se vuelve un botón que despliega/colapsa los enlaces (acordeón)
// para que el footer no ocupe casi toda la pantalla.
function FooterSection({
  title,
  className,
  children,
}: {
  title: string
  className?: string
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(false)
  return (
    <div className={`footer-col${className ? ` ${className}` : ''}${open ? ' is-open' : ''}`}>
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
          <Link className="logo logo-small footer-logo" to="/" aria-label="Group Casas">
            <small>GROUP</small>
            <span>CASAS</span>
          </Link>
          <p>Tu hogar empieza aquí.</p>
          <a
            className="footer-social"
            href="https://www.instagram.com/groupcasas/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
            </svg>
            @groupcasas
          </a>
        </div>
        <FooterSection title="Servicios" className="footer-col-services">
          <Link to="/servicios/administracion-de-comunidades">Administrar</Link>
          <Link to="/servicios/alarmas">Alarmas</Link>
          <Link to="/servicios/hipotecas">Hipotecas</Link>
          <Link to="/servicios/reformas">Reformas</Link>
          <Link to="/servicios/seguros">Seguros</Link>
          <Link to="/servicios/cambio-de-suministros">Suministros</Link>
        </FooterSection>
        <FooterSection title="Inmuebles">
          <a href="/#propiedades">Alquilar</a>
          <a href="/#propiedades">Comprar</a>
          <a href="/#valoracion">Vender</a>
        </FooterSection>
        <FooterSection title="Group Casas">
          <Link to="/trabaja-con-nosotros">Trabaja con nosotros</Link>
          <a href="mailto:info@groupcasas.com">info@groupcasas.com</a>
          <a href="tel:+34930119056">+34 930 119 056</a>
        </FooterSection>
      </div>
      <div className="footer-legal">
        <span className="footer-copyright">
          © {new Date().getFullYear()} Group Casas. Todos los derechos reservados.
        </span>
        <nav className="footer-legal-links" aria-label="Páginas legales">
          <Link to="/aviso-legal">Aviso legal</Link>
          <a href="/politica-de-cookies">Política de cookies</a>
          <a href="/politica-de-privacidad">Política de privacidad</a>
        </nav>
      </div>
    </footer>
  )
}
