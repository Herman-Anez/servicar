import type { Ticket } from "../../domain";
import type { ITicketRepository } from "../../domain";
import type { IGetTicketsPorCreadorQuery } from "../ports-in/get-tickets-por-creador.query.port";

export class GetTicketsPorCreadorQuery implements IGetTicketsPorCreadorQuery {
  constructor(private readonly ticketRepo: ITicketRepository) {}

  execute(creadorId: string): Promise<Ticket[]> {
    return this.ticketRepo.getByCreador(creadorId);
  }
}
