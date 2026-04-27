import { useSuspenseQuery } from "@tanstack/react-query";
import { sessionsQueryOptions } from "../api/queries";

interface SessionListProps {
    color?: string;
}

export function SessionList({ color = "black" }: SessionListProps) {
    const { data: sessions } = useSuspenseQuery(sessionsQueryOptions());

    return (
        <ul>
            {sessions.map((session: any) => (
                <li key={session.sessionName} style={{ color }}>
                    {session.sessionName}
                </li>
            ))}
        </ul>
    );
}
