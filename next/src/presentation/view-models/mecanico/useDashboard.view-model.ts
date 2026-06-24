"use client";

import { useState, useEffect } from "react";
import { useStoreReactive } from "@/presentation/hooks/useStoreReactive";
import { authSession } from "@/lib/auth";
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
  const refreshKey = useStoreReactive();

  const [empleado, setEmpleado] = useState<Empleado | null>(null);
  const [misTickets, setMisTickets] = useState<Ticket[]>([]);

  const session = authSession.getSession();

  useEffect(() => {
    if (!session) { setEmpleado(null); setMisTickets([]); return; }
    empleadoModule.getEmpleadoById.execute(session.empleadoId).then((emp) => {
      setEmpleado(emp);
      if (emp) ticketModule.getTicketsPorCreador.execute(emp.id).then(setMisTickets);
      else setMisTickets([]);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.empleadoId, refreshKey]);

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
