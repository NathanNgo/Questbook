import styles from "./Button.module.css";

interface ButtonProps {
	label?: string;
	icon?: string;
	onClick?: (event: React.MouseEvent) => void;
	buttonType?: "button" | "submit" | "reset";
	formId?: string;
	ref?: React.Ref<HTMLButtonElement>;
}

export function Button({
	label,
	icon,
	onClick,
	buttonType = "button",
	formId,
	ref,
}: ButtonProps) {
	return (
		<button
			type={buttonType}
			onClick={onClick}
			className={styles.button}
			form={formId}
			ref={ref}
		>
			{" "}
			{label}
		</button>
	);
}
