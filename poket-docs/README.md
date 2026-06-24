# Configuración de PocketBase para Servicar

Esta carpeta contiene la documentación detallada para configurar y operar el backend de **PocketBase** en conjunto con la aplicación de Servicar.

## Requisitos de Versión
*   **PocketBase v0.23+**: Esta aplicación está adaptada a las APIs de PocketBase v0.23 o superior. Es importante notar que v0.23 introdujo cambios significativos en el manejo de colecciones y campos (los campos `created` y `updated` ahora son opcionales y de tipo `autodate` en la definición de esquemas, y se utiliza la clave `fields` en lugar de `schema`).

---

## 1. Instalación y Puesta en Marcha

PocketBase es un único archivo ejecutable. Puedes descargarlo directamente de su web oficial o usar la imagen Docker si utilizas Compose.

El servidor corre por defecto en el puerto `8090`. Puedes acceder a él de las siguientes formas:
*   **API del Servidor**: `http://<IP_SERVIDOR>:8090/api/`
*   **Panel de Administración (Admin UI)**: `http://<IP_SERVIDOR>:8090/_/`

Al arrancar PocketBase por primera vez, ingresa a la Admin UI y crea tu cuenta de **Superuser** (el email y la contraseña que ingreses aquí serán los que uses para correr scripts administrativos y migraciones).

---

## 2. Inicialización Automática (Seeding)

Para facilitar el desarrollo y la configuración inicial, existe un script de seed en la carpeta core de la aplicación. Este script se encarga de:
1.  Verificar y actualizar el esquema de campos personalizados de la colección nativa `users` (`nombre` y `rol`).
2.  Crear o sincronizar la estructura completa de las colecciones `tickets` e `historial_ediciones`.
3.  Establecer las **API Rules** correctas para que la aplicación del frontend pueda consumir y consultar los registros.
4.  Borrar los registros de prueba previos e insertar datos seed limpios (3 usuarios y 2 tickets con su respectivo historial).

### Comando para ejecutar el Seed:
Desde la raíz del monorepo, ejecuta el siguiente comando reemplazando las variables correspondientes a tu servidor PocketBase:

```bash
PB_URL=http://<IP_SERVIDOR>:8090 \
PB_ADMIN_EMAIL=<email_superuser> \
PB_ADMIN_PASS=<contraseña_superuser> \
  npx tsx packages/core/seed.ts
```

*Nota: La contraseña por defecto de los usuarios creados por el seed (`juan.perez@servicar.com`, `m.rodriguez@servicar.com`, `admin@servicar.com`) es `Password1234!`.*

---

## 3. Configuración en la Aplicación Frontend (Next.js)

Para que el frontend deje de usar los mocks locales de `localStorage` y se conecte a tu servidor de PocketBase real, debes modificar el archivo [`next/.env.local`](file:///home/hermandev/Documents/proyectos/1/servicar/next/.env.local) con los siguientes valores:

```env
# Desactivar la capa de mocks
NEXT_PUBLIC_USE_MOCK=false

# URL pública de PocketBase accesible por el navegador (para SSE/Auth)
NEXT_PUBLIC_PB_URL=http://192.168.0.222:8090

# URL interna para consultas server-side
PB_URL=http://192.168.0.222:8090
```

---

## Índice de Documentación Adicional
*   [Esquemas de Base de Datos (esquemas.md)](file:///home/hermandev/Documents/proyectos/1/servicar/poket-docs/esquemas.md): Especificación detallada de campos y tipos de datos por colección.
*   [Reglas de Seguridad y API (reglas-api.md)](file:///home/hermandev/Documents/proyectos/1/servicar/poket-docs/reglas-api.md): Configuración de permisos de acceso en PocketBase para prevenir errores `403`.
*   [Resolución de Problemas (resolucion-problemas.md)](file:///home/hermandev/Documents/proyectos/1/servicar/poket-docs/resolucion-problemas.md): Detalle de errores comunes de integración, ordenamiento y soluciones aplicadas.
*   [Despliegue de PocketBase en Railway (despliegue-railway.md)](file:///home/hermandev/Documents/proyectos/1/servicar/poket-docs/despliegue-railway.md): Guía completa para desplegar, conectar y persistir PocketBase en la plataforma Railway.
*   [Despliegue de Next.js en Railway (despliegue-next.md)](file:///home/hermandev/Documents/proyectos/1/servicar/poket-docs/despliegue-next.md): Configuración del monorepo, variables de compilación y despliegue del frontend Next.js en Railway.

