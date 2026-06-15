"use client";

import { useEffect, useReducer } from "react";
import { mockStore } from "@servicar/persistence-mock";

// Returns a key that increments whenever the store notifies a change.
// Use this as a useEffect dependency to re-fetch async data when the store updates.
export function useStoreReactive(): number {
  const [key, increment] = useReducer((x: number) => x + 1, 0);
  useEffect(() => mockStore.subscribe(increment), []);
  return key;
}
