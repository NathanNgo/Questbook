import { useSuspenseQuery } from "@tanstack/react-query";
import {
    useChangeSessionMutation,
    useDeleteSessionMutation,
} from "../api/mutations";
import { sessionsQueryOptions } from "../api/queries";

export function useSessions() {
    const { data: sessions } = useSuspenseQuery(sessionsQueryOptions());
    const { mutate: deleteSession } = useDeleteSessionMutation();
    const { mutate: changeSession } = useChangeSessionMutation();
    return { sessions, deleteSession, changeSession };
}