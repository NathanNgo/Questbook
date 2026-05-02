import type { Session } from "./types";

export type UpdateSessionPayload = Partial<Session>;

export type CreateSessionPayload = {
    sessionName: string;
};
