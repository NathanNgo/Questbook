import type { Session } from "../api/types";
import { useSessions } from "../hooks/useSessions";
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
