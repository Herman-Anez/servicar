# Guía de Despliegue de Next.js (Railway y VPS)

Este documento detalla los pasos y configuraciones técnicas para compilar y desplegar el frontend de **Next.js** de Servicar tanto en la plataforma **Railway** como de forma nativa en un **servidor VPS** utilizando la configuración del monorepo.

---

## 1. Arquitectura de Despliegue de Next.js

El frontend de Next.js está configurado como una aplicación en un monorepo administrado por `pnpm`. Utiliza un esquema de compilación optimizado:

*   **Compilación Standalone**: En `next/next.config.mjs`, la propiedad `output: "standalone"` está habilitada. Esto indica a Next.js que genere una compilación mínima en `.next/standalone`, la cual incluye únicamente los archivos y dependencias de `node_modules` necesarios para la ejecución, eliminando dependencias de desarrollo y reduciendo el tamaño de la imagen Docker final.
*   **Docker Multi-stage**: El archivo `next/Dockerfile` realiza la instalación de dependencias, la compilación de la aplicación y la preparación de un entorno de ejecución ligero con Node 22 Alpine, corriendo como un usuario sin privilegios de administrador (`nextjs`).

---

## 2. Contexto de Construcción en Railway (Crucial)

El monorepo de Servicar tiene la siguiente estructura simplificada:
```
/ (Raíz del Repositorio)
├── package.json
├── pnpm-workspace.yaml
├── pnpm-lock.yaml
├── packages/
│   └── core/          (Código y esquemas compartidos, seed scripts)
└── next/              (Frontend de Next.js)
    └── Dockerfile     (Dockerfile específico del frontend)
```

Debido a que `next/Dockerfile` necesita acceder a dependencias de la raíz (como `pnpm-workspace.yaml` y `pnpm-lock.yaml`) y a otros paquetes compartidos (como `packages/core`), el contexto de construcción de Docker debe ser la **raíz del repositorio** (`/`), y no el subdirectorio `/next`.

### Configuración del Servicio en Railway:
Cuando agregues el servicio de Next.js en Railway desde GitHub, configúralo con los siguientes parámetros en la pestaña **Settings**:

1.  **Root Directory**: `/` (Déjalo en la raíz para que Railway tenga acceso a todo el monorepo).
2.  **Dockerfile Path**: `next/Dockerfile` (Indica a Railway que use el Dockerfile que se encuentra dentro de la carpeta `next`).
3.  **Start Command**: Déjalo vacío o en blanco. Railway detectará automáticamente el comando de inicio `CMD` definido al final del Dockerfile (`node next/server.js`).

---

## 3. Variables de Entorno y Argumentos de Construcción (Build Args)

En Next.js, las variables de entorno que tienen el prefijo `NEXT_PUBLIC_` se incrustan (se "hornean") en el código Javascript compilado **durante el tiempo de compilación** (`next build`). No pueden ser leídas dinámicamente en tiempo de ejecución por el navegador si no estaban presentes durante el build.

Por lo tanto, **debes añadir estas variables de entorno en la pestaña de variables del servicio de Railway antes de que se inicie la compilación**.

### Variables requeridas en Railway:

| Variable | Valor de Ejemplo | Propósito / Tipo |
|---|---|---|
| `NEXT_PUBLIC_USE_MOCK` | `false` | Indica al frontend que desactive los mocks locales y conecte con PocketBase. (Build Arg) |
| `NEXT_PUBLIC_PB_URL` | `https://servicar-pb.up.railway.app` | URL pública del servidor PocketBase. Es la dirección a la que llamará el navegador web del cliente para autenticación, consultas y suscripciones en tiempo real. (Build Arg) |
| `PB_URL` | `https://servicar-pb.up.railway.app` | URL del servidor PocketBase utilizada para llamadas desde el servidor de Next.js (Server-side Rendering). (Runtime Var) |
| `PORT` | `3000` | Puerto interno en el que escuchará el servidor standalone. Railway lo mapea de forma dinámica. |

### Cómo funciona el mapeo en el Dockerfile:
El archivo `next/Dockerfile` declara estas variables como argumentos de construcción (`ARG`) y luego las expone como variables de entorno (`ENV`) durante la fase de compilación:

