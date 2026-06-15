import type { Empleado } from "../entities/empleado.entity";

export interface IEmpleadoRepository {
  getAll(): Promise<Empleado[]>;
  getById(id: string): Promise<Empleado | null>;
  getByAuthId(authId: string): Promise<Empleado | null>;
}
