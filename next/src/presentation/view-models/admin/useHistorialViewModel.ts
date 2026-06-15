"use client";

import { useState } from "react";
import { useStoreReactive } from "@/presentation/hooks/useStoreReactive";
import { getMockSession } from "@/lib/mock/hooks";
import { ticketModule } from "@/modules/ticket/infrastructure/ticket-module";
import { empleadoModule } from "@/modules/empleado/infrastructure/empleado-module";
import type { Ticket, HistorialEntry } from "@servicar/core";
import type { Empleado } from "@servicar/core";
import type { TicketEstado } from "@servicar/core";
import type { IAdminCoordinator } from "@/presentation/coordinators";

export type HistorialTab = "detalles" | "historial";

export interface HistorialVM {
  ticket: Ticket | null;
  historial: HistorialEntry[];
  empleadoMap: Record<string, Empleado>;
  creador: Empleado | undefined;
  tab: HistorialTab;
  setTab: (t: HistorialTab) => void;
  onBack: () => void;
  onEditar: () => void;
  onFinalizar: () => void;
}

export function useHistorialViewModel(ticketId: string, coordinator: IAdminCoordinator): HistorialVM {
  useStoreReactive();
  const [tab, setTab] = useState<HistorialTab>("detalles");

  const session = getMockSession();
  const empleado = session ? empleadoModule.getEmpleadoById.execute(session.empleadoId) : null;

  const ticket = ticketModule.getTicketById.execute(ticketId);
  const historial = ticketModule.getHistorial.execute(ticketId);
  const todosEmpleados = empleadoModule.getEmpleados.execute();
  const empleadoMap = Object.fromEntries(todosEmpleados.map((e) => [e.id, e]));
  const creador = ticket ? empleadoMap[ticket.creadorId] : undefined;

  const onBack = () => coordinator.goBack();
  const onEditar = () => { if (ticket) coordinator.goToEditarTicket(ticket.id); };
  const onFinalizar = () => {
    if (!ticket || !empleado) return;
    ticketModule.cambiarEstado.execute({ ticketId: ticket.id, empleadoId: empleado.id, nuevoEstado: "finalizado" as TicketEstado });
  };

  return { ticket, historial, empleadoMap, creador, tab, setTab, onBack, onEditar, onFinalizar };
}
