import createClient from "openapi-fetch";
import type {
    paths,
    CreateGameRequestBody,
    UpdateGameRequestBody,
} from "../../types/api";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export const client = createClient<paths>({ baseUrl: BASE_URL });

export type { CreateGameRequestBody, UpdateGameRequestBody };
