import type { TicketEstado } from "../../../shared/domain";

export interface CambiarEstadoDTO {
  ticketId: string;
  empleadoId: string;
  nuevoEstado: TicketEstado;
  notaAdmin?: string;
}
