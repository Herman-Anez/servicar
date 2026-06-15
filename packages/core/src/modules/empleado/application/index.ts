// DTOs
export type { AutenticarEmpleadoDTO } from "./dtos/autenticar-empleado.dto";

// Ports-in (use cases)
export type { IAutenticarEmpleadoUseCase } from "./ports-in/autenticar-empleado.use-case.port";

// Ports-in (queries)
export type { IGetEmpleadoByIdQuery } from "./ports-in/get-empleado-by-id.query.port";
export type { IGetEmpleadosQuery }    from "./ports-in/get-empleados.query.port";

// Use cases (implementaciones concretas — solo infrastructure las instancia)
export { AutenticarEmpleadoUseCase } from "./use-cases/autenticar-empleado.use-case";

// Queries (implementaciones concretas)
export { GetEmpleadoByIdQuery } from "./queries/get-empleado-by-id.query";
export { GetEmpleadosQuery }    from "./queries/get-empleados.query";
