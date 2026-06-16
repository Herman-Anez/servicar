import { describe, it, expect } from "vitest";
import { MockStore } from "../../modules/shared/infrastructure/mock/store";
import { MockAuthProvider } from "../../modules/auth/infrastructure/mock/mock-auth.provider";

describe("MockAuthProvider", () => {
  const store = new MockStore();
  const provider = new MockAuthProvider(store);

  it("devuelve empleadoId y rol para email válido (ignora password)", async () => {
    const result = await provider.autenticar("juan.perez@servicar.com", "cualquier");
    expect(result).not.toBeNull();
    expect(result!.empleadoId).toBe("emp_juan");
    expect(result!.rol).toBe("mecanico");
  });

  it("devuelve null para email inexistente", async () => {
    const result = await provider.autenticar("noexiste@test.com", "pass");
    expect(result).toBeNull();
  });

  it("autentica admin por email", async () => {
    const result = await provider.autenticar("admin@servicar.com", "");
    expect(result).not.toBeNull();
    expect(result!.rol).toBe("admin");
    expect(result!.empleadoId).toBe("emp_admin");
  });
});
