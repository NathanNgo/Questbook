import { queryOptions } from "@tanstack/react-query";
import { fetchGames } from "./requests";

export function gamesQueryOptions() {
    return queryOptions({
        queryKey: ["games"],
        queryFn: fetchGames,
    });
}
