# PROPUESTA WEB — FASE 1
### Nueva web sin depender de la API del CRM

**Preparado por:** mazzmkt
**Fecha:** Marzo 2026

---

## ¿QUÉ ES ESTA FASE?

La web nueva puede estar en producción **en 3 semanas**, sin esperar que la API del CRM esté lista. En lugar de conectarse al CRM, la web lee los datos de un **Google Sheets** y las fotos de **Cloudinary** (un gestor de imágenes online, tan simple de usar como Drive).

Cuando en el futuro la API del CRM esté disponible, se cambia únicamente el origen de los datos — la web, el diseño y los filtros quedan exactamente igual. No se tira nada.

---

## CÓMO FUNCIONA EN LA PRÁCTICA

```
El equipo sube fotos a Cloudinary   +   edita el Google Sheets
                              │
                    Webhook automático
                              │
                    Vercel reconstruye
                              │
              El sitio se actualiza (~1 minuto)
```

**Para el equipo:** subir fotos es como subir a Drive (arrastrar y soltar). Editar el Sheets es como editar una planilla de Excel online. No hay código, no hay panel técnico, no hay dependencia del dev para publicar un piso.

---

## CÓMO FUNCIONA EL WEBHOOK (DETALLE TÉCNICO)

No se necesita ninguna herramienta externa. Se implementa con **Google Apps Script**, que ya viene incluido dentro de Google Sheets de forma gratuita.

### Configuración (una sola vez)

1. Abrir el Sheets → **Extensiones → Apps Script**
2. Pegar el siguiente script:

```javascript
function enviarWebhook() {
  const WEBHOOK_URL = "https://api.vercel.com/v1/integrations/deploy/xxxx"; // URL que genera Vercel
  UrlFetchApp.fetch(WEBHOOK_URL, { method: "post" });
}
```

3. Crear un trigger: Ejecutar → `enviarWebhook` → al editar el documento
4. Guardar

Desde ese momento, cada vez que alguien edite el Sheets, Google llama automáticamente a Vercel.

### De dónde sale la URL de Vercel

En el panel de Vercel: **Settings → Git → Deploy Hooks → Create Hook**. Vercel genera una URL única que se copia y se pega en el script. No hay código adicional en el lado de Vercel.

### Por qué funciona bien

- Google Apps Script corre en los servidores de Google, no en el navegador ni en ninguna máquina local
- Si varias personas editan el Sheets a la vez, Vercel encola las llamadas — no hay problema
- El rebuild de Vercel tarda ~45–60 segundos para este tipo de sitio
- Sin costo adicional: Apps Script y el deploy hook de Vercel son gratuitos
- Sin herramientas externas: no se necesita Zapier, Make ni ninguna integración de pago

---

## LAS DOS HERRAMIENTAS DEL EQUIPO

### 1. Google Sheets — datos del inmueble

Un único archivo de Google Sheets con una fila por inmueble y las siguientes columnas:

| Columna | Tipo | Ejemplo | Notas |
|---|---|---|---|
| `ref` | Texto | RC-001 | ID único. Nunca se repite ni se cambia |
| `publicado` | SI / NO | SI | En NO: el piso no aparece en la web (sin borrarlo) |
| `operacion` | VENTA / ALQUILER | VENTA | |
| `tipo` | PISO / DÚPLEX / CHALET / LOCAL / PARKING | PISO | |
| `estado` | EN VENTA / RESERVADO / VENDIDO / ALQUILADO | EN VENTA | "Vendido" aparece con badge en la web |
| `etiqueta` | OPORTUNIDAD / REBAJADO / DESTACADO / (vacío) | OPORTUNIDAD | Badge opcional sobre la foto |
| `precio` | Número | 185000 | Solo el número, sin € ni puntos |
| `direccion` | Texto | C/ Mallorca 234, 3º 1ª | |
| `zona` | Texto | Eixample | Para el filtro de zona en la web |
| `ciudad` | Texto | Barcelona | |
| `habitaciones` | Número | 3 | |
| `banos` | Número | 2 | |
| `superficie_m2` | Número | 85 | Solo el número |
| `planta` | Texto | 3ª | Puede ser "Bajo", "Ático", "3ª", etc. |
| `ascensor` | SI / NO | SI | |
| `terraza` | SI / NO | NO | |
| `garaje` | SI / NO | NO | |
| `trastero` | SI / NO | SI | |
| `certificado_energetico` | A / B / C / D / E / F / G | D | |
| `descripcion_corta` | Texto (máx 150 caracteres) | "Piso luminoso con terraza, reformado, próximo al metro" | Aparece en la tarjeta del listado |
| `descripcion_larga` | Texto libre | Descripción completa del inmueble | Aparece en la ficha individual |
| `ref_fotos` | Texto | rc-001 | **Clave:** debe coincidir exactamente con el nombre de carpeta en Cloudinary |

