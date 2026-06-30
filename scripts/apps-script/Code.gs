// ─────────────────────────────────────────────────────────────────────────────
// Casas Group — Auto-deploy de la web al editar/borrar filas del Google Sheet.
//
// Qué hace: cualquier cambio en el Sheet (editar, insertar o BORRAR filas) marca
// un "pendiente"; un timer cada minuto espera a que dejes de tocar el Sheet y recién
// ahí dispara el Deploy Hook de Vercel → Vercel reconstruye (lee Sheet + Cloudinary)
// → web actualizada en ~1-2 min. Además un rebuild diario toma fotos nuevas de
// Cloudinary que no tocan el Sheet.
//
// Instalación (una sola vez):
//   1. En el Sheet: Extensiones → Apps Script.
//   2. Pegá este archivo (reemplazando lo que haya).
//   3. Poné tu Deploy Hook real en DEPLOY_HOOK_URL (Vercel → Settings → Git → Deploy Hooks).
//   4. Elegí la función `instalar` en el desplegable y tocá ▶ Ejecutar UNA vez.
//      Autorizá los permisos. Eso crea los 3 triggers automáticamente.
// ─────────────────────────────────────────────────────────────────────────────

// 1) Pegá acá la URL del Deploy Hook de Vercel (Settings → Git → Deploy Hooks).
const DEPLOY_HOOK_URL = 'PEGAR_AQUI_LA_URL';

// 2) Minutos sin tocar el Sheet antes de desplegar (agrupa ediciones en un solo build).
const ESPERA_MINUTOS = 2;

// Texto de relleno: mientras DEPLOY_HOOK_URL valga esto, no se dispara nada.
const PLACEHOLDER = 'PEGAR_AQUI_LA_URL';

// ── Instalación: corré esto UNA vez para crear los 3 triggers ────────────────
function instalar() {
  // Borra triggers previos de estas funciones para no duplicarlos.
  const handlers = ['onChangeHandler', 'checkAndDeploy', 'nightlyDeploy'];
  ScriptApp.getProjectTriggers().forEach(function (t) {
    if (handlers.indexOf(t.getHandlerFunction()) !== -1) ScriptApp.deleteTrigger(t);
  });
  const ss = SpreadsheetApp.getActive();
  // Al cambiar: incluye editar, insertar y BORRAR filas.
  ScriptApp.newTrigger('onChangeHandler').forSpreadsheet(ss).onChange().create();
  // Cada minuto: despliega si el cliente dejó de editar.
  ScriptApp.newTrigger('checkAndDeploy').timeBased().everyMinutes(1).create();
  // Una vez por día (madrugada): rebuild de respaldo para fotos nuevas de Cloudinary.
  ScriptApp.newTrigger('nightlyDeploy').timeBased().everyDays(1).atHour(4).create();
  ss.toast('Auto-deploy instalado (cambios + respaldo diario).', 'Casas Group', 5);
}

// Se ejecuta automáticamente con cada cambio del Sheet (trigger "Al cambiar").
function onChangeHandler() {
  const props = PropertiesService.getScriptProperties();
  props.setProperty('pendiente', 'true');
  props.setProperty('ultimaEdicion', String(Date.now()));
}

// Se ejecuta cada minuto. Despliega solo si dejó de editar hace >= ESPERA_MINUTOS.
function checkAndDeploy() {
  const props = PropertiesService.getScriptProperties();
  if (props.getProperty('pendiente') !== 'true') return;

  const ultima = Number(props.getProperty('ultimaEdicion') || '0');
  const minutosQuieto = (Date.now() - ultima) / 60000;
  if (minutosQuieto < ESPERA_MINUTOS) return; // todavía está editando, esperar

  dispararBuild('edicion del Sheet');
  props.deleteProperty('pendiente');
}

// Se ejecuta una vez por día. Reconstruye sí o sí, para tomar fotos nuevas
// subidas a Cloudinary sin tocar el Sheet.
function nightlyDeploy() {
  dispararBuild('respaldo diario');
}

// Llama al Deploy Hook de Vercel.
function dispararBuild(motivo) {
  if (!DEPLOY_HOOK_URL || DEPLOY_HOOK_URL === PLACEHOLDER) {
    Logger.log('⚠️ Falta configurar DEPLOY_HOOK_URL con tu Deploy Hook real de Vercel.');
    return;
  }
  const res = UrlFetchApp.fetch(DEPLOY_HOOK_URL, {
    method: 'post',
    muteHttpExceptions: true,
  });
  Logger.log('Build disparado (' + motivo + '). HTTP ' + res.getResponseCode());
}

// Menú "Casas Group → Publicar ahora" para forzar un rebuild manual.
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Casas Group')
    .addItem('Publicar ahora (rebuild)', 'publicarAhora')
    .addToUi();
}
function publicarAhora() {
  dispararBuild('manual');
}
