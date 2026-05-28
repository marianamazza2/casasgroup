# BRIEF — PROYECTO WEB RED CASAS
**Preparado por:** mazzmkt
**Fecha:** Mayo 2026
**Estado:** Listo para arrancar

---

## 1. CONTEXTO Y CLIENTE

**Red Casas** es una inmobiliaria independiente con oficina en rambla (Hospitalet / Barcelona), que opera también en Girona. Tiene el QR de su web en el escaparate físico de la oficina.

**Equipo actual:** Angie (dueña) + Lucía (coordinadora) + Gala (financiero) + agentes comerciales
**Plan de crecimiento:** hasta 6 comerciales

**Servicios que ofrece:**
- Venta y alquiler de inmuebles
- Gestión de hipotecas
- Seguros (Ocaso / Arag)
- Alarmas (Securitas)
- Suministros (cambio de luz/gas)
- Administración de comunidades
- Reformas

---

## 2. POR QUÉ SE HACE ESTE PROYECTO

La web actual tiene tres problemas que impactan directamente en el negocio:

| Problema | Impacto real |
|---|---|
| Carga en 5-10 segundos y muestra HTML crudo como error | El QR del escaparate lleva a clientes que ven la web rota desde la calle |
| Sin conexión con el CRM | Cada piso se carga dos veces: en el CRM y en la web manualmente |
| Tecnología obsoleta (PHP 7.4 sin soporte desde nov 2022) | No se puede arreglar, solo reemplazar |

La web no es un problema estético — es un problema de negocio activo. Cada día sigue siendo imagen perdida.

**Prioridad del cliente (Angie, textual):** *"La página web me interesa mucho porque es la cara al público. Mucha gente pasa, escanea el QR y quiere entrar a ver los inmuebles."*

---

## 3. QUÉ RESUELVE ESTE PROYECTO (FASE 1)

Este proyecto reemplaza la web actual por una nueva, moderna y rápida. **No toca el CRM.** El CRM se aborda en una Fase 2 separada.

| Problema actual | Tras Fase 1 |
|---|---|
| Web tarda 5-10 segundos en cargar | Carga en < 1 segundo |
| La web muestra errores de HTML | Sitio nuevo, sin errores |
| QR del escaparate lleva a web rota | QR lleva a web funcional y moderna |
| Publicar un piso requiere al dev | El equipo lo hace en ~8 minutos |
| Publicación duplicada (CRM + web por separado) | Una sola edición en el Sheets |
| SEO deficiente | SEO configurado correctamente en casasgroup.es |
| Sin SSL ni dominio bien configurado | casasgroup.es + SSL activo |

**Lo que NO resuelve esta fase:**
- La publicación sigue siendo semi-manual (via Sheets, no automática desde el CRM)
- El CRM interno no cambia
- Sin módulos de hipotecas, seguros, alarmas ni comunidades en la web

---

## 4. SOLUCIÓN TÉCNICA — ARQUITECTURA

### Cómo funciona

La web se construye con React + Vite + TypeScript + Tailwind CSS y se despliega en Vercel. Los datos de los inmuebles viven en **Google Sheets** y las fotos en **Cloudinary**. Cuando el equipo edita el Sheets, la web se actualiza sola en ~1 minuto sin intervención técnica.

```
El equipo edita Google Sheets + sube fotos a Cloudinary
                          │
                 Google Apps Script (webhook)
                          │
              Vercel reconstruye el sitio (~60 seg)
                          │
              La web muestra los cambios automáticamente
```

### Por qué este enfoque (y no WordPress)

- La web actual es WordPress. WordPress carga lento por naturaleza (bases de datos, plugins, PHP).
- El nuevo sitio genera HTML estático en build time. No hay base de datos en el momento de servir la página. Resultado: carga < 1 segundo, score Lighthouse 95-100.
- Cuando en el futuro la API del CRM esté lista, **solo se cambia la fuente de datos** — la web, el diseño, los filtros y el dominio quedan exactamente igual. No se tira trabajo.

### Stack

