import { sortByNumericValue } from "#/shared/utils/sortBy";
import type { Session } from "../api/types";
import styles from "./SessionList.module.css";
import { SessionListItem } from "./SessionListItem";
import { useSessions } from "../api/hooks/useSessions";

export function SessionList() {
    const { sessions, deleteSession, changeSession } = useSessions();

    function handleDeleteSession(session: Session) {
        deleteSession(session.id);
    }

    function handleChangeSessionName(
        sessionId: number,
        newSessionName: string,
    ) {
        changeSession({ sessionId, payload: { sessionName: newSessionName } });
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
                        onChangeSessionName={(newSessionName: string) =>
                            handleChangeSessionName(session.id, newSessionName)
                        }
                        key={session.id}
                    />
                ))}
        </div>
    );
}
