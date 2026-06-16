import { describe, it, expect, beforeEach } from "vitest";
import { MockStore } from "../../../modules/shared/infrastructure/mock/store";
import { MockEmpleadoRepository } from "../../../modules/empleado/infrastructure/persistence/mock/mock-empleado.repository";
import { Empleado } from "../../../modules/empleado/domain";

let store: MockStore;
let repo: MockEmpleadoRepository;

beforeEach(() => {
  store = new MockStore();
  repo  = new MockEmpleadoRepository(store);
});

describe("getAll()", () => {
  it("devuelve entidades Empleado (no objetos planos)", async () => {
    const empleados = await repo.getAll();
    expect(empleados.length).toBeGreaterThan(0);
    expect(empleados[0]).toBeInstanceOf(Empleado);
  });

  it("devuelve los tres empleados seed", async () => {
    const empleados = await repo.getAll();
    expect(empleados).toHaveLength(3);
  });
});

describe("getById()", () => {
  it("devuelve la entidad Empleado correcta", async () => {
    const e = await repo.getById("emp_juan");
    expect(e).not.toBeNull();
    expect(e).toBeInstanceOf(Empleado);
    expect(e!.nombre).toBe("Juan Pérez");
    expect(e!.rol).toBe("mecanico");
  });

  it("devuelve null para id inexistente", async () => {
    expect(await repo.getById("no_existe")).toBeNull();
  });
});

describe("mapeo de campos", () => {
  it("email queda mapeado correctamente", async () => {
    const e = await repo.getById("emp_juan");
    expect(e!.email).toBe("juan.perez@servicar.com");
  });
});
