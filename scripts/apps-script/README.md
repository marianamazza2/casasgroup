# Apps Script — Webhook Sheet → Vercel (Fase 1, Paso 6)

`Code.gs` es el script que va pegado dentro del Google Sheet (**Extensiones → Apps Script**).
No corre en este repo: vive en el Sheet. Se versiona acá para tener una copia canónica.

## Qué hace

Edición en el Sheet → llama al **Deploy Hook** de Vercel → Vercel relanza el build
(`npm run build`, que corre `scripts/buildData.mjs`) → web actualizada en ~1 min.

## Mejoras sobre la versión simple de la propuesta

- **Debounce (`DEBOUNCE_SECONDS = 60`):** agrupa una ráfaga de ediciones en un solo
  rebuild. Sin esto, cargar las 22 columnas de un inmueble dispararía ~22 builds en
  Vercel (gasta build-minutes del free tier).
- **Menú `Casas Group → Publicar ahora`:** fuerza un rebuild a mano. Útil cuando
  reordenás/cambiás fotos en Cloudinary, que **no** edita el Sheet y por lo tanto no
  dispara el trigger automático.

## Validación de coordenadas

El mismo archivo valida `lat`/`lng` mientras se escriben (trigger simple `onEdit`,
no hace falta instalarlo):

- Fuera del área de trabajo (lat 40.4–42.9, lng 0.1–3.4) → celda **roja** + nota
  explicando el problema y, si se puede deducir, el valor probable.
- **lat y lng invertidos** o **punto decimal corrido** con una única lectura
  posible → los corrige y deja la celda **ámbar** con una nota de qué cambió.
  Si hay más de una lectura posible, no adivina: marca en rojo y ofrece las opciones.
- La coordenada se trata como **par**: si una mitad no tiene arreglo claro, no se
  toca ninguna de las dos.
- Menú **Casas Group → Revisar coordenadas de todas las filas** para repasar lo ya cargado.

Poné `AUTOCORREGIR = false` si preferís que solo marque y nunca modifique datos.
El rango vive en `COORD_AMBITO` y debe coincidir con `AMBITO` en `scripts/buildData.mjs`.

## Instalación

1. Vercel: **Settings → Git → Deploy Hooks → Create Hook** (branch de producción) → copiá la URL.
2. Sheet: **Extensiones → Apps Script** → pegá `Code.gs`.
3. Reemplazá `WEBHOOK_URL` por la URL del paso 1.
4. Elegí la función `instalar` en el editor y tocá ▶ una vez (autorizá los permisos).

Pasos detallados (con env vars de Vercel y la prueba end-to-end): ver
`GUIA_PROBAR_FLOW.md`, Parte E.
