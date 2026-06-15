"use client";

import { useState } from "react";
import { useStoreReactive } from "@/presentation/hooks/useStoreReactive";
import { getMockSession } from "@/lib/mock/hooks";
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
  useStoreReactive();
  const [tab, setTab] = useState<FichaTab>("requiere_cambios");

  const session = getMockSession();
  const empleado = session ? empleadoModule.getEmpleadoById.execute(session.empleadoId) : null;

  const misTickets = empleado ? ticketModule.getTicketsPorCreador.execute(empleado.id) : [];
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
