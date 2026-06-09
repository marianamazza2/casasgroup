# BRIEF DE IMPLEMENTACIÓN — WEB CASASGROUP.ES
**Preparado por:** mazzmkt
**Fecha:** Mayo 2026

---

## ESTADO ACTUAL DEL PROYECTO

| Librería | Estado |
|---|---|
| React + Vite + TypeScript | ✅ Instalado |
| TanStack Router | ✅ Instalado |
| Tailwind CSS | ✅ Instalado |
| Motion (Framer Motion) | ✅ Instalado |
| MapLibre GL | ✅ Instalado |
| react-map-gl | ✅ Instalado |
| Google Sheets (conexión) | 🔲 Por implementar |
| Cloudinary (conexión) | 🔲 Por implementar |
| Vercel (deploy) | 🔲 Por configurar |
| Resend (emails) | 🔲 Por implementar |
| TanStack Query | 🔲 Por instalar e implementar |
| MapTiler API key (tiles) | 🔲 Por configurar (free tier) |

> **TanStack Query** es el pairing natural con TanStack Router para data fetching. Se instala con `npm install @tanstack/react-query`. Maneja loading states, caché, refetch automático y errores sin boilerplate.

---

## 1. ESTRUCTURA DE CARPETAS

```
src/
├── routes/                        ← TanStack Router (file-based routing)
│   ├── __root.tsx                 ← Layout global (Header + Footer)
│   ├── index.tsx                  ← Home  /
│   ├── inmuebles/
│   │   ├── index.tsx              ← Listado  /inmuebles
│   │   └── $slug.tsx              ← Ficha individual  /inmuebles/$slug
│   ├── servicios.tsx              ← /servicios
│   └── contacto.tsx               ← /contacto
│
├── components/
│   ├── ui/                        ← Componentes genéricos reutilizables
│   │   ├── Button.tsx
│   │   ├── Badge.tsx
│   │   └── Spinner.tsx
│   ├── inmuebles/
│   │   ├── PropertyCard.tsx       ← Tarjeta del listado
│   │   ├── PropertyFilters.tsx    ← Panel de filtros
│   │   ├── PropertyGallery.tsx    ← Carrusel de fotos en la ficha
│   │   ├── PropertyMap.tsx        ← Mapa interactivo (MapLibre GL + react-map-gl)
│   │   ├── PropertyMapPin.tsx     ← Pin de precio personalizado sobre el mapa
│   │   ├── PropertyMapPopup.tsx   ← Mini-ficha al hacer clic en un pin
│   │   └── PropertyGrid.tsx       ← Grid/lista de tarjetas
│   └── layout/
│       ├── Header.tsx
│       └── Footer.tsx
│
├── lib/
│   ├── sheets.ts                  ← Fetch y parse de Google Sheets
│   ├── cloudinary.ts              ← Construcción de URLs de Cloudinary
│   └── types.ts                   ← TypeScript types del proyecto
│
├── hooks/
│   └── useInmuebles.ts            ← Filtrado y ordenamiento
│
└── styles/
    └── globals.css
```

---

## 2. TYPESCRIPT TYPES

```typescript
// src/lib/types.ts

export type Operacion = 'VENTA' | 'ALQUILER'
export type TipoInmueble = 'PISO' | 'DUPLEX' | 'CHALET' | 'LOCAL' | 'PARKING'
export type EstadoInmueble = 'EN VENTA' | 'RESERVADO' | 'VENDIDO' | 'ALQUILADO'
export type EtiquetaInmueble = 'OPORTUNIDAD' | 'REBAJADO' | 'DESTACADO' | ''
export type CertificadoEnergetico = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G'

export interface Inmueble {
  ref: string
  publicado: boolean
  operacion: Operacion
  tipo: TipoInmueble
  estado: EstadoInmueble
  etiqueta: EtiquetaInmueble
  precio: number
  direccion: string
  zona: string
  ciudad: string
  habitaciones: number
  banos: number
  superficie_m2: number
  planta: string
  ascensor: boolean
  terraza: boolean
  garaje: boolean
  trastero: boolean
  certificado_energetico: CertificadoEnergetico
  descripcion_corta: string
  descripcion_larga: string
  ref_fotos: string
  lat?: number   // opcional — solo Opción 3 (mapa)
  lng?: number   // opcional — solo Opción 3 (mapa)
  slug: string   // generado a partir de ref + dirección
}

export interface FiltrosInmueble {
  operacion?: Operacion
  tipo?: TipoInmueble
  zona?: string
  precioMin?: number
  precioMax?: number
  habitacionesMin?: number
  banos?: number
  superficieMin?: number
  ascensor?: boolean
  terraza?: boolean
  garaje?: boolean
  trastero?: boolean
  ordenar?: 'reciente' | 'precio_asc' | 'precio_desc'
}
```

