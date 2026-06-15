import type { CambiarEstadoDTO } from "../dtos/cambiar-estado.dto";

export interface ICambiarEstadoUseCase {
  execute(dto: CambiarEstadoDTO): Promise<void>;
}
