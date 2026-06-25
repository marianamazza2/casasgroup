# GUÍA — Cómo probar el flow completo (Fase 1)

> **Objetivo:** que vos, actuando como el cliente, puedas editar un Google Sheet
> y subir fotos a Cloudinary, y que la web se actualice **sola** en ~1 minuto, sin
> tocar código.
>
> Esta guía es **paso a paso**, en orden. Hacé los pasos tal cual están — cada uno
> depende del anterior. Tiempo total estimado la primera vez: **~45–60 min**.

---

## Mapa mental (qué hace cada pieza)

```
   VOS editás                       Se dispara solo                  El visitante ve
┌──────────────┐   webhook   ┌──────────────────────┐   build    ┌──────────────┐
│ Google Sheet │ ─────────►  │  Vercel reconstruye  │ ─────────► │  Web nueva   │
│  (datos)     │             │  - lee el Sheet      │            │  actualizada │
│ + Cloudinary │             │  - lee Cloudinary    │            │  (~1 min)    │
│  (fotos)     │             │  - genera los datos  │            │              │
└──────────────┘             └──────────────────────┘            └──────────────┘
```

- **Google Sheet** = los datos del piso (precio, habitaciones, zona…). Una fila por inmueble.
- **Cloudinary** = las fotos. Una carpeta por inmueble.
- **El script `buildData.mjs`** (ya está en el repo) baja todo eso y genera `src/lib/generatedProperties.ts`.
- **La bandera `VITE_DATA_SOURCE`** decide si la web muestra los datos del Sheet o los de prueba (hardcodeados).

> 🔑 **Regla de oro:** el nombre de la carpeta en Cloudinary debe coincidir
> **exactamente** con la columna `ref_fotos` del Sheet. Es lo único que une fotos ↔ datos.

---

## Requisitos previos

- Node.js 18+ instalado (`node --version`).
- El repo clonado y `npm install` ya corrido.
- Una cuenta de Google (para el Sheet).
- Una cuenta de Vercel con el proyecto ya desplegado (para el flow automático, Parte E).

---

# PARTE A — Cloudinary (las fotos)

### A.1 — Crear la cuenta (una sola vez)

1. Entrá a **https://cloudinary.com/users/register_free** y registrate (plan gratuito).
2. Al entrar, en el **Dashboard** vas a ver tres datos. Anotalos:
   - **Cloud name** (ej. `redcasas`) → es **público**.
   - **API Key** → secreto.
   - **API Secret** (clic en "Reveal") → secreto.

### A.2 — Crear la estructura de carpetas

1. En el menú lateral entrá a **Media Library**.
2. Creá una carpeta llamada **`inmuebles`** (en minúscula, exactamente así).
   > El script busca todo dentro de `inmuebles/`. Si la llamás distinto, no encuentra nada.
3. Dentro de `inmuebles/`, creá una carpeta por cada piso. Para la prueba, creá una llamada **`rc-001`**.

```
📁 inmuebles/
  📁 rc-001/        ← este nombre va en la columna ref_fotos del Sheet
```

### A.3 — Subir las fotos

1. Entrá a la carpeta `rc-001/` y arrastrá 3–6 fotos.
2. **Renombralas** para que empiecen con número de dos dígitos. El orden manda:

```
📁 rc-001/
  🖼️  01-salon.jpg       ← portada (la que sale en la tarjeta del listado)
  🖼️  02-cocina.jpg      ← galería de la ficha, en este orden
  🖼️  03-dormitorio.jpg
  🖼️  04-bano.jpg
```

   - **Obligatorio:** el número al principio (`01-`, `02-`…). Define el orden.
   - **Opcional:** el texto después del guión (`salon`, `cocina`) — solo para que vos identifiques la foto.
   - `01-` siempre es la **portada**.

> ✅ Checkpoint A: tenés una cuenta de Cloudinary, la carpeta `inmuebles/rc-001/`
> con fotos numeradas, y anotados tu **cloud name + API key + API secret**.

---

# PARTE B — Google Sheet (los datos)

### B.1 — Crear el Sheet con las columnas exactas

1. Andá a **https://sheets.google.com** y creá una planilla nueva. Llamala, p. ej., `Red Casas — Inmuebles`.
2. En la **fila 1**, pegá estos encabezados **tal cual** (sin acentos, en minúscula, una por columna):

