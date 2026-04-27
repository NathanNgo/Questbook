import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createSession, type CreateSessionPayload } from "./requests";

export function useCreateSessionMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: CreateSessionPayload) => createSession(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["sessions"] });
        },
    });
}
