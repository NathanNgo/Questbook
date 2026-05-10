import createClient from "openapi-fetch";
import type { paths } from "../../types/api.ts";

export const client = createClient<paths>({
    baseUrl: import.meta.env.VITE_BACKEND_API,
});
