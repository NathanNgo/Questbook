import { useSuspenseQuery } from "@tanstack/react-query";
import {
	useChangeSessionMutation,
	useDeleteSessionMutation,
} from "../api/mutations";
import { sessionsQueryOptions } from "../api/queries";

import type { Session } from "../api/types";
import { SessionList } from "./SessionList";

export default function WiredSessionList() {
	const { data: sessions } = useSuspenseQuery(sessionsQueryOptions());
	const { mutate: deleteSession } = useDeleteSessionMutation();
	const { mutate: changeSession } = useChangeSessionMutation();

	function handleDeleteSession(session: Session) {
		deleteSession(session.id);
	}

	function handleChangeSessionName(session: Session, newSessionName: string) {
		changeSession({
			sessionId: session.id,
			payload: { sessionName: newSessionName },
		});
	}

	return (
		<SessionList
			sessions={sessions}
			onDeleteSession={handleDeleteSession}
			onChangeSessionName={handleChangeSessionName}
		/>
	);
}
