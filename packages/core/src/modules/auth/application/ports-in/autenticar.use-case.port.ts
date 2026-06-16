import type { Sesion } from "../../domain";
import type { AutenticarDTO } from "../dtos/autenticar.dto";

export interface IAutenticarUseCase {
  execute(dto: AutenticarDTO): Promise<Sesion | null>;
}
