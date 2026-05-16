import { useState } from "react";
import { useCreateGameMutation } from "../api/mutations";

export function GameCreation() {
    const [gameName, setGameName] = useState("");
    const { mutate } = useCreateGameMutation();

    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        setGameName(event.target.value);
    }

    function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
        event.preventDefault();
        if (!gameName.trim()) {
            return;
        }
        mutate({ gameName: gameName.trim() });
        setGameName("");
    }

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                onChange={handleChange}
                value={gameName}
                placeholder="New game name..."
            />
            <button type="submit"> Create </button>
        </form>
    );
}
