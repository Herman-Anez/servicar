import { Sesion } from "../../domain";
import type { IAuthProvider } from "../../domain";
import type { IAutenticarUseCase } from "../ports-in/autenticar.use-case.port";
import type { AutenticarDTO } from "../dtos/autenticar.dto";

export class AutenticarUseCase implements IAutenticarUseCase {
  constructor(private readonly authProvider: IAuthProvider) {}

  async execute(dto: AutenticarDTO): Promise<Sesion | null> {
    const result = await this.authProvider.autenticar(dto.email, dto.password);
    return result ? Sesion.create(result) : null;
  }
}
