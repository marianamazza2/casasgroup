## Overview
La reunión se centró en alinear la nueva web de Casas Group, definiendo la estructura de navegación, el enfoque visual y el tipo de contenido que debe priorizarse. También se cerraron decisiones prácticas sobre el dominio, los plazos de trabajo, el coste total del proyecto y la forma de pago.

## Estructura y arquitectura de la web
Se debatió cómo organizar los servicios en la navegación superior. Angie explicó que, aunque le gusta una estética minimalista, moderna y limpia, no quiere que la web se vea cargada ni que el usuario tenga dificultades para encontrar lo que busca. Se valoró que poner demasiados servicios visibles en la barra principal puede saturar la experiencia, especialmente en móvil.

Angie detalló los servicios actuales y los cambios previstos:
- Alquileres
- Compra y venta de inmuebles
- Administración de fincas
- Hipotecas
- Cambio de suministros, incluidos luz y seguros
- Reformas, que se eliminaría por ahora porque era un servicio compartido con otra persona y no hay un equipo propio consolidado

También se discutió la posibilidad de mantener algunos servicios visibles en el inicio, pero con una estructura más equilibrada, combinando impacto visual y usabilidad.

## Sección “Nosotros” y humanización de marca
Se acordó que sería positivo incluir una sección tipo “Quiénes somos”, “Nosotros” o similar para dar contexto, historia y valores de la marca. Angie comentó que ya había hablado de este enfoque con Javi y que le interesaba una narrativa más humana, no solo comercial.

El contenido de esta sección se construirá con base en puntos clave que Angie irá aportando, y el resto se podrá desarrollar y completar a partir de esa información.

## Referencias visuales, estilo y branding
Angie compartió una referencia de estilo web que le gusta mucho, con una estructura visual que se sale de lo habitual. El objetivo es trasladar esa idea a Casas Group, pero adaptando colores, tipografías y distribución al sector inmobiliario y a la nueva identidad de la marca.

Se habló del rebranding actual, con una estética basada en blancos, dorados y una línea más elegante y limpia. Se comentó que la web debería mantenerse en una gama clara, evitando un estilo oscuro o demasiado contrastado, para conservar una imagen cálida, moderna y coherente con la marca.

También se revisó la tipografía. Angie indicó que la marca usa una mezcla de dos fuentes, una para títulos y otra para textos, y se pidió que comparta los nombres exactos para ajustar la jerarquía visual y la armonía tipográfica tanto en desktop como en móvil.

## Referencia de contenido e inspiración
Se valoró un sitio de referencia que Angie envió como inspiración por su enfoque más comercial y visual. Aun así, se acordó que la versión final debe adaptarse al negocio inmobiliario y a las necesidades reales de navegación, sin copiar literalmente un estilo demasiado centrado en animaciones o en una presentación excesivamente tecnológica.

El equilibrio buscado es: estética moderna, sensación familiar, funcionalidad clara y una experiencia agradable para el usuario.

## Dominio y presencia digital
Angie confirmó que ya tiene dominio comprado y que la marca está registrada. Se mencionó que el dominio .com de Casas Group está ocupado, por lo que se mantendrá el dominio que ya adquirió, que no es .com.

Se revisó que el dominio principal disponible es coherente con la realidad del negocio, ya que la actividad está enfocada en España y no requiere necesariamente una extensión internacional como .com.

## Funcionalidad comercial y búsquedas de inmuebles
Se revisó la estructura actual de la web, donde existen secciones como “pisos en venta”, “búsquedas” y “nuestros servicios”. Se comentó que “pisos en venta” y “búsquedas” resultan redundantes si no aportan una diferenciación clara.

La propuesta para la nueva web es que el usuario pueda:
- Buscar inmuebles en venta y alquiler
- Filtrar por zona y otros criterios
- Separar claramente la parte de servicios inmobiliarios de la parte de búsqueda de propiedades

Angie también comentó una idea de valoraciones de inmuebles, inspirada en otras plataformas, para que el usuario pueda solicitar una valoración gratuita y que esta sea gestionada por un agente, no solo por una herramienta automática.

## Mapa interactivo y búsqueda tipo Airbnb
Para el mapa interactivo de propiedades se recomienda usar `react-map-gl` junto con `maplibre-gl`.

Esta combinación es suficiente para una experiencia tipo Airbnb en la primera versión: mapa interactivo, zoom, desplazamiento, marcadores de propiedades, control del viewport y actualización de la lista según la zona visible. `maplibre-gl` permite trabajar sin depender obligatoriamente de una cuenta o token de Mapbox, y `react-map-gl` facilita la integración con React.

Dependencias recomendadas:
```bash
npm install react-map-gl maplibre-gl
```

