# Guía de Integración y Despliegue en Railway (PocketBase + Next.js)

Este documento explica paso a paso cómo desplegar y conectar **PocketBase** con el frontend de **Next.js** de Servicar en la plataforma **Railway**.

---

## Arquitectura en Railway

En Railway, desplegaremos dos servicios independientes dentro del mismo proyecto:

```
Usuario (Navegador)
   │
   ├───► https://servicar-next.up.railway.app (Frontend Next.js)
   │
   └───► https://servicar-pb.up.railway.app   (Backend PocketBase)
```

*Nota: Dado que el cliente de PocketBase se ejecuta en el navegador del usuario (cliente reactivo y autenticación), la aplicación necesita que PocketBase esté expuesto con un dominio público.*

---

## Paso 1: Desplegar PocketBase en Railway

PocketBase requiere almacenamiento persistente para su base de datos SQLite (`pb_data`). Sigue estos pasos para desplegarlo:

### Opción A: Despliegue usando Docker Image (Recomendado y más rápido)
1.  En tu panel de Railway, haz clic en **+ New** > **Deploy from Docker Image**.
2.  Introduce la imagen oficial ligera de PocketBase optimizada para Railway:
    `ghcr.io/muchobien/pocketbase:latest`
3.  Una vez creado el servicio, ve a la pestaña **Settings** del servicio de PocketBase y añade una **Custom Domain** (Railway te generará uno público como `xxx.up.railway.app`).

### Opción B: Despliegue usando Dockerfile personalizado
Si deseas empaquetar una versión específica (ej. `0.23.4`), puedes crear un repositorio simple en GitHub con un `Dockerfile` como el siguiente y conectarlo a Railway:

```dockerfile
FROM alpine:3.19

ARG PB_VERSION=0.23.4

RUN apk add --no-cache \
    unzip \
    ca-certificates \
    sqlite

# Descargar y extraer PocketBase
ADD https://github.com/pocketbase/pocketbase/releases/download/v${PB_VERSION}/pocketbase_${PB_VERSION}_linux_amd64.zip /tmp/pb.zip
RUN unzip /tmp/pb.zip -d /pb/ && rm /tmp/pb.zip

EXPOSE 8080

# Iniciar PocketBase enlazando al puerto dinámico de Railway ($PORT)
CMD ["/pb/pocketbase", "serve", "--http=0.0.0.0:8080"]
```
*Nota: Configura el puerto de Railway en `8080` en las variables de entorno si usas esta opción.*

---

### Configuración Crítica en Railway para PocketBase:


#### 1. Añadir Volumen de Persistencia (Crucial)
Por defecto, los contenedores en Railway son efímeros (borran sus datos y se destruyen en cada nuevo despliegue o reinicio). Como PocketBase utiliza SQLite, guarda toda la base de datos, configuraciones y archivos en una carpeta local llamada `pb_data`. Para no perder la información, debes asociar un volumen persistente:

1.  Selecciona tu servicio de PocketBase en Railway.
2.  Ve a la pestaña **Volume** y haz clic en **Add Volume**.
3.  Configura el **Mount Path** con la ruta exacta de datos de tu contenedor:
    *   **Si usas la imagen `ghcr.io/muchobien/pocketbase:latest` (Opción A):** Configura el Mount Path en `/pb/pb_data`.
    *   **Si usas nuestro Dockerfile personalizado (Opción B):** Dado que instalamos el binario en la ruta `/pb`, el directorio por defecto es `/pb/pb_data`.
    *   **Si usas otra imagen de Docker Hub:** Algunas imágenes montan los datos directamente en la raíz `/pb_data`.
4.  **¿Cómo saber la ruta exacta? (La regla de oro):**
    Una vez que el servicio de PocketBase intente arrancar por primera vez, ve a la pestaña **Logs** en Railway. Busca la línea de inicialización de PocketBase, que se ve así:
    ```bash
    2026/06/24 18:00:00 Server started at http://0.0.0.0:8080
    2026/06/24 18:00:00 └─ Data dir: /pb/pb_data
    ```
    La ruta que aparezca al lado de **`Data dir:`** es la ruta exacta que debes ingresar en el campo **Mount Path** de tu volumen en Railway. Si no coinciden exactamente, PocketBase guardará los datos en la memoria temporal del contenedor y los perderás al reiniciar.
5.  Asigna un tamaño inicial al volumen (con 1GB o 5GB es más que suficiente para miles de tickets e históricos).

#### 2. Configurar Variables de Entorno del Servicio:
En la pestaña **Variables** del servicio de PocketBase, asegúrate de tener:
*   `PORT` = `8080` (o el puerto que maneje la imagen Docker por defecto).

---

## Paso 2: Configuración Inicial de PocketBase en Railway

1.  Accede a la URL pública de tu PocketBase en Railway agregando el sufijo del panel:
    `https://tu-servicio-pb.up.railway.app/_/`
