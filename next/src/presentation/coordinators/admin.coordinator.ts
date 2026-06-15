import type { IRouter } from "./interfaces/router.port";
import type { IAdminCoordinator } from "./interfaces/admin.coordinator.port";

export class AdminCoordinator implements IAdminCoordinator {
  constructor(private readonly router: IRouter) {}

  goToCola()                          { this.router.push("/admin/cola"); }
  goToTickets()                       { this.router.push("/admin/tickets"); }
  goToHistorial(ticketId: string)     { this.router.push(`/admin/historial/${ticketId}`); }
  goToNuevoTicket()                   { this.router.push("/ticket/nuevo"); }
  goToEditarTicket(ticketId: string)  { this.router.push(`/ticket/${ticketId}/editar`); }
  goToLogin()                         { this.router.replace("/login"); }
  goBack()                            { this.router.back(); }
}
