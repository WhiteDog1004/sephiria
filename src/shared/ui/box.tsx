import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const boxVariants = cva("inline-flex items-center justify-center w-full p-8");

function Box({
	className,
	asChild = false,
	...props
}: React.ComponentProps<"div"> &
	VariantProps<typeof boxVariants> & {
		asChild?: boolean;
	}) {
	const Comp = asChild ? Slot : "div";

	return (
		<Comp
			data-slot="div"
			className={cn(boxVariants({ className }))}
			{...props}
		/>
	);
}

export { Box, boxVariants };
