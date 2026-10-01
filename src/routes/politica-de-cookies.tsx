import { createFileRoute } from '@tanstack/react-router'
import { Footer } from '../components/Footer'
import { pageHead } from '../lib/pageMeta'

export const Route = createFileRoute('/politica-de-cookies')({
  head: () => pageHead('/politica-de-cookies'),
  component: PoliticaCookiesPage,
})

// Fecha de la última revisión del texto. Actualizarla cada vez que cambie el
// contenido o se añada una herramienta que almacene datos en el navegador.
const LAST_UPDATED = '24 de septiembre de 2026'

// Inventario real de lo que la web guarda o carga en el navegador. Si se añade
// analítica (GA, Meta Pixel, Hotjar…) hay que ampliar esta tabla Y montar un
// banner de consentimiento previo: esas cookies no están exentas (art. 22.2 LSSI).
const STORAGE_ITEMS = [
  {
    name: 'heroSeen',
    owner: 'Group Casas (propia)',
    type: 'Técnica · sessionStorage',
    purpose:
      'Recuerda que ya has visto la animación de bienvenida de la página de inicio para no repetirla mientras navegas.',
    duration: 'Hasta cerrar la pestaña del navegador',
  },
  {
    name: 'gc-cookie-consent',
    owner: 'Group Casas (propia)',
    type: 'Técnica · localStorage',
    purpose: 'Guarda si has aceptado o rechazado las cookies para no volver a preguntarte en cada visita.',
    duration: '12 meses',
  },
]

const THIRD_PARTIES = [
  {
    name: 'Google Fonts',
    owner: 'Google Ireland Ltd.',
    purpose:
      'Sirve las tipografías de la web. Al cargarlas, tu navegador se conecta a los servidores de Google, que reciben tu dirección IP. No instala cookies.',
    link: 'https://policies.google.com/privacy',
  },
  {
    name: 'MapTiler',
    owner: 'MapTiler AG',
    purpose:
      'Muestra los mapas interactivos de propiedades y de nuestra oficina. Recibe tu dirección IP y la zona del mapa que consultas. No instala cookies.',
    link: 'https://www.maptiler.com/privacy-policy/',
  },
  {
    name: 'Cloudinary',
    owner: 'Cloudinary Ltd.',
    purpose:
      'Aloja y optimiza las fotografías de los inmuebles. Recibe tu dirección IP al descargar las imágenes. No instala cookies.',
    link: 'https://cloudinary.com/privacy',
  },
  {
    name: 'Vercel',
    owner: 'Vercel Inc.',
    purpose:
      'Proveedor de alojamiento de la web. Puede registrar datos técnicos de la conexión (IP, navegador) por motivos de seguridad y funcionamiento. No instala cookies de seguimiento.',
    link: 'https://vercel.com/legal/privacy-policy',
  },
]

const BROWSERS = [
  { name: 'Google Chrome', href: 'https://support.google.com/chrome/answer/95647' },
  { name: 'Mozilla Firefox', href: 'https://support.mozilla.org/es/kb/Borrar%20cookies' },
  { name: 'Safari (macOS)', href: 'https://support.apple.com/es-es/guide/safari/sfri11471/mac' },
  { name: 'Safari (iPhone y iPad)', href: 'https://support.apple.com/es-es/105082' },
  { name: 'Microsoft Edge', href: 'https://support.microsoft.com/es-es/microsoft-edge/eliminar-cookies-en-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09' },
]