```
ref	publicado	operacion	tipo	estado	etiqueta	precio	direccion	zona	ciudad	habitaciones	banos	superficie_m2	planta	ascensor	terraza	garaje	trastero	certificado_energetico	descripcion_corta	descripcion_larga	ref_fotos	lat	lng
```

   > ⚠️ Los nombres importan: el script busca las columnas **por nombre**. Si escribís
   > `baños` en vez de `banos`, esa columna se ignora. Copiá/pegá la línea de arriba.
   >
   > `lat` y `lng` son **opcionales** — solo hacen falta si querés que el inmueble
   > aparezca en el mapa (Opción 3). Sin ellas, todo lo demás funciona igual.

### B.2 — Cargar el inmueble de prueba

En la **fila 2**, cargá un piso de ejemplo. Tabla de referencia de cada columna:

| Columna | Qué poner | Ejemplo |
|---|---|---|
| `ref` | ID único, no se repite nunca | `RC-001` |
| `publicado` | `SI` para que aparezca, `NO` para ocultarlo | `SI` |
| `operacion` | `VENTA` o `ALQUILER` | `VENTA` |
| `tipo` | `PISO` / `DUPLEX` / `CHALET` / `LOCAL` / `PARKING` | `PISO` |
| `estado` | `EN VENTA` / `RESERVADO` / `VENDIDO` / `ALQUILADO` | `EN VENTA` |
| `etiqueta` | `DESTACADO` / `OPORTUNIDAD` / `REBAJADO` o vacío | `DESTACADO` |
| `precio` | Solo el número, sin € ni puntos | `320000` |
| `direccion` | Texto libre | `C/ Verdi 18, 2º 1ª` |
| `zona` | Barrio (alimenta el filtro de zona) | `Gràcia` |
| `ciudad` | Texto | `Barcelona` |
| `habitaciones` | Número | `3` |
| `banos` | Número | `2` |
| `superficie_m2` | Solo el número | `90` |
| `planta` | Texto (`Bajo`, `Ático`, `2ª`…) | `2ª` |
| `ascensor` | `SI` / `NO` | `SI` |
| `terraza` | `SI` / `NO` | `NO` |
| `garaje` | `SI` / `NO` | `NO` |
| `trastero` | `SI` / `NO` | `SI` |
| `certificado_energetico` | `A`…`G` | `C` |
| `descripcion_corta` | Máx. ~150 caracteres (tarjeta del listado) | `Piso luminoso reformado en Gràcia` |
| `descripcion_larga` | Texto libre (ficha individual) | `Precioso piso en pleno corazón de Gràcia…` |
| `ref_fotos` | **Debe ser igual al nombre de la carpeta en Cloudinary** | `rc-001` |
| `lat` | Latitud (opcional, para el mapa) | `41.4036` |
| `lng` | Longitud (opcional, para el mapa) | `2.1588` |

> 🔑 Lo más crítico: `ref_fotos` (`rc-001`) = nombre de la carpeta en Cloudinary (`rc-001`).
>
> 💡 Para `lat`/`lng`: en Google Maps, clic derecho sobre el punto → "copiar coordenadas".

### B.3 — Publicar el Sheet como CSV y copiar la URL

1. En el Sheet: **Archivo → Compartir → Publicar en la web**.
2. En el diálogo:
   - Primer desplegable: elegí **la hoja específica** (no "Documento completo").
   - Segundo desplegable: elegí **Valores separados por comas (.csv)**.
3. Clic en **Publicar** → confirmá.
4. Se genera una **URL** que termina en `output=csv`. **Copiala** — es tu `SHEET_CSV_URL`.

```
https://docs.google.com/spreadsheets/d/e/2PACX-xxxxxxxx/pub?gid=0&single=true&output=csv
```

> ✅ Checkpoint B: tenés el Sheet con la fila de prueba y la **URL CSV publicada**.

---

# PARTE C — Conectar las credenciales (local)

Editá el archivo **`.env.local`** en la raíz del proyecto y completá los valores
que anotaste en las Partes A y B:

