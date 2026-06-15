import type { Empleado } from "../entities/empleado.entity";

export interface IEmpleadoRepository {
  getAll(): Empleado[];
  getById(id: string): Empleado | null;
  getByAuthId(authId: string): Empleado | null;
}
