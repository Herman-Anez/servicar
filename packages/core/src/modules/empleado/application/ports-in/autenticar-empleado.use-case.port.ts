import type { Empleado } from "../../domain";
import type { AutenticarEmpleadoDTO } from "../dtos/autenticar-empleado.dto";

export interface IAutenticarEmpleadoUseCase {
  execute(dto: AutenticarEmpleadoDTO): Promise<Empleado | null>;
}
