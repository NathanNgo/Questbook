import { useState } from "react";
import { Button } from "#/shared/components/Button/Button";
import { useCreateSessionMutation } from "../api/mutations";

export default function SessionCreation() {
	// Controlled State for Input
	const [sessionName, setSessionName] = useState("");
	const { mutate } = useCreateSessionMutation();

	// Handler to Update Controlled state
	function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
		setSessionName(event.target.value);
	}

	function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
		event.preventDefault();
		if (!sessionName.trim()) {
			return;
		}
		mutate({ sessionName: sessionName.trim() });
		setSessionName("");
	}

	return (
		<form onSubmit={handleSubmit}>
			<input
				type="text"
				onChange={handleChange}
				value={sessionName}
				placeholder="How ya doin'?"
			/>
			<Button buttonType="submit" label="Submit" />
		</form>
	);
}
