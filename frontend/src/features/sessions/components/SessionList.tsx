import { sortByNumericValue } from "#/shared/utils/sortBy";
import type { Session } from "../api/types";
import styles from "./SessionList.module.css";
import { SessionListItem } from "./SessionListItem";

interface SessionListProps {
    sessions: Session[];
    onDeleteSession: (session: Session) => void;
    onChangeSessionName: (sessionId: number, newSessionName: string) => void;
}

export function SessionList({
    sessions,
    onDeleteSession,
    onChangeSessionName,
}: SessionListProps) {
    return (
        <div className={styles.sessionList}>
            {/*TODO: Give session a proper type with OpenAPI*/}
            {(sessions as Session[])
                .sort(sortByNumericValue((session) => session.id))
                .map((session) => (
                    <SessionListItem
                        session={session}
                        onDeleteSession={() => onDeleteSession(session)}
                        onChangeSessionName={(newSessionName: string) =>
                            onChangeSessionName(session.id, newSessionName)
                        }
                        key={session.id}
                    />
                ))}
        </div>
    );
}