```dockerfile
# Declaración de argumentos
ARG NEXT_PUBLIC_PB_URL
ARG NEXT_PUBLIC_USE_MOCK=false

# Exposición para el compilador de Next.js
ENV NEXT_PUBLIC_PB_URL=$NEXT_PUBLIC_PB_URL
ENV NEXT_PUBLIC_USE_MOCK=$NEXT_PUBLIC_USE_MOCK

# Ejecución del build
RUN pnpm --filter @servicar/next build
```

Railway lee las variables configuradas en su panel y las inyecta automáticamente como `ARG` y `ENV` durante el proceso de `docker build`.

---

## 4. Paso a Paso para Desplegar en Railway

Sigue esta secuencia para asegurar un despliegue sin errores:

### Paso 4.1: Crear el Servicio
1.  En tu proyecto de Railway, haz clic en **+ New** > **GitHub Repo**.
2.  Selecciona tu repositorio de Servicar y elige la rama que deseas desplegar (por ejemplo, `v2`).

### Paso 4.2: Configurar las Variables de Entorno (Antes del primer Build exitoso)
1.  Una vez creado el servicio, el primer build automático puede fallar o iniciarse. Ve rápidamente a la pestaña **Variables** del servicio de Next.js.
2.  Haz clic en **New Variable** y añade:
    *   `NEXT_PUBLIC_USE_MOCK` = `false`
    *   `NEXT_PUBLIC_PB_URL` = `https://tu-url-de-pocketbase.up.railway.app` (La URL pública obtenida al desplegar PocketBase).
    *   `PB_URL` = `https://tu-url-de-pocketbase.up.railway.app`
3.  Guarda las variables. Al guardarlas, Railway iniciará automáticamente un nuevo despliegue utilizando los nuevos valores.

### Paso 4.3: Configurar los Ajustes del Contenedor
1.  Ve a la pestaña **Settings** del servicio.
2.  En la sección **General**, verifica que:
    *   **Root Directory** esté configurado como `/`.
3.  En la sección **Build**, configura:
    *   **Dockerfile Path** como `next/Dockerfile`.
4.  En la sección **Environment**, asegúrate de que el puerto expuesto de Railway coincida con el puerto `3000` configurado en el Dockerfile.

### Paso 4.4: Generar el Dominio Público
1.  En la pestaña **Settings**, ve a la sección **Networking**.
2.  Haz clic en **Generate Domain** (o añade un dominio personalizado si cuentas con uno).
3.  Railway te proporcionará una URL pública tipo `https://tu-servicio-next.up.railway.app`.

---

## 5. Resolución de Problemas Comunes (Troubleshooting)

### El build falla con error de dependencias o archivos no encontrados
*   **Causa**: Has configurado el "Root Directory" de Railway en `next/` en lugar de `/`. El instalador de pnpm no puede leer la configuración del espacio de trabajo desde el subdirectorio.
*   **Solución**: Cambia el "Root Directory" a `/` en la pestaña **Settings** y especifica el Dockerfile como `next/Dockerfile`.

### La aplicación carga pero intenta conectarse a localhost o muestra datos simulados
*   **Causa**: La variable `NEXT_PUBLIC_PB_URL` no estaba configurada en Railway en el momento en que se construyó la imagen Docker, o bien `NEXT_PUBLIC_USE_MOCK` estaba en `true`.
*   **Solución**: Asegúrate de que ambas variables estén correctamente definidas en la pestaña **Variables** de Railway y realiza un redespliegue manual haciendo clic en los tres puntos del despliegue actual y seleccionando **Redeploy** para forzar una nueva reconstrucción.

### Errores de tipo "Hydration Mismatch" en producción
*   **Causa**: A veces ocurre cuando el servidor de Next.js renderiza contenido basado en un estado local diferente al del navegador del cliente (por ejemplo, si el servidor asume que hay sesión pero el cliente no, o debido a diferencias horarias locales).
*   **Solución**: Verifica que el reloj de tu servidor de base de datos y de la máquina donde corre Next.js estén sincronizados. Si utilizas hooks de datos, asegúrate de que el estado de carga inicial se maneje correctamente en componentes cliente (`"use client"`).

