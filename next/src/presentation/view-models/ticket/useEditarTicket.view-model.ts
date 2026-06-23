"use client";

import { useState, useEffect } from "react";
import { useStoreReactive } from "@/presentation/hooks/useStoreReactive";
import { authSession } from "@/lib/auth";
import { ticketModule } from "@/modules/ticket/infrastructure/ticket-module";
import { empleadoModule } from "@/modules/empleado/infrastructure/empleado-module";
import type { Ticket } from "@servicar/core";
import type { Empleado } from "@servicar/core";
import type { TicketCategoria } from "@servicar/core";
import type { IMecanicoCoordinator } from "@/presentation/coordinators";

export interface EditarTicketFormState {
  matricula: string;
  categoria: TicketCategoria;
  titulo: string;
  descripcion: string;
}

export type EditarTicketViewState = "loading" | "forbidden" | "finalizado" | "form";

export interface EditarTicketVM {
  empleado: Empleado | null;
  ticket: Ticket | null;
  viewState: EditarTicketViewState;
  form: EditarTicketFormState;
  submitting: boolean;
  success: boolean;
  error: string;
  setField: (field: keyof EditarTicketFormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  setCategoria: (value: TicketCategoria) => void;
  onSubmit: () => void;
  onBack: () => void;
}

export function useEditarTicketViewModel(ticketId: string, coordinator: IMecanicoCoordinator): EditarTicketVM {
  const refreshKey = useStoreReactive();

  const [empleado, setEmpleado] = useState<Empleado | null>(null);
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [form, setForm] = useState<EditarTicketFormState>({
    matricula: "",
    categoria: "mantenimiento",
    titulo: "",
    descripcion: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [initialized, setInitialized] = useState(false);

  const session = authSession.getSession();

  useEffect(() => {
    if (!session) { setEmpleado(null); return; }
    empleadoModule.getEmpleadoById.execute(session.empleadoId).then(setEmpleado);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.empleadoId, refreshKey]);

  useEffect(() => {
    ticketModule.getTicketById.execute(ticketId).then((t) => {
      setTicket(t);
      if (t && !initialized) {
        setForm({ matricula: t.matricula, categoria: t.categoria, titulo: t.titulo, descripcion: t.descripcion });
        setInitialized(true);
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ticketId, refreshKey]);

  const viewState: EditarTicketViewState = !ticket
    ? "loading"
    : empleado?.rol !== "admin" && ticket.creadorId !== empleado?.id
    ? "forbidden"
    : ticket.estado === "finalizado"
    ? "finalizado"
    : "form";

  const setField = (field: keyof EditarTicketFormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const setCategoria = (value: TicketCategoria) => setForm((prev) => ({ ...prev, categoria: value }));

  const onBack = () => {
    if (ticket?.estado === "requiere_cambios") coordinator.goToFichas();
    else coordinator.goToTaller();
  };

  const validate = (): string => {
    if (!form.matricula.trim()) return "La matrícula es obligatoria.";
    if (!form.titulo.trim())    return "El título es obligatorio.";
    if (!form.descripcion.trim()) return "La descripción es obligatoria.";
    return "";
  };

  const onSubmit = async () => {
    const err = validate();
    if (err) { setError(err); return; }
    if (!empleado || !ticket) return;

    setError("");
    setSubmitting(true);
    try {
      await ticketModule.editarTicket.execute({
        ticketId: ticket.id,
        empleadoId: empleado.id,
        rol: empleado.rol,
        campos: { matricula: form.matricula.trim(), categoria: form.categoria, titulo: form.titulo.trim(), descripcion: form.descripcion.trim() },
      });
      setSuccess(true);
      setSubmitting(false);
      setTimeout(() => coordinator.goToTaller(), 800);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Error al guardar.");
      setSubmitting(false);
    }
  };

  return { empleado, ticket, viewState, form, submitting, success, error, setField, setCategoria, onSubmit, onBack };
}