function PoliticaCookiesPage() {
  return (
    <>
      <main className="legal-page">
        <article className="legal-inner">
          <span className="legal-eyebrow">Información legal</span>
          <h1 className="legal-title">Política de cookies</h1>
          <p className="legal-updated">Última actualización: {LAST_UPDATED}</p>

          <section>
            <h2>1. ¿Qué son las cookies?</h2>
            <p>
              Las cookies son pequeños archivos que una web guarda en tu navegador cuando la
              visitas. Permiten, por ejemplo, recordar tus preferencias o saber cómo se usa un
              sitio. Existen otras tecnologías similares, como el almacenamiento local
              (<em>localStorage</em>) o de sesión (<em>sessionStorage</em>), a las que esta
              política también se refiere cuando hablamos de «cookies».
            </p>
          </section>

          <section>
            <h2>2. ¿Quién es el responsable?</h2>
            <p>
              El responsable de esta web es <strong>Group Casas</strong>, con domicilio en Calle
              Verge de la Mercè 49, local 16, 08950 Esplugues de Llobregat (Barcelona). Puedes
              contactarnos en{' '}
              <a href="mailto:info@groupcasas.com">info@groupcasas.com</a> o en el{' '}
              <a href="tel:+34930119056">+34 930 119 056</a>.
            </p>
          </section>

          <section>
            <h2>3. ¿Qué cookies utiliza esta web?</h2>
            <p>
              En Group Casas apostamos por una navegación sencilla y respetuosa con tu
              privacidad. <strong>No utilizamos cookies publicitarias, de análisis ni de
              seguimiento</strong>, y no elaboramos perfiles a partir de tu navegación.
            </p>
            <p>
              Únicamente usamos los siguientes elementos técnicos, imprescindibles para que la web
              funcione como esperas:
            </p>
            <div className="legal-table-wrap">
              <table className="legal-table">
                <thead>
                  <tr>
                    <th scope="col">Nombre</th>
                    <th scope="col">Titular</th>
                    <th scope="col">Tipo</th>
                    <th scope="col">Finalidad</th>
                    <th scope="col">Duración</th>
                  </tr>
                </thead>
                <tbody>
                  {STORAGE_ITEMS.map((item) => (
                    <tr key={item.name}>
                      <td data-label="Nombre"><code>{item.name}</code></td>
                      <td data-label="Titular">{item.owner}</td>
                      <td data-label="Tipo">{item.type}</td>
                      <td data-label="Finalidad">{item.purpose}</td>
                      <td data-label="Duración">{item.duration}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p>
              Al tratarse de elementos estrictamente necesarios, están exentos del deber de
              consentimiento según el artículo 22.2 de la Ley 34/2002, de Servicios de la
              Sociedad de la Información (LSSI). Aun así, al entrar te mostramos un aviso para
              que decidas si aceptas o rechazas cualquier cookie no esencial, y puedes cambiar
              tu decisión cuando quieras desde «Configurar cookies», en el pie de página.
            </p>
          </section>

          <section>
            <h2>4. Servicios de terceros</h2>
            <p>
              Para ofrecerte algunas funciones, la web carga contenido de los siguientes
              proveedores. Ninguno de ellos instala cookies en tu navegador desde nuestra web,
              pero sí reciben datos técnicos de la conexión, como tu dirección IP:
            </p>
            <ul className="legal-list">
              {THIRD_PARTIES.map((tp) => (
                <li key={tp.name}>
                  <strong>{tp.name}</strong> ({tp.owner}). {tp.purpose}{' '}
                  <a href={tp.link} target="_blank" rel="noopener noreferrer">
                    Política de privacidad
                  </a>
                  .
                </li>
              ))}
            </ul>
            <p>
              Si pulsas un enlace que te lleva a otra web (por ejemplo, «Cómo llegar» en Google
              Maps o WhatsApp), se aplicará la política de cookies de
              ese sitio, sobre la que no tenemos control.
            </p>
          </section>

          <section>
            <h2>5. ¿Cómo puedes gestionar o eliminar las cookies?</h2>
            <p>
              Puedes permitir, bloquear o borrar las cookies y el almacenamiento del sitio en
              cualquier momento desde la configuración de tu navegador. Ten en cuenta que, si lo
              bloqueas todo, algunas partes de la web podrían no funcionar correctamente.
            </p>
            <ul className="legal-list">
              {BROWSERS.map((b) => (
                <li key={b.name}>
                  <a href={b.href} target="_blank" rel="noopener noreferrer">
                    {b.name}
                  </a>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2>6. Cambios en esta política</h2>
            <p>
              Podemos actualizar esta política si incorporamos nuevas herramientas o cambia la
              normativa. Si en el futuro utilizamos cookies que requieran tu consentimiento
              (por ejemplo, de análisis), te lo pediremos antes de instalarlas mediante un aviso
              en la web. Te recomendamos revisar esta página periódicamente.
            </p>
          </section>

          <section>
            <h2>7. Más información</h2>
            <p>
              Para saber cómo tratamos tus datos personales, consulta nuestra{' '}
              <a href="/politica-de-privacidad">Política de privacidad</a>. Si tienes
              cualquier duda sobre esta política, escríbenos a{' '}
              <a href="mailto:info@groupcasas.com">info@groupcasas.com</a>.
            </p>
          </section>
        </article>
      </main>
      <Footer />
    </>
  )
}
