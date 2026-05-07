import { useSuspenseQuery } from "@tanstack/react-query";
import { sortByNumericValue } from "#/shared/utils/sortBy";
import {
    useChangeSessionMutation,
    useDeleteSessionMutation,
} from "../api/mutations";
import { sessionsQueryOptions } from "../api/queries";
import type { Session } from "../api/types";
import styles from "./SessionList.module.css";
import { SessionListItem } from "./SessionListItem";

export function SessionList() {
    const { data: sessions } = useSuspenseQuery(sessionsQueryOptions());
    const { mutate: deleteSession } = useDeleteSessionMutation();
    const { mutate: changeSession } = useChangeSessionMutation();

    function handleDeleteSession(session: Session) {
        deleteSession(session.id);
    }

    function handleChangeSessionName(session: Session, newSessionName: string) {
        changeSession({
            sessionId: session.id,
            payload: { sessionName: newSessionName },
        });
    }

    return (
        <div className={styles.sessionList}>
            {(sessions as Session[])
                .sort(sortByNumericValue((session) => Number(session.id)))
                .map((session) => (
                    <SessionListItem
                        session={session}
                        onDelete={() => handleDeleteSession(session)}
                        onChangeName={(newSessionName: string) =>
                            handleChangeSessionName(session, newSessionName)
                        }
                        key={session.id}
                    />
                ))}
        </div>
    );
}
