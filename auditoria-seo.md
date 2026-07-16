# Auditoría SEO — Casas Group

> Fecha: 2026-06-30 · Stack: React 19 + TanStack Router + Vite (SPA, render en cliente)
> Alcance: SEO técnico, on-page y jerarquía de encabezados de todas las rutas.

---

## 0. Resumen ejecutivo

La web está bien construida a nivel de UX, pero **a nivel SEO parte casi de cero**. Los tres problemas más graves, por orden de impacto:

1. **Es una SPA sin SSR ni prerender.** Los buscadores y crawlers reciben un `<div id="root">` vacío; todo el contenido se inyecta con JavaScript. Google puede renderizar JS, pero lo hace en una segunda pasada (más lenta y no garantizada), y los crawlers de redes sociales (WhatsApp, Facebook, X, LinkedIn) **no ejecutan JS en absoluto** → los enlaces compartidos salen sin título, sin descripción y sin imagen.
2. **Metadatos globales y estáticos.** Todas las rutas comparten el mismo `<title>` ("Casas Group"), no hay `meta description`, ni Open Graph, ni canonical. Para Google, hoy, **todas las páginas parecen la misma página**.
3. **Falta el `<h1>` en casi todas las páginas.** Solo el detalle de propiedad tiene `<h1>`. El resto arranca directamente en `<h2>`, rompiendo la jerarquía semántica que Google usa para entender de qué trata cada página.

Sin resolver el punto 1 (o al menos el 2 vía prerender), el resto de optimizaciones tienen un techo muy bajo.

### Tabla de severidad

| # | Hallazgo | Severidad | Esfuerzo |
|---|----------|-----------|----------|
| 1 | SPA sin SSR/prerender (HTML vacío para crawlers) | 🔴 Crítico | Alto |
| 2 | `<title>` único y estático para todo el sitio | 🔴 Crítico | Medio |
| 3 | Sin `meta description` en ninguna página | 🔴 Crítico | Medio |
| 4 | Falta `<h1>` en 10 de 11 páginas | 🔴 Crítico | Bajo |
| 5 | Sin Open Graph / Twitter Cards | 🟠 Alto | Bajo |
| 6 | Sin `robots.txt` ni `sitemap.xml` | 🟠 Alto | Bajo |
| 7 | Sin datos estructurados (JSON-LD) | 🟠 Alto | Medio |
| 8 | Sin `<link rel="canonical">` | 🟡 Medio | Bajo |
| 9 | Imágenes de propiedades con `alt=""` | 🟡 Medio | Bajo |
| 10 | Página de listado `/propiedades` sin ningún encabezado | 🟡 Medio | Bajo |
| 11 | **Dirección de oficina con placeholder** ("Calle Ejemplo 123") | 🔴 Crítico | Bajo |
| 12 | Sin estrategia de SEO local (Google Business, NAP, reseñas) | 🟠 Alto | Medio |
| 13 | `/propiedades`: filtros sin control de indexación (crawl trap) | 🟠 Alto | Medio |
| 14 | Dos stacks de mapas en el bundle (leaflet + maplibre) | 🟠 Alto | Medio |
| 15 | Sin 404 global → soft 404 (200 OK) en URLs desconocidas | 🟡 Medio | Bajo |
| 16 | Imágenes sin `width`/`height` (CLS); hero PNG sin optimizar | 🟡 Medio | Bajo |
| 17 | Sin `apple-touch-icon` / web manifest | 🟢 Bajo | Bajo |

✅ Lo que ya está bien: `<html lang="es">`, `<meta viewport>`, favicon SVG, `loading="lazy"` en varias imágenes, URLs limpias y semánticas (`/servicios/hipotecas`, etc.), uso de `<article>`/`<section>`/`<nav>`.

---

## 1. SEO técnico (global)

### 1.1 Renderizado — el problema raíz
`index.html` entrega solo:
```html
<body>
  <div id="root"></div>
  <script type="module" src="/src/main.tsx"></script>
</body>
```
Todo el contenido depende de JS. **Opciones para resolverlo** (de mayor a menor inversión):

