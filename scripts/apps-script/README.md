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
- **Menú `Red Casas → Publicar ahora`:** fuerza un rebuild a mano. Útil cuando
  reordenás/cambiás fotos en Cloudinary, que **no** edita el Sheet y por lo tanto no
  dispara el trigger automático.

## Instalación

1. Vercel: **Settings → Git → Deploy Hooks → Create Hook** (branch de producción) → copiá la URL.
2. Sheet: **Extensiones → Apps Script** → pegá `Code.gs`.
3. Reemplazá `WEBHOOK_URL` por la URL del paso 1.
4. Elegí la función `instalar` en el editor y tocá ▶ una vez (autorizá los permisos).

Pasos detallados (con env vars de Vercel y la prueba end-to-end): ver
`GUIA_PROBAR_FLOW.md`, Parte E.
