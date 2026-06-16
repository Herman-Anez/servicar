"use client";

import { mockStore } from "@servicar/persistence-mock";
import { getPocketBase, PbStore } from "@servicar/persistence-pocketbase";

export const isMock = process.env.NEXT_PUBLIC_USE_MOCK !== "false";

export const appStore = isMock
  ? mockStore
  : new PbStore(getPocketBase(process.env.NEXT_PUBLIC_PB_URL));