- **A — Migrar a SSR con TanStack Start** (la evolución natural de TanStack Router). Es la solución completa: HTML real por petición, `head` por ruta, streaming. Mayor esfuerzo de migración.
- **B — Prerender en build** (recomendado para empezar): generar HTML estático de cada ruta en el build con un plugin (p. ej. `vite-plugin-prerender` / `puppeteer` o `@prerenderer`). Como el contenido es prácticamente estático (salvo el detalle de propiedad dinámico), esto cubre el 90% del problema con poco coste. El detalle de propiedad puede prerenderearse por cada `id` conocido en build, o servirse con prerender bajo demanda.
- **C — Servicio de prerender bajo demanda** (prerender.io o similar detrás de Vercel) que detecta el user-agent del crawler y le sirve HTML renderizado. Cero cambios de código, coste recurrente.

> Recomendación: **B** ahora (rápido y barato), evaluar **A** a medio plazo si el catálogo de propiedades crece y se vuelve muy dinámico.

### 1.2 Gestión de `<head>` por ruta
TanStack Router soporta metadatos por ruta sin migrar a SSR: cada ruta puede declarar `head()` y se renderiza con `<HeadContent />`. Esto actualiza `document.title`, `meta` y `link` al navegar. Funciona en cliente (mejora la experiencia y el SEO post-render) y queda listo para cuando se active SSR/prerender.

Patrón a introducir (uno por ruta):
```tsx
export const Route = createFileRoute('/servicios/hipotecas')({
  head: () => ({
    meta: [
      { title: 'Hipotecas en Barcelona | Casas Group' },
      { name: 'description', content: 'Te acompañamos en tu hipoteca en 4 pasos...' },
      { property: 'og:title', content: 'Hipotecas | Casas Group' },
      { property: 'og:description', content: '...' },
      { property: 'og:image', content: 'https://casasgroup.es/og/hipotecas.jpg' },
      { property: 'og:type', content: 'website' },
    ],
    links: [{ rel: 'canonical', href: 'https://casasgroup.es/servicios/hipotecas' }],
  }),
  component: Hipotecas,
})
```
Y en `__root.tsx` añadir `<HeadContent />`. (Confirmar la API exacta en la versión instalada de `@tanstack/react-router`.)

### 1.3 Archivos de crawling
Faltan en `public/`:

**`public/robots.txt`**
```
User-agent: *
Allow: /
Sitemap: https://casasgroup.es/sitemap.xml
```
**`public/sitemap.xml`** — generarlo en el build (script junto a `buildData.mjs`) con todas las rutas estáticas + una entrada por cada propiedad. Incluir `<lastmod>`.

### 1.4 Datos estructurados (JSON-LD)
Sin `schema.org`, Google no obtiene resultados enriquecidos. Añadir:
- **`Organization`** / **`RealEstateAgent`** (global, en home): nombre, logo, dirección de la oficina, teléfono, redes sociales, `areaServed`.
- **`RealEstateListing`** en `/propiedades/$id`: precio, m², habitaciones, ubicación, imágenes.
- **`BreadcrumbList`** en páginas internas.
- **`FAQPage`** si se añaden FAQs en servicios (alta probabilidad de rich snippet).

---

## 2. Jerarquía de encabezados (H1–H6)

**Regla de oro:** exactamente **un `<h1>` por página** que resuma su tema, seguido de `<h2>` para secciones y `<h3>` para subsecciones, sin saltos.

### Estado actual por página

| Ruta | H1 | H2 | H3 | Problema |
|------|----|----|----|----------|
| `/` (home) | ❌ 0 | ✅ | ✅ | **Sin H1.** La marca "CASAS GROUP" del hero es un `<div aria-label>`, no un encabezado |
| `/propiedades` (listado) | ❌ 0 | ❌ 0 | ❌ 0 | **Sin ningún encabezado** |
| `/propiedades/$id` (detalle) | ✅ 1 | ✅ | — | **Correcto** ✅ |
| `/vender` | ❌ 0 | ✅ 4 | ✅ 4 | Sin H1 |
| `/nosotros` | ❌ 0 | ✅ 5 | ✅ 1 | Sin H1 |
| `/contacto` | ❌ 0 | ✅ 3 | — | Sin H1 |
| `/servicios/administracion-de-fincas` | ❌ 0 | ✅ 2 | ✅ 1 | Sin H1 |
| `/servicios/alarmas` | ❌ 0 | ✅ 3 | ✅ 1 | Sin H1 |
| `/servicios/cambio-de-suministros` | ❌ 0 | ✅ 3 | ✅ 2 | Sin H1 |
| `/servicios/hipotecas` | ❌ 0 | ✅ 3 | ✅ 1 | Sin H1 |
| `/servicios/seguros` | ❌ 0 | ✅ 3 | ✅ 1 | Sin H1 |