| Componente | Tecnología | Estado | Costo mensual |
|---|---|---|---|
| Framework | React + Vite + TypeScript | ✅ Instalado | $0 |
| Estilos | Tailwind CSS | ✅ Instalado | $0 |
| Routing | TanStack Router | ✅ Instalado | $0 |
| Animaciones | Motion | ✅ Instalado | $0 |
| Data fetching | TanStack Query | 🔲 Por instalar | $0 |
| Datos de inmuebles | Google Sheets (CSV público) | 🔲 Por implementar | $0 |
| Fotos | Cloudinary (free tier) | 🔲 Por implementar | $0 |
| Deploy + hosting | Vercel (free tier) | 🔲 Por configurar | $0 |
| Webhook rebuild | Google Apps Script | 🔲 Por configurar (opcional) | $0 |
| Emails de contacto | Resend (free tier: 100/día) | 🔲 Por implementar | $0 |
| **Total infraestructura** | | | **~$0/mes** |

---

## 4b. DETALLE TÉCNICO — IMPLEMENTACIONES PENDIENTES

### Datos: Google Sheets como fuente

Los datos de los inmuebles se leerán desde Google Sheets **en build time** — es decir, Vercel hace una llamada a la Sheets API cuando construye el sitio, obtiene todas las filas, y genera las páginas con esos datos ya embebidos en el HTML. El navegador del visitante no hace ninguna llamada a Google.

```
Vercel build
    │
    ├── fetch a Google Sheets API (Sheets ID + API Key)
    │       └── devuelve array de inmuebles (JSON)
    │
    ├── genera /inmuebles con todos los datos
    ├── genera /inmuebles/[slug] por cada inmueble
    └── HTML estático listo para servir
```

**Por qué build time y no fetch en el cliente:**
- Velocidad: el visitante recibe HTML con los datos ya adentro, sin esperar ningún fetch
- SEO: los buscadores ven el contenido completo desde el primer request
- Sin claves expuestas: la API key de Sheets solo se usa en el servidor de Vercel, nunca llega al navegador

**Cómo se dispara la actualización:**
Cuando alguien edita el Sheets, Google Apps Script llama automáticamente al deploy hook de Vercel. Vercel reconstruye el sitio (~60 segundos). Sin intervención manual, sin código adicional más allá del script inicial.

**Configuración del webhook — una sola vez:**
```javascript
// Google Apps Script (se pega en Extensiones → Apps Script del Sheets)
function enviarWebhook() {
  const WEBHOOK_URL = "https://api.vercel.com/v1/integrations/deploy/xxxx";
  UrlFetchApp.fetch(WEBHOOK_URL, { method: "post" });
}
// Trigger: ejecutar enviarWebhook → al editar el documento
```
La URL del webhook la genera Vercel en Settings → Git → Deploy Hooks. Se copia y pega en el script. Tiempo de configuración: ~15 minutos. Mantenimiento posterior: ninguno.

**Por qué Google Apps Script y no n8n:**

| | Google Apps Script | n8n |
|---|---|---|
| Setup | 15 min, dentro del propio Sheets | Horas + infraestructura externa |
| Costo | $0 | Cloud: costo mensual / Self-hosted: servidor |
| Mantenimiento | Ninguno | Mantener la instancia |
| Adecuado para este caso | ✅ Sí — un solo trigger simple | ❌ Sobredimensionado |

n8n tiene sentido para orquestar múltiples sistemas complejos. Acá el único trabajo es "cuando se edita el Sheets, llamar a esta URL" — Google Apps Script lo resuelve con 5 líneas.

---

### Fotos: Cloudinary

Las fotos se suben a Cloudinary organizadas en carpetas (una por inmueble). La columna `ref_fotos` del Sheets contiene el nombre de la carpeta, que es lo que conecta los datos con las imágenes.

En build time, Vite llama a la API de Cloudinary para obtener la lista de fotos de cada carpeta y genera las URLs optimizadas. Las imágenes se sirven desde la CDN de Cloudinary — no desde Vercel.

```
Sheets row: { ref: "RC-042", ref_fotos: "rc-042", ... }
                                    │
                    Cloudinary API: listar carpeta "rc-042"
                                    │
                    devuelve URLs de imágenes optimizadas
                                    │
              Ficha del inmueble renderizada con galería
```

