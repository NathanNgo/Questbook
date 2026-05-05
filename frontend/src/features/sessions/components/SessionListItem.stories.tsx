import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "@storybook/test";
import { SessionListItem, type SessionListItemProps } from "./SessionListItem";

type CustomArgs = {
	sessionName: string;
};

const meta: Meta<SessionListItemProps & CustomArgs> = {
	component: SessionListItem,
	title: "Components/Session/SessionListItem",
	argTypes: {
		session: {
			table: { disable: true },
		},
		sessionName: {
			control: "text",
			description: "The name of the session",
		},
	},
	render: (args) => (
		<SessionListItem
			session={{
				id: "1",
				sessionName: args.sessionName,
			}}
			onDelete={fn()}
			onChangeName={fn()}
		/>
	),
};

export default meta;

type Story = StoryObj<SessionListItemProps & CustomArgs>;

export const Default: Story = {
	args: {
		sessionName: "Name of the session",
	},
};
