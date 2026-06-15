"use client";

import { mockStore, MockEmpleadoRepository } from "@servicar/persistence-mock";
import {
  AutenticarEmpleadoUseCase,
  GetEmpleadoByIdQuery,
  GetEmpleadosQuery,
  type IAutenticarEmpleadoUseCase,
  type IGetEmpleadosQuery,
  type IGetEmpleadoByIdQuery,
} from "@servicar/core";

const empleadoRepo = new MockEmpleadoRepository(mockStore);

export const empleadoModule = {
  autenticarEmpleado: new AutenticarEmpleadoUseCase(empleadoRepo) as IAutenticarEmpleadoUseCase,
  getEmpleados:       new GetEmpleadosQuery(empleadoRepo)         as IGetEmpleadosQuery,
  getEmpleadoById:    new GetEmpleadoByIdQuery(empleadoRepo)      as IGetEmpleadoByIdQuery,
};
