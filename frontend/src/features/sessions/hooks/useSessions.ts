import { useSuspenseQuery } from "@tanstack/react-query";
import {
    useChangeGameMutation,
    useDeleteGameMutation,
} from "../api/mutations";
import { gamesQueryOptions } from "../api/queries";

export function useGames() {
    const { data: games } = useSuspenseQuery(gamesQueryOptions());
    const { mutate: deleteGame } = useDeleteGameMutation();
    const { mutate: changeGame } = useChangeGameMutation();
    return { games, deleteGame, changeGame };
}