**Conclusión:** 10 de 11 páginas no tienen `<h1>`. Es el arreglo de mayor relación impacto/esfuerzo del informe.

> Nota de implementación: si por diseño no se quiere un H1 visible (p. ej. en el hero del home), usar un H1 con clase "visually-hidden" (fuera de pantalla pero leíble por buscadores y lectores de pantalla), o convertir el texto de marca/título de hero existente en `<h1>`.

---

## 3. Imágenes, formato y `alt`

### 3.1 Fotos de propiedades (Cloudinary) — ✅ ya optimizadas
En `scripts/buildData.mjs` las URLs se generan con `f_auto,q_auto` (formato automático WebP/AVIF según navegador + compresión automática) y variantes dimensionadas:

| Contexto | Transformación |
|---|---|
| `card` | `c_fill,ar_4:3,w_900,f_auto,q_auto` |
| `gallery` | `c_limit,w_1600,f_auto,q_auto` |
| `thumbnail` | `c_fill,ar_1:1,w_200,f_auto,q_auto` |

Esto es exactamente lo correcto. **El pipeline de fotos de inmuebles no necesita cambios de formato.**

### 3.2 Imágenes del hero (locales) — 🔴 sin optimizar
Son los pesos pesados del sitio y el LCP del home:

| Archivo | Peso | Acción |
|---|---|---|
| `hero-initial.png` | 1.5 MB | Convertir a WebP/AVIF; verificar si se usa |
| `hero-bg.png` | 1.3 MB | Convertir a WebP/AVIF; verificar si se usa |
| `hero-building.jpg` | 416 KB | Verificar si se usa; si no, borrar |
| `hero-building-gold.jpg` | 324 KB | Recomprimir (crossfade) |
| `hero-building-light.jpg` | 233 KB | Recomprimir (crossfade) |

Hay 5 archivos pero el efecto de crossfade solo usa 2 (`-gold` y `-light`). Convertir PNG→WebP/AVIF baja ~80% el peso. Eliminar los archivos muertos.

### 3.3 Otros puntos de imagen
- `index.tsx:810` usa una imagen **hardcodeada de Unsplash** → sustituir por imagen propia autoalojada/Cloudinary (control, velocidad, sin dependencia de terceros).
- **Ningún `<img>` declara `width`/`height`** → provoca CLS (saltos de layout). Añadir dimensiones explícitas.
- **No existe ninguna imagen Open Graph** → al compartir enlaces en WhatsApp/redes no aparece miniatura. Crear OG por página (la del detalle = foto `cover` de la propiedad).

### 3.4 Atributo `alt` — regla y estado
Regla: imagen de **contenido** → `alt` descriptivo; imagen **decorativa** → `alt=""` (vacío, para que el lector de pantalla la salte).

| Ubicación | Actual | Correcto |
|---|---|---|
| `$id.tsx`, `MapPropertyPopup` | `alt={title}` | ✅ ya bien |
| **`PropertyCard.tsx`, `PropertyListItem.tsx`** | `alt=""` | ❌ es contenido → `alt={\`${p.title} en ${p.zone}\`}` |
| `ServiceFooter`, "why" home (`index.tsx:735`), feature admin | `alt=""` | ✅ decorativas, ok |
| Banner Unsplash (`index.tsx:810`) | `alt=""` | revisar según nuevo uso |

El único fallo real de `alt` son las tarjetas del listado: son fotos de inmuebles (contenido puro) marcadas como decorativas → se pierden en Google Imágenes.

---

## 4. Plan de acción por página

Para cada página: **(a)** asignar/crear `<h1>`, **(b)** definir `title` (≤ 60 car.) y `meta description` (≤ 155 car.) con la keyword local ("Barcelona" / zona), **(c)** canonical, **(d)** OG.

> Keywords base sugeridas: combinar servicio + ubicación ("inmobiliaria en Barcelona", "hipotecas Barcelona", "administración de fincas Barcelona", "venta de pisos [zona]").

