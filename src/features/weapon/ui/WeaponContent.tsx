import Image from "next/image";
import { cn } from "@/lib/utils";
import type { WeaponOptions } from "@/src/entities/weapon/model/types";
import { getCloudflareUrl } from "@/src/shared/utils/image";

export const WeaponContent = ({
	list,
	handler,
	selected = false,
}: {
	list: WeaponOptions;
	handler?: () => void;
	selected?: boolean;
}) => {
	return (
		<button
			type="button"
			onClick={handler}
			aria-label={list.value_kor}
			aria-pressed={selected}
			className={cn(
				"group relative grid size-20 shrink-0 place-items-center border-[3px] bg-[#171728] p-1 transition hover:-translate-y-0.5",
				"border-[#171728]",
			)}
		>
			<span
				className={cn(
					"absolute inset-1 bg-[#262637] group-hover:bg-[#303145]",
					selected
						? "border-[3px] border-[#f4f4ff]"
						: "border-2 border-[#7d829f]",
				)}
			/>
			<span className="absolute left-2 top-2 size-2 border-l-2 border-t-2 border-[#e4e8ff]" />
			<span className="absolute right-2 top-2 size-2 border-r-2 border-t-2 border-[#e4e8ff]" />
			<span className="absolute bottom-2 left-2 size-2 border-b-2 border-l-2 border-[#e4e8ff]" />
			<span className="absolute bottom-2 right-2 size-2 border-b-2 border-r-2 border-[#e4e8ff]" />
			<div className="relative grid size-full place-items-center">
				<Image
					className="size-13 object-contain"
					width={52}
					height={52}
					src={getCloudflareUrl(list.image || "")}
					alt={list.value}
					loading="eager"
				/>
			</div>
		</button>
	);
};