**Total: 22 columnas.** Se puede capacitar al equipo en 30 minutos.

---

### 2. Cloudinary — fotos de cada inmueble

Cloudinary es un gestor de imágenes en la nube. El equipo ve exactamente esto al entrar:

```
📁 inmuebles/
  📁 atico_severo_ochoa/     ← una carpeta por cada piso (nombre = ref_fotos)
    🖼️  01-salon.jpg          ← portada: sale en la card del listado
    🖼️  02-cocina.jpg
    🖼️  03-dormitorio.jpg
    🖼️  04-bano.jpg
    🖼️  05-terraza.jpg
    🖼️  06-fachada.jpg
  📁 rambla_just_oliveras_44/
    🖼️  01-fachada.jpg
    🖼️  02-salon.jpg
    ...
```

**Nombrado de las fotos — regla única:** empezar con número (`01-`, `02-`, `03-`...). El orden numérico determina el orden en la web:

- `01-` → foto de portada (la que aparece en la tarjeta del listado)
- `02-` en adelante → galería en la ficha individual, en ese orden

El texto después del guión (`salon`, `cocina`, etc.) es opcional pero recomendable para que el equipo pueda identificar y reemplazar fotos fácilmente sin tener que abrirlas todas.

**¿Cómo se ve en la ficha individual?**

```
┌──────────────────────────────────────────┐
│         [ foto 01 — imagen grande ]      │
├──────────────────────────────────────────┤
│  [02] [03] [04] [05] [06]  ← thumbnails  │
└──────────────────────────────────────────┘
```

Al hacer clic en un thumbnail, la imagen grande cambia. Es un carrusel estándar.

**¿Cómo se cambia la foto de portada?** Solo renombrar el archivo deseado a `01-...` y el anterior a `02-...`. Sin tocar el Sheets ni nada más.

**¿Por qué Cloudinary y no Google Drive?**

Google Drive no está pensado para servir imágenes a una web — puede bloquear el tráfico, las URLs no son estables y no optimiza el tamaño. Cloudinary sí:

| | Google Drive | Cloudinary |
|---|---|---|
| Subida | Arrastrar y soltar | Arrastrar y soltar |
| Compartir con el equipo | ✅ | ✅ |
| Sirve las fotos rápido a la web | ❌ | ✅ (CDN global) |
| Convierte a WebP automáticamente | ❌ | ✅ |
| Redimensiona según dispositivo | ❌ | ✅ |
| Costo | Gratis | Gratis (hasta ~10.000 fotos) |

La experiencia de uso es exactamente igual. La diferencia la nota el visitante de la web: carga instantánea vs carga lenta.

---

## EJEMPLO COMPLETO: CÓMO SE PUBLICA UN PISO NUEVO

Supongamos que hay que publicar este piso: *C/ Verdi 18, 2º 1ª — 3 hab, 2 baños, 90m², 320.000 € — Gràcia, Barcelona.*

---

### Paso 1 — Crear la carpeta en Cloudinary y subir las fotos (~5 min)

El agente entra a Cloudinary (link en favoritos del navegador). Crea una carpeta nueva dentro de `inmuebles/` y la nombra `rc-042` (la siguiente referencia disponible).

```
📁 inmuebles/
  📁 rc-042/          ← carpeta nueva
```

Arrastra todas las fotos desde su computadora a esa carpeta. Cloudinary las sube, las optimiza y las sirve desde su red.

