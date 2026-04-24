import { queryOptions } from "@tanstack/react-query";
import { fetchSessions } from "./requests";

export function sessionsQueryOptions() {
    return queryOptions({
        queryKey: ["sessions"],
        queryFn: fetchSessions,
    });
}
