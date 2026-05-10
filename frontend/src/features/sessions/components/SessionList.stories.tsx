import type { Meta, StoryObj } from "@storybook/react-vite";
import { useArgs } from "storybook/preview-api";
import type { Session } from "../api/types";
import { SessionList } from "./SessionList";

const meta: Meta<typeof SessionList> = {
    title: "Components/SessionList",
    component: SessionList,
    render: ({ sessions }) => {
        const [_, updateArgs] = useArgs();

        function handleDeleteSession(session: Session) {
            updateArgs({
                sessions: sessions.filter(
                    (otherSession) => otherSession.id !== session.id,
                ),
            });
        }

        function handleChangeSessionName(
            sessionId: number,
            newSessionName: string,
        ) {
            updateArgs({
                sessions: sessions.map((session) =>
                    session.id === sessionId
                        ? { ...session, sessionName: newSessionName }
                        : session,
                ),
            });
        }

        return (
            <SessionList
                sessions={sessions}
                onDeleteSession={handleDeleteSession}
                onChangeSessionName={handleChangeSessionName}
            />
        );
    },
};

export default meta;
type Story = StoryObj<typeof SessionList>;

function makeSessions(count: number, sessionNamesOverride?: string[]) {
    return Array.from({ length: count }, (_, sessionIndex) => ({
        id: sessionIndex + 1,
        sessionName: sessionNamesOverride
            ? sessionNamesOverride[sessionIndex]
            : `Session ${sessionIndex + 1}`,
    }));
}

export const NoSessions: Story = {
    name: "No sessions",
    args: {
        sessions: [],
    },
};

export const ThreeSessions: Story = {
    name: "Three sessions",
    args: {
        sessions: makeSessions(3),
    },
};

export const TwentySessions: Story = {
    name: "Twenty sessions",
    args: {
        sessions: makeSessions(20),
    },
};

export const LongSessionNames: Story = {
    name: "Long session names",
    args: {
        sessions: makeSessions(4, [
            "The one where Bogdan goes on and on about some Nordic God",
            "We literally just spent 2 hours discussing Doctor Who, until we realised no one else was gonna show up",
            "One shot where we were all pirates but not swashbuckling ones, but internet ones",
            "Factorio",
        ]),
    },
};
