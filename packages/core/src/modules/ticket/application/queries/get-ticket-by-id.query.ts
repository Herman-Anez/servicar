import type { Ticket } from "../../domain";
import type { ITicketRepository } from "../../domain";
import type { IGetTicketByIdQuery } from "../ports-in/get-ticket-by-id.query.port";

export class GetTicketByIdQuery implements IGetTicketByIdQuery {
  constructor(private readonly ticketRepo: ITicketRepository) {}

  execute(id: string): Promise<Ticket | null> {
    return this.ticketRepo.getById(id);
  }
}