### Múltiples entornos (Staging / Producción)
Si necesitas desplegar entornos de prueba y de producción:
1.  Crea un entorno diferente en tu proyecto de Railway (por ejemplo, `staging`).
2.  Despliega la rama `v2` en el entorno de staging y la rama principal (`main` / `master`) en producción.
3.  Asigna variables `NEXT_PUBLIC_PB_URL` separadas en cada entorno de Railway para que cada frontend apunte a su respectiva base de datos de PocketBase de desarrollo o producción.

---

## 6. Despliegue Directo en VPS (Sin Docker / Node.js Nativo)

Si prefieres desplegar Next.js directamente sobre el sistema operativo de un servidor VPS (por ejemplo, Ubuntu o Debian) sin utilizar contenedores Docker, sigue estas instrucciones para configurar la aplicación de forma óptima.

### Paso 6.1: Requisitos Previos en el VPS
Asegúrate de tener instalados los siguientes componentes globales en el servidor:
1.  **Node.js**: Se recomienda utilizar Node.js v22 (LTS). Puedes instalarlo usando `nvm` o NodeSource.
2.  **pnpm**: Instala el gestor de paquetes de forma global:
    ```bash
    npm install -g pnpm
    ```
3.  **PM2**: Gestor de procesos para mantener la aplicación Next.js corriendo en segundo plano y reiniciar en caso de fallos:
    ```bash
    npm install -g pm2
    ```

### Paso 6.2: Preparar el Repositorio y Dependencias
1.  Clona el repositorio en el VPS:
    ```bash
    git clone -b v2 <url-del-repositorio> /var/www/servicar
    cd /var/www/servicar
    ```
2.  Instala todas las dependencias del monorepo desde la raíz utilizando el archivo lock:
    ```bash
    pnpm install --frozen-lockfile
    ```

### Paso 6.3: Variables de Entorno en el VPS
Dado que estás en un VPS, puedes crear y editar archivos `.env` locales de manera segura porque no se sincronizarán con tu repositorio de Git (están ignorados en `.gitignore`).

1.  Crea el archivo de variables de entorno dentro del directorio del frontend:
    ```bash
    nano next/.env
    ```
2.  Añade las variables requeridas para producción:
    ```env
    # Desactivar simulación de datos
    NEXT_PUBLIC_USE_MOCK=false

    # URL pública de tu PocketBase en Railway o VPS (con HTTPS)
    NEXT_PUBLIC_PB_URL=https://tu-servicio-pb.com

    # URL para peticiones del lado del servidor
    PB_URL=https://tu-servicio-pb.com
    ```
3.  Guarda el archivo (`Ctrl+O`, `Enter`, `Ctrl+X`).

### Paso 6.4: Construcción (Build) de la Aplicación
1.  Compila el proyecto ejecutando el comando de construcción filtrando para el frontend de Next.js:
    ```bash
    pnpm --filter @servicar/next build
    ```
    *Nota: Durante este proceso, Next.js leerá las variables declaradas en `next/.env` (como `NEXT_PUBLIC_PB_URL`) y las inyectará de forma estática en los archivos de la aplicación compilada.*

### Paso 6.5: Ejecución en Producción con PM2

Para ejecutar la aplicación en producción, se utiliza **PM2** (Process Manager 2). A continuación se explica en detalle el funcionamiento de esta herramienta y los comandos necesarios.

#### ¿Qué es PM2 y por qué es necesario en un VPS?
Cuando ejecutas una aplicación en desarrollo (por ejemplo, con `pnpm dev`), el proceso corre directamente en tu consola. Si cierras la terminal o te desconectas del servidor, la aplicación se detiene. 

PM2 resuelve esto al:
1.  **Ejecutar la aplicación en segundo plano (Background)**: Permite que el servidor web siga activo aunque cierres tu sesión SSH.
2.  **Autoreiniciar en caso de fallos (Auto-restart)**: Si la aplicación sufre un error crítico inesperado, PM2 la levanta inmediatamente de forma automática.
3.  **Persistir tras un reinicio del sistema (Startup)**: Configura el sistema operativo para que, en caso de un apagón o mantenimiento del VPS, la aplicación se inicie sola al arrancar el sistema.

Hay dos alternativas para iniciar y mantener la aplicación activa mediante PM2:

---

#### Opción A: Usar la compilación Standalone (Recomendado y más eficiente)
Esta opción es más eficiente en consumo de memoria RAM y CPU porque ejecuta el servidor de producción optimizado de Next.js sin necesidad de levantar herramientas de desarrollo ni dependencias completas del monorepo.

