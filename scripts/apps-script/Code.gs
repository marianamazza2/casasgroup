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

// Además valida las coordenadas (lat/lng) a medida que se escriben: marca la celda,
// explica el error en una nota y corrige sola los casos inequívocos. Ver el bloque
// "Validación de coordenadas" más abajo.
//
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
    .addItem('Revisar coordenadas de todas las filas', 'revisarCoordenadas')
    .addToUi();
}
function publicarAhora() {
  dispararBuild('manual');
}

// ─────────────────────────────────────────────────────────────────────────────
// Validación de coordenadas
//
// Las columnas `lat` y `lng` se cargan a mano y llegan con tres errores típicos:
//   1. Punto decimal corrido:  413.894  en vez de  41.3894
//   2. lat y lng invertidos:   lat 2.1118 / lng 41.3894
//   3. Coma decimal como texto: "41,3894" (según el idioma del Sheet)
// Una coordenada corrupta no rompe la web (el build la descarta, ver
// `validCoords` en scripts/buildData.mjs), pero el inmueble se publica sin mapa
// y nadie se entera hasta que alguien mira el log del build. Esto lo detecta en
// el momento, sobre la celda, que es donde el que carga los datos lo va a ver.
//
// ⚠️ Este rango debe coincidir con `AMBITO` en scripts/buildData.mjs.
// ─────────────────────────────────────────────────────────────────────────────

const COORD_AMBITO = { latMin: 40.4, latMax: 42.9, lngMin: 0.1, lngMax: 3.4 };

// true  = corrige sola los casos inequívocos (invertidas, punto corrido con una
//         única lectura posible) y deja la celda en ámbar avisando qué cambió.
// false = nunca toca el dato, solo marca en rojo y explica en la nota.
const AUTOCORREGIR = true;

const COORD_COLOR_ERROR = '#f4c7c3';     // rojo suave: hay que tocarlo a mano
const COORD_COLOR_CORREGIDO = '#fce8b2'; // ámbar: lo corrigió el script

// Trigger simple: corre solo con cada edición, no hace falta instalarlo.
function onEdit(e) {
  if (!e || !e.range) return;
  validarCoordsEnRango(e.range);
}

// Menú → revisa la planilla entera (útil para los datos ya cargados).
function revisarCoordenadas() {
  const hoja = SpreadsheetApp.getActiveSheet();
  const ultima = hoja.getLastRow();
  if (ultima < 2) return;
  const resumen = validarCoordsEnRango(hoja.getRange(2, 1, ultima - 1, hoja.getLastColumn()));
  SpreadsheetApp.getActive().toast(
    resumen.errores + ' con error · ' + resumen.corregidas + ' corregidas · ' + resumen.ok + ' correctas',
    'Coordenadas',
    8
  );
}

// Devuelve las columnas lat/lng por nombre de cabecera (no por posición fija:
// si mañana se reordenan las columnas del Sheet, esto sigue funcionando).
function columnasCoords(hoja) {
  const cabeceras = hoja.getRange(1, 1, 1, hoja.getLastColumn()).getValues()[0];
  const cols = { lat: -1, lng: -1 };
  for (var i = 0; i < cabeceras.length; i++) {
    const h = String(cabeceras[i]).trim().toLowerCase();
    if (h === 'lat') cols.lat = i + 1;
    if (h === 'lng') cols.lng = i + 1;
  }
  return cols;
}

function validarCoordsEnRango(rango) {
  const resumen = { errores: 0, corregidas: 0, ok: 0 };
  const hoja = rango.getSheet();
  const cols = columnasCoords(hoja);
  if (cols.lat === -1 || cols.lng === -1) return resumen;

  // Si la edición no tocó ninguna de las dos columnas, no hay nada que revisar.
  const desde = rango.getColumn();
  const hasta = desde + rango.getNumColumns() - 1;
  const tocaLat = desde <= cols.lat && cols.lat <= hasta;
  const tocaLng = desde <= cols.lng && cols.lng <= hasta;
  if (!tocaLat && !tocaLng) return resumen;

  const primera = Math.max(2, rango.getRow()); // la fila 1 es la cabecera
  const ultima = rango.getRow() + rango.getNumRows() - 1;
  for (var fila = primera; fila <= ultima; fila++) {
    const estado = validarCoordsFila(hoja, fila, cols);
    if (estado === 'error') resumen.errores++;
    else if (estado === 'corregida') resumen.corregidas++;
    else if (estado === 'ok') resumen.ok++;
  }
  return resumen;
}

