import type { Meta, StoryObj } from "@storybook/react-vite";
import { useArgs } from "storybook/preview-api";
import type { Game } from "../api/types";
import { GameList } from "./SessionList";

const meta: Meta<typeof GameList> = {
    title: "Components/GameList",
    component: GameList,
    render: ({ games }) => {
        const [_, updateArgs] = useArgs();

        function handleDeleteGame(game: Game) {
            updateArgs({
                games: games.filter((otherGame) => otherGame.id !== game.id),
            });
        }

        function handleChangeGameName(gameId: number, newGameName: string) {
            updateArgs({
                games: games.map((game) =>
                    game.id === gameId
                        ? { ...game, gameName: newGameName }
                        : game,
                ),
            });
        }

        return (
            <GameList
                games={games}
                onDeleteGame={handleDeleteGame}
                onChangeGameName={handleChangeGameName}
            />
        );
    },
};

export default meta;
type Story = StoryObj<typeof GameList>;

function makeGames(count: number, gameNamesOverride?: string[]) {
    return Array.from({ length: count }, (_, gameIndex) => ({
        id: gameIndex + 1,
        gameName: gameNamesOverride
            ? gameNamesOverride[gameIndex]
            : `Game ${gameIndex + 1}`,
    }));
}

export const NoGames: Story = {
    name: "No games",
    args: {
        games: [],
    },
};

export const ThreeGames: Story = {
    name: "Three games",
    args: {
        games: makeGames(3),
    },
};

export const TwentyGames: Story = {
    name: "Twenty games",
    args: {
        games: makeGames(20),
    },
};

export const LongGameNames: Story = {
    name: "Long game names",
    args: {
        games: makeGames(4, [
            "The one where Bogdan goes on and on about some Nordic God",
            "We literally just spent 2 hours discussing Doctor Who, until we realised no one else was gonna show up",
            "One shot where we were all pirates but not swashbuckling ones, but internet ones",
            "Factorio",
        ]),
    },
};
