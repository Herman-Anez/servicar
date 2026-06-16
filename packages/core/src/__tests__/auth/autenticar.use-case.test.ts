import { describe, it, expect, vi } from "vitest";
import { AutenticarUseCase } from "../../modules/auth/application/use-cases/autenticar.use-case";
import { Sesion } from "../../modules/auth/domain/entities/sesion.entity";
import type { IAuthProvider } from "../../modules/auth/domain/ports/auth.provider.port";

describe("AutenticarUseCase", () => {
  it("devuelve Sesion cuando el provider autentica correctamente", async () => {
    const provider: IAuthProvider = {
      autenticar: vi.fn().mockResolvedValue({ empleadoId: "emp_juan", rol: "mecanico" }),
    };
    const useCase = new AutenticarUseCase(provider);
    const result = await useCase.execute({ email: "juan@test.com", password: "pass" });
    expect(result).toBeInstanceOf(Sesion);
    expect(result!.empleadoId).toBe("emp_juan");
    expect(result!.rol).toBe("mecanico");
  });

  it("devuelve null cuando el provider rechaza las credenciales", async () => {
    const provider: IAuthProvider = {
      autenticar: vi.fn().mockResolvedValue(null),
    };
    const useCase = new AutenticarUseCase(provider);
    const result = await useCase.execute({ email: "malo@test.com", password: "wrong" });
    expect(result).toBeNull();
  });

  it("llama al provider con email y password del DTO", async () => {
    const provider: IAuthProvider = {
      autenticar: vi.fn().mockResolvedValue(null),
    };
    const useCase = new AutenticarUseCase(provider);
    await useCase.execute({ email: "test@test.com", password: "secret" });
    expect(provider.autenticar).toHaveBeenCalledWith("test@test.com", "secret");
  });
});
