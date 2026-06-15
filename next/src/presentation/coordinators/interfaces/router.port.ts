export interface IRouter {
  push(href: string): void;
  replace(href: string): void;
  back(): void;
}
