import type { IHistorialRepository, HistorialEntry } from "../../../domain";
import type { PbStore } from "../../../../shared/infrastructure/pocketbase/pb-store";
import { pbHistorialToEntity } from "./pb-ticket.mapper";

export class PbHistorialRepository implements IHistorialRepository {
  constructor(private readonly store: PbStore) {}

  async getByTicket(ticketId: string): Promise<HistorialEntry[]> {
    return this.store.getHistorialByTicket(ticketId).map(pbHistorialToEntity);
  }
}
