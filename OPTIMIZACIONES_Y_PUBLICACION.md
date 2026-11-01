# JS NEXO — Edición optimizada V2 (tienda + admin)

## Qué mejoró

- Catálogo guardado temporalmente en la sesión del navegador para visualizarlo rápidamente en visitas repetidas. Actualiza en segundo plano al entrar o volver a la pestaña.
- Respuestas públicas del catálogo con caché CDN de 10 segundos; las acciones privadas siguen sin caché. Los cambios del panel pueden tardar hasta aproximadamente 10 segundos en propagarse a los visitantes.
- Fotos NUEVAS almacenadas como bytes en Netlify Blobs (sin la sobrecarga de guardar base64 en JSON). Las imágenes anteriores siguen funcionando.
- Fotos nuevas comprimidas con `canvas.toBlob` sin conversiones síncronas repetidas que bloqueen la interfaz.
- Imágenes de producto con carga diferida, decodificación asíncrona y dimensiones reservadas.
- Búsqueda de catálogo agrupada con `requestAnimationFrame`.
- Renderizado de tarjetas fuera de pantalla optimizado, y menos efectos costosos en móviles.
- Respeta la preferencia del sistema de reducir movimiento.
- Mensajes de diagnóstico del panel que distinguen `JS_ADMIN_PASSWORD` de `JS_ADMIN_SECRET` cuando faltan o son demasiado cortos.
- Se conservan rutas, nombres de tiendas Blobs, claves de sesión, nombres de variables de entorno y preferencias existentes.

## Cómo publicarlo sin borrar tu tienda ni catálogo

1. Antes de actualizar, si puedes entrar al panel, exporta **una copia de seguridad** desde Datos.
2. Descomprime el ZIP. Abre la carpeta `JS_NEXO_OPTIMIZADA_V2` y selecciona TODO su contenido.
3. Abre GitHub > tu repositorio actual `santy23gg1566/JS-NEXO`, rama `main`.
4. Reemplaza `public/index.html`, `public/admin/index.html` y `netlify/functions/api.mjs` (puedes usar el lápiz y pegar los nuevos archivos). También puedes actualizar el repositorio completo conservando las mismas rutas.
5. No renombres las carpetas y no borres `netlify/functions/seed.mjs`, `package.json` ni `netlify.toml`. No agregues contraseñas a GitHub.
6. Confirma **Commit changes**. Netlify, que está conectado a GitHub, publicará automáticamente la nueva versión.
7. En Netlify > Deploys revisa que el estado sea **Published** y que aparezcan **2 functions deployed**.
8. Comprueba `https://js-nexo.netlify.app/` y `https://js-nexo.netlify.app/admin/`. Si no ves el cambio, recarga con Ctrl+F5.

## Variables privadas y error `configured:false`

- `JS_ADMIN_PASSWORD`: mínimo 12 caracteres, en **Production**, disponible en Functions.
- `JS_ADMIN_SECRET`: mínimo 32 caracteres, en **Production**, disponible en Functions.
- Si editas cualquiera, realiza un nuevo despliegue. Visita `https://js-nexo.netlify.app/.netlify/functions/api?action=me` y comprueba `configured:true`. El campo `setupHint` (si existe) puede decir `password`, `secret` o `both` para orientar, sin revelar valores.
- Tu clave `JS_ADMIN_SECRET` apareció visible en una captura anterior: **genera una nueva**, guárdala en Netlify y vuelve a desplegar.

## Limitaciones conservadas

- La venta se confirma por WhatsApp al **849-503-8748**, no es un checkout con cobro electrónico.
- El stock se edita desde el panel; no se descuenta al enviar un mensaje de WhatsApp.
- Para rendimiento con imágenes reales, sube fotos bien iluminadas y deja que el panel las convierta a WebP.
- No he modificado ni borrado datos que tengas publicados en Netlify Blobs: el ZIP solo contiene código y datos de demostración de respaldo.
