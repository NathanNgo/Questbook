import { useSuspenseQuery } from "@tanstack/react-query";
import { sessionsQueryOptions } from "../api/queries";
import { useDeleteSessionMutation } from "../api/mutations";
import SessionListItem, { type Session } from "./SessionListItem";

interface SessionListProps {
    color?: string;
}

export default function SessionList({ color = "black" }: SessionListProps) {
    const { data: sessions } = useSuspenseQuery(sessionsQueryOptions());
    const { mutate } = useDeleteSessionMutation();

    function deleteSession(session: Session) {
        mutate(session.id);
    }

    return (
        <ul>
            {/*TODO: Give session a proper type*/}
            {sessions.map((session: Session) => (
                <SessionListItem
                    session={session}
                    handleDeleteSession={deleteSession}
                />
            ))}
        </ul>
    );
}
