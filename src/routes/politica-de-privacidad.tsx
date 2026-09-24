import { createFileRoute } from '@tanstack/react-router'
import { Footer } from '../components/Footer'
import { absoluteUrl } from '../lib/structuredData'
import { openCookieSettings } from '../lib/cookieConsent'

export const Route = createFileRoute('/politica-de-privacidad')({
  head: () => ({
    meta: [
      { title: 'Política de privacidad | Group Casas' },
      {
        name: 'description',
        content:
          'Política de privacidad de Group Casas: quién trata tus datos personales, con qué finalidad y base jurídica, cuánto tiempo se conservan y cómo ejercer tus derechos.',
      },
      { property: 'og:title', content: 'Política de privacidad | Group Casas' },
      {
        property: 'og:description',
        content:
          'Qué datos personales tratamos, para qué, durante cuánto tiempo, con quién los compartimos y cómo ejercer tus derechos de acceso, rectificación y supresión.',
      },
      { property: 'og:url', content: absoluteUrl('/politica-de-privacidad') },
    ],
    links: [{ rel: 'canonical', href: absoluteUrl('/politica-de-privacidad') }],
  }),
  component: PoliticaPrivacidadPage,
})

// Fecha de la última revisión del texto. Actualizarla cada vez que cambie el
// contenido, se añada un formulario nuevo o entre un proveedor que trate datos.
const LAST_UPDATED = '24 de septiembre de 2026'

// Datos del responsable (art. 13.1.a RGPD). Misma convención que el aviso legal:
// los campos con `value: null` NO se pintan porque faltan por confirmar con el
// cliente (denominación social exacta y NIF). En cuanto los facilite, se
// rellenan aquí y aparecen solos en la lista.
const RESPONSABLE: { label: string; value: string | null; href?: string }[] = [
  { label: 'Denominación social', value: null },
  { label: 'Nombre comercial', value: 'Group Casas' },
  { label: 'NIF', value: null },
  {
    label: 'Domicilio',
    value: 'Calle Verge de la Mercè 49, local 16, 08950 Esplugues de Llobregat (Barcelona)',
  },
  { label: 'Teléfono', value: '+34 930 119 056', href: 'tel:+34930119056' },
  { label: 'Correo electrónico', value: 'info@groupcasas.com', href: 'mailto:info@groupcasas.com' },
  { label: 'Actividad', value: 'Intermediación inmobiliaria y servicios asociados a la vivienda' },
]

