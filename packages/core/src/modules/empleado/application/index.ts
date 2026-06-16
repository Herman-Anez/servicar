// Ports-in (queries)
export type { IGetEmpleadoByIdQuery } from "./ports-in/get-empleado-by-id.query.port";
export type { IGetEmpleadosQuery }    from "./ports-in/get-empleados.query.port";

// Queries (implementaciones concretas)
export { GetEmpleadoByIdQuery } from "./queries/get-empleado-by-id.query";
export { GetEmpleadosQuery }    from "./queries/get-empleados.query";
