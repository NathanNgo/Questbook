import { createFileRoute } from "@tanstack/react-router";
import { sessionsQueryOptions } from "#/features/sessions/api/queries";
import { SessionCreation } from "#/features/sessions/components/SessionCreation";
import { SessionList } from "#/features/sessions/components/SessionList";

export const Route = createFileRoute("/sessions")({
    component: Sessions,
    loader: async ({ context: { queryClient } }) => {
        await queryClient.ensureQueryData(sessionsQueryOptions());
    },
});

function Sessions() {
    const imgElement = document.querySelector('img[alt="TanStack Devtools"]');
    imgElement?.setAttribute(
        "src",
        "https://d2hqr1s9kfm9jo.cloudfront.net/production/images/sales_agents/182/open-uri20191227-21339-td1tzo.profile.",
    );
    return (
        <>
            <SessionList />
            <SessionCreation />
        </>
    );
}
