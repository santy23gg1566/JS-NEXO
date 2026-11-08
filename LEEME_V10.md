# SIMÓ® V10 — Añadir flyers desde el mismo Super Admin

Este paquete reemplaza la **V9**. No necesitas crear otro sitio ni otro repositorio.

## ¿Qué cambió?

- En `/admin/`, **Agregar un flyer** abre un formulario dentro del panel, NO te envía a Decap.
- Puedes subir PNG/JPG/WEBP (máximo 6 MB), añadir título, categoría, año, descripción, enlace y elegir mostrar u ocultar.
- Vista previa de la imagen antes de publicar.
- Se puede editar, ocultar/mostrar, reordenar y retirar un flyer desde **Flyers y proyectos**.
- Los cambios se guardan en GitHub mediante un commit atómico y Netlify publica la nueva versión.
- El resto de secciones del panel sigue utilizando `admin/editor.html` (Decap CMS).

## Instalar en tu Netlify existente

1. Descomprime este ZIP.
2. Haz copia de seguridad de tus archivos actuales en GitHub, especialmente `SIMO_V8_ADMIN_READY/data/` y `SIMO_V8_ADMIN_READY/uploads/`.
3. Actualiza **solo** `SIMO_V8_ADMIN_READY/admin/index.html` con el archivo del paquete, desde GitHub o cargándolo a la carpeta `admin/` de tu repositorio.
4. Confirma el cambio (**Commit changes**) en `main`.
5. En Netlify comprueba el deploy **Published**.
6. Abre `https://simo-v8-admin.netlify.app/admin/` y recarga con `Ctrl + Shift + R`.
7. Pulsa **Agregar un flyer**: el formulario se mostrará dentro de la propia página.
8. Para publicar, pulsa arriba **Conectar GitHub**, autoriza tu cuenta con permiso de escritura y pulsa **Publicar en mi web**.

## Seguridad y autenticación

El acceso al panel visual puede ser público, pero publicar necesita un token temporal de GitHub con permiso de escritura (obtenido por OAuth de Netlify). **No se incluye ningún token ni secreto en los archivos.** El token solo permanece en memoria durante la pestaña abierta y se pierde al recargar o salir.

Si aún recibes `incorrect_client_credentials`, corrige primero el Client ID y el Client Secret en Netlify → Project configuration → Security → OAuth. El nuevo formulario no soluciona las credenciales erróneas.

## Importante

Esta función permite **subir diseños terminados y organizarlos**. No es un editor gráfico tipo Canva que diseñe flyers desde cero. Para eso haría falta un editor visual adicional.

Si ya tienes proyectos publicados, conserva `data/projects.json` y `uploads/` actuales. Los ejemplos del ZIP son de referencia y están vacíos. **La instalación recomendada reemplaza únicamente `admin/index.html`.**
