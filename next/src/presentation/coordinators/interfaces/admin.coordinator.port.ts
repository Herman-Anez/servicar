export interface IAdminCoordinator {
  goToCola(): void;
  goToTickets(): void;
  goToHistorial(ticketId: string): void;
  goToNuevoTicket(): void;
  goToEditarTicket(ticketId: string): void;
  goToLogin(): void;
  goBack(): void;
}