**Cloudinary hace automáticamente:**
- Conversión a WebP (formato moderno, ~30% más liviano que JPG)
- Redimensionado según el dispositivo (mobile recibe imagen más pequeña)
- Serving desde CDN global (la imagen sale del servidor más cercano al visitante)

---

### Routing: TanStack Router

TanStack Router gestiona la navegación entre páginas. Las rutas principales del sitio:

| Ruta | Página |
|---|---|
| `/` | Home |
| `/inmuebles` | Listado (venta + alquiler con filtros) |
| `/inmuebles/$slug` | Ficha individual de cada inmueble |
| `/servicios` | Página de servicios |
| `/contacto` | Formulario de contacto |

Los filtros activos se reflejan en los parámetros de la URL (`/inmuebles?zona=eixample&precio=300000`) para que las búsquedas sean compartibles por WhatsApp. TanStack Router maneja esto de forma nativa con type safety en TypeScript.

---

## 5. CÓMO GESTIONA EL EQUIPO LOS INMUEBLES

### Google Sheets — datos

Un único archivo, una fila por inmueble. 22 columnas. El equipo lo edita como cualquier Excel online.

| Columna clave | Ejemplo | Para qué sirve |
|---|---|---|
| `publicado` | SI / NO | En NO: el piso desaparece de la web sin borrarlo |
| `estado` | EN VENTA / VENDIDO / ALQUILADO | Controla el badge visible en la ficha |
| `etiqueta` | OPORTUNIDAD / REBAJADO / DESTACADO | Badge opcional sobre la foto |
| `ref_fotos` | rc-042 | Vincula el piso con su carpeta en Cloudinary |

**Para publicar un piso nuevo:** añadir una fila con los datos + crear carpeta en Cloudinary con las fotos → la web se actualiza sola en ~1 minuto.

**Para vender un piso:** cambiar `estado` a VENDIDO → el piso aparece con badge "Vendido" (genera confianza) o se puede ocultar cambiando `publicado` a NO.

### Cloudinary — fotos

Carpetas dentro de `inmuebles/`. Una carpeta por piso. Las fotos se nombran con número para controlar el orden: `01-salon.jpg` es la portada, `02-cocina.jpg` va segunda en la galería, etc.

```
📁 inmuebles/
  📁 rc-042/
    🖼️ 01-salon.jpg     ← portada (aparece en la tarjeta del listado)
    🖼️ 02-cocina.jpg
    🖼️ 03-dormitorio.jpg
    🖼️ 04-bano.jpg
```

Subir fotos es arrastrar y soltar, igual que Drive. La diferencia está en el rendimiento: Cloudinary sirve las imágenes desde una red CDN global, convierte a WebP automáticamente y las redimensiona según el dispositivo. Google Drive no hace nada de esto.

---

## 6. PÁGINAS Y FUNCIONALIDADES

### Páginas del sitio

| Página | Contenido |
|---|---|
| **Inicio** | Hero con llamada a acción, pisos destacados, estadísticas del negocio, resumen de servicios, formulario de contacto |
| **Inmuebles en venta** | Listado con filtros, tarjetas por inmueble |
| **Inmuebles en alquiler** | Listado con filtros, tarjetas por inmueble |
| **Ficha de inmueble** | Galería carrusel, todos los datos del piso, mapa de ubicación (embed), formulario de contacto |
| **Servicios** | Hipotecas, reformas, comunidades, seguros, alarmas, suministros |
| **Contacto** | Formulario, teléfono, dirección, horarios, mapa |

### Filtros de búsqueda (todas las opciones incluyen)
- Barra de búsqueda por zona o ciudad
- Tipo de inmueble (piso, chalet, dúplex, local, parking)
- Operación (venta / alquiler)
- Zona / barrio
- Precio máximo
- Habitaciones mínimas
- Ordenar por: último publicado · menor precio · mayor precio

---

## 7. DISEÑO Y MARCA

### Directrices confirmadas con Angie

