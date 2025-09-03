import Image from "next/image";
import type { WeaponOptions } from "@/src/entities/weapon/model/types";
import { TabsList, TabsTrigger } from "@/src/shared";

export const WeaponContent = ({
	list,
	handler,
}: {
	list: WeaponOptions;
	handler?: () => void;
}) => {
	return (
		<TabsList className="w-16 h-16">
			<TabsTrigger onClick={handler} value={list.value} className="p-2">
				<Image
					className="w-12 h-12 object-contain"
					width={48}
					height={48}
					src={list.image || ""}
					alt={list.value}
					loading="eager"
				/>
			</TabsTrigger>
		</TabsList>
	);
};
