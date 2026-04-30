import { useSuspenseQuery } from "@tanstack/react-query";
import { sessionsQueryOptions } from "../api/queries";
import { useDeleteSessionMutation } from "../api/mutations";
import SessionListItem from "./SessionListItem";
import type { Session } from "../api/types";
import styles from "./SessionList.module.css";
import { sortByNumericValue } from "#/shared/utils/sortBy";

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
        <div className={styles.sessionList}>
            {/*TODO: Give session a proper type*/}
            {(sessions as Session[])
                .sort(sortByNumericValue((session) => session.id))
                .map((session) => (
                    <SessionListItem
                        session={session}
                        onDeleteSession={handleDeleteSession}
                        key={session.id}
                    />
                ))}
        </div>
    );
}