---

## 3. VARIABLES DE ENTORNO

Crear `.env` en la raíz del proyecto (este archivo nunca va al repositorio):

```bash
# Google Sheets
VITE_SHEETS_CSV_URL=https://docs.google.com/spreadsheets/d/SHEET_ID/export?format=csv&gid=0

# Cloudinary
VITE_CLOUDINARY_CLOUD_NAME=nombre_del_cloud

# Resend
RESEND_API_KEY=re_xxxxxxxxxxxx

# (opcional) ID de Google Analytics
VITE_GA_ID=G-XXXXXXXXXX
```

En Vercel, estas mismas variables se cargan en **Settings → Environment Variables** para que el deploy en producción también las tenga.

> **Importante:** las variables que empiezan con `VITE_` son visibles en el navegador. Son seguras solo si son de lectura pública (la URL del CSV y el cloud name de Cloudinary lo son). `RESEND_API_KEY` NO debe tener el prefijo `VITE_` — se usa solo en una Vercel Function, nunca en el cliente.

---

## 4. GOOGLE SHEETS — SETUP Y CONEXIÓN

### 4.1 Preparar el Google Sheet

1. Crear el archivo en Google Drive con las 22 columnas definidas en el brief
2. Ir a **Archivo → Compartir → Publicar en la web**
3. Seleccionar la hoja → formato **CSV** → clic en **Publicar**
4. Copiar la URL que genera Google (tiene esta forma):
   ```
   https://docs.google.com/spreadsheets/d/SHEET_ID/export?format=csv&gid=0
   ```
5. Pegar esa URL en `.env` como `VITE_SHEETS_CSV_URL`

> Al publicar como CSV, el sheet es de lectura pública — cualquiera con la URL puede leerlo. Los datos son de inmuebles (no hay información sensible), así que está bien. No se expone ninguna API key.

### 4.2 Instalar el parser de CSV

```bash
npm install papaparse
npm install -D @types/papaparse
```

### 4.3 Función de fetch y parse

```typescript
// src/lib/sheets.ts

import Papa from 'papaparse'
import type { Inmueble } from './types'

const CSV_URL = import.meta.env.VITE_SHEETS_CSV_URL

function generarSlug(ref: string, direccion: string): string {
  return `${ref}-${direccion}`
    .toLowerCase()
    .replace(/[áàä]/g, 'a')
    .replace(/[éèë]/g, 'e')
    .replace(/[íìï]/g, 'i')
    .replace(/[óòö]/g, 'o')
    .replace(/[úùü]/g, 'u')
    .replace(/ñ/g, 'n')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export async function fetchInmuebles(): Promise<Inmueble[]> {
  const response = await fetch(CSV_URL)
  const csvText = await response.text()

  const { data } = Papa.parse<Record<string, string>>(csvText, {
    header: true,
    skipEmptyLines: true,
  })

  return data
    .filter(row => row.publicado?.toUpperCase() === 'SI')
    .map(row => ({
      ref: row.ref,
      publicado: true,
      operacion: row.operacion as Inmueble['operacion'],
      tipo: row.tipo as Inmueble['tipo'],
      estado: row.estado as Inmueble['estado'],
      etiqueta: (row.etiqueta ?? '') as Inmueble['etiqueta'],
      precio: Number(row.precio),
      direccion: row.direccion,
      zona: row.zona,
      ciudad: row.ciudad,
      habitaciones: Number(row.habitaciones),
      banos: Number(row.banos),
      superficie_m2: Number(row.superficie_m2),
      planta: row.planta,
      ascensor: row.ascensor?.toUpperCase() === 'SI',
      terraza: row.terraza?.toUpperCase() === 'SI',
      garaje: row.garaje?.toUpperCase() === 'SI',
      trastero: row.trastero?.toUpperCase() === 'SI',
      certificado_energetico: row.certificado_energetico as Inmueble['certificado_energetico'],
      descripcion_corta: row.descripcion_corta,
      descripcion_larga: row.descripcion_larga,
      ref_fotos: row.ref_fotos,
      lat: row.lat ? Number(row.lat) : undefined,
      lng: row.lng ? Number(row.lng) : undefined,
      slug: generarSlug(row.ref, row.direccion),
    }))
}
```

