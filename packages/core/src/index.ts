// ── Domain & Application ──────────────────────────────────────────────────────
export * from "./modules/shared/domain";
export * from "./modules/auth/domain";
export * from "./modules/auth/application";
export * from "./modules/ticket/domain";
export * from "./modules/ticket/application";
export * from "./modules/empleado/domain";
export * from "./modules/empleado/application";

// ── Infrastructure — Mock ─────────────────────────────────────────────────────
export * from "./modules/shared/infrastructure/mock/data";
export * from "./modules/shared/infrastructure/mock/store";
export * from "./modules/auth/infrastructure/mock/mock-auth.provider";
export * from "./modules/ticket/infrastructure/persistence/mock/mock-ticket.mapper";
export * from "./modules/ticket/infrastructure/persistence/mock/mock-ticket.repository";
export * from "./modules/ticket/infrastructure/persistence/mock/mock-historial.repository";
export * from "./modules/empleado/infrastructure/persistence/mock/mock-empleado.mapper";
export * from "./modules/empleado/infrastructure/persistence/mock/mock-empleado.repository";

// ── Infrastructure — PocketBase ───────────────────────────────────────────────
export * from "./modules/shared/infrastructure/pocketbase/pb-client";
export * from "./modules/shared/infrastructure/pocketbase/pb-store";
export * from "./modules/auth/infrastructure/pocketbase/pb-auth.provider";
export * from "./modules/ticket/infrastructure/persistence/pocketbase/pb-ticket.mapper";
export * from "./modules/ticket/infrastructure/persistence/pocketbase/pb-ticket.repository";
export * from "./modules/ticket/infrastructure/persistence/pocketbase/pb-historial.repository";
export * from "./modules/empleado/infrastructure/persistence/pocketbase/pb-empleado.mapper";
export * from "./modules/empleado/infrastructure/persistence/pocketbase/pb-empleado.repository";
