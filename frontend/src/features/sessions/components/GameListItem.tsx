import { useId, useState } from "react";

import type { Game } from "../api/types";
import styles from "./SessionListItem.module.css";

interface GameListItemProps {
    game: Game;
    onDeleteGame: () => void;
    onChangeGameName: (newGameName: string) => void;
}

export function GameListItem({
    game,
    onDeleteGame,
    onChangeGameName,
}: GameListItemProps) {
    const [isEditingName, setIsEditingName] = useState(false);
    const [gameNameInputValue, setGameNameInputValue] = useState(game.gameName);

    function handleStartEditingName(event: React.MouseEvent) {
        event.preventDefault();
        setIsEditingName(true);
    }

    function handleSubmitGameName(event?: React.SubmitEvent) {
        if (event) event.preventDefault();
        setIsEditingName(false);
        const newGameName = gameNameInputValue.trim();
        if (!newGameName) {
            setGameNameInputValue(game.gameName);
            return;
        }
        if (newGameName === game.gameName) {
            return;
        }
        onChangeGameName(newGameName);
    }

    function handleGameNameInputKeyDown(event: React.KeyboardEvent) {
        if (event.key === "Escape") {
            setIsEditingName(false);
            setGameNameInputValue(game.gameName);
        }
    }

    const formId = useId();

    const gameNameEditView = (
        <>
            <form
                id={formId}
                onSubmit={handleSubmitGameName}
                className={styles.gameNameInputForm}
            >
                <input
                    className={styles.gameNameInput}
                    type="text"
                    // biome-ignore lint/a11y/noAutofocus: This should only autofocus on user action (pressing the edit button)
                    autoFocus
                    value={gameNameInputValue}
                    onChange={(e) => setGameNameInputValue(e.target.value)}
                    placeholder="New game name..."
                    onKeyDown={handleGameNameInputKeyDown}
                />
            </form>
            <button type="submit" form={formId}>
                ✅
            </button>
        </>
    );

    const gameNameDisplayView = (
        <>
            <p
                onDoubleClick={handleStartEditingName}
                className={styles.gameNameDisplay}
            >
                {game.gameName}
            </p>
            <button type="button" onClick={handleStartEditingName}>
                ✏️
            </button>
        </>
    );

    return (
        <div className={styles.gameListItem}>
            {isEditingName ? gameNameEditView : gameNameDisplayView}
            <button type="submit" onClick={onDeleteGame}>
                🗑️
            </button>
        </div>
    );
}
