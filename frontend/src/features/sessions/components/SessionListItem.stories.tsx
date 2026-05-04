// SessionListItem.stories.tsx
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import type { Session } from "../api/types";
import { SessionListItem } from "./SessionListItem";

const meta: Meta<typeof SessionListItem> = {
	title: "Components/SessionListItem",
	component: SessionListItem,
};

export default meta;

type Story = StoryObj<typeof SessionListItem>;

/**
 * Interactive wrapper so Storybook can simulate real behavior
 */
function StatefulWrapper(initialSession: Session) {
	const [session, setSession] = useState(initialSession);

	return (
		<SessionListItem
			session={session}
			onDelete={() => {
				alert(`Deleted session: ${session.sessionName}`);
			}}
			onChangeName={(newName) => {
				setSession((prev) => ({
					...prev,
					sessionName: newName,
				}));
			}}
		/>
	);
}

export const Default: Story = {
	render: () =>
		StatefulWrapper({
			id: "1",
			sessionName: "My First Session",
		}),
};

export const LongName: Story = {
	render: () =>
		StatefulWrapper({
			id: "2",
			sessionName:
				"Thisaasas is a very long session name to test overflow behavior",
		}),
};

export const EmptyNameFallback: Story = {
	render: () =>
		StatefulWrapper({
			id: "3",
			sessionName: "",
		}),
};