Las fotos deben nombrarse empezando con número para controlar el orden:

```
📁 atico_severo_ochoa/
  🖼️  01-salon.jpg       ← portada (sale en la card del listado)
  🖼️  02-cocina.jpg
  🖼️  03-dormitorio.jpg
  🖼️  04-bano.jpg
  🖼️  05-terraza.jpg
  🖼️  06-fachada.jpg
```

El texto después del guión es libre — sirve para que el equipo identifique cada foto sin tener que abrirla. Lo único obligatorio es el número al principio.

---

### Paso 2 — Agregar una fila en el Google Sheets (~3 min)

El agente abre el Sheets, va al final de la tabla y agrega una fila:

| ref | publicado | operacion | tipo | estado | etiqueta | precio | direccion | zona | ciudad | hab | baños | m2 | planta | ascensor | terraza | garaje | trastero | cert_ener | desc_corta | desc_larga | ref_fotos |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| RC-042 | SI | VENTA | PISO | EN VENTA | | 320000 | C/ Verdi 18, 2º 1ª | Gràcia | Barcelona | 3 | 2 | 90 | 2ª | SI | NO | NO | SI | C | Piso luminoso con vistas, reformado... | Precioso piso en pleno corazón de Gràcia... | rc-042 |

**Lo único crítico:** `ref_fotos` debe coincidir exactamente con el nombre de la carpeta que se creó en el Paso 1 (`rc-042`).

---

### Paso 3 — La web se actualiza sola (~1 min)

El Sheets detecta el cambio. Un script de Google Apps Script dispara automáticamente un webhook a Vercel. Vercel reconstruye el sitio con los nuevos datos. En menos de un minuto, el piso aparece en la web con todos sus datos, filtros y galería de fotos.

**El agente no toca ningún archivo, ningún código, ningún panel técnico.**

---

### ¿Cómo se despublica o marca como vendido?

- **Ocultar temporalmente:** cambiar `publicado` a `NO` → desaparece de la web
- **Marcar como vendido:** cambiar `estado` a `VENDIDO` → aparece con badge "Vendido" (genera confianza)
- **Cambiar precio:** editar la celda `precio` → se actualiza en la web en ~1 minuto

---

## QUÉ TIENE EL SITIO EN PRODUCCIÓN AL TERMINAR

### Páginas

| Página | Descripción |
|---|---|
| **Inicio** | Hero con llamada a acción, estadísticas (pisos activos, clientes), propiedades destacadas, servicios resumidos, formulario de contacto |
| **Inmuebles en venta** | Listado grid con todos los inmuebles de operación VENTA |
| **Inmuebles en alquiler** | Listado grid con todos los inmuebles de operación ALQUILER |
| **Ficha de inmueble** | Galería de fotos, todos los datos del piso, mapa de ubicación, formulario de contacto |
| **Servicios** | Reformas, hipotecas, administración de comunidades, seguros, alarmas |
| **Contacto** | Formulario, teléfono, dirección, horarios, mapa |

### Filtros en el listado

- Operación (venta / alquiler)
- Tipo de inmueble (piso, chalet, dúplex, local, parking)
- Zona / Barrio
- Precio mínimo / máximo
- Habitaciones mínimas
- Ordenar por: más nuevo, precio ascendente, precio descendente, metros cuadrados

### Ficha individual — todos los datos visibles

```
┌─────────────────────────────────────────────────────────┐
│  [Galería de fotos — carrusel]                          │
│                                          [Badge estado] │
├─────────────────────────────────────────────────────────┤
│  C/ Verdi 18, 2º 1ª  ·  Gràcia, Barcelona               │
│  320.000 €                            3.555 €/m²        │
├────────────┬────────────┬─────────────┬─────────────────┤
│  🛏 3 hab  │  🚿 2 baños│  📐 90 m²  │  🏢 2ª planta  │
├────────────┴────────────┴─────────────┴─────────────────┤
│  ✅ Ascensor   ❌ Terraza   ❌ Garaje   ✅ Trastero     │
│  Certificado energético: C                              │
├─────────────────────────────────────────────────────────┤
│  [Descripción completa]                                 │
├─────────────────────────────────────────────────────────┤
│  [Mapa Google Maps con ubicación]                       │
├─────────────────────────────────────────────────────────┤
│  [Formulario: Quiero más información sobre este piso]   │
└─────────────────────────────────────────────────────────┘
```

