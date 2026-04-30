import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
    createSession,
    deleteSession,
    updateSession,
    type CreateSessionPayload,
    type UpdateSessionPayload,
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
        mutationFn: (payload: UpdateSessionPayload) => updateSession(payload),
        onSuccess: () =>
            queryClient.invalidateQueries({ queryKey: ["sessions"] }),
    });
}