### 4.1 `/` — Home
1. Añadir `<h1>` (puede ser visually-hidden): p. ej. *"Inmobiliaria en Barcelona — compra, venta y alquiler de viviendas"*. Candidato natural: convertir la marca del hero (`index.tsx:544`) o el título principal en H1.
2. `title`: `Casas Group | Inmobiliaria en Barcelona`
3. `description`: resumen de servicios + propuesta de valor + zona.
4. JSON-LD `Organization` / `RealEstateAgent` global aquí.
5. Revisar que `<h2>`/`<h3>` de secciones (servicios, valoración, "por qué", destacados) cuelguen del nuevo H1 sin saltos.

### 4.2 `/propiedades` — Listado de propiedades
1. **Añadir encabezados** (hoy no hay ninguno). `<h1>` dinámico según filtro: *"Pisos en venta en Barcelona"* / *"Pisos en alquiler en {zona}"*.
2. `title` y `description` dinámicos según `mode` (compra/alquiler) y zona seleccionada.
3. Considerar canonical hacia la versión sin filtros para evitar duplicados por combinaciones de `search params`; o `noindex` en combinaciones de filtros muy específicas.
4. Cada tarjeta: corregir `alt` de la imagen (ver §3).

### 4.3 `/propiedades/$id` — Detalle de propiedad ✅
1. Encabezados ya correctos (H1 = título, H2 = secciones).
2. `title`: `{título} en {zona} | Casas Group`. `description`: extracto + precio + m² + habitaciones.
3. **JSON-LD `RealEstateListing`** con precio, ubicación, características e imágenes.
4. OG con la foto de portada de la propiedad (clave para compartir en WhatsApp).
5. canonical único por propiedad. Incluir cada `id` en el `sitemap.xml`.

### 4.4 `/vender`
1. Añadir `<h1>`: *"Vende tu vivienda en Barcelona"* (hoy el principal es `<h2>` "Descubre cuánto vale tu vivienda", `vender.tsx:93`).
2. `title`: `Vende tu casa con Casas Group | Valoración gratuita`.
3. `description`: enfoque en valoración gratuita + acompañamiento.
4. Reordenar: H1 nuevo → los H2 actuales (formulario, cómo funciona, por qué) cuelgan de él.

### 4.5 `/nosotros`
1. Añadir `<h1>`: *"Sobre Casas Group"* / *"Quiénes somos"*.
2. `title`: `Sobre nosotros | Casas Group`.
3. `description`: historia (Red Casas → Casas Group), equipo, trayectoria.
4. JSON-LD `Organization` con `foundingDate` y `employee`/equipo si procede.

### 4.6 `/contacto`
1. Añadir `<h1>`: *"Contacta con Casas Group"* (hoy arranca en `<h2>`).
2. `title`: `Contacto | Casas Group — Inmobiliaria en Barcelona`.
3. `description`: con dirección de oficina y teléfono.
4. JSON-LD `LocalBusiness` con `address`, `geo`, `openingHours`, `telephone`.

### 4.7 Servicios (5 páginas)
Mismo patrón para `administracion-de-fincas`, `alarmas`, `cambio-de-suministros`, `hipotecas`, `seguros`:
1. Añadir `<h1>` con servicio + ubicación. Ejemplos:
   - Administración: *"Administración de fincas y comunidades en Barcelona"*
   - Alarmas: *"Sistemas de alarma para tu vivienda"*
   - Cambio de suministros: *"Cambio de suministros sin papeleo"*
   - Hipotecas: *"Hipotecas en Barcelona"*
   - Seguros: *"Seguros para tu vivienda"*
2. `title` único por servicio (`{Servicio} en Barcelona | Casas Group`).
3. `description` única por servicio con su keyword.
4. Los `<h2>` actuales ("Qué incluye", "En cuatro pasos", etc.) cuelgan del H1.
5. Si hay dudas frecuentes, añadir bloque FAQ + JSON-LD `FAQPage`.
6. canonical + OG por servicio.

---

## 4.bis. Copy listo para usar — meta titles y descriptions

Reglas: **title ≤ ~60 caracteres** (límite de píxeles de Google), **description ≤ ~155 caracteres**, keyword + ubicación al inicio y marca al final. Estado actual: **no existe ninguno**; todas las rutas heredan `<title>Casas Group</title>`.

