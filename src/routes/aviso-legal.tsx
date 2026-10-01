import { createFileRoute } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import { Footer } from '../components/Footer'
import { JsonLd } from '../components/JsonLd'
import { breadcrumbSchema } from '../lib/structuredData'
import { pageHead } from '../lib/pageMeta'

export const Route = createFileRoute('/aviso-legal')({
  head: () => pageHead('/aviso-legal'),
  component: AvisoLegalPage,
})

// Fecha de la última revisión del texto. Actualizarla cada vez que cambie el
// contenido: se muestra en la cabecera y da fe de la versión vigente.
const LAST_UPDATED = '24 de septiembre de 2026'

// ── Datos identificativos (art. 10 LSSI-CE) ──────────────────────────────────
// Obligatorio publicarlos de forma "permanente, fácil, directa y gratuita".
// Misma convención que la política de privacidad: los campos con `value: null`
// NO se pintan porque faltan por confirmar con el cliente (denominación social
// exacta, NIF, datos registrales y número AICAT, obligatorio este último para
// agentes inmobiliarios en Cataluña). En cuanto los facilite, se rellenan aquí
// y aparecen solos en la lista.
const DATOS_TITULAR: { label: string; value: string | null; href?: string }[] = [
  { label: 'Denominación social', value: null },
  { label: 'Nombre comercial', value: 'Group Casas' },
  { label: 'NIF', value: null },
  {
    label: 'Domicilio',
    value: 'Calle Verge de la Mercè 49, local 16, 08950 Esplugues de Llobregat (Barcelona)',
  },
  { label: 'Teléfono', value: '+34 930 119 056', href: 'tel:+34930119056' },
  { label: 'Correo electrónico', value: 'info@groupcasas.com', href: 'mailto:info@groupcasas.com' },
  { label: 'Datos registrales', value: null },
  { label: 'Registro de Agentes Inmobiliarios de Cataluña (AICAT)', value: null },
  { label: 'Actividad', value: 'Intermediación inmobiliaria y servicios asociados' },
]

