import type { ReactNode } from "react";
import { Separator } from "../ui/separator";
import { Typography } from "../ui/typography";

type PolicySectionProps = {
	title: string;
	children: ReactNode;
};

export const PolicySection = ({ title, children }: PolicySectionProps) => {
	return (
		<>
			<Separator />

			<Typography variant="header3">{title}</Typography>
			<Typography
				variant="body2"
				className="text-gray-600 leading-relaxed dark:text-gray-400"
			>
				{children}
			</Typography>
		</>
	);
};

type PolicyLinkProps = {
	href: string;
	children: ReactNode;
};

export const PolicyLink = ({ href, children }: PolicyLinkProps) => {
	return (
		<a
			href={href}
			target="_blank"
			rel="noreferrer"
			className="underline underline-offset-2 hover:text-foreground"
		>
			{children}
		</a>
	);
};
