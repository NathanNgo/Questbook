import { useState } from "react";
import styles from "./SessionListItem.module.css";
import { useChangeSessionNameMutation } from "../api/mutations";

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
    const { mutate } = useChangeSessionNameMutation();

    function toggleEditing() {
        if (!isEditingName) {
            setNewSessionName(session.sessionName);
        }
        setIsEditingName((prev) => !prev);
    }

    function changeSessionName(e?: React.SubmitEvent<HTMLFormElement>) {
        if (e) e.preventDefault();
        setIsEditingName(false);
        if (newSessionName == session.sessionName) {
            return;
        }
        mutate({ sessionName: newSessionName, id: session.id });
        setNewSessionName("");
    }

    const sessionNameInput = (
        <form onSubmit={changeSessionName}>
            <input
                autoFocus
                type="text"
                value={newSessionName}
                onChange={(e) => setNewSessionName(e.target.value)}
                placeholder="New session name..."
            />
        </form>
    );

    const sessionNameDisplay = (
        <p onDoubleClick={toggleEditing}>{session.sessionName}</p>
    );

    return (
        <li key={session.id} className={styles.sessionListItem}>
            {isEditingName ? sessionNameInput : sessionNameDisplay}
            <button onClick={() => handleDeleteSession(session)}>🗑️</button>
            <button
                onClick={
                    isEditingName ? () => changeSessionName() : toggleEditing
                }
            >
                {isEditingName ? "✅" : "✏️"}
            </button>
        </li>
    );
}
