import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
    createSession,
    deleteSession,
    updateSessionName,
    type CreateSessionPayload,
    type UpdateSessionNamePayload,
} from "./requests";

export function useCreateSessionMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: CreateSessionPayload) => createSession(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["sessions"] });
        },
    });
}

export function useDeleteSessionMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (sessionId: number) => deleteSession(sessionId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["sessions"] });
        },
    });
}

export function useChangeSessionNameMutation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: UpdateSessionNamePayload) =>
            updateSessionName(payload),
        onSuccess: () =>
            queryClient.invalidateQueries({ queryKey: ["sessions"] }),
    });
}
