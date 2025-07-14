import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

import { cn } from "@/lib/utils";

const rowVariants = cva("inline-flex flex-row");

function Row({
	className,
	asChild = false,
	...props
}: React.ComponentProps<"div"> &
	VariantProps<typeof rowVariants> & {
		asChild?: boolean;
	}) {
	const Comp = asChild ? Slot : "div";

	return (
		<Comp
			data-slot="div"
			className={cn(rowVariants({ className }))}
			{...props}
		/>
	);
}

export { Row, rowVariants };
