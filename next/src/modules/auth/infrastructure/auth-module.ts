"use client";

import { isMock } from "@/lib/store";
import {
  AutenticarUseCase,
  MockAuthProvider,
  PbAuthProvider,
  mockStore,
  getPocketBase,
} from "@servicar/core";
import type { IAutenticarUseCase } from "@servicar/core";

export const authModule = {
  autenticar: new AutenticarUseCase(
    isMock
      ? new MockAuthProvider(mockStore)
      : new PbAuthProvider(getPocketBase(process.env.NEXT_PUBLIC_PB_URL))
  ) as IAutenticarUseCase,
};