### 4.4 Configurar TanStack Query

```typescript
// src/main.tsx

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // datos frescos por 5 minutos
    },
  },
})

const router = createRouter({ routeTree, context: { queryClient } })

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  )
}
```

### 4.5 Usar los datos en una ruta

```typescript
// src/routes/inmuebles/index.tsx

import { useQuery } from '@tanstack/react-query'
import { fetchInmuebles } from '../../lib/sheets'

export default function InmueblesPage() {
  const { data: inmuebles, isLoading, isError } = useQuery({
    queryKey: ['inmuebles'],
    queryFn: fetchInmuebles,
  })

  if (isLoading) return <Spinner />
  if (isError) return <p>Error cargando inmuebles</p>

  return <PropertyGrid inmuebles={inmuebles} />
}
```

---

## 5. CLOUDINARY — SETUP Y CONEXIÓN

### 5.1 Crear la cuenta y estructura de carpetas

1. Crear cuenta en [cloudinary.com](https://cloudinary.com) (plan gratuito)
2. En el dashboard copiar el **Cloud name** → pegarlo en `.env` como `VITE_CLOUDINARY_CLOUD_NAME`
3. Crear la estructura de carpetas en la Media Library:
   ```
   📁 inmuebles/
     📁 rc-001/
       🖼️ 01-salon.jpg
       🖼️ 02-cocina.jpg
       🖼️ 03-dormitorio.jpg
     📁 rc-002/
       ...
   ```

**Convención de nombres obligatoria:** las fotos se nombran empezando con número (`01-`, `02-`, `03-`...). El número define el orden en la galería. `01-` siempre es la portada.

### 5.2 Función de construcción de URLs

No hace falta instalar el SDK de Cloudinary. Las URLs se construyen manualmente siguiendo el patrón de Cloudinary:

```typescript
// src/lib/cloudinary.ts

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
const BASE_URL = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload`

// Transformaciones predefinidas
const transformations = {
  card: 'w_600,h_400,c_fill,f_webp,q_auto',      // tarjeta del listado
  gallery: 'w_1200,h_800,c_fill,f_webp,q_auto',   // foto grande en ficha
  thumbnail: 'w_120,h_80,c_fill,f_webp,q_auto',   // miniaturas de galería
  popup: 'w_300,h_200,c_fill,f_webp,q_auto',      // popup del mapa
}

export function getImageUrl(
  refFotos: string,
  filename: string,
  size: keyof typeof transformations = 'gallery'
): string {
  return `${BASE_URL}/${transformations[size]}/inmuebles/${refFotos}/${filename}`
}

// URL de la foto de portada (siempre empieza con 01-)
export function getPortadaUrl(
  refFotos: string,
  size: keyof typeof transformations = 'card'
): string {
  // Cloudinary permite usar wildcards en la búsqueda,
  // pero la convención 01- hace que podamos construir la URL directamente
  return `${BASE_URL}/${transformations[size]}/inmuebles/${refFotos}/01`
}
```

> **Nota:** Cloudinary busca el archivo `01` sin extensión porque tiene activado el parámetro `f_webp` que detecta la extensión automáticamente. Si da problema, se agrega la extensión explícita: `/01-salon.jpg`.

### 5.3 Galería en la ficha individual

Para mostrar todas las fotos de un inmueble hay dos opciones:

**Opción A — Columna `fotos_count` en el Sheets (recomendada)**

Agregar una columna al Sheets con el número de fotos que tiene cada inmueble. El componente construye las URLs del 01 al N.

```typescript
// Si el inmueble tiene fotos_count = 4, genera:
// inmuebles/rc-001/01, inmuebles/rc-001/02, inmuebles/rc-001/03, inmuebles/rc-001/04
function getGalleryUrls(refFotos: string, count: number) {
  return Array.from({ length: count }, (_, i) => {
    const num = String(i + 1).padStart(2, '0')
    return getImageUrl(refFotos, num, 'gallery')
  })
}
```

**Opción B — Cloudinary API desde Vercel Function**

Crear una Vercel Function que consulte la API de Cloudinary y devuelva la lista de imágenes de una carpeta. Más automático pero requiere configurar la API key de Cloudinary como variable de entorno de servidor.

```typescript
// api/fotos.ts  (Vercel Serverless Function)
export default async function handler(req, res) {
  const { folder } = req.query
  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/resources/search?expression=folder:inmuebles/${folder}`,
    { headers: { Authorization: `Basic ${btoa(`${API_KEY}:${API_SECRET}`)}` } }
  )
  const data = await response.json()
  res.json(data.resources.map(r => r.secure_url))
}
```

> Para empezar se recomienda la **Opción A** — es más simple y no requiere configurar secretos adicionales. La Opción B es la mejora natural cuando el volumen de inmuebles crece.

---

## 6. WEBHOOK — GOOGLE APPS SCRIPT → VERCEL

### ¿Hace falta el webhook en una SPA?

En este proyecto los datos se obtienen en el navegador en tiempo real (runtime fetch), por lo que el sitio siempre muestra los datos actuales del Sheets sin necesidad de rebuild.

El webhook es útil si en el futuro se activa SSG (generación estática) o si Vercel cachea las respuestas de la API. Por ahora es opcional — se puede configurar igual como buena práctica.

### Configuración (una sola vez, ~15 minutos)

**Paso 1 — Crear el Deploy Hook en Vercel**

1. Ir al proyecto en Vercel → **Settings → Git → Deploy Hooks**
2. Crear un hook con nombre `sheets-update` y branch `main`
3. Vercel genera una URL como:
   ```
   https://api.vercel.com/v1/integrations/deploy/prj_xxxx/yyyy
   ```
4. Copiar esa URL

**Paso 2 — Configurar el script en Google Sheets**

1. Abrir el Google Sheet → **Extensiones → Apps Script**
2. Pegar este código:

```javascript
function enviarWebhook() {
  const WEBHOOK_URL = 'https://api.vercel.com/v1/integrations/deploy/prj_xxxx/yyyy'
  UrlFetchApp.fetch(WEBHOOK_URL, { method: 'post' })
}
```

3. Guardar el script
4. Ir a **Triggers (reloj)** → Agregar trigger:
   - Función: `enviarWebhook`
   - Evento: **Al editar la hoja de cálculo**
5. Guardar — Google pedirá autorización, aceptar

Desde ese momento, cada edición en el Sheets llama automáticamente a Vercel. No hay costo, no hay mantenimiento.

---

## 7. RUTAS CON TANSTACK ROUTER

TanStack Router usa file-based routing: la estructura de archivos en `src/routes/` define las URLs del sitio.

```
src/routes/
├── __root.tsx          →  layout global (siempre visible)
├── index.tsx           →  /
├── inmuebles/
│   ├── index.tsx       →  /inmuebles
│   └── $slug.tsx       →  /inmuebles/rc-001-c-mallorca-234
├── servicios.tsx       →  /servicios
└── contacto.tsx        →  /contacto
```

### Filtros en la URL

Los filtros del listado se reflejan en los search params de la URL para que las búsquedas sean compartibles por WhatsApp. TanStack Router maneja esto con type safety:

```typescript
// src/routes/inmuebles/index.tsx

import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

const filtrosSchema = z.object({
  operacion: z.enum(['VENTA', 'ALQUILER']).optional(),
  zona: z.string().optional(),
  precioMax: z.number().optional(),
  habitacionesMin: z.number().optional(),
  ordenar: z.enum(['reciente', 'precio_asc', 'precio_desc']).optional(),
})

export const Route = createFileRoute('/inmuebles/')({
  validateSearch: filtrosSchema,
})

// Uso en el componente:
// const { operacion, zona, precioMax } = Route.useSearch()
// Los tipos están garantizados por TypeScript
```

> Se necesita instalar Zod: `npm install zod`. Es la forma recomendada por TanStack Router para validar search params.

---

## 8. HOOK DE FILTRADO

```typescript
// src/hooks/useInmuebles.ts

import { useMemo } from 'react'
import type { Inmueble, FiltrosInmueble } from '../lib/types'

export function useInmueblesFiltrados(
  inmuebles: Inmueble[],
  filtros: FiltrosInmueble
): Inmueble[] {
  return useMemo(() => {
    let resultado = [...inmuebles]

    if (filtros.operacion)
      resultado = resultado.filter(i => i.operacion === filtros.operacion)
    if (filtros.tipo)
      resultado = resultado.filter(i => i.tipo === filtros.tipo)
    if (filtros.zona)
      resultado = resultado.filter(i =>
        i.zona.toLowerCase().includes(filtros.zona!.toLowerCase())
      )
    if (filtros.precioMax)
      resultado = resultado.filter(i => i.precio <= filtros.precioMax!)
    if (filtros.precioMin)
      resultado = resultado.filter(i => i.precio >= filtros.precioMin!)
    if (filtros.habitacionesMin)
      resultado = resultado.filter(i => i.habitaciones >= filtros.habitacionesMin!)
    if (filtros.ascensor)
      resultado = resultado.filter(i => i.ascensor)
    if (filtros.terraza)
      resultado = resultado.filter(i => i.terraza)
    if (filtros.garaje)
      resultado = resultado.filter(i => i.garaje)

    switch (filtros.ordenar) {
      case 'precio_asc':
        resultado.sort((a, b) => a.precio - b.precio)
        break
      case 'precio_desc':
        resultado.sort((a, b) => b.precio - a.precio)
        break
      default:
        // 'reciente' — orden por defecto del Sheets (última fila = más reciente)
        break
    }

    return resultado
  }, [inmuebles, filtros])
}
```

---

## 9. MAPA INTERACTIVO — MAPLIBRE GL

### Stack del mapa

| Pieza | Tecnología | Por qué |
|---|---|---|
| Motor de renderizado | MapLibre GL JS | WebGL, open source, sin API key propia |
| Wrapper React | react-map-gl | Hooks nativos, integra bien con estado React |
| Tiles vectoriales | MapTiler (free tier) | 100k tiles/mes gratis, estilo limpio y moderno |

**MapTiler free tier:** registrar cuenta en [maptiler.com](https://maptiler.com) → copiar la API key → pegarla en `.env` como `VITE_MAPTILER_KEY`. Sin tarjeta de crédito.

### Variable de entorno adicional

```bash
# .env
VITE_MAPTILER_KEY=tu_api_key_aqui
```

### Cómo funciona el mapa en el listado

La página `/propiedades` usa un layout dividido (split):
- **Izquierda:** lista scrollable de tarjetas
- **Derecha:** mapa sticky que ocupa el resto del viewport

Cuando el usuario mueve o hace zoom en el mapa, se calcula el `bounds` (rectángulo visible) y se filtran las propiedades cuyos `lat/lng` caen dentro de ese rectángulo. La lista izquierda se actualiza en tiempo real.

```
usuario mueve el mapa
        │
        ▼
onMoveEnd → obtener map.getBounds()
        │
        ▼
filtrar inmuebles por bounds (lat/lng dentro del rectángulo)
        │
        ▼
actualizar lista izquierda
```

### Componente PropertyMap

```typescript
// src/components/search/PropertyMap.tsx

import Map, { Marker, Popup } from 'react-map-gl/maplibre'
import 'maplibre-gl/dist/maplibre-gl.css'
import type { Property } from '../../lib/types'

const MAPTILER_KEY = import.meta.env.VITE_MAPTILER_KEY
const MAP_STYLE = `https://api.maptiler.com/maps/streets-v2/style.json?key=${MAPTILER_KEY}`

interface PropertyMapProps {
  properties: Property[]
  hoveredId: string | null
  onBoundsChange: (bounds: maplibregl.LngLatBounds) => void
  onPinClick: (id: string) => void
}

export function PropertyMap({ properties, hoveredId, onBoundsChange, onPinClick }: PropertyMapProps) {
  const [popupId, setPopupId] = useState<string | null>(null)

  return (
    <Map
      initialViewState={{ longitude: 2.154, latitude: 41.39, zoom: 12 }}  // Barcelona
      style={{ width: '100%', height: '100%' }}
      mapStyle={MAP_STYLE}
      onMoveEnd={(e) => onBoundsChange(e.target.getBounds())}
    >
      {properties.map((p) => (
        <Marker key={p.id} longitude={p.lng!} latitude={p.lat!} anchor="bottom">
          <button
            className={`map-price-pin ${hoveredId === p.id ? 'pin-active' : ''}`}
            onClick={() => { setPopupId(p.id); onPinClick(p.id) }}
          >
            {formatPrice(p.precio)}
          </button>
        </Marker>
      ))}

      {popupId && (() => {
        const p = properties.find(x => x.id === popupId)!
        return (
          <Popup longitude={p.lng!} latitude={p.lat!} onClose={() => setPopupId(null)}>
            <PropertyMapPopup property={p} />
          </Popup>
        )
      })()}
    </Map>
  )
}
```

### Filtrado por bounds

```typescript
// src/hooks/usePropertyFilters.ts (extensión)

function isInBounds(property: Property, bounds: maplibregl.LngLatBounds): boolean {
  if (!property.lat || !property.lng) return true  // sin coords → siempre visible
  return bounds.contains([property.lng, property.lat])
}
```

### Interacción lista ↔ mapa

- **Hover en tarjeta** → pin correspondiente se resalta (clase `pin-active`)
- **Clic en pin** → scroll automático a la tarjeta en la lista izquierda + popup en el mapa
- **Sin coordenadas** (`lat`/`lng` vacíos en el Sheets) → la propiedad aparece en la lista pero no tiene pin; no da error

### Coordenadas en el Sheets

Las columnas `lat` y `lng` son opcionales. El equipo las obtiene así:
1. Buscar la dirección en Google Maps
2. Clic derecho sobre el punto exacto → aparecen las coordenadas
3. Copiar y pegar en el Sheets (ej: `41.3874`, `2.1686`)

Tiempo: < 1 min por inmueble.

---

## 10. RESEND — FORMULARIOS DE CONTACTO

Los formularios (contacto general + contacto por inmueble) envían emails vía Resend desde una **Vercel Serverless Function** — la API key nunca llega al navegador.

### Setup

```bash
npm install resend
```

### Vercel Function

```typescript
// api/contacto.ts

import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export default async function handler(req: Request) {
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 })

  const { nombre, email, telefono, mensaje, refInmueble } = await req.json()

  await resend.emails.send({
    from: 'web@casasgroup.es',
    to: 'info@casasgroup.es',
    subject: refInmueble
      ? `Consulta sobre inmueble ${refInmueble}`
      : 'Consulta general desde la web',
    html: `
      <p><strong>Nombre:</strong> ${nombre}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Teléfono:</strong> ${telefono ?? '—'}</p>
      <p><strong>Mensaje:</strong> ${mensaje}</p>
      ${refInmueble ? `<p><strong>Inmueble:</strong> ${refInmueble}</p>` : ''}
    `,
  })

  return new Response(JSON.stringify({ ok: true }), { status: 200 })
}
```

---

## 11. DEPLOY EN VERCEL

### Primera vez

```bash
npm install -g vercel
vercel login
vercel          # desde la raíz del proyecto — sigue el wizard
```

Vercel detecta automáticamente que es un proyecto Vite y configura el build command (`vite build`) y el output directory (`dist`).

### Variables de entorno en producción

En el panel de Vercel → **Settings → Environment Variables** agregar:

```
VITE_SHEETS_CSV_URL        → la URL del CSV de Google Sheets
VITE_CLOUDINARY_CLOUD_NAME → el cloud name de Cloudinary
VITE_MAPTILER_KEY          → API key de MapTiler (free tier, sin tarjeta de crédito)
RESEND_API_KEY             → la API key de Resend (solo producción)
```

### Deploy automático

Vercel hace deploy automático en cada push a `main`. Para el webhook de Sheets, usar la URL que genera Vercel en Settings → Git → Deploy Hooks.

---

## 12. NOTA SOBRE SEO

Una SPA con React + Vite sirve HTML vacío por defecto — los buscadores ven una página en blanco hasta que ejecutan el JavaScript. Para mitigar esto:

- Usar `react-helmet-async` para que cada página tenga su propio `<title>` y meta tags (`npm install react-helmet-async`)
- Agregar un `sitemap.xml` estático con las URLs principales
- Las fichas individuales de inmuebles son las más críticas para SEO — asegurarse de que cada una tenga title y description únicos con el precio, zona y características

> Si en el futuro el SEO se vuelve prioritario, la migración a SSR/SSG (via frameworks como TanStack Start o Next.js) es posible sin reescribir los componentes.

---

*Documento preparado por mazzmkt · Mayo 2026*
*Ver también: BRIEF_PROYECTO_WEB.md · PROPUESTA_WEB_FASE1.md*
