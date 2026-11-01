# JS NEXO® — tienda + panel administrativo con contraseña

**Qué recibes:**

- `public/index.html`: tienda visual (continuación de Atelier Edition), móvil y PC.
- `public/admin/index.html`: panel de administración protegido mediante contraseña de servidor.
- `public/assets/`: ilustraciones originales de demostración.
- `netlify/functions/api.mjs`: Netlify Function que autentica, guarda productos y recibe fotos.
- `netlify/functions/seed.mjs`: datos iniciales demostrativos.
- `netlify.toml`: configura la carpeta pública y las funciones.
- `package.json`: instala la biblioteca `@netlify/blobs` al desplegar.

**Muy importante:** Para usar el panel *no basta abrir index.html ni hacer drag-and-drop a Netlify Drop*. Hace falta conectar el repositorio GitHub a un sitio Netlify para desplegar funciones y almacenamiento de datos. La contraseña se crea en Netlify, no en los archivos de la web.

## PARTE A — Subir a GitHub (desde Windows, sin instalar nada)

1. Descarga el ZIP completo y haz clic derecho → **Extraer todo**.
2. Abre la carpeta `JS_NEXO_ADMIN_READY` extraída.
3. Abre https://github.com/new e inicia sesión. Nombre sugerido del repositorio: `JS-NEXO-TIENDA`. Puedes elegir **Private** para proteger tu código. Selecciona **Create repository**. Si aparece `Add a README`, puedes dejarlo sin marcar.
4. En el nuevo repositorio pulsa **uploading an existing file**; si ya contiene archivos pulsa **Add file → Upload files**.
5. En el Explorador de Windows, entra DENTRO de `JS_NEXO_ADMIN_READY` y selecciona sus contenidos (no la carpeta externa ni el ZIP). Arrastra a GitHub **public**, **netlify**, `netlify.toml`, `package.json`, `.gitignore` y los demás archivos que quieras conservar. Para los nombres que comienzan con punto, Windows puede ocultarlos: si `.gitignore` no aparece, no es imprescindible para publicar.
6. Antes de confirmar revisa que el árbol de tu repositorio quede así:

```
JS-NEXO-TIENDA/
├── netlify.toml
├── package.json
├── public/
│   ├── index.html
│   ├── admin/
│   │   └── index.html
│   └── assets/
│       ├── watch.svg
│       ├── smart.svg
│       └── ...
└── netlify/
    └── functions/
        ├── api.mjs
        └── seed.mjs
```

7. Pulsa **Commit changes**. Si GitHub deja fuera alguna carpeta, usa otra vez **Add file → Upload files** y súbela en la ruta correcta.

No subas jamás contraseñas, `.env` con valores reales ni tokens.

## PARTE B — Conectar el repositorio a Netlify

**Si quieres mantener la URL de tu tienda actual:** abre el proyecto anterior en https://app.netlify.com, entra en **Project configuration → Developer settings → Continuous deployment → Repository** y selecciona **Link repository**, si está disponible. Vincula el repositorio nuevo de GitHub. Revisa que la configuración de compilación apunte al proyecto correcto. Conserva antes una copia del sitio anterior.

**Si prefieres una tienda nueva:**

1. Entra a https://app.netlify.com.
2. Pulsa **Add new project → Import an existing project**.
3. Elige **GitHub** y autoriza acceso al repositorio `JS-NEXO-TIENDA`.
4. Selecciona rama `main`.
5. Configura **Base directory**: vacío (raíz del repositorio). **Publish directory**: `public`. **Functions directory**: `netlify/functions` (se toma también de `netlify.toml`). **Build command**: dejar vacío (no necesitas compilar el HTML).
6. Pulsa **Deploy / Publish**.
7. Cuando termine, abre la URL pública `https://NOMBRE-DEL-SITIO.netlify.app/`. La tienda inicialmente mostrará artículos de DEMOSTRACIÓN.

Netlify instalará la dependencia del `package.json` durante el despliegue. Si ves errores de dependencias, revisa **Deploys → Deploy log**. La carpeta `netlify/` no debe colocarse dentro de `public/`.

## PARTE C — Configurar la contraseña PRIVADA del panel

1. Dentro de tu proyecto Netlify, entra en **Project configuration → Environment variables**.
2. Pulsa **Add variable** y crea **exactamente** estas 2 variables:

   - **Key:** `JS_ADMIN_PASSWORD` — **Value:** una contraseña tuya de 12 o más caracteres (mejor una frase de 18+ caracteres, diferente de tus otras claves).
   - **Key:** `JS_ADMIN_SECRET` — **Value:** un texto aleatorio y secreto de 64 caracteres o más. Para generar uno localmente sin compartirlo, puedes usar PowerShell:

