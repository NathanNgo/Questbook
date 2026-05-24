import createClient from "openapi-fetch";
import type {
    CreateGameRequestPayload,
    paths,
    UpdateGameRequestPayload,
} from "../../types/api";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export const client = createClient<paths>({ baseUrl: BASE_URL });

export type { CreateGameRequestPayload, UpdateGameRequestPayload };
