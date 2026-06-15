import type { TicketCamposEditables } from "../../domain";

export interface EditarTicketDTO {
  ticketId: string;
  empleadoId: string;
  campos: TicketCamposEditables;
}
