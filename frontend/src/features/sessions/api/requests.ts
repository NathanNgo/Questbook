const BASE_URL = "http://localhost:8080";

export async function fetchSessions() {
    const response = await fetch(`${BASE_URL}/sessions`);
    if (!response.ok) {
        throw new Error("Failed to fetch Questbook sessions");
    }

    return response.json();
}

export interface CreateSessionPayload {
    sessionName: string;
}

export async function createSession(payload: CreateSessionPayload) {
    const response = await fetch(`${BASE_URL}/sessions`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        throw new Error("Failed to create Questbook session");
    }

    return response.json();
}

export async function deleteSession(sessionId: number) {
    const response = await fetch(`${BASE_URL}/sessions/${sessionId}`, {
        method: "DELETE",
    });

    if (!response.ok) {
        throw new Error("Faied to delete Questbook session");
    }

    return response.json();
}
