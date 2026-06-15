// DTOs
export type { CrearTicketDTO }   from "./dtos/crear-ticket.dto";
export type { EditarTicketDTO }  from "./dtos/editar-ticket.dto";
export type { CambiarEstadoDTO } from "./dtos/cambiar-estado.dto";

// Ports-in (use cases)
export type { ICrearTicketUseCase }   from "./ports-in/crear-ticket.use-case.port";
export type { IEditarTicketUseCase }  from "./ports-in/editar-ticket.use-case.port";
export type { ICambiarEstadoUseCase } from "./ports-in/cambiar-estado.use-case.port";

// Ports-in (queries)
export type { IGetTicketsQuery }           from "./ports-in/get-tickets.query.port";
export type { IGetTicketByIdQuery }        from "./ports-in/get-ticket-by-id.query.port";
export type { IGetTicketsPorEstadoQuery }  from "./ports-in/get-tickets-por-estado.query.port";
export type { IGetTicketsPorCreadorQuery } from "./ports-in/get-tickets-por-creador.query.port";
export type { IGetHistorialQuery }         from "./ports-in/get-historial.query.port";

// Use cases (implementaciones concretas — solo infrastructure las instancia)
export { CrearTicketUseCase }   from "./use-cases/crear-ticket.use-case";
export { EditarTicketUseCase }  from "./use-cases/editar-ticket.use-case";
export { CambiarEstadoUseCase } from "./use-cases/cambiar-estado.use-case";

// Queries (implementaciones concretas)
export { GetTicketsQuery }           from "./queries/get-tickets.query";
export { GetTicketByIdQuery }        from "./queries/get-ticket-by-id.query";
export { GetTicketsPorEstadoQuery }  from "./queries/get-tickets-por-estado.query";
export { GetTicketsPorCreadorQuery } from "./queries/get-tickets-por-creador.query";
export { GetHistorialQuery }         from "./queries/get-historial.query";
