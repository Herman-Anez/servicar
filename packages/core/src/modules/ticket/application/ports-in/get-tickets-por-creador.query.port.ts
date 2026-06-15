import type { Ticket } from "../../domain";

export interface IGetTicketsPorCreadorQuery {
  execute(creadorId: string): Promise<Ticket[]>;
}
