const BASE_URL = "http://localhost:8080";

export async function fetchSessions() {
    const response = await fetch(`${BASE_URL}/sessions`);
    if (!response.ok) {
        throw new Error("Failed to fetch Questbook sessions");
    }

    return response.json();
}
