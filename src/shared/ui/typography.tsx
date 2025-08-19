import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";
import { cn } from "@/lib/utils";

const typographyVariants = cva("", {
	variants: {
		variant: {
			body: "text-base",
			header3: "text-lg",
			header2: "text-2xl",
			header1: "text-3xl",
			body2: "text-sm",
			caption: "text-xs",
		},
	},
	defaultVariants: {
		variant: "body",
	},
});

function Typography({
	className,
	variant,
	asChild = false,
	...props
}: React.ComponentProps<"div"> &
	VariantProps<typeof typographyVariants> & {
		asChild?: boolean;
	}) {
	const Comp = asChild ? Slot : "div";

	return (
		<Comp
			data-slot="div"
			className={cn(typographyVariants({ variant, className }))}
			{...props}
		/>
	);
}

export { Typography, typographyVariants };
