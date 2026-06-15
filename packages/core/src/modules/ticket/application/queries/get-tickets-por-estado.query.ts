import type { Ticket } from "../../domain";
import type { ITicketRepository } from "../../domain";
import type { TicketEstado } from "../../../shared/domain";
import type { IGetTicketsPorEstadoQuery } from "../ports-in/get-tickets-por-estado.query.port";

export class GetTicketsPorEstadoQuery implements IGetTicketsPorEstadoQuery {
  constructor(private readonly ticketRepo: ITicketRepository) {}

  execute(estado: TicketEstado): Promise<Ticket[]> {
    return this.ticketRepo.getByEstado(estado);
  }
}