```bash
# Cloudinary
VITE_CLOUDINARY_CLOUD_NAME=tu-cloud-name      # ej. redcasas  (público)
CLOUDINARY_API_KEY=123456789012345            # solo build, no llega al cliente
CLOUDINARY_API_SECRET=tu-api-secret           # solo build, no llega al cliente

# Google Sheets
SHEET_CSV_URL=https://docs.google.com/.../pub?...&output=csv

# Fuente de datos: dejala en 'hardcoded' por ahora; la cambiamos en la Parte D
VITE_DATA_SOURCE=hardcoded
```

> 🔒 `.env.local` está en `.gitignore`: tus claves **no** se suben al repo. Tranquila.

---

# PARTE D — Probar en LOCAL (Nivel 1: sin webhook todavía)

Acá comprobamos que el script lee bien el Sheet + Cloudinary, antes de automatizar nada.

### D.1 — Generar los datos desde el Sheet

```bash
npm run data
```

Esto corre `scripts/buildData.mjs`. Si todo está bien, vas a ver algo como:

```
▶ buildData: generando datos de inmuebles…
  1 filas · 1 publicadas
✔ generatedProperties.ts escrito (1 inmuebles).
```

- Si dice **`0 inmuebles`** → revisá que `publicado` sea exactamente `SI`.
- Si dice **`Cloudinary 401`** → revisá API key/secret.
- Si dice **`No se pudo leer el Sheet`** → revisá la URL CSV (que termine en `output=csv`).

### D.2 — Activar la fuente "sheet"

En `.env.local`, cambiá la bandera:

```bash
VITE_DATA_SOURCE=sheet
```

### D.3 — Levantar la web y mirar

```bash
npm run dev
```

Abrí el navegador en la URL que muestra (normalmente `http://localhost:5173`).
Deberías ver **tu piso de prueba** (RC-001) en el listado, con su foto de portada
(`01-`), y al entrar a la ficha, la galería completa.

> 🛟 **Salvaguarda:** si `generatedProperties.ts` está vacío (porque no corriste
> `npm run data` o el Sheet falló), la web **no se rompe**: muestra los datos de
> prueba hardcodeados y avisa por consola. Así nunca queda en blanco.

> ✅ Checkpoint D: ves tu inmueble real del Sheet en la web local. El pipeline funciona.

---

# PARTE E — Hacerlo AUTOMÁTICO (Nivel 2: webhook en producción)

Hasta acá probaste a mano. Ahora conectamos todo para que se actualice solo.
Esto se hace **una sola vez**.

### E.1 — Cargar las env vars en Vercel

1. En Vercel: tu proyecto → **Settings → Environment Variables**.
2. Agregá las mismas variables que en `.env.local`, para los entornos
   **Production, Preview y Development**:

| Variable | Valor |
|---|---|
| `VITE_CLOUDINARY_CLOUD_NAME` | tu cloud name |
| `CLOUDINARY_API_KEY` | tu api key |
| `CLOUDINARY_API_SECRET` | tu api secret |
| `SHEET_CSV_URL` | tu URL CSV |
| `VITE_DATA_SOURCE` | `sheet` |

3. **Redesplegá** una vez (Deployments → último deploy → Redeploy) para que tome las variables.

> El `build` del repo ya corre `buildData.mjs` automáticamente antes de compilar
> (`npm run build` = `node scripts/buildData.mjs && tsc -b && vite build`), así que
> Vercel regenera los datos en cada deploy sin que hagas nada.

### E.2 — Crear el Deploy Hook en Vercel

1. En Vercel: tu proyecto → **Settings → Git → Deploy Hooks**.
2. **Create Hook**:
   - Nombre: `sheet-update`
   - Branch: `main` (o la que uses para producción)
3. Vercel genera una **URL** tipo:
   ```
   https://api.vercel.com/v1/integrations/deploy/prj_xxxx/yyyy
   ```
   **Copiala.** Es la que dispara el rebuild.

### E.3 — Pegar el script en el Google Sheet (Apps Script)

1. En el Sheet: **Extensiones → Apps Script**.
2. Borrá lo que haya y pegá esto (reemplazá la URL por la del paso E.2):

```javascript
function enviarWebhook() {
  const WEBHOOK_URL = "https://api.vercel.com/v1/integrations/deploy/prj_xxxx/yyyy"; // ← tu Deploy Hook
  UrlFetchApp.fetch(WEBHOOK_URL, { method: "post" });
}
```

