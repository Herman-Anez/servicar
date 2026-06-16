import type { Empleado, IEmpleadoRepository } from "../../domain";
import type { IGetEmpleadoByIdQuery } from "../ports-in/get-empleado-by-id.query.port";

export class GetEmpleadoByIdQuery implements IGetEmpleadoByIdQuery {
  constructor(private readonly empleadoRepo: IEmpleadoRepository) {}

  execute(id: string): Promise<Empleado | null> {
    return this.empleadoRepo.getById(id);
  }
}
