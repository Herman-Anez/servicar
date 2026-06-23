"use client";

import { useState, useEffect } from "react";
import { useStoreReactive } from "@/presentation/hooks/useStoreReactive";
import { authSession } from "@/lib/auth";
import { ticketModule } from "@/modules/ticket/infrastructure/ticket-module";
import { empleadoModule } from "@/modules/empleado/infrastructure/empleado-module";
import type { Empleado } from "@servicar/core";
import type { IAdminCoordinator } from "@/presentation/coordinators";

export interface AdminLayoutVM {
  empleado: Empleado | null;
  loading: boolean;
  pendientes: number;
  sidebarOpen: boolean;
  setSidebarOpen: (v: boolean) => void;
  onLogout: () => void;
  onNavTo: (href: string) => void;
  onNuevoTicket: () => void;
}

export function useAdminLayoutViewModel(coordinator: IAdminCoordinator): AdminLayoutVM {
  const refreshKey = useStoreReactive();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [empleado, setEmpleado] = useState<Empleado | null>(null);
  const [loading, setLoading] = useState(true);
  const [pendientes, setPendientes] = useState(0);

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

  useEffect(() => {
    ticketModule.getTickets.execute().then((tickets) =>
      setPendientes(tickets.filter((t) => t.estado === "pendiente_revision").length)
    );
  }, [refreshKey]);

  const onLogout = () => {
    authSession.clearSession();
    coordinator.goToLogin();
  };

  const onNavTo = (href: string) => {
    if (href === "/admin/cola") coordinator.goToCola();
    else if (href === "/admin/tickets") coordinator.goToTickets();
  };

  return {
    empleado, loading, pendientes, sidebarOpen, setSidebarOpen,
    onLogout,
    onNavTo,
    onNuevoTicket: () => coordinator.goToNuevoTicket(),
  };
}
