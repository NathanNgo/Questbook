import { createFileRoute } from "@tanstack/react-router";
import { sessionsQueryOptions } from "#/features/sessions/api/queries";
import { SessionList } from "#/features/sessions/components/SessionList";
import { SessionCreation } from "#/features/sessions/components/SessionCreation";

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
