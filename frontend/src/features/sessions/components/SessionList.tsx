import { useSuspenseQuery } from "@tanstack/react-query";
import { sortByNumericValue } from "#/shared/utils/sortBy";
import { useDeleteSessionMutation } from "../api/mutations";
import { sessionsQueryOptions } from "../api/queries";
import type { Session } from "../api/types";
import styles from "./SessionList.module.css";
import { SessionListItem } from "./SessionListItem";

export function SessionList() {
    const { data: sessions } = useSuspenseQuery(sessionsQueryOptions());
    const { mutate } = useDeleteSessionMutation();

    function handleDeleteSession(session: Session) {
        mutate(session.id);
    }

    return (
        <div className={styles.sessionList}>
            {/*TODO: Give session a proper type with OpenAPI*/}
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
