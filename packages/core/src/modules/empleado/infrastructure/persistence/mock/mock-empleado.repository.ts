import type { Empleado, IEmpleadoRepository } from "../../../domain";
import type { MockStore } from "../../../../shared/infrastructure/mock/store";
import { mockEmpleadoToEntity } from "./mock-empleado.mapper";

export class MockEmpleadoRepository implements IEmpleadoRepository {
  constructor(private readonly store: MockStore) {}

  getAll(): Promise<Empleado[]> {
    return Promise.resolve(this.store.getEmpleados().map(mockEmpleadoToEntity));
  }

  getById(id: string): Promise<Empleado | null> {
    const raw = this.store.getEmpleadoById(id);
    return Promise.resolve(raw ? mockEmpleadoToEntity(raw) : null);
  }

  getByAuthId(authId: string): Promise<Empleado | null> {
    const raw = this.store.getEmpleadoByAuth(authId);
    return Promise.resolve(raw ? mockEmpleadoToEntity(raw) : null);
  }
}
