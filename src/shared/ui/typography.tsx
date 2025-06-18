import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

const typographyVariants = cva("", {
	variants: {
		variant: {
			body: "text-base",
			header3: "text-lg",
			body2: "text-sm",
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
			data-slot="button"
			className={cn(typographyVariants({ variant, className }))}
			{...props}
		/>
	);
}

export { Typography, typographyVariants };
