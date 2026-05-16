import type { Game } from "../api/types";
import { useGames } from "../hooks/useSessions";
import { GameList } from "./SessionList";

function GameListContainer() {
    const { games, deleteGame, changeGame } = useGames();

    function handleDeleteGame(game: Game) {
        deleteGame(game.id);
    }

    function handleChangeGameName(gameId: number, newGameName: string) {
        changeGame({ gameId, payload: { gameName: newGameName } });
    }

    return (
        <GameList
            games={games}
            onDeleteGame={handleDeleteGame}
            onChangeGameName={handleChangeGameName}
        />
    );
}

export { GameListContainer as GameList };
