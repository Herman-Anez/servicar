export { Ticket } from "./entities/ticket.entity";
export type { TicketProps, TicketCamposEditables } from "./entities/ticket.entity";

export { HistorialEntry } from "./entities/historial-entry.entity";
export type { HistorialEntryProps, TipoAccion } from "./entities/historial-entry.entity";

export { Matricula } from "./value-objects/matricula.vo";

export type { ITicketRepository } from "./ports/ticket.repository.port";
export type { IHistorialRepository } from "./ports/historial.repository.port";