- **Estilo:** minimalista, limpio, moderno. Referencia: webs que ella envió + reforma de la oficina (blancos, caqui, toques de marca)
- **Color corporativo:** rojo Red Casas — se usa como acento, no como fondo dominante (el rojo en exceso genera sensación de alerta en el usuario)
- **Tipografía:** a definir en Checkpoint 1. Probablemente Inter o similar — moderna, legible
- **Sin vídeos de fondo agresivos** — si se usa movimiento, que sea suave (accesibilidad)
- **Mobile-first** — el equipo y los clientes acceden desde móvil

### Proceso de validación de diseño

Hay 3 checkpoints de revisión durante el proyecto. El primero ocurre **antes de escribir código de producción**, para asegurarse de que el branding y el layout están alineados con lo que espera el cliente.

---

## 8. DOMINIO NUEVO — casasgroup.es

### Qué cambia respecto a redcasas.com

El sitio nuevo se publicará en **casasgroup.es**. Esto implica más trabajo que un simple cambio de URL — hay varias decisiones y tareas técnicas asociadas.

### Tareas incluidas en este proyecto

- Configuración completa de `casasgroup.es` apuntando al nuevo sitio en Vercel
- SSL activo en el nuevo dominio
- Sitemap y meta tags con las URLs de `casasgroup.es`

### Qué pasa con redcasas.com — decisión pendiente del cliente

El destino de `redcasas.com` no está decidido. Las opciones son:

| Opción | Qué implica | Recomendación |
|---|---|---|
| **Redirección 301 a casasgroup.es** | Todo el tráfico y cualquier posicionamiento SEO existente en redcasas.com se transfiere al nuevo dominio | ✅ Recomendado |
| **Mantenerlo activo sin redirección** | Dos sitios distintos activos, posible confusión para usuarios y Google | ❌ No recomendado |
| **Abandonarlo sin redirección** | Se pierde el tráfico y cualquier historial de SEO acumulado | Solo si el dominio no tiene tráfico relevante |

La redirección 301 es la opción correcta en casi todos los casos. No tiene costo adicional y se implementa en el mismo sprint de go-live.

### Impacto en SEO del cambio de dominio

Cambiar de dominio siempre tiene un impacto inicial en el posicionamiento, aunque se hagan bien las redirecciones. Lo que hay que saber:

- Google tarda entre 2 y 6 semanas en reconocer plenamente el nuevo dominio
- Con redirecciones 301 bien implementadas, la mayor parte del posicionamiento se recupera
- Sin redirecciones, el posicionamiento se pierde por completo y hay que empezar de cero
- El SEO que se configure en `casasgroup.es` (sitemap, meta tags, Open Graph, velocidad) acelerará la indexación

### Otras cosas que cambian con el nuevo dominio

- **QR del escaparate:** el código QR físico apunta a `redcasas.com` — hay que reemplazarlo por uno nuevo apuntando a `casasgroup.es`. Responsabilidad del cliente (imprimir nuevo QR)
- **Portales externos:** Idealista, Fotocasa, Habitaclia tienen el link a la web antigua — hay que actualizarlos. Responsabilidad del equipo
- **Google My Business:** actualizar la URL del sitio web en la ficha de Google Maps al nuevo dominio `casasgroup.es`. Responsabilidad del equipo
- **Emails corporativos:** si el equipo usa `@redcasas.com`, eso es independiente del proyecto web y no cambia aquí

---

## 8b. INTEGRACIÓN TÉCNICA — CONEXIÓN CON EL CRM (FASE 2, REFERENCIA)

Esta fase no toca el CRM. Cuando en el futuro la API del CRM esté disponible, el trabajo de conexión es:

1. Mapear los campos del CRM a las 22 columnas del Sheets (ya documentadas)
2. Reemplazar la función que lee el Sheets por una que llame a la API del CRM
3. Eliminar el webhook de Sheets

**El diseño, los filtros, las páginas y todo lo demás quedan exactamente igual.** El equipo deja de usar el Sheets y pasa a gestionar todo desde el CRM — sin aprender una web nueva porque ya la conocen.

---

## 9. OPCIONES DE PRESUPUESTO

### Comparativa rápida

