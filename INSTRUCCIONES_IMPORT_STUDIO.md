# JS NEXO — Import Studio

## Instalación

1. Haz una copia de seguridad de tu proyecto actual y exporta un respaldo JSON desde el panel de administración.
2. Extrae el ZIP y sube **el contenido de la carpeta** a la raíz del repositorio GitHub de JS NEXO. Conserva la estructura de carpetas; no sustituyas los datos publicados de Netlify Blobs.
3. Espera a que Netlify despliegue la nueva versión.
4. Inicia sesión en `https://TU-SITIO.netlify.app/admin/`.
5. Abre `https://TU-SITIO.netlify.app/admin/importador/`.

## Uso

1. Prepara un JSON con la clave `productos`, según `public/admin/importador/ejemplo-productos.json`.
2. Selecciona el JSON y todas las imágenes referenciadas en `archivo` (nombres exactos, incluyendo extensión).
3. Pulsa **Preparar vista previa** y revisa nombres y descripciones.
4. Pulsa **Publicar nuevos productos** una sola vez.
5. Abre la tienda y comprueba los nuevos productos.

**Los productos existentes se consultan desde el servidor justo antes de publicar y se conservan con sus precios actuales.** No se envía un catálogo de ejemplo que pueda sobrescribir tus cambios.

**Límites:** máximo 150 productos en el catálogo completo. Imágenes JPG, PNG o WebP. Las fotografías se comprimen en el navegador. El sistema detecta nombres duplicados, pero no equivalencias semánticas entre nombres distintos. Las fotos subidas antes de un fallo de publicación podrían quedar huérfanas.

**Seguridad:** el importador utiliza la sesión HttpOnly del panel existente y las mismas funciones protegidas. No contiene contraseñas ni tokens. No hace llamadas a una IA externa; los nombres y descripciones los prepara ChatGPT al crear el archivo JSON a partir de las fotos que envíes.

**Importante:** `precio` y `existencias` pueden ser `null` para dejar esos campos pendientes. Los productos anteriores no se modifican. Haz siempre una copia de seguridad antes de importar.