### Diseño y marca

- Colores: rojo corporativo Red Casas + blanco, con tipografía moderna (Inter o similar — a definir en diseño)
- Responsive completo: mobile, tablet, desktop
- Velocidad de carga: < 1 segundo (vs 5-10 segundos actuales)
- Score Lighthouse: 95-100/100

### Funcionalidades técnicas incluidas

- ✅ SEO completo (sitemap, meta tags, Open Graph para WhatsApp/redes)
- ✅ SSL/HTTPS configurado
- ✅ Formulario de contacto con email (por inmueble y general)
- ✅ Google Analytics 4 (mantiene el ID actual: G-1SLF7KWW3D)
- ✅ Aviso de cookies (cumple GDPR/LOPD española)
- ✅ Dominio actual transferido (redcasas.com)
- ✅ Deploy automático al editar el Sheets

---

## STACK TECNOLÓGICO

| Componente | Tecnología | Costo |
|---|---|---|
| Web pública | React + Vite + TanStack Router + Tailwind CSS | $0 |
| Datos inmuebles | Google Sheets | $0 |
| Imágenes | Cloudinary (free tier) | $0 |
| Deploy + hosting | Vercel (free tier) | $0 |
| Webhook rebuild | Google Apps Script | $0 |
| Emails de contacto | Resend (free tier: 100/día) | $0 |
| **Total infraestructura** | | **~$0/mes** |

> Los free tiers son más que suficientes para el volumen actual de Red Casas. Se revisaría si el tráfico creced significativamente.

---

## IMPLEMENTACIÓN — PASO A PASO

> Detalle técnico de cómo se conecta el Google Sheets + Cloudinary a esta web (React + Vite + TanStack Router). Los datos se resuelven **en build time**: no hay backend ni fetch en runtime.

### Arquitectura en una frase

Un script de prebuild baja los datos del Sheet, descubre las fotos en Cloudinary y genera un módulo TypeScript (`generatedProperties.ts`) que la app importa igual que hoy importa los datos hardcodeados. Cuando alguien edita el Sheet, un Deploy Hook de Vercel relanza el build y el módulo se regenera.

```
Google Sheets  ─┐
                ├─►  scripts/buildData.mjs  ─►  src/lib/generatedProperties.ts  ─►  vite build
Cloudinary     ─┘     (corre antes de vite)        (datos + URLs ya listas)         (bundle final)
```

### Paso 0 — Credenciales y entorno

- `VITE_CLOUDINARY_CLOUD_NAME` → **público** (se usa para armar las URLs de entrega).
- `CLOUDINARY_API_KEY` y `CLOUDINARY_API_SECRET` → **solo build** (sin prefijo `VITE_`, nunca llegan al cliente). Se cargan como Environment Variables en Vercel.
- `SHEET_CSV_URL` o el ID del Google Sheet publicado como CSV → de dónde lee los datos el script.

### Paso 1 — Helper de Cloudinary (`src/lib/cloudinary.ts`)

Inicializa Cloudinary con el `cloud_name` y expone funciones para construir URLs con transformaciones (`f_auto`, `q_auto` y tamaños por contexto: card del listado, galería de la ficha, thumbnail del popup del mapa). El cliente solo recibe URLs ya construidas.

### Paso 2 — Script de build (`scripts/buildData.mjs`)

Corre antes de `vite build`. Hace:

1. **Lee el Sheet** (CSV publicado → no requiere credenciales de Google) y parsea las 22 columnas.
2. **Filtra** las filas con `publicado = SI`.
3. Por cada fila, con su `ref_fotos`, **lista la carpeta de Cloudinary** vía Admin API (`inmuebles/{ref_fotos}/`), ordena por nombre → `01-` = portada, resto = galería.
4. **Mapea `Inmueble` → `Property`** (el tipo que consume la app): `ref → id`, portada → `image`, galería → `images[]`, `lat`/`lng → coords`, etc.
5. **Escribe** `src/lib/generatedProperties.ts` con el array tipado.

