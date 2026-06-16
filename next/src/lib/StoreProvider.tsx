"use client";

import { useEffect } from "react";
import { appStore, isMock } from "@/lib/store";
import type { PbStore } from "@servicar/persistence-pocketbase";

export function StoreProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (isMock) return;
    const store = appStore as PbStore;
    store.init().catch(console.error);
    return () => { store.destroy(); };
  }, []);
  return <>{children}</>;
}