2.  Crea la cuenta de **Superuser** inicial (apunta bien el email y contraseña).

---

## Paso 3: Ejecutar el Seed de forma remota

No es necesario que corras el script de inicialización dentro de los servidores de Railway. Puedes ejecutarlo **desde tu máquina local** apuntando directamente a la URL pública de tu instancia en Railway:

1.  Asegúrate de tener el código actualizado con las correcciones para v0.23+.
2.  Ejecuta el comando en tu terminal local pasando las credenciales del superuser que creaste en el paso anterior:

```bash
PB_URL=https://tu-servicio-pb.up.railway.app \
PB_ADMIN_EMAIL=<email_superuser_railway> \
PB_ADMIN_PASS=<pass_superuser_railway> \
  npx tsx packages/core/seed.ts
```

*El script se conectará vía HTTPS a tu servidor de Railway, creará las tablas `tickets`, `historial_ediciones`, configurará las API Rules de lectura/escritura e insertará los usuarios y tickets seed.*

---

## Paso 4: Desplegar el Frontend de Next.js en Railway

1.  En Railway, haz clic en **+ New** > **Github Repo** y selecciona tu repositorio de Servicar.
2.  Railway detectará automáticamente que es un proyecto Next.js basado en pnpm/npm.
3.  **Configurar el Root Directory:** Si tu monorepo tiene el frontend en la carpeta `/next`, ve a **Settings** > **General** > **Root Directory** en Railway y configúralo como `next`.

---

### Variables de Entorno para Next.js en Railway:

En la pestaña **Variables** del servicio frontend en Railway, debes definir obligatoriamente las siguientes variables:

| Variable | Valor | Descripción |
|---|---|---|
| `NEXT_PUBLIC_USE_MOCK` | `false` | Apaga los mocks de localStorage y activa PocketBase. |
| `NEXT_PUBLIC_PB_URL` | `https://tu-servicio-pb.up.railway.app` | **URL pública** de PocketBase (es la que llamará el navegador del cliente para autenticación y suscripciones en tiempo real). |
| `PB_URL` | `https://tu-servicio-pb.up.railway.app` | URL de PocketBase para operaciones de servidor. |

### Nota sobre el Build en Railway:
Next.js realiza un chequeo de tipos y compilación en tiempo de construcción (`next build`). Dado que `NEXT_PUBLIC_PB_URL` se incrusta en el código compilado durante el build, **debes asegurarte de que esta variable esté configurada en las variables de Railway antes de realizar el despliegue**. Si cambias la URL de PocketBase en el futuro, Railway reconstruirá la imagen automáticamente aplicando la nueva variable.

---

## Resumen de Troubleshooting en Railway

*   **Error `502 Bad Gateway (connection refused)` o `499 (connection dial timeout)`:**
    *   *Síntoma:* El servicio de PocketBase se cae constantemente o el log de despliegue muestra el error: `Error: listen tcp: lookup tcp/$PORT: unknown port`.
    *   *Causa:* Railway ejecuta el comando de inicio directamente en el contenedor sin instanciar una consola de comandos (shell). Al no haber shell, la variable de entorno `$PORT` no se evalúa numéricamente y PocketBase intenta resolver literalmente la palabra `"$PORT"`.
    *   *Solución A (Recomendada y 100% infalible):* Forzar un puerto fijo para el contenedor de PocketBase:
        1. Ve a la pestaña **Variables** del servicio de PocketBase en Railway y añade la variable **`PORT`** con el valor `8080`.
        2. Ve a la pestaña **Settings**, busca la sección **Start Command** y configúralo como:
           `pocketbase serve --http=0.0.0.0:8080`
           *(O `/pb/pocketbase serve --http=0.0.0.0:8080` si usas la Opción B)*.
        3. Guarda y deja que se redespliegue.
    *   *Solución B (Suscripción dinámica):* Forzar la shell para que expanda la variable al arrancar el servicio. En el **Start Command** de **Settings**, configura exactamente:
        `sh -c "pocketbase serve --http=0.0.0.0:\$PORT"`
*   **Página se queda cargando indefinidamente:** Revisa en la consola del navegador si hay errores de conexión a la URL de PocketBase. Asegúrate de que `NEXT_PUBLIC_PB_URL` use `https://` y no tenga una barra diagonal `/` al final.
*   **Pérdida de datos al reiniciar:** Si tus usuarios o tickets desaparecen al hacer un redeplegar en Railway, es porque **olvidaste añadir el volumen persistente** al servicio de PocketBase o el path de montaje (`Mount Path`) no coincide con la ubicación del SQLite de la imagen Docker.
*   **Error 403 Forbidden al listar:** Asegúrate de haber ejecutado el script `seed.ts` de forma exitosa contra la URL de Railway. Si no se corrió, las API Rules de las colecciones estarán en `null` bloqueando todas las lecturas de los mecánicos.
