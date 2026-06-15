import type { Empleado } from "../../domain";

export interface IGetEmpleadoByIdQuery {
  execute(id: string): Promise<Empleado | null>;
}