// Cada apartado del aviso. Se numeran solos al pintarlos, igual que en la
// política de cookies y en la de privacidad.
const SECCIONES: { title: string; body: ReactNode }[] = [
  {
    title: 'Datos identificativos',
    body: (
      <>
        <p>
          En cumplimiento del deber de información recogido en el artículo 10 de la Ley 34/2002, de
          11 de julio, de Servicios de la Sociedad de la Información y de Comercio Electrónico, se
          facilitan a continuación los datos del titular de este sitio web:
        </p>
        <ul className="legal-list">
          {DATOS_TITULAR.filter((d) => d.value).map((d) => (
            <li key={d.label}>
              <strong>{d.label}:</strong> {d.href ? <a href={d.href}>{d.value}</a> : d.value}
            </li>
          ))}
        </ul>
      </>
    ),
  },
  {
    title: 'Objeto',
    body: (
      <>
        <p>
          El presente aviso legal regula el acceso, la navegación y el uso del sitio web
          groupcasas.com (en adelante, «el sitio web»), titularidad de Group Casas (en adelante,
          «Group Casas» o «el titular»), así como las responsabilidades derivadas de dicho uso.
        </p>
        <p>
          Group Casas es una empresa dedicada a la intermediación inmobiliaria y a los servicios
          asociados a la compra, venta y alquiler de viviendas —hipotecas, seguros, reformas,
          alarmas, cambio de suministros y administración de comunidades— con oficina en Esplugues
          de Llobregat y ámbito de actuación en Barcelona y su área metropolitana.
        </p>
      </>
    ),
  },
  {
    title: 'Condición de usuario y aceptación',
    body: (
      <>
        <p>
          El acceso al sitio web atribuye a quien lo realiza la condición de usuario e implica la
          aceptación plena y sin reservas de todas las disposiciones incluidas en este aviso legal,
          en la versión publicada en el momento del acceso. En consecuencia, el usuario debe leer
          atentamente este texto cada vez que se proponga utilizar el sitio web.
        </p>
        <p>
          El acceso al sitio web es libre y gratuito, si bien determinados servicios pueden requerir
          la cumplimentación de formularios con datos personales, que se tratarán conforme a lo
          indicado en la política de privacidad.
        </p>
      </>
    ),
  },
  {
    title: 'Uso del sitio web',
    body: (
      <>
        <p>
          El usuario se compromete a utilizar el sitio web, sus contenidos y sus servicios conforme
          a la ley, a este aviso legal, a la buena fe y al orden público. Queda prohibido cualquier
          uso con fines ilícitos o lesivos para los derechos e intereses de terceros, así como
          cualquier conducta que pueda dañar, inutilizar, sobrecargar o impedir la normal
          utilización del sitio web.
        </p>
        <p>En particular, el usuario se abstendrá de:</p>
        <ul className="legal-list">
          <li>
            Introducir o difundir contenidos que atenten contra los derechos fundamentales y las
            libertades públicas, o que tengan carácter racista, xenófobo, pornográfico, de apología
            del terrorismo o contrario a los derechos humanos.
          </li>
          <li>
            Introducir programas de datos susceptibles de provocar daños en los sistemas
            informáticos del titular, de sus proveedores o de terceros usuarios.
          </li>
          <li>
            Utilizar sistemas automatizados de extracción masiva de datos (<em>scraping</em>),
            robots o procedimientos análogos para reproducir la información de inmuebles publicada,
            ni reutilizarla con fines comerciales sin autorización expresa y por escrito.
          </li>
          <li>
            Facilitar datos falsos o de terceros sin su consentimiento en los formularios de
            contacto, valoración o candidatura.
          </li>
        </ul>
      </>
    ),
  },
  {
    title: 'Información sobre los inmuebles y los servicios',
    body: (
      <>
        <p>
          La información relativa a los inmuebles publicados —superficies, distribución, precio,
          fotografías, planos, año de construcción, calificación energética y ubicación— tiene
          carácter meramente informativo y orientativo. Procede en buena medida de los titulares de
          las propiedades y, pese a las comprobaciones que realiza Group Casas, puede contener
          errores, estar sujeta a variación o quedar desactualizada mientras se corrige.
        </p>
        <p>
          En consecuencia, dicha información <strong>no constituye una oferta vinculante</strong> ni
          documento contractual alguno. Los datos definitivos del inmueble se acreditan en la
          documentación registral, catastral y técnica que se facilita antes de la formalización de
          cualquier operación. La ubicación mostrada en los mapas puede ser aproximada por motivos
          de privacidad del propietario.
        </p>
        <p>
          Salvo que se indique expresamente lo contrario, los precios publicados{' '}
          <strong>no incluyen</strong> los honorarios de la agencia ni los gastos, impuestos y
          tributos inherentes a la compraventa o al arrendamiento. Determinadas imágenes pueden
          contener recreaciones virtuales, <em>home staging</em> digital o representaciones
          infográficas de carácter orientativo y no contractual.
        </p>
        <p>
          Group Casas se reserva el derecho a modificar, suspender o retirar en cualquier momento y
          sin previo aviso cualquier inmueble o servicio publicado.
        </p>
      </>
    ),
  },
  {
    title: 'Propiedad intelectual e industrial',
    body: (
      <>
        <p>
          Todos los contenidos del sitio web —textos, fotografías, vídeos, gráficos, imágenes,
          iconos, tecnología, software, diseño, código fuente, estructura de navegación, bases de
          datos y cualesquiera otros elementos— son titularidad de Group Casas o de terceros que han
          autorizado su uso, y están protegidos por la normativa española e internacional sobre
          propiedad intelectual e industrial.
        </p>
        <p>
          La marca, el nombre comercial, el logotipo y los signos distintivos que aparecen en el
          sitio web son propiedad de Group Casas. El acceso al sitio web no otorga al usuario
          derecho ni titularidad alguna sobre ellos.
        </p>
        <p>
          Queda expresamente prohibida la reproducción, distribución, comunicación pública,
          transformación o cualquier otra forma de explotación, total o parcial, de los contenidos
          del sitio web sin la autorización previa y por escrito del titular. El usuario podrá
          visualizar los contenidos e imprimir o descargar copias únicamente para su uso personal y
          privado.
        </p>
      </>
    ),
  },
  {
    title: 'Enlaces a sitios de terceros',
    body: (
      <>
        <p>
          El sitio web puede incluir enlaces a páginas de terceros —entre otros, portales
          inmobiliarios, redes sociales, servicios de mapas y herramientas de mensajería— con la
          única finalidad de facilitar el acceso a información de interés para el usuario.
        </p>
        <p>
          Group Casas no asume responsabilidad alguna sobre los contenidos, servicios, políticas de
          privacidad o prácticas de esos sitios, sobre los que no ejerce control alguno, y recomienda
          al usuario revisar sus condiciones antes de utilizarlos.
        </p>
        <p>
          El establecimiento de un enlace hacia el sitio web no implica relación, colaboración ni
          recomendación alguna por parte de Group Casas, que podrá solicitar en cualquier momento su
          retirada.
        </p>
      </>
    ),
  },
  {
    title: 'Exclusión de garantías y responsabilidad',
    body: (
      <>
        <p>
          Group Casas emplea medios razonables para que la información publicada sea exacta y esté
          actualizada, y para que el sitio web funcione correctamente, pero no garantiza la
          inexistencia de errores ni la disponibilidad y continuidad ininterrumpida del servicio.
        </p>
        <p>
          El titular no será responsable de los daños y perjuicios derivados de interrupciones,
          fallos técnicos, virus o elementos lesivos, ni del uso que el usuario haga de la
          información publicada, especialmente cuando adopte decisiones de compra, venta o alquiler
          basándose únicamente en los datos orientativos del sitio web y sin la comprobación
          documental previa indicada en el apartado correspondiente.
        </p>
        <p>
          Group Casas podrá interrumpir temporalmente el acceso al sitio web por motivos de
          mantenimiento, actualización o mejora, procurando avisar con antelación cuando resulte
          posible.
        </p>
      </>
    ),
  },
  {
    title: 'Protección de datos y cookies',
    body: (
      <>
        <p>
          Los datos personales que el usuario facilite a través de los formularios del sitio web se
          tratarán conforme al Reglamento (UE) 2016/679 (RGPD) y a la Ley Orgánica 3/2018, de
          Protección de Datos Personales y garantía de los derechos digitales, en los términos
          detallados en la <a href="/politica-de-privacidad">Política de privacidad</a>.
        </p>
        <p>
          El sitio web utiliza cookies y tecnologías similares en los términos descritos en la{' '}
          <a href="/politica-de-cookies">Política de cookies</a>, donde el usuario puede consultar
          su finalidad y gestionar sus preferencias.
        </p>
      </>
    ),
  },
  {
    title: 'Modificaciones',
    body: (
      <p>
        Group Casas se reserva el derecho a modificar en cualquier momento y sin previo aviso la
        presentación, la configuración y los contenidos del sitio web, así como el presente aviso
        legal, con el fin de adaptarlos a novedades legislativas, jurisprudenciales o a los cambios
        en su actividad. La versión vigente será siempre la publicada en esta página, con indicación
        de la fecha de su última actualización.
      </p>
    ),
  },
  {
    title: 'Legislación aplicable y jurisdicción',
    body: (
      <>
        <p>
          Este aviso legal se rige por la legislación española, en particular por la Ley 34/2002, de
          11 de julio, de Servicios de la Sociedad de la Información y de Comercio Electrónico, y
          por la normativa sobre protección de datos y consumidores y usuarios.
        </p>
        <p>
          Para la resolución de cualquier controversia derivada del acceso o uso del sitio web, las
          partes se someten a los juzgados y tribunales que resulten competentes conforme a derecho,
          respetando en todo caso el fuero que corresponda al usuario cuando tenga la condición de
          consumidor.
        </p>
      </>
    ),
  },
  {
    title: 'Contacto',
    body: (
      <p>
        Para cualquier duda, consulta o reclamación relativa a este aviso legal, el usuario puede
        escribirnos a <a href="mailto:info@groupcasas.com">info@groupcasas.com</a>, llamar al{' '}
        <a href="tel:+34930119056">+34 930 119 056</a>, dirigirse por escrito al domicilio indicado
        en el apartado de datos identificativos o utilizar la{' '}
        <a href="/contacto">página de contacto</a>.
      </p>
    ),
  },
]

function AvisoLegalPage() {
  return (
    <>
      <main className="legal-page">
        <article className="legal-inner">
          <JsonLd
            data={breadcrumbSchema([
              { name: 'Inicio', path: '/' },
              { name: 'Aviso legal', path: '/aviso-legal' },
            ])}
          />
          <span className="legal-eyebrow">Información legal</span>
          <h1 className="legal-title">Aviso legal</h1>
          <p className="legal-updated">Última actualización: {LAST_UPDATED}</p>

          {SECCIONES.map((s, i) => (
            <section key={s.title}>
              <h2>
                {i + 1}. {s.title}
              </h2>
              {s.body}
            </section>
          ))}
        </article>
      </main>
      <Footer />
    </>
  )
}
