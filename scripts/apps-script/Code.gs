/**
 * Red Casas — Webhook Google Sheet → Vercel
 * Fase 1 · Paso 6 (Deploy Hook + Apps Script)
 *
 * Qué hace: cuando alguien edita el Sheet, dispara un rebuild de Vercel vía el
 * Deploy Hook. Vercel relanza el build (scripts/buildData.mjs lee Sheet + Cloudinary)
 * y publica la web actualizada en ~1 minuto. El equipo no toca código.
 *
 * Instalación (una sola vez):
 *   1. En el Sheet: Extensiones → Apps Script.
 *   2. Pegá este archivo (reemplazando lo que haya).
 *   3. Reemplazá WEBHOOK_URL por tu Deploy Hook de Vercel
 *      (Settings → Git → Deploy Hooks → Create Hook).
 *   4. En el editor, elegí la función `instalar` y tocá ▶ Ejecutar una vez.
 *      Google pedirá autorizar permisos la primera vez → aceptá (es tu cuenta
 *      llamando a tu propio webhook).
 *   5. Listo. Editá una celda y en ~1 min la web se actualiza sola.
 *
 * Forzar un rebuild a mano (p. ej. tras reordenar fotos en Cloudinary, que NO
 * edita el Sheet y por lo tanto no dispara el trigger): menú Red Casas → Publicar ahora.
 */

// ⬇️ REEMPLAZAR por tu Deploy Hook de Vercel (Settings → Git → Deploy Hooks).
const WEBHOOK_URL = 'https://api.vercel.com/v1/integrations/deploy/prj_xxxx/yyyy'

// Ventana de espera: agrupa una ráfaga de ediciones en un solo rebuild.
// Cargar las ~22 columnas de un inmueble dispara muchos "onEdit"; sin esto sería
// un build de Vercel por cada celda. Con esto, se espera a que dejes de editar.
const DEBOUNCE_SECONDS = 60

const PENDING_HANDLER = 'dispararRebuild_'

/** Ejecutá esto UNA vez para conectar el trigger "al editar". */
function instalar() {
  limpiarTriggers_('onEditTrigger')
  ScriptApp.newTrigger('onEditTrigger')
    .forSpreadsheet(SpreadsheetApp.getActive())
    .onEdit()
    .create()
  SpreadsheetApp.getActive().toast('Webhook instalado. Editá el Sheet para probar.', 'Red Casas', 5)
}

/** Trigger instalable: cada edición reinicia la ventana de debounce. */
function onEditTrigger() {
  limpiarTriggers_(PENDING_HANDLER)
  ScriptApp.newTrigger(PENDING_HANDLER)
    .timeBased()
    .after(DEBOUNCE_SECONDS * 1000)
    .create()
}

/** Se ejecuta una vez que pasaron DEBOUNCE_SECONDS sin más ediciones. */
function dispararRebuild_() {
  limpiarTriggers_(PENDING_HANDLER)
  enviarWebhook()
}

/** Llama al Deploy Hook de Vercel. También lo usa el menú manual. */
function enviarWebhook() {
  if (!WEBHOOK_URL || WEBHOOK_URL.indexOf('prj_xxxx') !== -1) {
    throw new Error('Falta configurar WEBHOOK_URL con tu Deploy Hook de Vercel.')
  }
  const res = UrlFetchApp.fetch(WEBHOOK_URL, { method: 'post', muteHttpExceptions: true })
  console.log('Deploy Hook → HTTP ' + res.getResponseCode())
}

/** Menú "Red Casas → Publicar ahora" para forzar un rebuild manual. */
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Red Casas')
    .addItem('Publicar ahora (rebuild)', 'enviarWebhook')
    .addToUi()
}

/** Borra los triggers cuyo handler sea el indicado (evita duplicados). */
function limpiarTriggers_(handler) {
  for (const t of ScriptApp.getProjectTriggers()) {
    if (t.getHandlerFunction() === handler) ScriptApp.deleteTrigger(t)
  }
}
