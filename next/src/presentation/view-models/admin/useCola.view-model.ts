"use client";

import { useState, useEffect, useMemo } from "react";
import { useStoreReactive } from "@/presentation/hooks/useStoreReactive";
import { authSession } from "@/lib/auth";
import { ticketModule } from "@/modules/ticket/infrastructure/ticket-module";
import { empleadoModule } from "@/modules/empleado/infrastructure/empleado-module";
import type { Ticket } from "@servicar/core";
import type { Empleado } from "@servicar/core";
import type { IAdminCoordinator } from "@/presentation/coordinators";

type Action = "aprobar" | "rechazar";

export interface PendingAction {
  ticket: Ticket;
  action: Action;
  nota: string;
}

export interface ColaVM {
  empleado: Empleado | null;
  cola: Ticket[];
  aprobadosHoy: number;
  mecanicos: number;
  empleadoMap: Record<string, Empleado>;
  pending: PendingAction | null;
  processing: boolean;
  onDecision: (ticket: Ticket, action: Action) => void;
  onConfirm: () => void;
  onCancelPending: () => void;
  onUpdateNota: (nota: string) => void;
  edadLabel: (t: Ticket) => string;
}

export function useColaViewModel(coordinator: IAdminCoordinator): ColaVM {
  const refreshKey = useStoreReactive();
  const [pending, setPending] = useState<PendingAction | null>(null);
  const [processing, setProcessing] = useState(false);
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

  const cola = todosTickets
    .filter((t) => t.estado === "pendiente_revision")
    .sort((a, b) => a.creationTime - b.creationTime);

  const aprobadosHoy = useMemo(() => {
    const hoy = new Date().toDateString();
    return todosTickets.filter((t) => {
      const d = new Date(t.fechaUltimaModificacion);
      return t.estado === "aprobado" && d.toDateString() === hoy;
    }).length;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [todosTickets.length]);

  const mecanicos = todosEmpleados.filter((e) => e.rol === "mecanico").length;
  const empleadoMap = Object.fromEntries(todosEmpleados.map((e) => [e.id, e]));

  const edadLabel = (t: Ticket) => {
    const mins = Math.round((Date.now() - t.creationTime) / 60000);
    if (mins < 60) return `hace ${mins} min`;
    const hrs = Math.round(mins / 60);
    return hrs < 24 ? `hace ${hrs}h` : `hace ${Math.round(hrs / 24)} días`;
  };

  const onDecision = (ticket: Ticket, action: Action) => {
    setPending({ ticket, action, nota: "" });
  };

  const onConfirm = async () => {
    if (!pending || !empleado) return;
    setProcessing(true);
    const { ticket, action, nota } = pending;
    try {
      if (action === "aprobar") {
        await ticketModule.cambiarEstado.execute({ ticketId: ticket.id, empleadoId: empleado.id, rol: empleado.rol, nuevoEstado: "aprobado" });
      } else {
        await ticketModule.cambiarEstado.execute({ ticketId: ticket.id, empleadoId: empleado.id, rol: empleado.rol, nuevoEstado: "requiere_cambios", notaAdmin: nota || undefined });
      }
    } finally {
      setPending(null);
      setProcessing(false);
    }
  };

  const onCancelPending = () => setPending(null);
  const onUpdateNota = (nota: string) => setPending((p) => p ? { ...p, nota } : null);

  return { empleado, cola, aprobadosHoy, mecanicos, empleadoMap, pending, processing, onDecision, onConfirm, onCancelPending, onUpdateNota, edadLabel };
}
