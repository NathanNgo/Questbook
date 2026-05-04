import { sortByNumericValue } from "#/shared/utils/sortBy";
import type { Session } from "../api/types";
import styles from "./SessionList.module.css";
import { SessionListItem } from "./SessionListItem";

export interface SessionListProps {
	sessions: Session[];
	onDeleteSession: (session: Session) => void;
	onChangeSessionName: (session: Session, newSessionName: string) => void;
}

export function SessionList({
	sessions,
	onDeleteSession,
	onChangeSessionName,
}: SessionListProps) {
	return (
		<div className={styles.sessionList}>
			{/*TODO: Give session a proper type*/}
			{(sessions as Session[])
				.sort(sortByNumericValue((session) => parseInt(session.id)))
				.map((session) => (
					<SessionListItem
						session={session}
						onDelete={() => onDeleteSession(session)}
						onChangeName={(newSessionName: string) =>
							onChangeSessionName(session, newSessionName)
						}
						key={session.id}
					/>
				))}
		</div>
	);
}
