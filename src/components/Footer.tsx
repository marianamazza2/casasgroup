import { Link } from '@tanstack/react-router'

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
        <div>
          <h3>Inmuebles</h3>
          <a href="/#propiedades">Alquilar</a>
          <a href="/#propiedades">Comprar</a>
          <a href="/#valoracion">Vender</a>
        </div>
        <div>
          <h3>Servicios</h3>
          <Link to="/servicios/administracion-de-fincas">Administración de fincas</Link>
          <Link to="/servicios/cambio-de-suministros">Cambio de suministros</Link>
          <Link to="/servicios/hipotecas">Hipotecas</Link>
          <Link to="/servicios/seguros">Seguros</Link>
        </div>
        <div>
          <h3>Contacto</h3>
          <a href="mailto:info@casasgroup.es">info@casasgroup.es</a>
          <a href="tel:+34123456789">+34 123 456 789</a>
          <Link to="/nosotros" hash="trabaja">Trabaja con nosotros</Link>
        </div>
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
