Documento de Visión Global del Sistema: Gestión de Taller de Autobuses

1. Visión y Propósito (El "Por qué")

El sistema es una plataforma de gestión operativa para un taller de autobuses. Su propósito principal es centralizar, estandarizar y dar seguimiento a todas las operaciones que ocurren en el taller (incidencias, reparaciones, reclamos) mediante la figura unificada de un "Ticket".

Se construye para resolver el problema del descontrol o falta de trazabilidad en las operaciones diarias, aportando valor al negocio al permitir una comunicación fluida entre el personal de piso (mecánicos) y la administración, operando bajo un entorno siempre conectado (Online).

2. Actores y Perfiles de Usuario (El "Quién")

Mecánico: Personal de piso del taller. Interactúa con el sistema desde su propio dispositivo móvil para crear nuevos tickets y visualizar el listado de tickets activos. Puede editar exclusivamente los tickets que él mismo ha creado.

Administrador (Jefe de Taller / Supervisor): Responsable de la gestión. Utiliza un panel administrativo de escritorio que le permite visualizar, aprobar, rechazar, editar, reasignar o modificar la información de cualquier ticket.

Cliente: Actor externo que solo puede ver el estado de un ticket específico ingresando su ID único, sin necesidad de autenticarse.

3. Glosario Inicial / Lenguaje Ubicuo (El "Qué")

Empleado: Persona registrada en el sistema. Todo ticket o acción debe estar vinculado a una cuenta.

Ticket: Documento digital central. Atributos obligatorios: ID, Fecha de Creación, Estado Actual, Fecha de Última Modificación y Empleado Reportante.

Matrícula: Identificador alfanumérico único del autobús. Todo ticket debe tener una matrícula asociada.

Historial de Ediciones (Audit Log): Registro inmutable anexo a cada ticket que detalla todos los cambios (quién, cuándo, qué).

Listado Global: Vista que muestra EXCLUSIVAMENTE los tickets que ya han sido Aprobados por administración.

4. Procesos de Negocio Principales (El "Cómo funciona")

4.0 Proceso Previo: Carga de Datos Maestros

El Administrador registra a los empleados, habilitando el inicio de sesión.

4.1 Proceso de Creación (Mecánico)

El Mecánico inicia sesión en su dispositivo.

Llena el formulario indicando la Matrícula y los datos del ticket.

El sistema lo guarda en estado "Pendiente de Revisión" (No visible en el Listado Global). Se genera el registro en el Historial de Ediciones.

4.2 Proceso de Aprobación (Triage Administrativo)

El Administrador revisa los tickets "Pendientes".

Si aprueba: Cambia el estado a "Aprobado". El ticket pasa al Listado Global.

Si rechaza: Cambia el estado a "Requiere Cambios", notificando al mecánico para que lo corrija.

Se actualiza el Historial de Ediciones.

4.3 Proceso de Consulta Pública (Cliente)

El Cliente accede a una URL pública, ingresa el ID del ticket y ve el estado actual (Solo Lectura).

5. Reglas de Negocio e Invariantes Críticas

Regla 1 (Matrícula): Todo Ticket debe estar asociado a la Matrícula de un Autobús.

Regla 2 (Trazabilidad): Inicio de sesión obligatorio. Cada acción registra al empleado responsable.

Regla 3 (Autorización): Mecánico edita solo sus propios tickets; Administrador edita todos.

Regla 4 (Aprobación): Ningún ticket va al Listado Global sin el estado "Aprobado".

Regla 5 (Atributos): ID, Fechas (Creación/Modificación) y Estado son obligatorios.

Regla 6 (Inmutabilidad): El Historial de Ediciones no puede ser alterado ni borrado.

Regla 7 (Privacidad Cliente): Acceso solo por ID exacto de ticket, sin listados públicos.

6. Arquitectura y Stack Tecnológico

Backend y Base de Datos: Convex (BaaS). Manejará la base de datos en la nube, la autenticación, las funciones del servidor (Mutations/Queries) y la reactividad en tiempo real (WebSockets) de forma nativa.

Frontend: Next.js (React). Se utilizará para construir tanto la interfaz móvil responsiva (para los mecánicos) como el panel de administración de escritorio y el portal de clientes.

Despliegue: Vercel. Plataforma serverless en la nube para alojar la aplicación Next.js, con conexión directa a Convex.

7. Preguntas Abiertas

Estados del Ticket: Una vez que el ticket está "Aprobado", ¿cuáles son los siguientes estados operativos por los que pasa en el taller hasta que se da por finalizado o cerrado?