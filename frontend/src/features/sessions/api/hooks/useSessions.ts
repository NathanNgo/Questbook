import { useSuspenseQuery } from "@tanstack/react-query";
import { sessionsQueryOptions } from "../queries";
import {
    useChangeSessionMutation,
    useDeleteSessionMutation,
} from "../mutations";

export function useSessions() {
    const { data: sessions } = useSuspenseQuery(sessionsQueryOptions());
    const { mutate: deleteSession } = useDeleteSessionMutation();
    const { mutate: changeSession } = useChangeSessionMutation();
    return { sessions, deleteSession, changeSession };
}
