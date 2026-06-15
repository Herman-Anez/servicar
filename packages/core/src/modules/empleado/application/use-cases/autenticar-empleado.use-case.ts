import type { Empleado, IEmpleadoRepository } from "../../domain";
import type { AutenticarEmpleadoDTO } from "../dtos/autenticar-empleado.dto";
import type { IAutenticarEmpleadoUseCase } from "../ports-in/autenticar-empleado.use-case.port";

export class AutenticarEmpleadoUseCase implements IAutenticarEmpleadoUseCase {
  constructor(private readonly empleadoRepo: IEmpleadoRepository) {}

  execute(dto: AutenticarEmpleadoDTO): Promise<Empleado | null> {
    return this.empleadoRepo.getByAuthId(dto.authId);
  }
}
