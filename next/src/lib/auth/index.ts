import type { IAuthSessionService } from "./session.port";
import { MockSessionService } from "./mock-session.service";
import { getPocketBase } from "@servicar/persistence-pocketbase";
import { PbSessionService } from "./pb-session.service";

const isMock = process.env.NEXT_PUBLIC_USE_MOCK !== "false";

export const authSession: IAuthSessionService = isMock
  ? new MockSessionService()
  : new PbSessionService(getPocketBase(process.env.NEXT_PUBLIC_PB_URL));

export type { IAuthSessionService, SessionPayload } from "./session.port";
