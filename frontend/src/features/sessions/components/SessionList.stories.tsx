import type { Meta, StoryObj } from "@storybook/react-vite";
import { useArgs } from "storybook/internal/preview-api";
import type { Session } from "../api/types";
import { SessionList } from "./SessionList";

const meta: Meta<typeof SessionList> = {
    title: "Components/SessionList",
    component: SessionList,
    render: ({ sessions }) => {
        // useArgs - Allows us to change args -> reflect in story
        // and change in story -> reflect in args
        const [, updateArgs] = useArgs();

        function handleDeleteSession(session: Session) {
            updateArgs({
                sessions: sessions.filter((s) => s.id !== session.id),
            });
        }

        function handleChangeSessionName(
            sessionId: number,
            newSessionName: string,
        ) {
            updateArgs({
                sessions: sessions.map((s) =>
                    s.id === sessionId
                        ? { ...s, sessionName: newSessionName }
                        : s,
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

const makeSessions = (
    count: number,
    nameOverride?: (i: number) => string,
): Session[] =>
    Array.from({ length: count }, (_, i) => ({
        id: i + 1,
        sessionName: nameOverride ? nameOverride(i) : `Session ${i + 1}`,
    }));

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
        sessions: makeSessions(
            4,
            (i) =>
                [
                    "The one where Bogdan goes on and on about some Nordic God",
                    "We literally just spent 2 hours discussing Doctor Who, until we realised no one else was gonna show up",
                    "One shot where we were all pirates but not swashbuckling ones, but internet ones",
                    "Factorio",
                ][i],
        ),
    },
};