3. Guardá (ícono de disquete).

### E.4 — Crear el disparador (trigger)

1. En Apps Script, menú izquierdo → **Activadores** (ícono de reloj ⏰).
2. **+ Agregar activador**, con esta configuración:
   - Función: `enviarWebhook`
   - Implementación: `Head`
   - Origen del evento: **Desde la hoja de cálculo**
   - Tipo de evento: **Al editar**
3. Guardá. Google te va a pedir **autorizar permisos** la primera vez → aceptá
   (es tu propia cuenta llamando a tu propio webhook).

> ✅ Checkpoint E: env vars en Vercel, Deploy Hook creado, Apps Script con trigger "al editar".

---

# PARTE F — Probar el flow completo (la prueba final)

Ahora actuás como el cliente. **No vas a tocar código.**

1. Abrí el **Google Sheet**.
2. Cambiá algo visible. Por ejemplo, editá el `precio` de RC-001 de `320000` a `315000`.
   - (O agregá una fila nueva con otro inmueble + su carpeta en Cloudinary.)
3. **Esperá ~1 minuto.** Por detrás pasó esto solo:
   - El trigger detectó la edición → llamó al Deploy Hook.
   - Vercel relanzó el build → `buildData.mjs` bajó el Sheet + Cloudinary de nuevo.
   - Se publicó la web con el dato nuevo.
4. Recargá la web de producción (o el staging `*.vercel.app`).
   **El precio nuevo (315.000 €) ya está ahí.**

🎉 Si ves el cambio reflejado sin haber tocado nada de código, **el flow completo funciona.**

---

## Operaciones del día a día (para el equipo)

| Quiero… | Hacé esto en el Sheet | Resultado |
|---|---|---|
| Publicar un piso nuevo | Crear carpeta en Cloudinary + agregar fila (con `ref_fotos` = carpeta) | Aparece en ~1 min |
| Ocultar un piso | Cambiar `publicado` a `NO` | Desaparece de la web |
| Marcarlo vendido | Cambiar `estado` a `VENDIDO` | Sale con badge "Vendido" |
| Cambiar el precio | Editar la celda `precio` | Se actualiza en ~1 min |
| Cambiar la foto de portada | Renombrar la foto deseada a `01-…` en Cloudinary | Nueva portada en el próximo deploy |

> ⚠️ Cambiar **solo fotos en Cloudinary** no dispara el webhook (el trigger es sobre el
> Sheet). Truco: tras reordenar fotos, hacé una micro-edición en el Sheet (o usá el
> Deploy Hook a mano) para forzar el rebuild.

---

## Resolución de problemas

| Síntoma | Causa probable | Solución |
|---|---|---|
| La web muestra los pisos de prueba, no los míos | `VITE_DATA_SOURCE` no es `sheet`, o `generatedProperties.ts` quedó vacío | Poné `VITE_DATA_SOURCE=sheet` y corré `npm run data`; revisá la consola |
| `npm run data` dice `0 inmuebles` | `publicado` no es exactamente `SI` | Escribí `SI` en mayúscula, sin espacios |
| El piso aparece sin fotos | `ref_fotos` ≠ nombre de carpeta en Cloudinary | Que coincidan exactamente (minúsculas incluidas) |
| `Cloudinary 401` / `403` | API key/secret mal | Recopiá del Dashboard de Cloudinary |
| `No se pudo leer el Sheet` | URL CSV mal o Sheet no publicado | Republicá como `.csv`; la URL termina en `output=csv` |
| Edito el Sheet y no pasa nada | Falta el trigger o el Deploy Hook | Revisá Parte E.2–E.4; mirá "Ejecuciones" en Apps Script |
| Las columnas se ignoran | Encabezados con acentos o mal escritos | Copiá la fila de encabezados de B.1 tal cual |

---

## Resumen de comandos

```bash
npm run data     # baja Sheet + Cloudinary y regenera generatedProperties.ts
npm run dev      # levanta la web en local
npm run build    # corre data + compila (lo que hace Vercel en cada deploy)
```

---

*Cuando en Fase 2 esté la API del CRM, solo se reemplaza la fuente de datos: el
diseño, los filtros y las páginas quedan igual. Esta guía deja de usar el Sheet,
pero el equipo no aprende ninguna web nueva.*
