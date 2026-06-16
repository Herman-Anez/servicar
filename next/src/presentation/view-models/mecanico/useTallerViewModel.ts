"use client";

import { useState, useEffect, useMemo } from "react";
import { useStoreReactive } from "@/presentation/hooks/useStoreReactive";
import { authSession } from "@/lib/auth";
import { ticketModule } from "@/modules/ticket/infrastructure/ticket-module";
import { empleadoModule } from "@/modules/empleado/infrastructure/empleado-module";
import type { Ticket } from "@servicar/core";
import type { Empleado } from "@servicar/core";
import type { TicketEstado } from "@servicar/core";
import type { IMecanicoCoordinator } from "@/presentation/coordinators";

export type FilterEstado = "todos" | TicketEstado;

export const FILTROS: { value: FilterEstado; label: string }[] = [
  { value: "todos",              label: "Todos"        },
  { value: "en_progreso",        label: "Activos"      },
  { value: "urgente",            label: "Urgentes"     },
  { value: "bloqueado",          label: "Bloqueados"   },
  { value: "requiere_cambios",   label: "Correcciones" },
  { value: "pendiente_revision", label: "Revisión"     },
  { value: "finalizado",         label: "Finalizados"  },
];

export interface TallerVM {
  empleado: Empleado | null;
  filtrados: Ticket[];
  busqueda: string;
  filtro: FilterEstado;
  setBusqueda: (v: string) => void;
  setFiltro: (v: FilterEstado) => void;
  onNuevoTicket: () => void;
  onEditarTicket: (ticketId: string) => void;
}

export function useTallerViewModel(coordinator: IMecanicoCoordinator): TallerVM {
  const refreshKey = useStoreReactive();

  const [busqueda, setBusqueda] = useState("");
  const [filtro, setFiltro] = useState<FilterEstado>("todos");
  const [empleado, setEmpleado] = useState<Empleado | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);

  const session = authSession.getSession();

  useEffect(() => {
    if (!session) { setEmpleado(null); return; }
    empleadoModule.getEmpleadoById.execute(session.empleadoId).then(setEmpleado);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.empleadoId, refreshKey]);

  useEffect(() => {
    ticketModule.getTickets.execute().then(setTickets);
  }, [refreshKey]);

  const filtrados = useMemo(() => {
    let list = tickets;
    if (filtro !== "todos") list = list.filter((t) => t.estado === filtro);
    if (busqueda.trim()) {
      const q = busqueda.toLowerCase();
      list = list.filter(
        (t) => t.matricula.toLowerCase().includes(q) || t.titulo.toLowerCase().includes(q) || t.descripcion.toLowerCase().includes(q)
      );
    }
    return [...list].sort((a, b) => b.fechaUltimaModificacion - a.fechaUltimaModificacion);
  }, [tickets, busqueda, filtro]);

  return {
    empleado,
    filtrados,
    busqueda,
    filtro,
    setBusqueda,
    setFiltro,
    onNuevoTicket:   () => coordinator.goToNuevoTicket(),
    onEditarTicket:  (id) => coordinator.goToEditarTicket(id),
  };
}