// Una fila por tratamiento real: los formularios de la web (contacto, ficha de
// inmueble y valoración de /vender), el contacto directo, las candidaturas de
// rrhh@ y los registros técnicos del alojamiento. Si se añade un formulario o
// una herramienta nueva hay que añadir fila AQUÍ: esta tabla es la información
// del art. 13 RGPD y debe reflejar lo que de verdad se trata.
const TRATAMIENTOS = [
  {
    finalidad:
      'Atender las consultas que nos envías por el formulario de contacto, por la ficha de un inmueble, por correo electrónico, por teléfono o por WhatsApp.',
    datos: 'Nombre y apellidos, correo electrónico, teléfono, motivo del contacto y contenido del mensaje.',
    base:
      'Tu consentimiento al enviarnos la solicitud (art. 6.1.a RGPD) y nuestro interés legítimo en responder a quien nos escribe (art. 6.1.f RGPD).',
    plazo:
      'Mientras gestionamos la consulta y hasta un año después. Si deriva en una relación comercial, pasa al plazo de la fila siguiente.',
  },
  {
    finalidad:
      'Elaborar la valoración gratuita de tu vivienda y, si nos lo encargas, gestionar su venta o su alquiler.',
    datos:
      'Nombre, teléfono, correo electrónico, tipo de inmueble, dirección y los datos del inmueble y de su titularidad que nos facilites.',
    base:
      'La ejecución del contrato de intermediación o las gestiones precontractuales previas a su firma (art. 6.1.b RGPD).',
    plazo:
      'Durante la relación y, después, los plazos legales de prescripción: seis años en materia mercantil (art. 30 del Código de Comercio) y cuatro en materia fiscal (Ley 58/2003).',
  },
  {
    finalidad:
      'Organizar visitas, trasladar ofertas y acompañarte en la compra o el alquiler de un inmueble de nuestra cartera.',
    datos:
      'Datos identificativos y de contacto y, cuando sea imprescindible para valorar una oferta, los datos económicos que nos aportes.',
    base: 'La ejecución del contrato o de las gestiones previas a su celebración (art. 6.1.b RGPD).',
    plazo: 'Los mismos plazos de prescripción mercantil y fiscal indicados arriba.',
  },
  {
    finalidad:
      'Poner tu solicitud en manos de la entidad colaboradora adecuada cuando nos pides uno de nuestros servicios asociados: hipotecas, seguros, alarmas, reformas, cambio de suministros o administración de tu comunidad.',
    datos:
      'Datos identificativos y de contacto y los estrictamente necesarios para el servicio concreto (por ejemplo, datos del inmueble o del punto de suministro).',
    base:
      'Tu consentimiento específico para cada servicio (art. 6.1.a RGPD). Sin que lo pidas, tus datos no salen de Group Casas.',
    plazo: 'Hasta que retires el consentimiento o hasta que el servicio quede cerrado.',
  },
  {
    finalidad:
      'Cumplir las obligaciones de identificación, diligencia debida y conservación documental que nos impone la normativa de prevención del blanqueo de capitales cuando intervenimos en una compraventa.',
    datos: 'Datos identificativos y copia del documento de identidad, en los supuestos en que la norma lo exige.',
    base:
      'El cumplimiento de una obligación legal (art. 6.1.c RGPD), en aplicación de la Ley 10/2010 de prevención del blanqueo de capitales y de la financiación del terrorismo.',
    plazo: 'Diez años, el plazo que fija la propia Ley 10/2010.',
  },
  {
    finalidad: 'Valorar tu candidatura si nos envías tu currículum a nuestra dirección de recursos humanos.',
    datos: 'Datos identificativos, de contacto, académicos y profesionales que incluyas en la candidatura.',
    base: 'Tu consentimiento al remitirnos el currículum (art. 6.1.a RGPD).',
    plazo: 'Un año desde su recepción, salvo que antes nos pidas que lo eliminemos.',
  },
  {
    finalidad:
      'Enviarte información sobre inmuebles o servicios de Group Casas que puedan encajar con lo que buscas.',
    datos: 'Nombre, correo electrónico y teléfono.',
    base:
      'Tu consentimiento (art. 6.1.a RGPD) o, si ya eres cliente y se trata de servicios similares a los contratados, nuestro interés legítimo conforme al art. 21.2 de la LSSI.',
    plazo: 'Hasta que te des de baja, cosa que puedes hacer en cualquier momento y sin coste.',
  },
  {
    finalidad:
      'Mantener la web operativa y segura y recordar tus preferencias técnicas, como tu elección sobre cookies.',
    datos: 'Datos técnicos de la conexión: dirección IP, tipo de dispositivo y navegador, páginas visitadas.',
    base: 'Nuestro interés legítimo en la seguridad y el buen funcionamiento del sitio (art. 6.1.f RGPD).',
    plazo: 'Un máximo de doce meses en los registros técnicos de nuestro proveedor de alojamiento.',
  },
]

// Encargados del tratamiento y cesionarios. Los proveedores técnicos son los
// mismos cuatro que declara la política de cookies: si se añade uno allí, hay
// que añadirlo aquí para que las dos páginas no se contradigan.
const DESTINATARIOS = [
  {
    nombre: 'Vercel Inc.',
    detalle:
      'Proveedor de alojamiento de la web. Registra los datos técnicos de la conexión necesarios para servirla de forma segura.',
  },
  {
    nombre: 'MapTiler AG, Cloudinary Ltd. y Google Ireland Ltd.',
    detalle:
      'Sirven, respectivamente, los mapas, las fotografías de los inmuebles y las tipografías de la web. Al cargarse reciben tu dirección IP; el detalle está en la política de cookies.',
  },
  {
    nombre: 'Proveedores de correo electrónico y almacenamiento en la nube',
    detalle:
      'Las herramientas con las que gestionamos las comunicaciones y los expedientes de cliente, contratadas con el acuerdo de encargo de tratamiento que exige el art. 28 del RGPD.',
  },
  {
    nombre: 'Entidades colaboradoras',
    detalle:
      'Entidades financieras y bróker hipotecario, compañías de seguros, empresas de reformas, de sistemas de alarma y comercializadoras de suministros, únicamente cuando solicitas expresamente ese servicio.',
  },
  {
    nombre: 'Profesionales intervinientes en la operación',
    detalle:
      'Notarías, registros de la propiedad, gestorías, despachos de abogados y asesores fiscales o contables, cuando su intervención sea necesaria para formalizar la operación.',
  },
  {
    nombre: 'Administraciones públicas y fuerzas y cuerpos de seguridad',
    detalle: 'Cuando exista una obligación legal de comunicarles la información.',
  },
]

