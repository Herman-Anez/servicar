# Esquemas de Base de Datos en PocketBase

Este documento detalla la estructura y los tipos de datos requeridos para las colecciones de PocketBase en Servicar. Todos estos esquemas son creados o actualizados de manera automática al correr el script de seed.

---

## 1. Colección `users` (Colección de tipo Auth)

Esta es la colección de autenticación nativa de PocketBase. Aparte de los campos por defecto (`email`, `emailVisibility`, `verified`, etc.), la aplicación requiere los siguientes campos personalizados:

| Nombre del Campo | Tipo de Datos | Requerido | Configuración / Valores permitidos |
|---|---|---|---|
| `nombre` | `text` | No | Nombre completo del empleado (usado para avatares y firmas en la UI). |
| `rol` | `select` | Sí | `maxSelect: 1`<br>Valores permitidos: `["mecanico", "admin"]` |

---

## 2. Colección `tickets` (Colección de tipo Base)

Es la entidad central del taller de autobuses. Almacena las solicitudes, diagnósticos y el progreso del mantenimiento.

| Nombre del Campo | Tipo de Datos | Requerido | Configuración / Valores permitidos |
|---|---|---|---|
| `matricula` | `text` | Sí | Placa identificativa del autobús. |
| `categoria` | `select` | Sí | `maxSelect: 1`<br>Valores permitidos: `["mantenimiento", "frenos", "aceite", "neumaticos", "electrico", "carroceria", "otros"]` |
| `titulo` | `text` | Sí | Título corto de la incidencia. |
| `descripcion` | `text` | Sí | Explicación detallada del problema o reparación. |
| `estado` | `select` | Sí | `maxSelect: 1`<br>Valores permitidos: `["pendiente_revision", "aprobado", "requiere_cambios", "en_progreso", "urgente", "bloqueado", "finalizado"]` |
| `creadorId` | `text` | Sí | ID del usuario creador (referencia al `id` del registro en `users`). |
| `fechaUltimaModificacion` | `number` | Sí | Timestamp numérico en milisegundos (`Date.now()`). |
| `notaAdmin` | `text` | No | Mensaje que introduce el administrador cuando el estado cambia a `requiere_cambios`. |
| `bahia` | `text` | No | Nombre o número de la bahía de trabajo en el taller donde se encuentra el autobús. |
| `created` | `autodate` | Sí | `onCreate: true`, `onUpdate: false`<br>*Nota: Obligatorio para permitir que el frontend ordene los registros de forma cronológica.* |
| `updated` | `autodate` | Sí | `onCreate: true`, `onUpdate: true` |

---

## 3. Colección `historial_ediciones` (Colección de tipo Base)

Historial de auditoría inmutable de cada ticket. Cada cambio de estado o edición de datos genera un registro en esta colección.

| Nombre del Campo | Tipo de Datos | Requerido | Configuración / Valores permitidos |
|---|---|---|---|
| `ticketId` | `text` | Sí | ID del ticket relacionado. |
| `empleadoId` | `text` | Sí | ID del empleado que realizó la acción. |
| `tipoAccion` | `select` | Sí | `maxSelect: 1`<br>Valores permitidos: `["CREACION", "CAMBIO_ESTADO", "EDICION_TEXTO"]` |
| `detallesCambio` | `text` | No | JSON stringificado que contiene el diff o los detalles del cambio realizado (por ejemplo, el estado anterior y el nuevo). |
| `created` | `autodate` | Sí | `onCreate: true`, `onUpdate: false`<br>*Nota: Permite construir la línea de tiempo cronológica en la vista de auditoría.* |
| `updated` | `autodate` | Sí | `onCreate: true`, `onUpdate: true` |

---

## Particularidad de PocketBase v0.23+

En versiones anteriores, los campos `created` y `updated` se administraban de forma separada al esquema de la colección. A partir de la versión v0.23+, **estos campos son opcionales y forman parte del array de campos de la API (`fields`)**. 

Si reconstruyes o actualizas el esquema de la colección de manera programática mediante la API y omites los campos `created` y `updated`, **PocketBase los eliminará permanentemente de la colección**, rompiendo todas las consultas que utilicen ordenamientos cronológicos (`sort=-created`). Por ende, siempre deben ser incluidos explícitamente en el seed o en cualquier archivo de migración como tipos `autodate`.