### Paso 3 — Transformación `Inmueble → Property`

Función centralizada (en el script o en `src/lib/`) que convierte el esquema del Sheet al tipo `Property` ya usado por la web. Así el diseño, los filtros y las fichas no cambian: solo cambia el origen de los datos. Esto es lo que permite la migración limpia al CRM en Fase 2.

### Paso 4 — Toggle hardcodeado ↔ Sheet (etapa de pruebas)

Mientras se prueba, `propertiesData.ts` mantiene los datos hardcodeados y se combina/alterna con `generatedProperties.ts` mediante una bandera. Permite validar el pipeline sin romper la web actual. Al confirmar, se deja solo la fuente del Sheet.

### Paso 5 — Integración en el build de Vite

`package.json` encadena el script antes del build:

```jsonc
"scripts": {
  "build": "node scripts/buildData.mjs && tsc -b && vite build"
}
```

Así, tanto en local como en el build de Vercel, los datos se regeneran automáticamente.

### Paso 6 — Deploy Hook + Google Apps Script

Se crea un Deploy Hook en Vercel (Settings → Git → Deploy Hooks) y se pega su URL en el Apps Script del Sheet (ver "Cómo funciona el webhook"). Editar el Sheet → rebuild → web actualizada en ~1 min.

### Resumen de artefactos a crear

| Artefacto | Rol |
|---|---|
| `src/lib/cloudinary.ts` | Construye URLs de imágenes con transformaciones |
| `scripts/buildData.mjs` | Lee Sheet + Cloudinary, genera el módulo de datos |
| `src/lib/generatedProperties.ts` | **Generado** — datos de inmuebles listos para la app |
| Transform `Inmueble → Property` | Adapta el esquema del Sheet al tipo de la web |
| Env vars en Vercel | `VITE_CLOUDINARY_CLOUD_NAME` (público) + `CLOUDINARY_API_KEY`/`SECRET` (build) |
| Deploy Hook + Apps Script | Rebuild automático al editar el Sheet |

---

## PLAN DE TRABAJO Y TIMELINE DE ENTREGABLES

El proceso tiene **3 checkpoints de revisión** para el cliente en todas las opciones. Atrapar cambios de branding o estructura antes de implementar ahorra tiempo a ambas partes.

---

### CHECKPOINT 1 — Branding + estructura *(el cliente valida antes de que se escriba código de producción)*

**Qué se revisa:**
- Paleta de colores, tipografía y estilo visual general
- Layout de las páginas principales (home, listado, ficha)
- Estructura de la navegación y flujo del usuario
- Nomenclatura y textos clave (ej. cómo se llaman las secciones)

**Formato:** documento visual + URL de staging con diseño base aplicado
**Qué se espera del cliente:** confirmar o pedir ajustes antes de continuar

---

### CHECKPOINT 2 — Web completa en staging *(el cliente prueba la web funcionando con datos reales)*

**Qué se revisa:**
- Todas las páginas implementadas con diseño final
- Filtros y búsqueda funcionando
- Galería de fotos, formularios de contacto con envío real de emails
- Webhook activo: el cliente edita el Sheets y ve el cambio en staging
- Versión mobile y desktop

**Formato:** URL de staging pública (`redcasas-nueva.vercel.app`)
**Qué se espera del cliente:** lista de ajustes finales (máximo 1 ronda)

---

### CHECKPOINT 3 — Testing final + go-live

**Qué se hace:**
- Ajustes de la ronda anterior aplicados
- Pruebas cross-browser (Chrome, Safari, Firefox) y mobile real
- SEO técnico, GA4, cookies y SSL verificados
- Capacitación al equipo (guía escrita + videollamada ~1h)
- Dominio redcasas.com apuntando al nuevo sitio
- **Go-live**

**Entregable final:** sitio en producción en redcasas.com · Equipo autónomo para publicar inmuebles

---

### TIMELINES POR OPCIÓN

#### Opción 1 — Web Esencial · €1.200

