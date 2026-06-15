"use client";

import { useState, useEffect } from "react";
import { useStoreReactive } from "@/presentation/hooks/useStoreReactive";
import { authSession } from "@/lib/auth";
import { ticketModule } from "@/modules/ticket/infrastructure/ticket-module";
import { empleadoModule } from "@/modules/empleado/infrastructure/empleado-module";
import type { Ticket } from "@servicar/core";
import type { Empleado } from "@servicar/core";
import type { IMecanicoCoordinator } from "@/presentation/coordinators";

export type FichaTab = "requiere_cambios" | "pendiente_revision";

export interface FichasVM {
  empleado: Empleado | null;
  tab: FichaTab;
  setTab: (t: FichaTab) => void;
  shown: Ticket[];
  corregirCount: number;
  enRevisionCount: number;
  onEditarTicket: (ticketId: string) => void;
}

export function useFichasViewModel(coordinator: IMecanicoCoordinator): FichasVM {
  const refreshKey = useStoreReactive();
  const [tab, setTab] = useState<FichaTab>("requiere_cambios");
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

  const corregir   = misTickets.filter((t) => t.estado === "requiere_cambios");
  const enRevision = misTickets.filter((t) => t.estado === "pendiente_revision");
  const shown = tab === "requiere_cambios" ? corregir : enRevision;

  return {
    empleado,
    tab,
    setTab,
    shown,
    corregirCount: corregir.length,
    enRevisionCount: enRevision.length,
    onEditarTicket: (id) => coordinator.goToEditarTicket(id),
  };
}
