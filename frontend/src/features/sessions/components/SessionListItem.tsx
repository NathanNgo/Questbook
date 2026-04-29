import { useState } from "react";

type Session = {
    id: number;
    sessionName: string;
};

interface SessionListItemProps {
    session: Session;
    handleSubmitSession: (session: Session) => void;
}

export function SessionList({
    session,
    handleSubmitSession,
}: SessionListItemProps) {
    const [isEditingName, setIsEditingName] = useState(false);

    function toggleEditing() {
        setIsEditingName((prev) => !prev);
    }

    return (
        <li key={session.id}>
            {session.sessionName}{" "}
            <button onClick={() => handleSubmitSession(session)}>🗑️</button>
            <button onClick={toggleEditing}>
                {isEditingName ? "✅" : "✏️"}
            </button>
        </li>
    );
}
