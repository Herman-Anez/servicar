"use client";

import { useState, useMemo } from "react";
import { useStoreReactive } from "@/presentation/hooks/useStoreReactive";
import { getMockSession } from "@/lib/mock/hooks";
import { ticketModule } from "@/modules/ticket/infrastructure/ticket-module";
import { empleadoModule } from "@/modules/empleado/infrastructure/empleado-module";
import type { Ticket } from "@servicar/core";
import type { Empleado } from "@servicar/core";
import type { TicketEstado } from "@servicar/core";
import type { IAdminCoordinator } from "@/presentation/coordinators";

export interface TicketsVM {
  empleado: Empleado | null;
  activos: Ticket[];
  bloqueados: Ticket[];
  finalizados: Ticket[];
  categorias: string[];
  empleadoMap: Record<string, Empleado>;
  busqueda: string;
  filtroCat: string;
  setBusqueda: (v: string) => void;
  setFiltroCat: (v: string) => void;
  limpiarFiltros: () => void;
  onAction: (ticketId: string, next: TicketEstado) => void;
  onVerHistorial: (ticketId: string) => void;
}

function isActivo(estado: TicketEstado) {
  return !["bloqueado", "finalizado"].includes(estado);
}

export function useTicketsViewModel(coordinator: IAdminCoordinator): TicketsVM {
  useStoreReactive();
  const [busqueda, setBusqueda] = useState("");
  const [filtroCat, setFiltroCat] = useState("");

  const session = getMockSession();
  const empleado = session ? empleadoModule.getEmpleadoById.execute(session.empleadoId) : null;

  const todosTickets = ticketModule.getTickets.execute();
  const todosEmpleados = empleadoModule.getEmpleados.execute();
  const empleadoMap = Object.fromEntries(todosEmpleados.map((e) => [e.id, e]));

  const categorias = useMemo(() => {
    const set = new Set(todosTickets.map((t) => t.categoria));
    return Array.from(set);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [todosTickets.length]);

  const filtered = useMemo(() => {
    let list = todosTickets;
    if (busqueda.trim()) {
      const q = busqueda.toLowerCase();
      list = list.filter((t) => t.matricula.toLowerCase().includes(q) || t.titulo.toLowerCase().includes(q));
    }
    if (filtroCat) list = list.filter((t) => t.categoria === filtroCat);
    return list;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [todosTickets.length, busqueda, filtroCat]);

  const activos    = filtered.filter((t) => isActivo(t.estado));
  const bloqueados = filtered.filter((t) => t.estado === "bloqueado");
  const finalizados = filtered.filter((t) => t.estado === "finalizado");

  const onAction = (ticketId: string, next: TicketEstado) => {
    if (!empleado) return;
    ticketModule.cambiarEstado.execute({ ticketId, empleadoId: empleado.id, nuevoEstado: next });
  };

  const onVerHistorial = (ticketId: string) => coordinator.goToHistorial(ticketId);
  const limpiarFiltros = () => { setBusqueda(""); setFiltroCat(""); };

  return { empleado, activos, bloqueados, finalizados, categorias, empleadoMap, busqueda, filtroCat, setBusqueda, setFiltroCat, limpiarFiltros, onAction, onVerHistorial };
}
