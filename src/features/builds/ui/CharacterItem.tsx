import {
	Box,
	COSTUMES,
	Column,
	ImageWithFallback,
	Separator,
	Typography,
} from "@/src/shared";

export const CharacterItem = ({ costume }: { costume: string }) => {
	return (
		<Column className="justify-evenly items-center min-w-24 max-w-24 rounded-md border">
			<Box className="w-max min-h-[72] p-2">
				<ImageWithFallback
					className="w-max p-0"
					width={48}
					height={48}
					src={`https://utrndoiwtfajgzlsmsxj.supabase.co/storage/v1/object/public/costume/${costume}.png`}
					alt={"scholar_lizard"}
					unoptimized
				/>
			</Box>
			<Separator />
			<Typography
				className="p-2 max-w-24 text-center truncate"
				variant="caption"
			>
				{COSTUMES[costume].name}
			</Typography>
		</Column>
	);
};
