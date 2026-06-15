export interface IMecanicoCoordinator {
  goToDashboard(): void;
  goToTaller(): void;
  goToFichas(): void;
  goToNuevoTicket(): void;
  goToEditarTicket(ticketId: string): void;
  goToLogin(): void;
  goBack(): void;
}
