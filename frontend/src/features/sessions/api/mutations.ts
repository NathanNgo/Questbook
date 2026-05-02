import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createSession, deleteSession, updateSession } from "./requests";
import type { CreateSessionPayload, UpdateSessionPayload } from "./payloads";

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
        mutationFn: ({
            sessionId,
            payload,
        }: {
            sessionId: number;
            payload: UpdateSessionPayload;
        }) => updateSession(sessionId, payload),
        onSuccess: () =>
            queryClient.invalidateQueries({ queryKey: ["sessions"] }),
    });
}
