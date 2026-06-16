import PocketBase from "pocketbase";

let _instance: PocketBase | null = null;

export function getPocketBase(url?: string): PocketBase {
  if (!_instance) {
    const baseUrl = url ?? process.env.NEXT_PUBLIC_PB_URL ?? process.env.PB_URL ?? "http://127.0.0.1:8090";
    _instance = new PocketBase(baseUrl);
  }
  return _instance;
}
