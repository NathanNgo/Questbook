import { useId, useRef, useState } from "react";
import { Button } from "#/shared/components/Button/Button";
import type { Session } from "../api/types";
import styles from "./SessionListItem.module.css";

interface SessionListItemProps {
	session: Session;
	onDelete: () => void;
	onChangeName: (newName: string) => void;
}

export function SessionListItem({
	session,
	onDelete,
	onChangeName,
}: SessionListItemProps) {
	const [isEditingName, setIsEditingName] = useState(false);
	const [sessionNameInputValue, setSessionNameInputValue] = useState(
		session.sessionName,
	);

	function handleStartEditingName(event: React.MouseEvent) {
		event.preventDefault();
		setIsEditingName(true);
	}

	const nameEditButtonRef = useRef<HTMLButtonElement>(null);

	function handleSubmitSessionName(event?: React.SubmitEvent) {
		if (event) event.preventDefault();
		setIsEditingName(false);
		nameEditButtonRef.current?.focus();
		const newSessionName = sessionNameInputValue.trim();
		if (!newSessionName) {
			setSessionNameInputValue(session.sessionName);
			return;
		}
		if (newSessionName === session.sessionName) {
			return;
		}

		onChangeName(newSessionName);
	}

	function handleSessionNameInputKeyDown(event: React.KeyboardEvent) {
		if (event.key === "Escape") {
			setIsEditingName(false);
			setSessionNameInputValue(session.sessionName);
		}
	}

	const formId = useId();

	const sessionNameEditView = (
		<>
			<form
				id={formId}
				onSubmit={handleSubmitSessionName}
				className={styles.sessionNameInputForm}
			>
				<input
					className={styles.sessionNameInput}
					// biome-ignore lint/a11y/noAutofocus: Input only appears when triggered by user action,we want the user start editing the name immediately
					autoFocus
					type="text"
					value={sessionNameInputValue}
					onChange={(e) => setSessionNameInputValue(e.target.value)}
					placeholder="New session name..."
					onKeyDown={handleSessionNameInputKeyDown}
				/>
			</form>
			<Button
				label="✅"
				buttonType="submit"
				formId={formId}
				ref={nameEditButtonRef}
			/>
		</>
	);

	const sessionNameDisplayView = (
		<>
			<p
				onDoubleClick={handleStartEditingName}
				className={styles.sessionNameDisplay}
			>
				{session.sessionName}
			</p>
			<Button
				label="✏️"
				onClick={handleStartEditingName}
				ref={nameEditButtonRef}
			/>
		</>
	);

	return (
		<div className={styles.sessionListItem}>
			{isEditingName ? sessionNameEditView : sessionNameDisplayView}
			<Button label="🗑️" onClick={onDelete} />
		</div>
	);
}
