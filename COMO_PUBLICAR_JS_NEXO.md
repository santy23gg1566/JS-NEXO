# JS NEXO — Tienda original con 10 relojes reales

Esta versión conserva el diseño de JS NEXO y su administrador con contraseña de Netlify Functions. Se incorporaron **únicamente los 10 flyers de relojes enviados por ti**; los nombres y descripciones son comerciales basados en su aspecto, no certificaciones de marca/modelo.

## Qué incluye
- `public/index.html`: portada, Shop, Nosotros, Contacto, filtros, carrito y WhatsApp.
- `public/admin/index.html`: panel para editar nombre, descripción, precio, stock, foto y demás datos.
- `public/assets/reloj-01.webp` a `reloj-10.webp`: tus fotografías comprimidas, sin sustituir los diseños.
- `netlify/functions/watches.mjs`: listado de los 10 relojes.
- `netlify/functions/api.mjs`: Netlify Functions, autenticación con contraseña y datos en Netlify Blobs.
- `netlify/functions/seed.mjs`: catálogo inicial de los 10 relojes.
- `netlify.toml` y `package.json`: configuración de Netlify.

## Publicación sin perder datos
1. **Haz una copia de seguridad del catálogo** desde `/admin/` si ya tienes datos reales publicados.
2. En GitHub abre el repositorio de tu tienda **JS NEXO**, no el repositorio de tu portafolio SIMÓ.
3. Sube/reemplaza el CONTENIDO de esta carpeta en la raíz de ese repositorio, preservando `public/` y `netlify/` en esas rutas (no subas la carpeta envolvente).
4. Confirma el commit; Netlify hará el despliegue del código cuando el proyecto esté conectado al repositorio.
5. Comprueba que la publicación use `public` como publish directory y `netlify/functions` como functions directory.
6. Abre `/` para ver Shop y `/admin/` para iniciar sesión y editar precios/existencias. Guarda y pulsa **PUBLICAR CAMBIOS**.

### Si ya tenías un catálogo publicado en Netlify Blobs
La API **no sobrescribe tu catálogo existente**: añade los 10 relojes con identificadores fijos, conservando tus artículos reales. Solo retira las fichas de demostración originales si siguen con sus nombres intactos. La migración se fija al pulsar Publicar cambios por primera vez, para que no reaparezcan relojes que después elimines.

### Precio y stock
No se proporcionaron precios ni cantidades confirmadas, por lo que se dejan **sin valor** (`null`). La web indica «Consultar precio» y «Consultar disponibilidad» y permite solicitar una cotización por WhatsApp. Introduce cantidades y precios desde el panel cuando los confirmes. No se inventan números.

### Contraseña y seguridad
La contraseña NO está en el código: `JS_ADMIN_PASSWORD` (12+ caracteres) y `JS_ADMIN_SECRET` (32+ caracteres) deben configurarse como variables privadas en Netlify, disponibles para Functions en producción. Nunca subas secretos a GitHub.

### Nota
No se ha probado la publicación en tu cuenta real de Netlify ni se han modificado los datos remotos. Se ha comprobado la sintaxis y la consistencia del paquete local.