function validarCoordsFila(hoja, fila, cols) {
  const celdaLat = hoja.getRange(fila, cols.lat);
  const celdaLng = hoja.getRange(fila, cols.lng);
  const lat = aNumeroCoord(celdaLat.getValue());
  const lng = aNumeroCoord(celdaLng.getValue());

  limpiarMarcaCoord(celdaLat);
  limpiarMarcaCoord(celdaLng);

  // Sin coordenadas: es válido. El inmueble se publica sin mapa, no es un error.
  if (lat === null && lng === null) return 'vacia';

  if (lat === null || lng === null) {
    const falta = lat === null ? celdaLat : celdaLng;
    marcarCoord(falta, COORD_COLOR_ERROR, 'Falta la otra mitad de la coordenada: hacen falta lat y lng, o ninguna de las dos.');
    return 'error';
  }

  if (dentroAmbitoCoord(lat, lng)) {
    // El valor puede haber venido como texto con coma ("41,3894"): lo dejamos
    // como número para que el CSV salga limpio.
    if (typeof celdaLat.getValue() === 'string') celdaLat.setValue(lat);
    if (typeof celdaLng.getValue() === 'string') celdaLng.setValue(lng);
    return 'ok';
  }

  const a = COORD_AMBITO;

  // Caso 1: invertidas. Es inequívoco (cada valor cae justo en el rango del otro).
  if (entre(lng, a.latMin, a.latMax) && entre(lat, a.lngMin, a.lngMax)) {
    if (AUTOCORREGIR) {
      celdaLat.setValue(lng);
      celdaLng.setValue(lat);
      marcarCoord(celdaLat, COORD_COLOR_CORREGIDO, 'Estaban invertidas: se cambió lat por lng automáticamente. Verificá el punto en el mapa.');
      marcarCoord(celdaLng, COORD_COLOR_CORREGIDO, 'Estaban invertidas: se cambió lng por lat automáticamente. Verificá el punto en el mapa.');
      return 'corregida';
    }
    marcarCoord(celdaLat, COORD_COLOR_ERROR, 'lat y lng parecen invertidos. Debería ser lat=' + lng + ' y lng=' + lat + '.');
    marcarCoord(celdaLng, COORD_COLOR_ERROR, 'lat y lng parecen invertidos. Debería ser lat=' + lng + ' y lng=' + lat + '.');
    return 'error';
  }

  // Caso 2: punto decimal corrido. La coordenada es un PAR: si una de las dos
  // mitades no tiene arreglo claro, no se toca ninguna. Corregir media coordenada
  // deja un punto que parece válido y apunta a cualquier lado, que es peor que
  // dejarlo roto a la vista.
  const propLat = proponerCoord(lat, a.latMin, a.latMax);
  const propLng = proponerCoord(lng, a.lngMin, a.lngMax);

  if (AUTOCORREGIR && propLat.estado !== 'dudoso' && propLng.estado !== 'dudoso') {
    if (propLat.estado === 'corregible') {
      celdaLat.setValue(propLat.valor);
      marcarCoord(celdaLat, COORD_COLOR_CORREGIDO, 'El punto decimal estaba corrido: ' + lat + ' → ' + propLat.valor + '. Verificá el punto en el mapa.');
    }
    if (propLng.estado === 'corregible') {
      celdaLng.setValue(propLng.valor);
      marcarCoord(celdaLng, COORD_COLOR_CORREGIDO, 'El punto decimal estaba corrido: ' + lng + ' → ' + propLng.valor + '. Verificá el punto en el mapa.');
    }
    return 'corregida';
  }

  if (propLat.estado !== 'ok') marcarCoord(celdaLat, COORD_COLOR_ERROR, notaCoord('latitud', lat, propLat, a.latMin, a.latMax));
  if (propLng.estado !== 'ok') marcarCoord(celdaLng, COORD_COLOR_ERROR, notaCoord('longitud', lng, propLng, a.lngMin, a.lngMax));
  return 'error';
}

// Prueba correr el punto decimal (÷10, ×10, ÷100…) buscando lecturas que caigan
// dentro del ámbito, de la más chica a la más grande. Con una sola lectura posible
// es seguro corregir; con varias, adivinar sería peor que avisar y ofrecerlas.
function proponerCoord(valor, min, max) {
  if (entre(valor, min, max)) return { estado: 'ok' };
  const candidatos = [];
  for (var k = 1; k <= 6; k++) {
    const div = valor / Math.pow(10, k);
    const mul = valor * Math.pow(10, k);
    if (entre(div, min, max)) candidatos.push(redondearCoord(div));
    if (entre(mul, min, max)) candidatos.push(redondearCoord(mul));
  }
  if (candidatos.length === 1) return { estado: 'corregible', valor: candidatos[0] };
  return { estado: 'dudoso', candidatos: candidatos };
}

function notaCoord(nombre, valor, propuesta, min, max) {
  if (propuesta.estado === 'ok') return '';
  const base = 'La ' + nombre + ' ' + valor + ' está fuera del área de trabajo (debe estar entre ' + min + ' y ' + max + '). ';
  if (propuesta.estado === 'corregible') return base + 'Probablemente sea ' + propuesta.valor + '.';
  if (propuesta.candidatos.length > 1) return base + 'Puede ser ' + propuesta.candidatos.join(' o ') + ': revisá en el mapa cuál corresponde.';
  return base + 'Copiala de Google Maps: click derecho sobre el punto → el primer número es lat, el segundo lng.';
}

// Correr el punto decimal arrastra basura binaria (41.38940000000001): la
// coordenada no necesita más de 6 decimales (~10 cm).
function redondearCoord(v) {
  return Math.round(v * 1000000) / 1000000;
}

function entre(v, min, max) {
  return v >= min && v <= max;
}

function dentroAmbitoCoord(lat, lng) {
  const a = COORD_AMBITO;
  return entre(lat, a.latMin, a.latMax) && entre(lng, a.lngMin, a.lngMax);
}

// Acepta número o texto, con coma o punto decimal. '' / null → null (sin dato).
function aNumeroCoord(valor) {
  if (valor === null || valor === undefined || valor === '') return null;
  if (typeof valor === 'number') return isNaN(valor) ? null : valor;
  const n = parseFloat(String(valor).trim().replace(',', '.'));
  return isNaN(n) ? null : n;
}

function marcarCoord(celda, color, nota) {
  celda.setBackground(color);
  celda.setNote(nota);
}

function limpiarMarcaCoord(celda) {
  // Solo limpia las marcas que pone este script (colores propios), para no
  // pisar el formato que alguien haya puesto a mano en la planilla.
  const fondo = celda.getBackground();
  if (fondo === COORD_COLOR_ERROR || fondo === COORD_COLOR_CORREGIDO) celda.setBackground(null);
  celda.clearNote();
}
