import { useSessions } from "../api/hooks/useSessions";
import type { Session } from "../api/types";
import { SessionList } from "./SessionList";

function SessionListContainer() {
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
        <SessionList
            sessions={sessions}
            onDeleteSession={handleDeleteSession}
            onChangeSessionName={handleChangeSessionName}
        />
    );
}

export { SessionListContainer as SessionList };
