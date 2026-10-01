// ── Metadatos <head> de las páginas estáticas ───────────────────────────────
//
// Fuente única de title/description por ruta. La usan:
//   - el head() de cada ruta (cliente, vía <HeadContent />), y
//   - el plugin de build staticHead (vite.config.ts), que escribe un HTML por
//     ruta con estas metas ya en el <head>. Sin eso, el HTML que reciben Google
//     y los previews de WhatsApp/Facebook es el shell vacío de la SPA.
//
// Debe seguir siendo un módulo puro (sin React ni APIs del navegador): se
// importa también desde Node en el build.

import type { Property } from './types'
import { absoluteUrl } from './structuredData'

export type PageMeta = {
  title: string
  description: string
  /** Variante más corta para Open Graph; si falta se usa `description`. */
  ogDescription?: string
}

export const PAGE_META = {
  '/': {
    title: 'Group Casas | Inmobiliaria en Barcelona',
    description:
      'Compra, venta y alquiler de viviendas en Barcelona. Te acompañamos en hipotecas, seguros y administración de comunidades. Valoración gratuita.',
    ogDescription:
      'Compra, venta y alquiler de viviendas en Barcelona. Hipotecas, seguros y administración de comunidades. Valoración gratuita.',
  },
  '/aviso-legal': {
    title: 'Aviso legal | Group Casas',
    description:
      'Aviso legal de Group Casas: datos identificativos del titular, condiciones de uso del sitio web, propiedad intelectual y legislación aplicable.',
    ogDescription:
      'Datos identificativos del titular, condiciones de uso, propiedad intelectual y legislación aplicable del sitio web de Group Casas.',
  },
  '/contacto': {
    title: 'Contacto | Group Casas Barcelona',
    description:
      'Contacta con Group Casas. Visítanos en nuestra oficina o escríbenos y te ayudamos con tu compra, venta o alquiler en Barcelona.',
    ogDescription:
      'Escríbenos o visítanos en nuestra oficina en Barcelona. Te ayudamos con tu compra, venta o alquiler.',
  },
  '/nosotros': {
    title: 'Sobre nosotros | Group Casas',
    description:
      'Conoce a Group Casas: nuestro equipo, nuestra trayectoria y cómo trabajamos en el sector inmobiliario en Barcelona.',
    ogDescription:
      'Group Casas: nuestro equipo, nuestra trayectoria y cómo trabajamos en el sector inmobiliario en Barcelona.',
  },
  '/politica-de-cookies': {
    title: 'Política de cookies | Group Casas',
    description:
      'Información sobre las cookies y tecnologías de almacenamiento que utiliza la web de Group Casas y cómo gestionarlas.',
  },
  '/politica-de-privacidad': {
    title: 'Política de privacidad | Group Casas',
    description:
      'Política de privacidad de Group Casas: quién trata tus datos personales, con qué finalidad y base jurídica, cuánto tiempo se conservan y cómo ejercer tus derechos.',
    ogDescription:
      'Qué datos personales tratamos, para qué, durante cuánto tiempo, con quién los compartimos y cómo ejercer tus derechos de acceso, rectificación y supresión.',
  },
  '/servicios/administracion-de-comunidades': {
    title: 'Administración de comunidades en Barcelona | Group Casas',
    description:
      'Gestión profesional de comunidades de propietarios en Barcelona. Transparencia, cercanía y todo bajo control con Group Casas.',
    ogDescription:
      'Gestión profesional de comunidades de propietarios en Barcelona. Transparencia y cercanía con Group Casas.',
  },
  '/servicios/alarmas': {
    title: 'Alarmas para tu vivienda | Group Casas',
    description:
      'Sistemas de alarma gestionados por quien conoce tu vivienda. Protege tu hogar en Barcelona con el acompañamiento de Group Casas.',
    ogDescription:
      'Sistemas de alarma gestionados por quien conoce tu vivienda. Protege tu hogar en Barcelona con Group Casas.',
  },
  '/servicios/cambio-de-suministros': {
    title: 'Cambio de suministros sin papeleo | Group Casas',
    description:
      'Cambia la luz, el agua y el gas de tu nueva vivienda sin papeleo. Nos encargamos de todo en cuatro simples pasos. Group Casas.',
    ogDescription:
      'Luz, agua y gas de tu nueva vivienda sin papeleo. Nos encargamos de todo en cuatro simples pasos. Group Casas.',
  },
  '/servicios/hipotecas': {
    title: 'Hipotecas en Barcelona | Group Casas',
    description:
      'Te acompañamos en tu hipoteca en cuatro pasos. Descubre cuánto puedes financiar para comprar tu vivienda en Barcelona. Group Casas.',
    ogDescription:
      'Te acompañamos en tu hipoteca en cuatro pasos. Descubre cuánto puedes financiar para comprar tu vivienda en Barcelona.',
  },
  '/servicios/reformas': {
    title: 'Reformas integrales en Barcelona | Group Casas',
    description:
      'Reformas integrales, cocinas, baños y zonas comunes en Barcelona. Presupuesto cerrado, plazos por contrato y un único interlocutor. Group Casas.',
    ogDescription:
      'Reformas integrales, cocinas, baños y zonas comunes en Barcelona. Presupuesto cerrado y un único interlocutor con Group Casas.',
  },
  '/servicios/seguros': {
    title: 'Seguros de hogar en Barcelona | Group Casas',
    description:
      'Gestiona tus seguros con quien conoce tu vivienda. Protege tu hogar en Barcelona con la cercanía de Group Casas.',
    ogDescription:
      'Gestiona tus seguros con quien conoce tu vivienda. Protege tu hogar en Barcelona con Group Casas.',
  },
  '/trabaja-con-nosotros': {
    title: 'Trabaja con nosotros | Group Casas',
    description:
      'Únete a Group Casas: formación continua, acompañamiento y un plan de carrera real como asesor, responsable o franquiciado en Barcelona.',
    ogDescription:
      'Crece con nosotros: formación continua, acompañamiento y un plan de carrera real dentro del sector inmobiliario.',
  },
  '/vender': {
    title: 'Vende tu vivienda | Valoración gratis | Group Casas',
    description:
      '¿Quieres vender tu casa en Barcelona? Te damos una valoración gratuita y te acompañamos en todo el proceso. Descubre cuánto vale.',
    ogDescription:
      'Valoración gratuita y sin compromiso de tu vivienda en Barcelona. Te acompañamos en todo el proceso de venta.',
  },
  // El listado no usa pageHead(): su <Seo> calcula title/description según el
  // modo y la ubicación buscada. Esta entrada solo alimenta el HTML estático de
  // /propiedades (vista base: compra en Barcelona) y debe coincidir con ella.
  '/propiedades': {
    title: 'Pisos y casas en venta en Barcelona | Group Casas',
    description:
      'Pisos y casas en venta en Barcelona. Filtra por zona, precio y características y encuentra tu próximo hogar con Group Casas.',
  },
} satisfies Record<string, PageMeta>

export type StaticPagePath = keyof typeof PAGE_META

/** head() de TanStack Router para una página estática. */
export function pageHead(path: StaticPagePath) {
  const m: PageMeta = PAGE_META[path]
  const url = absoluteUrl(path)
  return {
    meta: [
      { title: m.title },
      { name: 'description', content: m.description },
      { property: 'og:title', content: m.title },
      ...(m.ogDescription ? [{ property: 'og:description', content: m.ogDescription }] : []),
      { property: 'og:url', content: url },
    ],
    links: [{ rel: 'canonical', href: url }],
  }
}

/** title/description/canonical de la ficha de un inmueble (§4.3.2). OG con la
 *  foto de portada (p.image = cover): la miniatura al compartir por WhatsApp. */
export function propertySeo(p: Property) {
  const locality = p.zone || p.city
  return {
    title: `${p.title} en ${locality} | Group Casas`,
    description: `${p.title} en ${locality}. ${p.priceLabel} · ${p.m2} m² · ${p.beds} hab. Descúbrelo y agenda tu visita con Group Casas.`,
    canonical: absoluteUrl(`/propiedades/${p.id}`),
    image: p.image,
  }
}
