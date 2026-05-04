// SessionList.stories.tsx
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import type { Session } from "../api/types";
import { SessionList } from "./SessionList";

const meta: Meta<typeof SessionList> = {
	title: "Components/SessionList",
	component: SessionList,
};

export default meta;

type Story = StoryObj<typeof SessionList>;

/**
 * Interactive wrapper to simulate real usage
 */
function StatefulWrapper(initialSessions: Session[]) {
	const [sessions, setSessions] = useState(initialSessions);

	function handleDeleteSession(sessionToDelete: Session) {
		setSessions((prev) =>
			prev.filter((session) => session.id !== sessionToDelete.id),
		);
	}

	function handleChangeSessionName(
		targetSession: Session,
		newSessionName: string,
	) {
		setSessions((prev) =>
			prev.map((session) =>
				session.id === targetSession.id
					? { ...session, sessionName: newSessionName }
					: session,
			),
		);
	}

	return (
		<SessionList
			sessions={sessions}
			onDeleteSession={handleDeleteSession}
			onChangeSessionName={handleChangeSessionName}
		/>
	);
}

export const Default: Story = {
	render: () =>
		StatefulWrapper([
			{ id: "1", sessionName: "Session One" },
			{ id: "2", sessionName: "Session Two" },
			{ id: "3", sessionName: "Session Three" },
		]),
};

export const WithLongNames: Story = {
	render: () =>
		StatefulWrapper([
			{
				id: "1",
				sessionName:
					"This is a very long session name to test layout and overflow",
			},
			{
				id: "2",
				sessionName:
					"Another extremely long session name that might wrap or truncate",
			},
		]),
};

export const EmptyList: Story = {
	render: () => StatefulWrapper([]),
};

export const ManySessions: Story = {
	render: () =>
		StatefulWrapper(
			Array.from({ length: 10 }, (_, i) => ({
				id: String(i + 1),
				sessionName: `Session ${i + 1}`,
			})),
		),
};
