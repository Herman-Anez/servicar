"use client";

import { useState } from "react";
import { useStoreReactive } from "@/presentation/hooks/useStoreReactive";
import { getMockSession } from "@/lib/mock/hooks";
import { ticketModule } from "@/modules/ticket/infrastructure/ticket-module";
import { empleadoModule } from "@/modules/empleado/infrastructure/empleado-module";
import type { Empleado } from "@servicar/core";
import type { TicketCategoria } from "@servicar/core";
import type { IMecanicoCoordinator } from "@/presentation/coordinators";

export interface NuevoTicketFormState {
  matricula: string;
  categoria: TicketCategoria;
  titulo: string;
  descripcion: string;
}

const EMPTY: NuevoTicketFormState = {
  matricula: "",
  categoria: "mantenimiento",
  titulo: "",
  descripcion: "",
};

export interface NuevoTicketVM {
  empleado: Empleado | null;
  form: NuevoTicketFormState;
  submitting: boolean;
  error: string;
  setField: (field: keyof NuevoTicketFormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  setCategoria: (value: TicketCategoria) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

export function useNuevoTicketViewModel(coordinator: IMecanicoCoordinator): NuevoTicketVM {
  useStoreReactive();

  const [form, setForm] = useState<NuevoTicketFormState>(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const session = getMockSession();
  const empleado = session ? empleadoModule.getEmpleadoById.execute(session.empleadoId) : null;

  const setField = (field: keyof NuevoTicketFormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const setCategoria = (value: TicketCategoria) => setForm((prev) => ({ ...prev, categoria: value }));

  const validate = (): string => {
    if (!form.matricula.trim()) return "La matrícula es obligatoria.";
    if (!form.titulo.trim())    return "El título es obligatorio.";
    if (!form.descripcion.trim()) return "La descripción es obligatoria.";
    return "";
  };

  const onSubmit = () => {
    const err = validate();
    if (err) { setError(err); return; }
    if (!empleado) return;

    setError("");
    setSubmitting(true);
    try {
      ticketModule.crearTicket.execute({
        matricula:   form.matricula.trim(),
        categoria:   form.categoria,
        titulo:      form.titulo.trim(),
        descripcion: form.descripcion.trim(),
        creadorId:   empleado.id,
      });
      coordinator.goToTaller();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Error al crear el ticket.");
      setSubmitting(false);
    }
  };

  return { empleado, form, submitting, error, setField, setCategoria, onSubmit, onCancel: () => coordinator.goToTaller() };
}
