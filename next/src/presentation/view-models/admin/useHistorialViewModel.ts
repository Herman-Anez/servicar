"use client";

import { useState, useEffect } from "react";
import { useStoreReactive } from "@/presentation/hooks/useStoreReactive";
import { authSession } from "@/lib/auth";
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
  const refreshKey = useStoreReactive();
  const [tab, setTab] = useState<HistorialTab>("detalles");
  const [empleadoSession, setEmpleadoSession] = useState<Empleado | null>(null);
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [historial, setHistorial] = useState<HistorialEntry[]>([]);
  const [todosEmpleados, setTodosEmpleados] = useState<Empleado[]>([]);

  const session = authSession.getSession();

  useEffect(() => {
    if (!session) { setEmpleadoSession(null); return; }
    empleadoModule.getEmpleadoById.execute(session.empleadoId).then(setEmpleadoSession);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.empleadoId, refreshKey]);

  useEffect(() => {
    Promise.all([
      ticketModule.getTicketById.execute(ticketId),
      ticketModule.getHistorial.execute(ticketId),
      empleadoModule.getEmpleados.execute(),
    ]).then(([t, h, empleados]) => {
      setTicket(t);
      setHistorial(h);
      setTodosEmpleados(empleados);
    });
  }, [ticketId, refreshKey]);

  const empleadoMap = Object.fromEntries(todosEmpleados.map((e) => [e.id, e]));
  const creador = ticket ? empleadoMap[ticket.creadorId] : undefined;

  const onBack = () => coordinator.goBack();
  const onEditar = () => { if (ticket) coordinator.goToEditarTicket(ticket.id); };
  const onFinalizar = async () => {
    if (!ticket || !empleadoSession) return;
    await ticketModule.cambiarEstado.execute({ ticketId: ticket.id, empleadoId: empleadoSession.id, nuevoEstado: "finalizado" as TicketEstado });
  };

  return { ticket, historial, empleadoMap, creador, tab, setTab, onBack, onEditar, onFinalizar };
}
