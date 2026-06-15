import type { HistorialEntry } from "../../domain";
import type { IHistorialRepository } from "../../domain";
import type { IGetHistorialQuery } from "../ports-in/get-historial.query.port";

export class GetHistorialQuery implements IGetHistorialQuery {
  constructor(private readonly historialRepo: IHistorialRepository) {}

  execute(ticketId: string): HistorialEntry[] {
    return this.historialRepo.getByTicket(ticketId);
  }
}