| Ruta | Meta title | Meta description |
|---|---|---|
| `/` | `Casas Group \| Inmobiliaria en Barcelona` | `Compra, venta y alquiler de viviendas en Barcelona. Te acompañamos en hipotecas, seguros y administración de fincas. Valoración gratuita.` |
| `/propiedades` (compra) | `Pisos y casas en venta en Barcelona \| Casas Group` | `Descubre nuestra selección de pisos y casas en venta en Barcelona. Filtra por zona, precio y características. Actualizado a diario.` |
| `/propiedades` (alquiler) | `Pisos en alquiler en Barcelona \| Casas Group` | `Pisos en alquiler en Barcelona por zonas. Filtra por precio, habitaciones y barrio y encuentra tu próximo hogar con Casas Group.` |
| `/propiedades/$id` *(dinámico)* | `{título} en {zona} \| Casas Group` | `{título} en {zona}. {precio}, {m²} m², {habitaciones} hab. Descúbrelo y agenda tu visita con Casas Group.` |
| `/vender` | `Vende tu vivienda \| Valoración gratis \| Casas Group` | `¿Quieres vender tu casa en Barcelona? Te damos una valoración gratuita y te acompañamos en todo el proceso. Descubre cuánto vale.` |
| `/nosotros` | `Sobre nosotros \| Casas Group` | `De Red Casas a Casas Group: conoce a nuestro equipo, nuestra trayectoria y cómo trabajamos en el sector inmobiliario en Barcelona.` |
| `/contacto` | `Contacto \| Casas Group Barcelona` | `Contacta con Casas Group. Visítanos en nuestra oficina o escríbenos y te ayudamos con tu compra, venta o alquiler en Barcelona.` |
| `/servicios/administracion-de-fincas` | `Administración de fincas en Barcelona \| Casas Group` | `Gestión profesional de comunidades de propietarios en Barcelona. Transparencia, cercanía y todo bajo control con Casas Group.` |
| `/servicios/alarmas` | `Alarmas para tu vivienda \| Casas Group` | `Sistemas de alarma gestionados por quien conoce tu vivienda. Protege tu hogar en Barcelona con el acompañamiento de Casas Group.` |
| `/servicios/cambio-de-suministros` | `Cambio de suministros sin papeleo \| Casas Group` | `Cambia la luz, el agua y el gas de tu nueva vivienda sin papeleo. Nos encargamos de todo en cuatro simples pasos. Casas Group.` |
| `/servicios/hipotecas` | `Hipotecas en Barcelona \| Casas Group` | `Te acompañamos en tu hipoteca en cuatro pasos. Descubre cuánto puedes financiar para comprar tu vivienda en Barcelona. Casas Group.` |
| `/servicios/seguros` | `Seguros de hogar en Barcelona \| Casas Group` | `Gestiona tus seguros con quien conoce tu vivienda. Protege tu hogar en Barcelona con la cercanía de Casas Group.` |

Notas:
- **`/propiedades`**: title y description deben ser **dinámicos** según `mode` (compra/alquiler) y la zona seleccionada — son las páginas con mayor potencial de búsqueda local (p. ej. "pisos en venta en Gràcia").
- **`/propiedades/$id`**: title y description generados desde los datos de la propiedad; el OG debe usar la **foto de portada** (`cover`), que es lo que se previsualiza al compartir por WhatsApp.

---

## 5. SEO local (crítico para una inmobiliaria)

Para un negocio físico en Barcelona, el SEO local pesa tanto como el on-page. Es la vía principal por la que un cliente cercano encuentra la agencia.

### 5.1 🔴 Dirección placeholder en producción
`contacto.tsx:262` muestra **`Calle Ejemplo 123, Local 2`** — un texto de relleno. Hasta poner la dirección real:
- Rompe la confianza del usuario que llega a "Visítanos en nuestra oficina".
- Hace imposible el SEO local (Google no puede asociar el negocio a una ubicación real).

Datos reales ya presentes: email `info@casasgroup.es`, teléfonos `+34 930 110 056` y `+34 601 391 778` (`contacto.tsx:46-57`, `Footer.tsx:51-52`).

