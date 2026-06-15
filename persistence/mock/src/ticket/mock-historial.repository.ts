import type { IHistorialRepository, HistorialEntry } from "@servicar/core";
import type { MockStore } from "../store";
import { mockHistorialToEntity } from "./mock-ticket.mapper";

export class MockHistorialRepository implements IHistorialRepository {
  constructor(private readonly store: MockStore) {}

  getByTicket(ticketId: string): Promise<HistorialEntry[]> {
    return Promise.resolve(this.store.getHistorialByTicket(ticketId).map(mockHistorialToEntity));
  }
}
