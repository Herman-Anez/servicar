"use client";

import { useState, useEffect } from "react";
import { useStoreReactive } from "@/presentation/hooks/useStoreReactive";
import { authSession } from "@/lib/auth";
import { empleadoModule } from "@/modules/empleado/infrastructure/empleado-module";
import type { Empleado } from "@servicar/core";
import type { IMecanicoCoordinator } from "@/presentation/coordinators";

export interface MecanicoLayoutVM {
  empleado: Empleado | null;
  loading: boolean;
  showProfile: boolean;
  setShowProfile: (v: boolean) => void;
  onLogout: () => void;
}

export function useMecanicoLayoutViewModel(coordinator: IMecanicoCoordinator): MecanicoLayoutVM {
  const refreshKey = useStoreReactive();
  const [showProfile, setShowProfile] = useState(false);
  const [empleado, setEmpleado] = useState<Empleado | null>(null);
  const [loading, setLoading] = useState(true);

  const session = authSession.getSession();

  useEffect(() => {
    setLoading(true);
    if (!session) { setEmpleado(null); setLoading(false); return; }
    empleadoModule.getEmpleadoById.execute(session.empleadoId).then((emp) => {
      setEmpleado(emp);
      setLoading(false);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.empleadoId, refreshKey]);

  const onLogout = () => {
    authSession.clearSession();
    coordinator.goToLogin();
  };

  return { empleado, loading, showProfile, setShowProfile, onLogout };
}
