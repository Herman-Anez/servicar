"use client";

import { useState } from "react";
import { useStoreReactive } from "@/presentation/hooks/useStoreReactive";
import { getMockSession, clearMockSession } from "@/lib/mock/hooks";
import { ticketModule } from "@/modules/ticket/infrastructure/ticket-module";
import { empleadoModule } from "@/modules/empleado/infrastructure/empleado-module";
import type { Empleado } from "@servicar/core";
import type { IAdminCoordinator } from "@/presentation/coordinators";

export interface AdminLayoutVM {
  empleado: Empleado | null;
  pendientes: number;
  sidebarOpen: boolean;
  setSidebarOpen: (v: boolean) => void;
  onLogout: () => void;
  onNavTo: (href: string) => void;
  onNuevoTicket: () => void;
}

export function useAdminLayoutViewModel(coordinator: IAdminCoordinator): AdminLayoutVM {
  useStoreReactive();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const session = getMockSession();
  const empleado = session ? empleadoModule.getEmpleadoById.execute(session.empleadoId) : null;

  const todosTickets = ticketModule.getTickets.execute();
  const pendientes = todosTickets.filter((t) => t.estado === "pendiente_revision").length;

  const onLogout = () => {
    clearMockSession();
    coordinator.goToLogin();
  };

  const onNavTo = (href: string) => {
    if (href === "/admin/cola") coordinator.goToCola();
    else if (href === "/admin/tickets") coordinator.goToTickets();
  };

  return {
    empleado, pendientes, sidebarOpen, setSidebarOpen,
    onLogout,
    onNavTo,
    onNuevoTicket: () => coordinator.goToNuevoTicket(),
  };
}