```
Semana 1       Setup + estructura + diseño base
Fin semana 1   ✅ CHECKPOINT 1 — Branding & estructura (cliente revisa)
Semana 2       Implementación completa en staging (páginas, filtros básicos, webhook)
Fin semana 2   ✅ CHECKPOINT 2 — Web en staging con datos reales (cliente revisa)
Semana 3       Ajustes post-revisión + SEO + GDPR + capacitación al equipo
Fin semana 3   ✅ CHECKPOINT 3 — Testing final + go-live
```
**Duración total: 3 semanas**

---

#### Opción 2 — Web con Buscador Avanzado · €1.500

```
Semana 1       Setup + estructura + diseño base
Fin semana 1   ✅ CHECKPOINT 1 — Branding & estructura (cliente revisa)
Semanas 2–3    Implementación completa: filtros avanzados, vista lista/grid, URL params
Fin semana 3   ✅ CHECKPOINT 2 — Web en staging con datos reales (cliente revisa)
Semana 4       Ajustes post-revisión + SEO + GDPR + capacitación al equipo
Fin semana 4   ✅ CHECKPOINT 3 — Testing final + go-live
```
**Duración total: 4 semanas**

---

#### Opción 3 — Web Completa con Mapa · €1.900

```
Semana 1       Setup + estructura + diseño base
Fin semana 1   ✅ CHECKPOINT 1 — Branding & estructura (cliente revisa)
Semanas 2–3    Implementación completa: todo de Opción 2 + mapa interactivo half-map
Fin semana 3   ✅ CHECKPOINT 2 — Web en staging con mapa y datos reales (cliente revisa)
Semanas 4–5    Ajustes post-revisión + carga de coordenadas + SEO + GDPR + capacitación
Fin semana 5   ✅ CHECKPOINT 3 — Testing final + go-live
```
**Duración total: 5 semanas**

---

> Los plazos asumen disponibilidad del cliente para revisar en 24h en cada checkpoint. Cada día de demora en la revisión se traslada al plazo final.

---

## CUÁNDO SE CONECTA AL CRM (FASE 2)

Cuando la API del CRM esté lista, el trabajo de Fase 2 es:

1. Mapear los campos del CRM a las columnas del Sheets (ya mapeadas y documentadas)
2. Reemplazar la función que lee el Sheets por una que llame a la API del CRM
3. Eliminar el webhook de Sheets (el CRM lo reemplaza)

**El diseño, los filtros, las páginas, el dominio y todo lo demás quedan exactamente igual.** La migración es solo de fuente de datos. El equipo deja de usar el Sheets y pasa a gestionar todo desde el CRM — sin aprender una web nueva porque ya la conocen.

---

## LO QUE RESUELVE ESTA FASE

| Problema actual | Estado tras Fase 1 |
|---|---|
| Web tarda 5-10 segundos en cargar | ✅ Carga en < 1 segundo |
| La web muestra errores | ✅ Sitio nuevo, sin errores |
| QR de la oficina lleva a web rota | ✅ QR lleva a web moderna |
| Para publicar un piso hay que pedirle al dev | ✅ El equipo lo hace en 8 minutos |
| Publicación duplicada (CRM + web por separado) | ✅ Una sola edición en el Sheets |
| SEO malo → clientes no encuentran la web | ✅ SEO configurado correctamente |
| Sin dominio configurado correctamente | ✅ redcasas.com + SSL |

## LO QUE NO RESUELVE (queda para fases siguientes)

- ❌ La publicación sigue siendo manual (Sheets en lugar de automática desde el CRM)
- ❌ El CRM interno no cambia en nada
- ❌ Sin módulos de reformas, hipotecas, seguros, alarmas ni administración de comunidades
- ❌ Sin dashboard ni alertas automáticas

---

---

## MAPA INTERACTIVO — DETALLE TÉCNICO (Opción 3)

### Stack

| Componente | Tecnología | Motivo |
|---|---|---|
| Librería de mapas | Leaflet (react-leaflet) / MapLibre | Open source, sin API key, sin costo, ampliamente mantenida |
| Tiles (mapa base) | OpenStreetMap / MapTiler | Gratuito (o free tier) para este volumen |
| Integración en la app | Componente React montado en cliente | El mapa requiere acceso al DOM y al navegador |

