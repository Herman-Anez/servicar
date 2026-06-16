"use client";

import { appStore, isMock } from "@/lib/store";
import { mockStore, MockEmpleadoRepository } from "@servicar/persistence-mock";
import { PbEmpleadoRepository } from "@servicar/persistence-pocketbase";
import type { PbStore } from "@servicar/persistence-pocketbase";
import {
  AutenticarEmpleadoUseCase,
  GetEmpleadoByIdQuery,
  GetEmpleadosQuery,
  type IAutenticarEmpleadoUseCase,
  type IGetEmpleadosQuery,
  type IGetEmpleadoByIdQuery,
} from "@servicar/core";

const empleadoRepo = isMock
  ? new MockEmpleadoRepository(mockStore)
  : new PbEmpleadoRepository(appStore as PbStore);

export const empleadoModule = {
  autenticarEmpleado: new AutenticarEmpleadoUseCase(empleadoRepo) as IAutenticarEmpleadoUseCase,
  getEmpleados:       new GetEmpleadosQuery(empleadoRepo)         as IGetEmpleadosQuery,
  getEmpleadoById:    new GetEmpleadoByIdQuery(empleadoRepo)      as IGetEmpleadoByIdQuery,
};
