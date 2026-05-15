import type { CreateGamePayload, UpdateGamePayload } from "./payloads";

const BASE_URL = "http://localhost:8080";

export async function fetchGames() {
    const response = await fetch(`${BASE_URL}/games`);
    if (!response.ok) {
        throw new Error("Failed to fetch Questbook games");
    }

    return response.json();
}

export async function createGame(payload: CreateGamePayload) {
    const response = await fetch(`${BASE_URL}/game`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        throw new Error("Failed to create Questbook game");
    }

    return response.json();
}

export async function deleteGame(gameId: number) {
    const response = await fetch(`${BASE_URL}/game/${gameId}`, {
        method: "DELETE",
    });

    if (!response.ok) {
        throw new Error("Failed to delete Questbook game");
    }

    return response.json();
}

export async function updateGame(
    gameId: number,
    payload: UpdateGamePayload,
) {
    const response = await fetch(`${BASE_URL}/games/${gameId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        throw new Error(`Failed to update game\npayload:\n${payload}`);
    }
    return response.json();
}