La compilación standalone genera su servidor en `next/.next/standalone`. Para iniciarla, ejecuta desde la raíz del monorepo:

```bash
PORT=3000 HOSTNAME=0.0.0.0 pm2 start next/.next/standalone/server.js --name "servicar-next"
```

##### Explicación detallada de los parámetros de este comando:
*   **`PORT=3000`**: Define la variable de entorno para indicar al servidor de Next.js que escuche las peticiones internas en el puerto 3000.
*   **`HOSTNAME=0.0.0.0`**: Indica al servidor que escuche en todas las interfaces de red locales, permitiendo que el proxy reverso (Nginx) se comunique con él.
*   **`pm2 start`**: Ordena a PM2 que inicie el script indicado en segundo plano y comience a monitorizarlo.
*   **`next/.next/standalone/server.js`**: Ruta al archivo de entrada principal del servidor generado durante el build de Next.js.
*   **`--name "servicar-next"`**: Asigna un nombre identificativo al proceso para gestionarlo de forma sencilla mediante comandos de texto en lugar de usar números de ID del sistema.

*Nota: Al ejecutarse desde la raíz del monorepo, el servidor standalone resolverá correctamente las carpetas de recursos estáticos `/public` y `/.next/static` que Next.js requiere.*

---

#### Opción B: Ejecución estándar a través del script de Next.js
Si prefieres iniciar la aplicación utilizando el flujo de ejecución estándar del monorepo en lugar del modo standalone, ejecuta desde la raíz:

```bash
pm2 start pnpm --name "servicar-next" -- --filter @servicar/next start
```

---

#### Comandos esenciales para la administración con PM2

Una vez iniciado el servicio, puedes controlarlo mediante los siguientes comandos en la terminal del VPS:

*   **Ver el estado de los servicios**: Muestra una tabla con todas las aplicaciones activas bajo PM2, su consumo de RAM, CPU y número de reinicios.
    ```bash
    pm2 list
    ```
*   **Ver logs en tiempo real**: Muestra la consola de salida de la aplicación (`console.log` y errores del servidor). Útil para diagnosticar problemas en vivo.
    ```bash
    pm2 logs servicar-next
    ```
    *(Para salir de los logs presiona `Ctrl + C`)*.
*   **Reiniciar la aplicación**: Apaga y vuelve a encender el proceso. Es necesario ejecutarlo tras actualizar el código o modificar variables de entorno.
    ```bash
    pm2 restart servicar-next
    ```
*   **Detener la aplicación**: Apaga el servidor temporalmente sin eliminarlo del panel de control de PM2.
    ```bash
    pm2 stop servicar-next
    ```

#### Configurar el reinicio automático con el sistema operativo (Startup)
Para asegurar que tu aplicación se inicie sola si el servidor VPS físico se reinicia:

1.  Guarda la lista actual de aplicaciones activas en la configuración de PM2:
    ```bash
    pm2 save
    ```
2.  Genera el script de inicio para el sistema:
    ```bash
    pm2 startup
    ```
    *Este comando generará una línea de comando larga que comienza con `sudo env PATH...`. Debes copiar esa línea exacta de la consola, pegarla en tu terminal y pulsar Enter para aplicar los permisos de sistema.*


### Paso 6.6: Configuración del Proxy Reverso con Nginx
Para mapear el puerto interno `3000` de Next.js a un dominio público con certificado SSL:

1.  Crea un archivo de configuración para tu dominio en Nginx:
    ```bash
    sudo nano /etc/nginx/sites-available/servicar-next
    ```
2.  Agrega la configuración del proxy:
    ```nginx
    server {
        listen 80;
        server_name app.tu-dominio.com;

        location / {
            proxy_pass http://127.0.0.1:3000;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
        }
    }
    ```
3.  Habilita el sitio y reinicia Nginx:
    ```bash
    sudo ln -s /etc/nginx/sites-available/servicar-next /etc/nginx/sites-enabled/
    sudo nginx -t
    sudo systemctl restart nginx
    ```
4.  Genera el certificado SSL gratuito de Let's Encrypt con Certbot:
    ```bash
    sudo certbot --nginx -d app.tu-dominio.com
    ```
