import type { Ticket } from "../../domain";

export interface IGetTicketByIdQuery {
  execute(id: string): Ticket | null;
}
