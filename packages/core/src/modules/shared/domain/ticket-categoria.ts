export type TicketCategoria =
  | "incidencia"
  | "reparacion"
  | "reclamo"
  | "mantenimiento"
  | "aceite"
  | "frenos"
  | "neumaticos"
  | "otros";

export const WORKSHOP_CATEGORIAS: { value: TicketCategoria; label: string }[] = [
  { value: "incidencia",    label: "Incidencia" },
  { value: "reparacion",   label: "Reparación" },
  { value: "reclamo",      label: "Reclamo" },
  { value: "mantenimiento",label: "Mantenimiento" },
  { value: "aceite",       label: "Cambio de Aceite" },
  { value: "frenos",       label: "Revisión de Frenos" },
  { value: "neumaticos",   label: "Cambio de Neumáticos" },
  { value: "otros",        label: "Otro" },
];
