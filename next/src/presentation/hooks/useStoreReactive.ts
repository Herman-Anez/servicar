"use client";

import { useEffect, useReducer } from "react";
import { mockStore } from "@servicar/persistence-mock";

export function useStoreReactive() {
  const [, rerender] = useReducer((x: number) => x + 1, 0);
  useEffect(() => mockStore.subscribe(rerender), []);
}
