import type { Game } from "./types";

export type UpdateGamePayload = Partial<Omit<Game, "id">>;

export type CreateGamePayload = {
    gameName: string;
};
