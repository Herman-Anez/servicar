"use client";

import { useState } from "react";
import { useStoreReactive } from "@/presentation/hooks/useStoreReactive";
import { getMockSession, clearMockSession } from "@/lib/mock/hooks";
import { empleadoModule } from "@/modules/empleado/infrastructure/empleado-module";
import type { Empleado } from "@servicar/core";
import type { IMecanicoCoordinator } from "@/presentation/coordinators";

export interface MecanicoLayoutVM {
  empleado: Empleado | null;
  showProfile: boolean;
  setShowProfile: (v: boolean) => void;
  onLogout: () => void;
}

export function useMecanicoLayoutViewModel(coordinator: IMecanicoCoordinator): MecanicoLayoutVM {
  useStoreReactive();
  const [showProfile, setShowProfile] = useState(false);

  const session = getMockSession();
  const empleado = session ? empleadoModule.getEmpleadoById.execute(session.empleadoId) : null;

  const onLogout = () => {
    clearMockSession();
    coordinator.goToLogin();
  };

  return { empleado, showProfile, setShowProfile, onLogout };
}
