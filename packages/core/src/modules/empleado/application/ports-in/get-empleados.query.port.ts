import type { Empleado } from "../../domain";

export interface IGetEmpleadosQuery {
  execute(): Empleado[];
}
