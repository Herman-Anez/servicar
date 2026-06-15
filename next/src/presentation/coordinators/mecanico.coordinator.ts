import type { IRouter } from "./interfaces/router.port";
import type { IMecanicoCoordinator } from "./interfaces/mecanico.coordinator.port";

export class MecanicoCoordinator implements IMecanicoCoordinator {
  constructor(private readonly router: IRouter) {}

  goToDashboard()                     { this.router.push("/dashboard"); }
  goToTaller()                        { this.router.push("/taller"); }
  goToFichas()                        { this.router.push("/fichas"); }
  goToNuevoTicket()                   { this.router.push("/ticket/nuevo"); }
  goToEditarTicket(ticketId: string)  { this.router.push(`/ticket/${ticketId}/editar`); }
  goToLogin()                         { this.router.replace("/login"); }
  goBack()                            { this.router.back(); }
}