### 5.2 Pilares de SEO local a implementar
1. **Dirección real** en `/contacto` y `Footer` (sustituir el placeholder).
2. **Consistencia NAP** (Name-Address-Phone): exactamente el mismo nombre, dirección y teléfono en la web, el footer, Google Business Profile y cualquier directorio. Las inconsistencias diluyen el ranking local.
3. **Google Business Profile**: dar de alta/reclamar la ficha (horario, fotos, categoría "Agencia inmobiliaria", zona de servicio).
4. **Schema `RealEstateAgent` / `LocalBusiness`** en el sitio con `address`, `geo` (lat/long), `telephone`, `openingHours`, `areaServed`, `sameAs` (redes).
5. **Reseñas**: estrategia para pedir y responder reseñas en Google (señal local fuerte).
6. **Páginas por zona** (medio plazo): aprovechar la taxonomía de barrios de Barcelona que ya existe para crear landings locales ("pisos en venta en Gràcia").

---

## 6. Indexación y navegación por filtros (faceted navigation)

`/propiedades` filtra con `search params` (`?mode=compra&query=...`, distrito/barrio). Sin control, Google indexa infinitas combinaciones como páginas duplicadas y gasta *crawl budget* en URLs sin valor.

Estrategia:
- **Indexar** las vistas con valor de búsqueda: compra/alquiler y filtros por zona ("pisos en venta en Gràcia").
- **`noindex`** (o canonical hacia la versión limpia) en combinaciones de micro-filtros (rangos de precio, nº de habitaciones, multi-filtro) que generan duplicados.
- Definir **canonical** coherente por cada vista indexable.
- Cuidar la **paginación** del listado: que el contenido sea descubrible por crawler (no solo cargado por scroll/JS) y enlazado con `<a href>` reales.

---

## 7. Rendimiento (Core Web Vitals)

Más allá del peso del hero (§3.2):

### 7.1 🟠 Dos stacks de mapas en el bundle
El proyecto carga **dos librerías de mapas completas**:
- `leaflet` + `react-leaflet` → `components/property/PropertyMap.tsx` (detalle de propiedad).
- `maplibre-gl` + `react-map-gl` → `components/search/PropertyMap.tsx` y `contacto.tsx`.

Mantener dos motores de mapas duplica el JS de mapas en el bundle. **Unificar en uno solo** (preferible MapLibre, ya mayoritario) reduce peso y mejora LCP/TBT. Además, **cargar el mapa de forma diferida** (lazy/dynamic import) ya que no es contenido crítico above-the-fold.

### 7.2 Medición pendiente

**Revisión de código (hecha, jul-2026):**
- ✅ **Fuentes**: se quitó el `@import` render-blocking de Google Fonts en `src/index.css` y se pasó a `<link>` en `index.html` con `preconnect` a `fonts.googleapis.com`/`fonts.gstatic.com`. Ya tenía `display=swap` (evita FOIT).
- ✅ **Hero LCP**: la imagen del hero (`hero-building-light.jpg`) es `background-image` en CSS y no se descubría temprano → se añadió `<link rel="preload" as="image" fetchpriority="high">` en `index.html`.
- ✅ **`loading="lazy"`** en imágenes below-the-fold: tarjetas de propiedad (grid y lista), carrusel de destacados y franja "nosotros" de la home, y slides 2+ del carrusel móvil del detalle. La imagen principal del detalle y la primera slide móvil quedan `eager` (son el LCP de esa vista).
- 🟢 **`width`/`height` en imágenes**: ausentes, pero **no generan CLS** porque cada `<img>` vive en un contenedor con `height`/`aspect-ratio` fijo + `object-fit: cover`. Sin acción.
- 🟠 **Imagen remota de Unsplash** en la franja "nosotros" (`index.tsx`): dominio externo, conviene autoalojarla y optimizarla.

**Pendiente (requiere navegador, no se puede desde código):**
- Pasar **Lighthouse** real (móvil) a home, listado, detalle y un servicio → números de LCP, CLS, TBT.
- Confirmar en campo que el preload del hero y el swap de fuentes mejoran LCP/FOUT sin regresiones.
- Cerrar §7.1 (unificar los dos stacks de mapas) para bajar TBT/peso de bundle.

---

## 8. Manejo de errores y 404

