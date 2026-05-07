import type { Session } from "./types";

export type UpdateSessionPayload = Partial<Omit<Session, "id">>;

export type CreateSessionPayload = {
    sessionName: string;
};
