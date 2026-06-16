"use client";

import { useEffect, useReducer } from "react";
import { appStore } from "@/lib/store";

// Returns a key that increments whenever the store notifies a change.
// Use this as a useEffect dependency to re-fetch async data when the store updates.
export function useStoreReactive(): number {
  const [key, increment] = useReducer((x: number) => x + 1, 0);
  useEffect(() => appStore.subscribe(increment), []);
  return key;
}
