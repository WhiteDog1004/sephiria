import {
	Box,
	COSTUMES,
	Column,
	ImageWithFallback,
	Typography,
} from "@/src/shared";

export const CostumeItem = ({ costume }: { costume: string }) => {
	return (
		<Column className="overflow-hidden justify-center items-center max-w-16">
			<Box className="w-fit p-2">
				<ImageWithFallback
					className="w-max p-0"
					width={48}
					height={48}
					src={`https://utrndoiwtfajgzlsmsxj.supabase.co/storage/v1/object/public/costume/${costume}.png`}
					alt={costume}
					unoptimized
				/>
			</Box>
			<Typography
				className="p-1 lg:max-w-16 text-center truncate"
				variant="caption"
			>
				{COSTUMES[costume].name}
			</Typography>
		</Column>
	);
};
