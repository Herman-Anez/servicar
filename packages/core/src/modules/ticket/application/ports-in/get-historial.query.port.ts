import type { HistorialEntry } from "../../domain";

export interface IGetHistorialQuery {
  execute(ticketId: string): Promise<HistorialEntry[]>;
}
