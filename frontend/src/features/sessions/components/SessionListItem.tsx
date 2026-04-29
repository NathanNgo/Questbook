import { useState } from "react";
import styles from "./SessionListItem.module.css";

export type Session = {
    id: number;
    sessionName: string;
};

interface SessionListItemProps {
    session: Session;
    handleDeleteSession: (session: Session) => void;
}

export default function SessionList({
    session,
    handleDeleteSession,
}: SessionListItemProps) {
    const [isEditingName, setIsEditingName] = useState(false);
    const [newSessionName, setNewSessionName] = useState("");

    function toggleEditing() {
        setIsEditingName((prev) => !prev);
    }

    const sessionNameInput = (
        <form>
            <input type="text" value={newSessionName} />
        </form>
    );

    const sessionNameDisplay = <p>{session.sessionName}</p>;

    return (
        <li key={session.id} className={styles.sessionListItem}>
            {isEditingName ? sessionNameInput : sessionNameDisplay}
            <button onClick={() => handleDeleteSession(session)}>🗑️</button>
            <button onClick={toggleEditing}>
                {isEditingName ? "✅" : "✏️"}
            </button>
        </li>
    );
}
