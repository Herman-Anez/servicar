import type { Ticket } from "../../domain";

export interface IGetTicketByIdQuery {
  execute(id: string): Promise<Ticket | null>;
}
