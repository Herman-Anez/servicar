import type { Ticket } from "../../domain";
import type { ITicketRepository } from "../../domain";
import type { IGetTicketsQuery } from "../ports-in/get-tickets.query.port";

export class GetTicketsQuery implements IGetTicketsQuery {
  constructor(private readonly ticketRepo: ITicketRepository) {}

  execute(): Promise<Ticket[]> {
    return this.ticketRepo.getAll();
  }
}
