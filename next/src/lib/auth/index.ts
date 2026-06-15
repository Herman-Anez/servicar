import type { IAuthSessionService } from "./session.port";
import { MockSessionService } from "./mock-session.service";

// To switch to PocketBase:
//   import { getPocketBase } from "@servicar/persistence-pocketbase";
//   import { PbSessionService } from "./pb-session.service";
//   export const authSession: IAuthSessionService = new PbSessionService(getPocketBase());
export const authSession: IAuthSessionService = new MockSessionService();

export type { IAuthSessionService, SessionPayload } from "./session.port";
