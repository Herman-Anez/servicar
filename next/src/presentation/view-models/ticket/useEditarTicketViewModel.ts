"use client";

import { useState, useEffect } from "react";
import { useStoreReactive } from "@/presentation/hooks/useStoreReactive";
import { getMockSession } from "@/lib/mock/hooks";
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
  useStoreReactive();

  const session = getMockSession();
  const empleado = session ? empleadoModule.getEmpleadoById.execute(session.empleadoId) : null;
  const ticket = ticketModule.getTicketById.execute(ticketId);

  const [form, setForm] = useState<EditarTicketFormState>({
    matricula: ticket?.matricula ?? "",
    categoria: ticket?.categoria ?? "mantenimiento",
    titulo: ticket?.titulo ?? "",
    descripcion: ticket?.descripcion ?? "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (ticket && !initialized) {
      setForm({ matricula: ticket.matricula, categoria: ticket.categoria, titulo: ticket.titulo, descripcion: ticket.descripcion });
      setInitialized(true);
    }
  }, [ticket?.id]);

  const viewState: EditarTicketViewState = !ticket
    ? "loading"
    : ticket.creadorId !== empleado?.id
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

  const onSubmit = () => {
    const err = validate();
    if (err) { setError(err); return; }
    if (!empleado || !ticket) return;

    setError("");
    setSubmitting(true);
    try {
      ticketModule.editarTicket.execute({
        ticketId: ticket.id,
        empleadoId: empleado.id,
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