- Existe un "no encontrado" **solo** para propiedades inexistentes (`$id.tsx:29`), pero **no hay 404 global** para URLs desconocidas.
- En una SPA, una URL inexistente devuelve `200 OK` con shell vacío → Google lo interpreta como **soft 404** (lo trata como contenido pobre, no como error). Añadir una **ruta catch-all** (`notFoundComponent` de TanStack Router) y, con prerender/SSR, asegurar que devuelva estado 404 real.
- Definir **redirecciones** de dominio: `www` vs no-`www`, `http`→`https`, y trailing slash → una sola versión canónica (evita contenido duplicado).

---

## 9. Otros pendientes (menor prioridad, conviene cerrar)

- **Enlaces internos crawleables**: confirmar que las tarjetas de propiedad y CTAs naveguen con `<a href>` reales (TanStack `<Link>` los renderiza así) y no con `onClick`/JS, para que Google siga el grafo de enlaces.
- **Arquitectura de enlazado interno**: breadcrumbs como navegación real (+ schema `BreadcrumbList`), enlaces entre servicios relacionados, evitar páginas huérfanas.
- **Contenido / keywords**: las páginas de servicio pueden ser *thin content*; enriquecer con texto útil y FAQs. Sin blog no hay captación orgánica de cola larga — valorar una sección de contenidos.
- **Iconos y manifest**: añadir `apple-touch-icon`, `manifest.webmanifest` y `theme-color` (hoy solo hay `favicon.svg`).
- **Twitter Cards** además de Open Graph (§1.2 las contempla; confirmar `twitter:card`, `twitter:image`).

---

## 10. Orden de ejecución recomendado

**Fase 0 — Arreglos urgentes de confianza/contenido**
1. Sustituir la **dirección placeholder** "Calle Ejemplo 123" por la dirección real (§5.1).

**Fase 1 — Cimientos (rápido, alto impacto)**
2. Añadir `<h1>` a las 10 páginas que faltan (§2).
3. Crear `robots.txt` y `sitemap.xml` en `public/` (§1.3).
4. Corregir `alt` de las tarjetas de propiedad (§3.4).
5. Introducir gestión de `head` por ruta (`head()` + `<HeadContent />`) con `title` y `description` únicos por página (§1.2, §4, §4.bis).
6. Añadir **404 global** (catch-all / `notFoundComponent`) (§8).

**Fase 2 — Visibilidad y compartido social**
7. Open Graph + Twitter Cards por ruta (imágenes OG, la del detalle = foto de la propiedad).
8. canonical por ruta + control de indexación de filtros en `/propiedades` (§6).
9. JSON-LD: `RealEstateAgent`/`LocalBusiness` (global, con NAP real) + `RealEstateListing` (detalle) + `BreadcrumbList` (§5.2, §7-no, §1.4).

**Fase 3 — SEO local**
10. Google Business Profile + consistencia NAP + estrategia de reseñas (§5.2).

**Fase 4 — El problema raíz**
11. Implementar **prerender en build** (opción B de §1.1) para servir HTML real a los crawlers. Re-test con "Inspección de URL" en Google Search Console y con el depurador de enlaces de Facebook/WhatsApp.

**Fase 5 — Rendimiento y medición**
12. Optimizar imágenes del hero (WebP/AVIF, dimensionar, eliminar las no usadas) → mejora LCP (§3.2).
13. **Unificar los dos stacks de mapas** en uno solo + carga diferida del mapa (§7.1).
14. Dar de alta el sitio en **Google Search Console** y enviar el sitemap; configurar analítica.
15. Revisar Core Web Vitals con **Lighthouse** real y corregir lo que salga (§7.2).

---

## 11. Cómo verificar cada arreglo

- **Encabezados:** extensión "HeadingsMap" o `document.querySelectorAll('h1')` en consola (debe haber exactamente 1).
- **Title/meta:** ver el `<head>` tras navegar; con prerender, `curl https://casasgroup.es/ruta` debe mostrar el HTML con title y meta ya presentes.
- **OG:** depurador de Facebook Sharing y compartir el enlace por WhatsApp a uno mismo.
- **Indexación:** Google Search Console → Inspección de URL → "Probar URL publicada" (ver HTML renderizado que ve Google).
- **Datos estructurados:** Rich Results Test de Google.
- **Sitemap/robots:** abrir `/(robots.txt|sitemap.xml)` en el navegador.
