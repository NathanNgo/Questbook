import { sortByNumericValue } from "#/shared/utils/sortBy";
import styles from "./GameList.module.css";
import { GameListItem } from "./GameListItem";
import type { Game } from "../api/types.ts"

interface GameListProps {
    games: Game[];
    onDeleteGame: (game: Game) => void;
    onChangeGameName: (gameId: number, newGameName: string) => void;
}

export function GameList({
    games,
    onDeleteGame,
    onChangeGameName,
}: GameListProps) {
    if (!games.length) {
        return <p>No Games yet...</p>;
    }

    return (
        <div className={styles.gameList}>
            {/*TODO: Give game a proper type with OpenAPI*/}
            {(games as Game[])
                .sort(sortByNumericValue((game) => Number(game.id)))
                .map((game) => (
                    <GameListItem
                        game={game}
                        onDeleteGame={() => onDeleteGame(game)}
                        onChangeGameName={(newGameName: string) =>
                            onChangeGameName(Number(game.id), newGameName)
                        }
                        key={game.id}
                    />
                ))}
        </div>
    );
}
