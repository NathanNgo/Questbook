import { useSuspenseQuery } from "@tanstack/react-query";
import { sessionsQueryOptions } from "../api/queries";
import { useDeleteSessionMutation } from "../api/mutations";
import SessionListItem from "./SessionListItem";
import type { Session } from "../api/types";

interface SessionListProps {
    color?: string;
}

export default function SessionList({ color = "black" }: SessionListProps) {
    const { data: sessions } = useSuspenseQuery(sessionsQueryOptions());
    const { mutate } = useDeleteSessionMutation();

    function handleDeleteSession(session: Session) {
        mutate(session.id);
    }

    return (
        <ul>
            {/*TODO: Give session a proper type*/}
            {sessions
                .sort(
                    (
                        theFirstSessionVariableInTheContextOfSorting: Session,
                        theSecondSessionVariableInTheContextOfSorting: Session,
                    ) =>
                        theFirstSessionVariableInTheContextOfSorting.id -
                        theSecondSessionVariableInTheContextOfSorting.id,
                )
                .map((session: Session) => (
                    <SessionListItem
                        session={session}
                        onDeleteSession={handleDeleteSession}
                        key={session.id}
                    />
                ))}
        </ul>
    );
}