### Cómo se integra el mapa en React + Vite

La web es una SPA de React (Vite + TanStack Router). El mapa (Leaflet/react-leaflet, ya instalado en el proyecto) se ejecuta en el navegador porque dibuja sobre un elemento del DOM. Los datos de los inmuebles **no** se piden en runtime: se generan en el build (ver "Implementación — paso a paso") dentro de un módulo `generatedProperties.ts` que la app importa directamente. Leaflet los recibe ya en memoria, sin fetch adicional en cliente.

```
Build de Vercel
├── script de datos     → baja el Sheet + arma URLs de Cloudinary
│                          → genera generatedProperties.ts
├── vite build          → bundle de la SPA con los datos ya embebidos
└── Componente mapa     → JS que corre en el navegador (Leaflet)
```

Los datos de los inmuebles (del Sheets) quedan embebidos en el bundle en build time — el mapa los recibe ya listos, sin fetch adicional en cliente.

### Flujo de datos

```
Google Sheets
     │
     │  (build time — webhook de Vercel)
     ▼
El script de build lee todas las filas con lat + lng
     │
     ▼
Genera generatedProperties.ts; el componente mapa lo importa
     │
     ▼
Leaflet crea un pin por inmueble (usando lat/lng)
     │
     ▼
El usuario navega el mapa → Leaflet emite evento "moveend"
     │
     ▼
Se calcula el bounding box actual (N, S, E, O)
     │
     ▼
Se filtra el array por: inmuebles dentro del bbox + filtros activos
     │
     ▼
El listado (izquierda) re-renderiza con esos resultados
```

### Sincronización mapa ↔ listado en detalle

- **Evento `moveend`:** Leaflet expone este evento cada vez que el usuario termina de mover o hacer zoom. Se usa para recalcular el bounding box y actualizar el listado.
- **Bounding box:** `map.getBounds()` devuelve los límites geográficos visibles. Se comparan con `lat`/`lng` de cada inmueble para saber cuáles están dentro.
- **Filtros activos:** se aplican antes del filtro por bbox — el resultado es la intersección de ambos.
- **Sin fetch en cliente:** todos los datos ya están en memoria (pasados como props). La actualización del listado es instantánea, sin red.

### Pin y mini-ficha al hacer clic

```
Clic en pin
     │
     ├─ Se resalta la card correspondiente en el listado (scroll automático)
     └─ Se abre un popup de Leaflet con:
           - Foto de portada (01-*.jpg de Cloudinary)
           - Precio formateado (€185.000)
           - Habitaciones · Baños · m²
           - Botón "Ver ficha completa" → /inmuebles/[slug]
```

### Coordenadas — obtención y carga

**Opción A (manual — incluida en esta fase):**
El equipo obtiene las coordenadas desde Google Maps (clic derecho → copiar coordenadas) y las pega en las columnas `lat` / `lng` del Sheets. Tiempo: < 1 min por inmueble.

**Opción B (geocoding automático — Fase 2):**
Cuando esté disponible la API del CRM, se puede añadir un paso de geocoding automático: la dirección del inmueble se envía a la API de Google Maps Geocoding y devuelve `lat`/`lng` sin intervención manual. Esto requeriría una API key de Google Maps (tiene costo por request, aunque el volumen de Red Casas entraría en el free tier de $200/mes que ofrece Google).

### Consideraciones de rendimiento

- Los tiles de OpenStreetMap se cachean en el navegador — navegaciones repetidas por la misma zona no generan requests adicionales.
- Las fotos de los popups se sirven desde Cloudinary con transformación automática a tamaño thumbnail (≈ 200px) — no se carga la foto full-size en el popup.
- Con el volumen actual de Red Casas (estimado < 100 inmuebles activos), el filtrado en cliente es instantáneo. No se necesita paginación ni filtrado server-side.

*Documento preparado por mazzmkt · Marzo 2026*
*Ver también: PROPUESTAS_ALTERNATIVAS.md · ANALISIS_FINAL.md*
