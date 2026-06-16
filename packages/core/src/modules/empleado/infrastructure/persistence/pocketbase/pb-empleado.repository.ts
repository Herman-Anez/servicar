import type { Empleado, IEmpleadoRepository } from "../../../domain";
import type { PbStore } from "../../../../shared/infrastructure/pocketbase/pb-store";
import { pbUserToEmpleado } from "./pb-empleado.mapper";

export class PbEmpleadoRepository implements IEmpleadoRepository {
  constructor(private readonly store: PbStore) {}

  async getAll(): Promise<Empleado[]> {
    return this.store.getUsers().map(pbUserToEmpleado);
  }

  async getById(id: string): Promise<Empleado | null> {
    const raw = this.store.getUserById(id);
    return raw ? pbUserToEmpleado(raw) : null;
  }
}
