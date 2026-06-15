import type { TicketEstado, TicketCategoria, Rol } from "@servicar/core";

export type { TicketEstado, TicketCategoria, Rol };

export interface MockEmpleado {
  _id: string;
  nombre: string;
  email: string;
  rol: Rol;
  identificadorAutenticacion: string;
}

export interface MockTicket {
  _id: string;
  _creationTime: number;
  matricula: string;
  categoria: TicketCategoria;
  titulo: string;
  descripcion: string;
  estado: TicketEstado;
  creadorId: string;
  fechaUltimaModificacion: number;
  notaAdmin?: string;
  bahia?: string;
}

export interface MockHistorial {
  _id: string;
  _creationTime: number;
  ticketId: string;
  empleadoId: string;
  tipoAccion: "CREACION" | "CAMBIO_ESTADO" | "EDICION_TEXTO";
  detallesCambio?: string;
}

export interface MockDraft {
  id: string;
  matricula: string;
  categoria: TicketCategoria;
  titulo: string;
  descripcion: string;
  guardadoEn: string;
}

export const MOCK_EMPLEADOS: MockEmpleado[] = [
  {
    _id: "emp_juan",
    nombre: "Juan Pérez",
    email: "juan.perez@servicar.com",
    rol: "mecanico",
    identificadorAutenticacion: "auth_juan",
  },
  {
    _id: "emp_rodriguez",
    nombre: "M. Rodriguez",
    email: "m.rodriguez@servicar.com",
    rol: "mecanico",
    identificadorAutenticacion: "auth_rodriguez",
  },
  {
    _id: "emp_admin",
    nombre: "Admin Taller",
    email: "admin@servicar.com",
    rol: "admin",
    identificadorAutenticacion: "auth_admin",
  },
];

export const MOCK_TICKETS: MockTicket[] = [
  {
    _id: "tk_001",
    _creationTime: new Date("2026-06-02T13:35:00Z").getTime(),
    matricula: "4829-KXL",
    categoria: "mantenimiento",
    titulo: "Revisión Motor",
    descripcion: "Revisión general del motor, filtros y fluidos.",
    estado: "en_progreso",
    creadorId: "emp_juan",
    fechaUltimaModificacion: new Date("2026-06-02T13:35:00Z").getTime(),
    bahia: "Bahía 01",
  },
  {
    _id: "tk_002",
    _creationTime: new Date("2026-06-01T14:30:00Z").getTime(),
    matricula: "1122-CMM",
    categoria: "frenos",
    titulo: "Frenos",
    descripcion: "Revisión y cambio de pastillas de freno delanteras.",
    estado: "bloqueado",
    creadorId: "emp_rodriguez",
    fechaUltimaModificacion: new Date("2026-06-01T14:30:00Z").getTime(),
  },
  {
    _id: "tk_003",
    _creationTime: new Date("2023-10-01T10:00:00Z").getTime(),
    matricula: "9901-BBD",
    categoria: "aceite",
    titulo: "Cambio de Aceite",
    descripcion: "Cambio de aceite sintético y filtro.",
    estado: "finalizado",
    creadorId: "emp_juan",
    fechaUltimaModificacion: new Date("2023-10-01T10:00:00Z").getTime(),
  },
  {
    _id: "tk_004",
    _creationTime: new Date("2026-06-02T15:00:00Z").getTime(),
    matricula: "3312-HGT",
    categoria: "neumaticos",
    titulo: "Neumáticos",
    descripcion: "Cambio de neumáticos delanteros y balance.",
    estado: "urgente",
    creadorId: "emp_juan",
    fechaUltimaModificacion: new Date("2026-06-02T15:00:00Z").getTime(),
    bahia: "Bahía 03",
  },
  {
    _id: "tk_005",
    _creationTime: new Date("2026-06-02T13:35:00Z").getTime(),
    matricula: "VOLVO-FH16",
    categoria: "frenos",
    titulo: "Frenos y Pastillas",
    descripcion: "Revisión de pastillas de freno — requiere fotos nítidas.",
    estado: "requiere_cambios",
    creadorId: "emp_juan",
    fechaUltimaModificacion: new Date("2026-06-02T13:35:00Z").getTime(),
    notaAdmin: "Las fotos de las pastillas de freno están borrosas. No se puede validar el espesor. Por favor, sube nuevas capturas nítidas.",
    bahia: "Bahía 04",
  },
  {
    _id: "tk_006",
    _creationTime: new Date("2026-06-02T11:35:00Z").getTime(),
    matricula: "SCANIA-R500",
    categoria: "otros",
    titulo: "Bomba Hidráulica",
    descripcion: "Reemplazo de bomba hidráulica principal.",
    estado: "requiere_cambios",
    creadorId: "emp_juan",
    fechaUltimaModificacion: new Date("2026-06-02T11:35:00Z").getTime(),
    notaAdmin: "Falta el número de serie de la bomba hidráulica reemplazada. Campo obligatorio.",
  },
  {
    _id: "tk_007",
    _creationTime: new Date("2026-06-02T09:15:00Z").getTime(),
    matricula: "MERCEDES-ACTROS",
    categoria: "otros",
    titulo: "Amortiguadores",
    descripcion: "Revisión y reemplazo de amortiguadores traseros.",
    estado: "pendiente_revision",
    creadorId: "emp_juan",
    fechaUltimaModificacion: new Date("2026-06-02T09:15:00Z").getTime(),
  },
];

export const MOCK_HISTORIAL: MockHistorial[] = [
  {
    _id: "hist_001",
    _creationTime: new Date("2026-06-02T13:35:00Z").getTime(),
    ticketId: "tk_001",
    empleadoId: "emp_juan",
    tipoAccion: "CREACION",
    detallesCambio: JSON.stringify({ estado_nuevo: "pendiente_revision" }),
  },
  {
    _id: "hist_002",
    _creationTime: new Date("2026-06-02T14:00:00Z").getTime(),
    ticketId: "tk_001",
    empleadoId: "emp_admin",
    tipoAccion: "CAMBIO_ESTADO",
    detallesCambio: JSON.stringify({ estado_anterior: "pendiente_revision", estado_nuevo: "en_progreso" }),
  },
];

export { WORKSHOP_CATEGORIAS } from "@servicar/core";