| | Opción 1 · Esencial | Opción 2 · Buscador avanzado | Opción 3 · Completa con mapa |
|---|---|---|---|
| **Precio** | **€1.200** | **€1.500** | **€1.900** |
| **Plazo** | 3 semanas | 4 semanas | 5 semanas |
| Web nueva y rápida | ✅ | ✅ | ✅ |
| Diseño moderno + branding | ✅ | ✅ | ✅ |
| Gestión por Google Sheets | ✅ | ✅ | ✅ |
| Fotos en Cloudinary | ✅ | ✅ | ✅ |
| Webhook (auto-actualización) | ✅ | ✅ | ✅ |
| SEO completo | ✅ | ✅ | ✅ |
| Barra de búsqueda + filtros básicos | ✅ | ✅ | ✅ |
| Filtros avanzados (10+ filtros) | ❌ | ✅ | ✅ |
| Vista lista + grid (toggle) | ❌ | ✅ | ✅ |
| Mapa interactivo con pins | ❌ | ❌ | ✅ |

### Detalle de filtros avanzados (Opciones 2 y 3)

Estado · Precio mínimo y máximo (rango) · Baños · Superficie mínima · Planta · Extras (ascensor, terraza, garaje, trastero) · Filtros reflejados en URL (búsqueda compartible por WhatsApp) · Contador de resultados

### Detalle del mapa interactivo (Opción 3)

Vista half-map estilo Airbnb / Tecnocasa: listado a la izquierda, mapa a la derecha. Al mover o hacer zoom en el mapa, el listado se actualiza mostrando solo los inmuebles visibles en esa zona. Un pin por inmueble con el precio visible. Al hacer clic en el pin aparece mini-ficha con foto, precio y habitaciones.

**Tecnología:** Leaflet.js (open source) + OpenStreetMap (gratuito). Sin API key, sin costo.

**Coordenadas:** el equipo las obtiene haciendo clic derecho en Google Maps y pegando en el Sheets. < 1 min por inmueble.

### Recomendación

| Si... | Elegir |
|---|---|
| La prioridad es tener algo funcionando cuanto antes | **Opción 1** |
| Se quiere experiencia de búsqueda completa desde el día 1 | **Opción 2** |
| Se quiere la experiencia más completa posible | **Opción 3** |

Las tres opciones son compatibles con la Fase 2 (conexión al CRM). No se tira trabajo en ningún caso.

---

## 10. FORMA DE PAGO

- 50% al inicio del proyecto (tras kick-off)
- 50% al go-live

---

## 11. LO QUE INCLUYE SIEMPRE (TODAS LAS OPCIONES)

- Reunión de kick-off para revisar diseño y preferencias
- Dominio `casasgroup.es` configurado y apuntando al nuevo sitio en Vercel
- SSL configurado en `casasgroup.es`
- Redirección 301 de `redcasas.com` a `casasgroup.es` (si el cliente confirma — ver sección 8)
- Aviso de cookies (cumple GDPR / LOPD española)
- Sitio en staging para revisión antes del go-live
- Formularios de contacto con envío real de emails
- Open Graph (vista previa al compartir por WhatsApp / redes)
- Sitemap y robots.txt para SEO
- Capacitación al equipo: guía escrita + videollamada de 1h
- 2 semanas de soporte post-lanzamiento para ajustes menores

## LO QUE NO INCLUYE

- Redacción de textos (se usan los actuales o los provee el cliente)
- Fotografía de inmuebles
- Mantenimiento mensual recurrente (se puede contratar aparte)
- Integración con la API del CRM (queda para Fase 2)

---

## 12. TIMELINE Y CHECKPOINTS

El proceso tiene 3 checkpoints de revisión. Los plazos asumen disponibilidad del cliente para revisar en 24h en cada checkpoint.

### Opción 1 — 3 semanas

```
Semana 1      Setup + estructura + diseño base
Fin semana 1  ✅ CHECKPOINT 1 — Branding & estructura (cliente revisa)
Semana 2      Implementación completa en staging (páginas, filtros, webhook)
Fin semana 2  ✅ CHECKPOINT 2 — Web en staging con datos reales (cliente revisa)
Semana 3      Ajustes + SEO + GDPR + capacitación
              Configuración DNS casasgroup.es + redirección 301 redcasas.com
Fin semana 3  ✅ CHECKPOINT 3 — Testing final + go-live en casasgroup.es
```

