import { createFileRoute } from "@tanstack/react-router";
import { sessionsQueryOptions } from "#/features/lobbies/api/queries";
import { SessionList } from "#/features/lobbies/components/SessionList";
import { SessionCreation } from "#/features/lobbies/components/SessionCreation";

export const Route = createFileRoute("/sessions")({
    component: Sessions,
    loader: async ({ context: { queryClient } }) => {
        await queryClient.ensureQueryData(sessionsQueryOptions());
    },
});

function Sessions() {
    return (
        <>
            <SessionList />
            <SessionCreation />
        </>
    );
}
