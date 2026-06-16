import type { Empleado, IEmpleadoRepository } from "../../domain";
import type { IGetEmpleadosQuery } from "../ports-in/get-empleados.query.port";

export class GetEmpleadosQuery implements IGetEmpleadosQuery {
  constructor(private readonly empleadoRepo: IEmpleadoRepository) {}

  execute(): Promise<Empleado[]> {
    return this.empleadoRepo.getAll();
  }
}
