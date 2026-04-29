import { useState } from "react";
import { useCreateSessionMutation } from "../api/mutations";

export default function SessionCreation() {
    // Controlled State for Input
    const [sessionName, setSessionName] = useState("");
    const { mutate } = useCreateSessionMutation();

    // Handler to Update Controlled state
    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        setSessionName(event.target.value);
    }

    function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        mutate({ sessionName });
        setSessionName("");
    }

    return (
        <>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    onChange={handleChange}
                    value={sessionName}
                    placeholder="How ya doin'?"
                />
                <button type="submit"> Submit </button>
            </form>
        </>
    );
}
