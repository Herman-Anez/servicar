import type { Ticket } from "../../domain";

export interface IGetTicketsQuery {
  execute(): Ticket[];
}
