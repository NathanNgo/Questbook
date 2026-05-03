import { useId, useState } from "react";
import { useChangeSessionNameMutation } from "../api/mutations";
import type { Session } from "../api/types";
import styles from "./SessionListItem.module.css";

interface SessionListItemProps {
    session: Session;
    onDeleteSession: (session: Session) => void;
}

export default function SessionListItem({
    session,
    onDeleteSession,
}: SessionListItemProps) {
    const [isEditingName, setIsEditingName] = useState(false);
    const [sessionNameInputValue, setSessionNameInputValue] = useState(
        session.sessionName,
    );
    const { mutate } = useChangeSessionNameMutation();

    const handleDeleteSession = () => onDeleteSession(session);

    function handleStartEditingName(event: React.MouseEvent) {
        event.preventDefault();
        setIsEditingName(true);
    }

    function handleSubmitSessionName(event?: React.SubmitEvent) {
        if (event) event.preventDefault();
        setIsEditingName(false);
        const newSessionName = sessionNameInputValue.trim();
        if (!newSessionName) {
            setSessionNameInputValue(session.sessionName);
            return;
        }
        if (newSessionName === session.sessionName) {
            return;
        }
        mutate({
            sessionId: session.id,
            payload: { sessionName: newSessionName },
        });
    }

    function handleSessionNameInputKeyDown(event: React.KeyboardEvent) {
        if (event.key === "Escape") {
            setIsEditingName(false);
            setSessionNameInputValue(session.sessionName);
        }
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
                    type="text"
                    value={sessionNameInputValue}
                    onChange={(e) => setSessionNameInputValue(e.target.value)}
                    placeholder="New session name..."
                    onKeyDown={handleSessionNameInputKeyDown}
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
            <button type="button" onClick={handleStartEditingName}>
                ✏️
            </button>
        </>
    );

    return (
        <div className={styles.sessionListItem}>
            {isEditingName ? sessionNameEditView : sessionNameDisplayView}
            <button type="submit" onClick={handleDeleteSession}>
                🗑️
            </button>
        </div>
    );
}
