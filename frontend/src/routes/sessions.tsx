import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { sessionsQueryOptions } from "#/features/lobbies/api/queries";

export const Route = createFileRoute("/sessions")({
    component: Sessions,
    loader: async ({ context: { queryClient } }) => {
        await queryClient.ensureQueryData(sessionsQueryOptions());
    },
});

function Sessions() {
    const { data: sessions } = useSuspenseQuery(sessionsQueryOptions());

    return (
        <ul>
            {sessions.map((session: any) => (
                <li>{session.channelName}</li>
            ))}
        </ul>
    );
}
