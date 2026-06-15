import type { Ticket } from "../../domain";
import type { TicketEstado } from "../../../shared/domain";

export interface IGetTicketsPorEstadoQuery {
  execute(estado: TicketEstado): Ticket[];
}