### Opción 2 — 4 semanas

```
Semana 1      Setup + estructura + diseño base
Fin semana 1  ✅ CHECKPOINT 1 — Branding & estructura
Semanas 2–3   Implementación completa: filtros avanzados, vista lista/grid, URL params
Fin semana 3  ✅ CHECKPOINT 2 — Web en staging con datos reales
Semana 4      Ajustes + SEO + GDPR + capacitación
              Configuración DNS casasgroup.es + redirección 301 redcasas.com
Fin semana 4  ✅ CHECKPOINT 3 — Testing final + go-live en casasgroup.es
```

### Opción 3 — 5 semanas

```
Semana 1      Setup + estructura + diseño base
Fin semana 1  ✅ CHECKPOINT 1 — Branding & estructura
Semanas 2–3   Implementación: todo de Opción 2 + mapa interactivo half-map
Fin semana 3  ✅ CHECKPOINT 2 — Web en staging con mapa y datos reales
Semanas 4–5   Ajustes + carga de coordenadas + SEO + GDPR + capacitación
              Configuración DNS casasgroup.es + redirección 301 redcasas.com
Fin semana 5  ✅ CHECKPOINT 3 — Testing final + go-live en casasgroup.es
```

---

## 13. PENDIENTES DEL CLIENTE PARA ARRANCAR

Antes de confirmar y comenzar, el cliente debe proveer o confirmar:

- [ ] **Opción elegida** (1, 2 o 3)
- [ ] **Dominio `casasgroup.es`**: confirmar que el dominio está comprado y acceso al panel DNS (o datos del registrador para gestionar la configuración)
- [ ] **Decisión sobre `redcasas.com`**: ¿se redirige a `casasgroup.es` o se abandona? (ver sección 8 — se recomienda redirección 301)
- [ ] **QR del escaparate**: el cliente debe imprimir un nuevo QR apuntando a `casasgroup.es` antes del go-live
- [ ] **Portales externos**: actualizar el link a la web en Idealista, Fotocasa, Habitaclia tras el go-live (responsabilidad del equipo)
- [ ] **Acceso al WordPress actual** (para revisar contenidos — lo gestiona la hermana de Angie)
- [ ] **Referencias visuales** de webs que le gustan (Angie las había enviado a Andrés en su momento)
- [ ] **Textos actuales** o confirmación de que se reutilizan los de la web actual
- [ ] **Fotos existentes** de inmuebles activos para cargar el Sheets inicial
- [ ] **Capacitación**: confirmar quién del equipo gestiona el Sheets (Lucía era la coordinadora que publicaba)

---

## 14. CONTEXTO DEL PROYECTO GLOBAL (PARA REFERENCIA)

Este proyecto es solo la Fase 1 de un proyecto mayor. El mapa completo:

| Fase | Qué es | Estado |
|---|---|---|
| **Fase 1 — Web** | Nueva web + Google Sheets + Cloudinary | **Este proyecto** |
| **Fase 2 — CRM** | Modernizar el CRM (tecnología, módulos, velocidad) | Propuesta pendiente |
| **Fase 3 — Integración** | Conectar la web directamente al CRM vía API | Depende de Fase 2 |
| **Fase 4 — Módulos avanzados** | App móvil puerta fría, dashboard, portal comunidades | Largo plazo |

El CRM actual corre sobre PHP 7.4 (sin soporte desde noviembre 2022) y MySQL 5.7. No se puede reparar, solo reemplazar. Eso es un proyecto mayor con propuesta separada.

---

*Brief preparado por mazzmkt · Mayo 2026*
*Fuentes: MEETING_1, MEETING_2_MINUTA, MEETING_3_MINUTA, ANALISIS_FINAL, PROPUESTA_WEB_FASE1, presupuestos-web, PROBLEMAS_CONOCIDOS, INTERESES_MAZZMKT*
