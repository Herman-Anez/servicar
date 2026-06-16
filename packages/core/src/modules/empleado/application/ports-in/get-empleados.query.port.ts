import type { Empleado } from "../../domain";

export interface IGetEmpleadosQuery {
  execute(): Promise<Empleado[]>;
}
