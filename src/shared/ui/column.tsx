import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

import { cn } from "@/lib/utils";

const columnVariants = cva("inline-flex flex-col");

function Column({
	className,
	asChild = false,
	...props
}: React.ComponentProps<"div"> &
	VariantProps<typeof columnVariants> & {
		asChild?: boolean;
	}) {
	const Comp = asChild ? Slot : "div";

	return (
		<Comp
			data-slot="div"
			className={cn(columnVariants({ className }))}
			{...props}
		/>
	);
}

export { Column, columnVariants };
