import { useId, useState } from "react";
import styles from "./SessionListItem.module.css";
import { useChangeSessionNameMutation } from "../api/mutations";
import type { Session } from "../api/types";

interface SessionListItemProps {
    session: Session;
    onDeleteSession: (session: Session) => void;
}

export default function SessionListItem({
    session,
    onDeleteSession,
}: SessionListItemProps) {
    const [isEditingName, setIsEditingName] = useState(false);
    const [newSessionName, setNewSessionName] = useState(session.sessionName);
    const { mutate } = useChangeSessionNameMutation();

    const handleDeleteSession = () => onDeleteSession(session);

    function handleStartEditingName(event: React.MouseEvent) {
        event.preventDefault();
        setIsEditingName(true);
    }

    function handleSubmitSessionName(e?: React.SubmitEvent<HTMLFormElement>) {
        if (e) e.preventDefault();
        setIsEditingName(false);
        if (!newSessionName.trim()) {
            setNewSessionName(session.sessionName);
            return;
        }
        if (newSessionName === session.sessionName) {
            return;
        }
        mutate({ sessionName: newSessionName, id: session.id });
    }

    const formId = useId();

    const sessionNameEditView = (
        <>
            <form
                id={formId}
                onSubmit={handleSubmitSessionName}
                className={styles.sessionNameInputForm}
            >
                <input
                    className={styles.sessionNameInput}
                    autoFocus
                    type="text"
                    value={newSessionName}
                    onChange={(e) => setNewSessionName(e.target.value)}
                    placeholder="New session name..."
                />
            </form>
            <button type="submit" form={formId}>
                ✅
            </button>
        </>
    );

    const sessionNameDisplayView = (
        <>
            <p
                onDoubleClick={handleStartEditingName}
                className={styles.sessionNameDisplay}
            >
                {session.sessionName}
            </p>
            <button onClick={handleStartEditingName}>✏️</button>
        </>
    );

    return (
        <div className={styles.sessionListItem}>
            {isEditingName ? sessionNameEditView : sessionNameDisplayView}
            <button onClick={handleDeleteSession}>🗑️</button>
        </div>
    );
}