Funcionamiento esperado:
- Al mover o hacer zoom en el mapa, se capturan los límites visibles del mapa mediante eventos como `onMoveEnd`.
- Con esos límites se obtienen coordenadas norte, sur, este y oeste.
- La lista de propiedades se filtra o consulta usando esos límites.
- Los marcadores del mapa y la lista lateral se mantienen sincronizados.
- Al hacer clic en una propiedad de la lista, el mapa puede centrar o resaltar su marcador.
- Al hacer clic en un marcador, se puede destacar la propiedad correspondiente en la lista.

Ejemplo conceptual:
```tsx
onMoveEnd={(event) => {
  const bounds = event.target.getBounds()
  // Usar bounds para actualizar la busqueda de propiedades visibles
}}
```

Para que el comportamiento sea realmente como Airbnb no basta solo con instalar la librería: las propiedades deberán tener latitud y longitud, y la búsqueda deberá aceptar filtros por límites geográficos. En una primera fase se puede hacer el filtrado en frontend si el volumen de propiedades es bajo; si el catálogo crece, conviene resolverlo desde backend o CMS con una consulta geoespacial.

## Gestión de imágenes con Cloudinary
Para la gestión de imágenes de propiedades se recomienda usar Cloudinary como CDN y gestor de assets. En el código conviene separar dos responsabilidades: entrega de imágenes en la web y subida/gestión de imágenes.

Dependencias recomendadas para React:
```bash
npm install @cloudinary/react @cloudinary/url-gen
```

Configuración pública en entorno:
```bash
VITE_CLOUDINARY_CLOUD_NAME=tu_cloud_name
```

El `cloud_name` puede usarse en frontend. No se debe exponer nunca `api_secret` en React/Vite. Si más adelante se necesita subida firmada desde un panel de administración, la firma debe generarse desde backend o desde un endpoint seguro.

Estructura recomendada en código:
- Crear un helper tipo `src/lib/cloudinary.ts` para inicializar Cloudinary.
- Guardar en cada propiedad los `public_id` de Cloudinary, no URLs largas.
- Generar las URLs o componentes de imagen desde el frontend aplicando transformaciones.
- Usar transformaciones como `format('auto')`, `quality('auto')` y recortes/tamaños según cada card, galería o hero.

Ejemplo conceptual de propiedad:
```ts
{
  id: 'piso-salamanca-1',
  title: 'Piso en Salamanca',
  images: [
    'casasgroup/properties/piso-salamanca-1/cover',
    'casasgroup/properties/piso-salamanca-1/salon',
  ],
}
```

Ejemplo conceptual de renderizado:
```tsx
const image = cld
  .image(publicId)
  .resize(fill().width(900).height(650))
  .delivery(format('auto'))
  .delivery(quality('auto'))
```

Para la primera versión, si las propiedades se gestionan manualmente, se pueden subir las imágenes directamente desde el dashboard de Cloudinary y guardar los `public_id` en los datos de propiedades. Si se desarrolla un panel admin propio, entonces se debe implementar subida firmada o configurar cuidadosamente un unsigned upload preset con restricciones de carpeta, tipo de archivo y tamaño.

## Home y experiencia de usuario
Se propuso una Home más comercial y visual, pero sin perder accesibilidad. La idea final quedó orientada a un punto intermedio: mostrar arriba accesos como comprar, vender y alquilar, y desarrollar esa información también a medida que el usuario baja por la página.

Se insistió en que la Home no debe estar sobrecargada, especialmente pensando en dispositivos móviles, donde listar demasiadas opciones una debajo de otra puede perjudicar la lectura y la interacción.

## Plan de trabajo y tiempos
Se explicó una planificación por semanas que servirá como base de trabajo, aunque se espera que el proyecto avance más rápido si el contenido se va definiendo a tiempo. El enfoque acordado fue:
- Semana 1: branding y estructura
- Semana 2: web implementada con datos reales
- Semana 3: implementación del mapa interactivo
- Semana 4: posible revisión final, solo si hiciera falta

Antes de implementar, se acordó preparar diseños previos, al menos de la Home, para validar la estética, los colores y la organización general.

## Próximos pasos de contenido
Angie deberá enviar:
- Los nombres exactos de las dos tipografías
- Los colores de marca o referencias visuales más precisas
- Ideas o puntos clave para la sección “Nosotros”
- Cualquier contenido adicional que quiera destacar

A partir de eso, se prepararán propuestas visuales y una estructura base para validación antes de comenzar el desarrollo técnico.

## Coste y forma de pago
Se confirmó que el proyecto corresponde a la propuesta 3, con un coste total de 1.900 €. El pago se dividirá en dos partes:
- 950 € de anticipo para comenzar
- 950 € al finalizar

Angie pidió no emitir factura, y se aceptó esa condición. Al cierre de la reunión, indicó que realizaría el pago del anticipo de inmediato.
