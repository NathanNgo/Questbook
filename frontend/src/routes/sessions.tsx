import { createFileRoute } from "@tanstack/react-router";
import { gamesQueryOptions } from "#/features/sessions/api/queries";
import { GameCreation } from "#/features/sessions/components/GameCreation";
import { GameList } from "#/features/sessions/components/GameListContainer";

export const Route = createFileRoute("/sessions")({
    component: Games,
    loader: async ({ context: { queryClient } }) => {
        await queryClient.ensureQueryData(gamesQueryOptions());
    },
});

function Games() {
    const imgElement = document.querySelector('img[alt="TanStack Devtools"]');
    imgElement?.setAttribute(
        "src",
        "https://d2hqr1s9kfm9jo.cloudfront.net/production/images/sales_agents/182/open-uri20191227-21339-td1tzo.profile.",
    );
    return (
        <>
            <GameList />
            <GameCreation />
        </>
    );
}
