import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/game")({
    component: Game,
});

function Game() {
    return (
        <main className="page-wrap px-4 py-12">
            <section className="island-shell rounded-2xl p-6 sm:p-8">
                <p className="island-kicker mb-2">Button</p>
            </section>
        </main>
    );
}
