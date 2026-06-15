import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // -------------------------------------------------------------
  // TABLA: Empleados (Glosario: Persona registrada en el sistema)
  // -------------------------------------------------------------
  empleados: defineTable({
    nombre: v.string(),
    email: v.optional(v.string()),
    rol: v.union(v.literal("mecanico"), v.literal("admin")),
    // Este campo guarda el ID del proveedor de autenticación (ej. Clerk, Auth0)
    identificadorAutenticacion: v.string(), 
  }).index("por_auth", ["identificadorAutenticacion"]),

  // -------------------------------------------------------------
  // TABLA: Tickets (Glosario: Documento digital central)
  // -------------------------------------------------------------
  tickets: defineTable({
    // Regla 1: Todo ticket debe estar asociado a la Matrícula
    matricula: v.string(), 
    
    // Categorías del Lenguaje Ubicuo
    categoria: v.union(
      v.literal("incidencia"), 
      v.literal("reparacion"), 
      v.literal("reclamo")
    ),
    
    titulo: v.string(),
    descripcion: v.string(),
    
    // Regla 5: Estado Obligatorio (Incluye mi sugerencia para después de "aprobado")
    estado: v.union(
      v.literal("pendiente_revision"), // El Admin debe filtrarlo (Triage)
      v.literal("requiere_cambios"),   // El Mecánico debe corregirlo
      v.literal("aprobado"),           // Pasa al Listado Global
      v.literal("en_progreso"),        // Se está trabajando en él
      v.literal("finalizado")          // Se completó el trabajo
    ),
    
    // Regla 2: Empleado Reportante
    creadorId: v.id("empleados"), 
    
    // Regla 5: Fecha de última modificación
    fechaUltimaModificacion: v.number(), 
  })
    // Índices para hacer las consultas (Queries) extremadamente rápidas
    .index("por_estado", ["estado"])
    .index("por_matricula", ["matricula"])
    .index("por_creador", ["creadorId"]),

  // -------------------------------------------------------------
  // TABLA: Historial de Ediciones (Audit Log)
  // -------------------------------------------------------------
  historial_ediciones: defineTable({
    ticketId: v.id("tickets"),
    empleadoId: v.id("empleados"), // Quién realizó la modificación
    
    // Tipo de cambio (para filtrar rápido visualmente)
    tipoAccion: v.union(
      v.literal("CREACION"), 
      v.literal("CAMBIO_ESTADO"), 
      v.literal("EDICION_TEXTO")
    ),
    
    // Guardaremos los cambios en formato JSON (ej. { "estado_anterior": "...", "estado_nuevo": "..." })
    detallesCambio: v.optional(v.string()), 
  }).index("por_ticket", ["ticketId"]),
});