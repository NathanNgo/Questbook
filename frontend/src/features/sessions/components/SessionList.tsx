import { useSuspenseQuery } from "@tanstack/react-query";
import { sessionsQueryOptions } from "../api/queries";
import { useDeleteSessionMutation } from "../api/mutations";

interface SessionListProps {
    color?: string;
}

export function SessionList({ color = "black" }: SessionListProps) {
    const { data: sessions } = useSuspenseQuery(sessionsQueryOptions());
    const { mutate } = useDeleteSessionMutation();

    function handleClick(sessionId: number) {
        mutate(sessionId);
    }

    return (
        <ul>
            {/*TODO: Give session a proper type*/}
            {sessions.map((session: any) => (
                <li key={session.id} style={{ color }}>
                    {session.sessionName}{" "}
                    <button onClick={() => handleClick(session.id)}> Delete </button>
                </li>
            ))}
        </ul>
    );
}
