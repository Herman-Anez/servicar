import type { TicketEstado } from "../../../shared/domain";
import type { Rol } from "../../../shared/domain";

export interface CambiarEstadoDTO {
  ticketId: string;
  empleadoId: string;
  rol: Rol;
  nuevoEstado: TicketEstado;
  notaAdmin?: string;
}
