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
			<TabsTrigger onClick={handler} value={list.value}>
				<Image
					className="object-cover"
					width={48}
					height={48}
					src={list.image || ""}
					alt={list.value}
				/>
			</TabsTrigger>
		</TabsList>
	);
};
