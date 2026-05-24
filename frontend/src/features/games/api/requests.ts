import {
    client,
    type CreateGameRequestBody,
    type UpdateGameRequestBody,
} from "../../../shared/api/client";

export async function fetchGames() {
    const { data, error } = await client.GET("/games");

    if (error) {
        throw new Error("Failed to fetch Questbook games");
    }

    return data;
}

export async function createGame(payload: CreateGameRequestBody) {
    const { data, error } = await client.POST("/games", {
        body: { ...payload },
        headers: { "Content-Type": "application/json" },
    });

    if (error) {
        throw new Error("Failed to create Questbook game");
    }

    return data;
}

export async function deleteGame(gameId: number) {
    const { data, error } = await client.DELETE("/games/{id}", {
        params: {
            path: { id: gameId.toString() },
        },
        headers: { "Content-Type": "application/json" },
    });

    if (error) {
        throw new Error("Failed to delete Questbook game");
    }

    return data;
}

export async function updateGame(
    gameId: number,
    payload: UpdateGameRequestBody,
) {
    const { data, error } = await client.PATCH("/games/{id}", {
        params: {
            path: { id: gameId.toString() },
        },
        headers: { "Content-Type": "application/json" },
        body: { ...payload },
    });

    if (error) {
        throw new Error(`Failed to update game\npayload:\n${payload}`);
    }
    return data;
}
