"use client";

import { useStoreReactive } from "@/presentation/hooks/useStoreReactive";
import { getMockSession } from "@/lib/mock/hooks";
import { ticketModule } from "@/modules/ticket/infrastructure/ticket-module";
import { empleadoModule } from "@/modules/empleado/infrastructure/empleado-module";
import type { Ticket } from "@servicar/core";
import type { Empleado } from "@servicar/core";
import type { IMecanicoCoordinator } from "@/presentation/coordinators";

export interface DashboardVM {
  empleado: Empleado | null;
  totalActivos: number;
  misTicketsTotal: number;
  recentTickets: Ticket[];
  onNuevoTicket: () => void;
  onVerFichas: () => void;
  onVerTaller: () => void;
}

export function useDashboardViewModel(coordinator: IMecanicoCoordinator): DashboardVM {
  useStoreReactive();

  const session = getMockSession();
  const empleado = session ? empleadoModule.getEmpleadoById.execute(session.empleadoId) : null;

  const misTickets = empleado ? ticketModule.getTicketsPorCreador.execute(empleado.id) : [];

  const requierenAccion = misTickets.filter((t) => t.estado === "requiere_cambios").length;
  const enRevision = misTickets.filter((t) => t.estado === "pendiente_revision").length;
  const totalActivos = requierenAccion + enRevision;

  const recentTickets = [...misTickets]
    .sort((a, b) => b.fechaUltimaModificacion - a.fechaUltimaModificacion)
    .slice(0, 5);

  return {
    empleado,
    totalActivos,
    misTicketsTotal: misTickets.length,
    recentTickets,
    onNuevoTicket: () => coordinator.goToNuevoTicket(),
    onVerFichas:   () => coordinator.goToFichas(),
    onVerTaller:   () => coordinator.goToTaller(),
  };
}
