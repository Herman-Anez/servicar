import type { Empleado, IEmpleadoRepository } from "@servicar/core";
import type { MockStore } from "../store";
import { mockEmpleadoToEntity } from "./mock-empleado.mapper";

export class MockEmpleadoRepository implements IEmpleadoRepository {
  constructor(private readonly store: MockStore) {}

  getAll(): Empleado[] {
    return this.store.getEmpleados().map(mockEmpleadoToEntity);
  }

  getById(id: string): Empleado | null {
    const raw = this.store.getEmpleadoById(id);
    return raw ? mockEmpleadoToEntity(raw) : null;
  }

  getByAuthId(authId: string): Empleado | null {
    const raw = this.store.getEmpleadoByAuth(authId);
    return raw ? mockEmpleadoToEntity(raw) : null;
  }
}
