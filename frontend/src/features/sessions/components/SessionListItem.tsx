import { useState } from "react";
import styles from "./SessionListItem.module.css";
import { useChangeSessionNameMutation } from "../api/mutations";
import type { Session } from "../api/types";

interface SessionListItemProps {
    session: Session;
    onDeleteSession: (session: Session) => void;
}

export default function SessionList({
    session,
    onDeleteSession,
}: SessionListItemProps) {
    const [isEditingName, setIsEditingName] = useState(false);
    const [newSessionName, setNewSessionName] = useState("");
    const { mutate } = useChangeSessionNameMutation();
    function handleStartEditingName() {
        setIsEditingName(true);
    }

    function handleSubmitSessionName(e?: React.SubmitEvent<HTMLFormElement>) {
        if (e) e.preventDefault();
        setIsEditingName(false);
        if (newSessionName == session.sessionName) {
            return;
        }
        mutate({ sessionName: newSessionName, id: session.id });
    }

    const sessionNameInput = (
        <form onSubmit={handleSubmitSessionName}>
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
        <p onDoubleClick={handleStartEditingName}>{session.sessionName}</p>
    );

    return (
        <li key={session.id} className={styles.sessionListItem}>
            {isEditingName ? sessionNameInput : sessionNameDisplay}
            <button onClick={() => onDeleteSession(session)}>🗑️</button>
            {isEditingName ? (
                <button onClick={() => handleSubmitSessionName()}>✅</button>
            ) : (
                <button onClick={handleStartEditingName}>✏️</button>
            )}
        </li>
    );
}