```powershell
$bytes = New-Object byte[] 32
[System.Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($bytes)
[BitConverter]::ToString($bytes).Replace('-', '').ToLower()
```

3. Asegúrate de que ambas variables estén disponibles para **Functions** y para el contexto **Production**. Si Netlify te ofrece marcar los valores como secretos, actívalo.
4. Guarda y en **Deploys** ejecuta un nuevo **Trigger deploy → Deploy site** para que las funciones reciban las variables.
5. Entra a **https://TU-SITIO.netlify.app/admin/**. Introduce `JS_ADMIN_PASSWORD` (la contraseña que elegiste). ¡Ya puedes administrar la tienda!

**No me envíes la contraseña.** No la escribas en HTML, GitHub, capturas ni mensajes.

## PARTE D — Administrar productos y editar todo

- **Productos → Nuevo producto:** nombre, precio RD$, stock, categoría, descripción, etiqueta, visibilidad, destacado y fotografía. Pulsa **Guardar en borrador**.
- **Productos → Editar / Duplicar / Eliminar:** administra piezas existentes.
- **Categorías:** agrega secciones y cambia nombres. Para eliminar una sección, primero mueve sus productos a otra.
- **Contenido web:** cambia el título grande de Inicio, descripción de bienvenida, textos de Tienda, Nosotros y Contacto, anuncio superior y texto de pie de página.
- **Identidad y redes:** nombre de marca, WhatsApp (preconfigurado `18495038748`), Instagram, TikTok, logotipo, foto principal y tema inicial.
- **Copias de seguridad:** exporta o importa un JSON.
- **Publicar cambios:** botón visible arriba del panel. **Solo después de pulsarlo aparecen los cambios en la tienda pública.**

## PARTE E — Cómo cambiar los datos desde el panel

1. Entra al panel, inicia sesión.
2. Pulsa **Productos** y **Editar** sobre un producto de muestra.
3. Reemplaza nombre, precio, unidades y descripción con datos reales.
4. Selecciona una foto desde tu PC o celular y pulsa **Subir imagen**. Admite JPG, PNG, WebP; el navegador comprime antes de subir.
5. Pulsa **Guardar en borrador** en el producto.
6. Pulsa **PUBLICAR CAMBIOS** en la parte superior.
7. Abre la tienda en otra pestaña y recarga para comprobar que apareció el cambio.

Cuando publiques desde el panel **NO necesitas volver a GitHub** para cada producto. Si cambias la estructura HTML o funciones de programación, entonces sí harás un nuevo commit a GitHub y Netlify desplegará la versión del código.

## PARTE F — Limitaciones y seguridad

- La dirección `/admin/` puede conocerse; **la contraseña protege las funciones de edición y el acceso a los datos de administración**, no oculta el HTML de la pantalla de inicio de sesión.
- Las credenciales están solo en Netlify Functions y no en el código público; la sesión utiliza cookie segura HttpOnly, con vencimiento de 12 horas.
- Hay un límite básico de intentos de contraseña por IP (no sustituye MFA, WAF ni medidas antiabuso de Netlify).
- El catálogo y las imágenes se guardan en Netlify Blobs, sujeto a los límites y tarifas vigentes de tu plan.
- La cuenta y el costo de Netlify pueden variar según consumo y plan; revisa el uso antes de escalar.
- **Pedidos por WhatsApp:** no es un sistema de pagos ni inventario transaccional. Las cantidades de stock se actualizan manualmente al confirmar cada pedido; evita vender más de lo que tienes.
- Varias sesiones editando el catálogo al mismo tiempo pueden sobrescribirse. Usa un administrador a la vez y exporta respaldos con frecuencia.
- Las fotos subidas se almacenan separadamente. Los archivos JSON exportados incluyen sus direcciones, no las imágenes binarias. No borres el sitio Netlify ni sus Blobs si quieres conservar esas fotos.
- Cambiar tu contraseña en Netlify y volver a desplegar **invalida las sesiones existentes**. Para cerrar una sesión local, usa **Cerrar sesión**.
- La edición en el panel cubre productos, categorías, contenidos, marca, redes e imágenes. La modificación arbitraria de diseño HTML, CSS o lógica avanzada sigue requiriendo editar archivos en GitHub.
- En este paquete los productos de ejemplo están explícitamente identificados. **Cámbialos antes de recibir pedidos reales.**

**Si aparece error al publicar:** abre Netlify → proyecto → **Logs / Functions** y busca `api`. Comprueba que `JS_ADMIN_PASSWORD` y `JS_ADMIN_SECRET` estén configuradas y que Netlify haya desplegado el código desde GitHub.