// Derechos de los arts. 15 a 22 del RGPD.
const DERECHOS = [
  { nombre: 'Acceso', detalle: 'Saber qué datos tuyos tratamos, de dónde salen y para qué los usamos.' },
  { nombre: 'Rectificación', detalle: 'Corregir los datos inexactos y completar los que falten.' },
  {
    nombre: 'Supresión',
    detalle:
      'Pedir que los eliminemos cuando ya no sean necesarios para la finalidad que los justificó y ninguna ley nos obligue a conservarlos.',
  },
  {
    nombre: 'Limitación del tratamiento',
    detalle: 'Pedir que lo suspendamos mientras se verifica una reclamación que nos hayas planteado.',
  },
  {
    nombre: 'Oposición',
    detalle:
      'Oponerte a los tratamientos basados en nuestro interés legítimo, incluida la recepción de comunicaciones comerciales.',
  },
  {
    nombre: 'Portabilidad',
    detalle: 'Recibir tus datos en un formato estructurado o pedirnos que los enviemos a otro responsable.',
  },
  {
    nombre: 'Retirar el consentimiento',
    detalle:
      'Revocarlo en cualquier momento y con la misma facilidad con la que lo diste, sin que eso afecte a la licitud del tratamiento anterior.',
  },
]

function PoliticaPrivacidadPage() {
  return (
    <>
      <main className="legal-page">
        <article className="legal-inner">
          <span className="legal-eyebrow">Información legal</span>
          <h1 className="legal-title">Política de privacidad</h1>
          <p className="legal-updated">Última actualización: {LAST_UPDATED}</p>

          <section>
            <h2>1. Nuestro compromiso</h2>
            <p>
              En Group Casas tratamos datos personales todos los días: el de quien nos pide la
              valoración de su piso, el de quien pregunta por un inmueble y el de quien nos deja su
              teléfono para que le llamemos. Esta política explica, sin letra pequeña, qué hacemos
              con esa información y qué puedes decidir tú sobre ella.
            </p>
            <p>
              Tratamos tus datos conforme al Reglamento (UE) 2016/679 (RGPD) y a la Ley Orgánica
              3/2018, de Protección de Datos Personales y garantía de los derechos digitales
              (LOPDGDD), y con tres reglas propias: pedimos solo lo que necesitamos, lo usamos
              únicamente para lo que te hemos dicho y <strong>no vendemos ni cedemos tus datos a
              terceros con fines publicitarios</strong>.
            </p>
          </section>

          <section>
            <h2>2. ¿Quién es el responsable?</h2>
            <p>
              El responsable de los datos personales que recogemos a través de esta web y en el
              desarrollo de nuestra actividad es:
            </p>
            <ul className="legal-list">
              {RESPONSABLE.filter((d) => d.value).map((d) => (
                <li key={d.label}>
                  <strong>{d.label}:</strong>{' '}
                  {d.href ? <a href={d.href}>{d.value}</a> : d.value}
                </li>
              ))}
            </ul>
            <p>
              No hemos designado delegado de protección de datos porque no concurre ninguno de los
              supuestos del artículo 37 del RGPD. Para cualquier cuestión relativa a tus datos
              puedes escribirnos directamente a{' '}
              <a href="mailto:info@groupcasas.com">info@groupcasas.com</a>.
            </p>
          </section>

          <section>
            <h2>3. ¿Qué datos tratamos y cómo llegan a nosotros?</h2>
            <p>
              Solo tratamos los datos que tú nos facilitas y los datos técnicos imprescindibles
              para que la web funcione. No compramos bases de datos ni obtenemos tu información de
              fuentes que no conozcas. Las vías por las que llegan a nosotros son estas:
            </p>
            <ul className="legal-list">
              <li>
                <strong>El formulario de contacto</strong> y el que se abre desde la ficha de un
                inmueble: nombre, apellidos, correo electrónico, teléfono, motivo del contacto y el
                mensaje que escribas.
              </li>
              <li>
                <strong>El formulario de valoración</strong> de la página «Vender»: nombre,
                teléfono, correo electrónico, tipo de inmueble y dirección de la vivienda.
              </li>
              <li>
                <strong>El contacto directo</strong> por correo electrónico, teléfono o WhatsApp,
                con los datos que nos facilites en esa conversación.
              </li>
              <li>
                <strong>El envío de tu currículum</strong> a{' '}
                <a href="mailto:rrhh@groupcasas.com">rrhh@groupcasas.com</a> desde la página
                «Trabaja con nosotros».
              </li>
              <li>
                <strong>La propia navegación</strong>: datos técnicos como la dirección IP, el
                navegador o las páginas visitadas.
              </li>
            </ul>
            <p>
              Los campos señalados con asterisco son obligatorios porque sin ellos no podemos
              atender la solicitud; el resto es voluntario. Te pedimos que los datos sean veraces y
              que nos avises si cambian, y que no incluyas en el mensaje ni en tu currículum{' '}
              <strong>datos de categoría especial</strong> —salud, convicciones, afiliación
              sindical y similares—, porque no los necesitamos para nada. Si nos facilitas datos de
              otra persona, debes haberla informado previamente de este tratamiento.
            </p>
          </section>

          <section>
            <h2>4. ¿Para qué los usamos y qué nos legitima?</h2>
            <p>
              Cada tratamiento tiene una finalidad concreta, una base jurídica que lo legitima y un
              plazo de conservación. No usamos tus datos para nada que no esté en esta tabla:
            </p>
            <div className="legal-table-wrap">
              <table className="legal-table">
                <thead>
                  <tr>
                    <th scope="col">Finalidad</th>
                    <th scope="col">Datos</th>
                    <th scope="col">Base jurídica</th>
                    <th scope="col">Conservación</th>
                  </tr>
                </thead>
                <tbody>
                  {TRATAMIENTOS.map((t) => (
                    <tr key={t.finalidad}>
                      <td data-label="Finalidad">{t.finalidad}</td>
                      <td data-label="Datos">{t.datos}</td>
                      <td data-label="Base">{t.base}</td>
                      <td data-label="Plazo">{t.plazo}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p>
              Cumplidos esos plazos, los datos quedan bloqueados: se conservan únicamente a
              disposición de jueces, tribunales y administraciones competentes durante el tiempo de
              prescripción de las acciones que pudieran derivarse, tal como prevé el artículo 32 de
              la LOPDGDD. Después se suprimen de forma segura.
            </p>
            <p>
              No elaboramos perfiles ni tomamos decisiones sobre ti basadas únicamente en
              tratamientos automatizados: la valoración de un inmueble y cualquier propuesta
              comercial las revisa y firma siempre una persona del equipo.
            </p>
          </section>

          <section>
            <h2>5. ¿Quién más puede acceder a tus datos?</h2>
            <p>
              Para prestar el servicio trabajamos con proveedores que actúan como encargados del
              tratamiento —con un contrato firmado que les obliga a tratar los datos solo según
              nuestras instrucciones— y con colaboradores a los que tus datos llegan únicamente si
              nos pides ese servicio:
            </p>
            <ul className="legal-list">
              {DESTINATARIOS.map((d) => (
                <li key={d.nombre}>
                  <strong>{d.nombre}.</strong> {d.detalle}
                </li>
              ))}
            </ul>
            <p>
              Algunos de estos proveedores son empresas con sede o infraestructura fuera del
              Espacio Económico Europeo. En esos casos la transferencia internacional se ampara en
              una decisión de adecuación de la Comisión Europea o, en su defecto, en las cláusulas
              contractuales tipo aprobadas por la Comisión, junto con las medidas complementarias
              que resulten necesarias. Puedes pedirnos copia de las garantías aplicadas escribiendo
              a <a href="mailto:info@groupcasas.com">info@groupcasas.com</a>.
            </p>
          </section>

          <section>
            <h2>6. ¿Cuáles son tus derechos?</h2>
            <p>La normativa de protección de datos te reconoce estos derechos sobre tu información:</p>
            <ul className="legal-list">
              {DERECHOS.map((d) => (
                <li key={d.nombre}>
                  <strong>{d.nombre}.</strong> {d.detalle}
                </li>
              ))}
            </ul>
            <p>
              Para ejercerlos basta con escribirnos a{' '}
              <a href="mailto:info@groupcasas.com">info@groupcasas.com</a> o por correo postal al
              domicilio indicado más arriba, señalando qué derecho quieres ejercer y acreditando tu
              identidad. El ejercicio es <strong>gratuito</strong> y te responderemos en el plazo
              máximo de un mes, ampliable a tres si la solicitud resulta especialmente compleja, en
              cuyo caso te lo comunicaremos antes de que venza el primero.
            </p>
            <p>
              Si crees que no hemos atendido correctamente tu solicitud, puedes presentar una
              reclamación ante la Agencia Española de Protección de Datos (C/ Jorge Juan 6, 28001
              Madrid), a través de su sede electrónica en{' '}
              <a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer">
                www.aepd.es
              </a>
              . Antes de eso, si lo prefieres, escríbenos: lo normal es que podamos resolverlo
              directamente.
            </p>
          </section>

          <section>
            <h2>7. ¿Cómo protegemos tus datos?</h2>
            <p>
              Aplicamos las medidas técnicas y organizativas que exige el artículo 32 del RGPD,
              adecuadas al riesgo del tratamiento: conexión cifrada en todo el sitio, acceso a la
              información restringido según el puesto de cada persona del equipo, deberes de
              confidencialidad con el personal y con los proveedores, y copias de seguridad
              periódicas. Ningún sistema es infalible; si se produjera una brecha de seguridad con
              riesgo alto para tus derechos, te lo comunicaríamos y lo notificaríamos a la
              autoridad de control en los plazos que fija la norma.
            </p>
          </section>

          <section>
            <h2>8. Menores de edad</h2>
            <p>
              Los servicios de esta web se dirigen a personas mayores de edad con capacidad para
              contratar. No recogemos de forma consciente datos de menores de catorce años. Si
              detectamos que hemos recibido datos de un menor sin el consentimiento de quien ejerce
              su tutela, los suprimiremos de inmediato. Si crees que ha ocurrido, avísanos en{' '}
              <a href="mailto:info@groupcasas.com">info@groupcasas.com</a>.
            </p>
          </section>

          <section>
            <h2>9. Cookies y almacenamiento en el navegador</h2>
            <p>
              Esta web no utiliza cookies publicitarias, de análisis ni de seguimiento. Solo
              guardamos en tu navegador lo imprescindible para que funcione —como tu elección sobre
              cookies— y cargamos los servicios de mapas y tipografías descritos más arriba. Tienes
              el inventario completo, con su finalidad y su duración, en la{' '}
              <a href="/politica-de-cookies">Política de cookies</a>, y puedes cambiar tu decisión
              cuando quieras desde{' '}
              <button type="button" className="legal-inline-button" onClick={openCookieSettings}>
                «Configurar cookies»
              </button>
              , también disponible en el pie de página.
            </p>
          </section>

          <section>
            <h2>10. Redes sociales y enlaces externos</h2>
            <p>
              Si nos sigues o nos escribes a través de nuestros perfiles en redes sociales, el
              tratamiento de los datos de tu perfil se rige además por las condiciones de la
              plataforma correspondiente, sobre la que no tenemos control. Esta web incluye también
              enlaces a sitios de terceros —portales inmobiliarios, servicios de mapas, entidades
              colaboradoras—: al seguirlos sales de nuestro dominio y pasas a estar sujeto a sus
              propias políticas de privacidad, que te recomendamos revisar.
            </p>
          </section>

          <section>
            <h2>11. Cambios en esta política</h2>
            <p>
              Podemos actualizar esta política cuando cambien nuestra actividad, los servicios que
              ofrecemos, los proveedores que utilizamos o la normativa aplicable. La versión vigente
              es siempre la publicada en esta página, con la fecha de última actualización que
              figura arriba. Si el cambio afecta de forma significativa a un tratamiento basado en
              tu consentimiento, te lo comunicaremos y, cuando proceda, te pediremos uno nuevo.
            </p>
          </section>

          <section>
            <h2>12. Más información</h2>
            <p>
              Esta política se completa con el <a href="/aviso-legal">Aviso legal</a> y la{' '}
              <a href="/politica-de-cookies">Política de cookies</a> del sitio. Si te queda
              cualquier duda, escríbenos a{' '}
              <a href="mailto:info@groupcasas.com">info@groupcasas.com</a> o llámanos al{' '}
              <a href="tel:+34930119056">+34 930 119 056</a>.
            </p>
          </section>
        </article>
      </main>
      <Footer />
    </>
  )
}
