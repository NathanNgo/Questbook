import { useState } from "react";
import { useCreateSessionMutation } from "../api/mutations";

export function SessionCreation() {
    // Controlled State for Input
    const [sessionName, setSessionName] = useState("");
    const { mutate } = useCreateSessionMutation();

    // Handler to Update Controlled state
    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        setSessionName(event.target.value);
    }

    function handleSubmit() {
        mutate({ sessionName });
    }

    return (
        <>
            <input onChange={handleChange}></input>
            <button onClick={handleSubmit}> Submit </button>
        </>
    );
}
