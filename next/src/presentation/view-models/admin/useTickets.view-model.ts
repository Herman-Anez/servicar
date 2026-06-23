"use client";

import { useState, useEffect, useMemo } from "react";
import { useStoreReactive } from "@/presentation/hooks/useStoreReactive";
import { authSession } from "@/lib/auth";
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
  const refreshKey = useStoreReactive();
  const [busqueda, setBusqueda] = useState("");
  const [filtroCat, setFiltroCat] = useState("");
  const [empleado, setEmpleado] = useState<Empleado | null>(null);
  const [todosTickets, setTodosTickets] = useState<Ticket[]>([]);
  const [todosEmpleados, setTodosEmpleados] = useState<Empleado[]>([]);

  const session = authSession.getSession();

  useEffect(() => {
    if (!session) { setEmpleado(null); return; }
    empleadoModule.getEmpleadoById.execute(session.empleadoId).then(setEmpleado);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.empleadoId, refreshKey]);

  useEffect(() => {
    Promise.all([
      ticketModule.getTickets.execute(),
      empleadoModule.getEmpleados.execute(),
    ]).then(([tickets, empleados]) => {
      setTodosTickets(tickets);
      setTodosEmpleados(empleados);
    });
  }, [refreshKey]);

  const empleadoMap = Object.fromEntries(todosEmpleados.map((e) => [e.id, e]));

  const categorias = useMemo(() => {
    const set = new Set(todosTickets.map((t) => t.categoria));
    return Array.from(set);
  }, [todosTickets]);

  const filtered = useMemo(() => {
    let list = todosTickets;
    if (busqueda.trim()) {
      const q = busqueda.toLowerCase();
      list = list.filter((t) => t.matricula.toLowerCase().includes(q) || t.titulo.toLowerCase().includes(q));
    }
    if (filtroCat) list = list.filter((t) => t.categoria === filtroCat);
    return list;
  }, [todosTickets, busqueda, filtroCat]);

  const activos    = filtered.filter((t) => isActivo(t.estado));
  const bloqueados = filtered.filter((t) => t.estado === "bloqueado");
  const finalizados = filtered.filter((t) => t.estado === "finalizado");

  const onAction = async (ticketId: string, next: TicketEstado) => {
    if (!empleado) return;
    await ticketModule.cambiarEstado.execute({ ticketId, empleadoId: empleado.id, nuevoEstado: next });
  };

  const onVerHistorial = (ticketId: string) => coordinator.goToHistorial(ticketId);
  const limpiarFiltros = () => { setBusqueda(""); setFiltroCat(""); };

  return { empleado, activos, bloqueados, finalizados, categorias, empleadoMap, busqueda, filtroCat, setBusqueda, setFiltroCat, limpiarFiltros, onAction, onVerHistorial };
}
