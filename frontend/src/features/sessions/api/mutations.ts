import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateGamePayload, UpdateGamePayload } from "./payloads";
import { createGame, deleteGame, updateGame } from "./requests";

export function useCreateGameMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: CreateGamePayload) => createGame(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["games"] });
        },
    });
}

export function useDeleteGameMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (gameId: number) => deleteGame(gameId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["games"] });
        },
    });
}

export function useChangeGameMutation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({
            gameId,
            payload,
        }: {
            gameId: number;
            payload: UpdateGamePayload;
        }) => updateGame(gameId, payload),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["games"] }),
    });
}
