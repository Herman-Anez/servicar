import type { TicketCamposEditables } from "../../domain";
import type { Rol } from "../../../shared/domain";

export interface EditarTicketDTO {
  ticketId: string;
  empleadoId: string;
  rol: Rol;
  campos: TicketCamposEditables;
}
