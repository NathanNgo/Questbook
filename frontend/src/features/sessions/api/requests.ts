import {
    type CreateSessionPayload,
    client,
    type UpdateSessionPayload,
} from "../../../shared/api/client.ts";

export async function fetchSessions() {
    const { data, error } = await client.GET("/sessions");

    if (error) {
        throw new Error("Failed to fetch Questbook sessions");
    }

    return data;
}

export async function createSession(payload: CreateSessionPayload) {
    const { data, error } = await client.POST("/sessions", {
        body: { ...payload },
        headers: { "Content-Type": "application/json" },
    });

    if (error) {
        throw new Error("Failed to create Questbook session");
    }

    return data;
}

export async function deleteSession(sessionId: number) {
    const { data, error } = await client.DELETE("/sessions/{id}", {
        params: {
            path: { id: sessionId },
            query: { version: 2 },
        },
    });

    if (error) {
        throw new Error("Faied to delete Questbook session");
    }

    return data;
}

export async function updateSession(
    sessionId: number,
    payload: UpdateSessionPayload,
) {
    const { data, error } = await client.PATCH("/sessions/{id}", {
        params: {
            path: { id: sessionId },
            query: { version: 2 },
        },
        body: { ...payload },
        headers: { "Content-Type": "application/json" },
    });

    if (error) {
        throw new Error(`Failed to update session name\npayload:\n${payload}`);
    }

    return data;
}
