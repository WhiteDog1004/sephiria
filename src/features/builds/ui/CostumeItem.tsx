import {
	Box,
	COSTUMES,
	Column,
	ImageWithFallback,
	Typography,
} from "@/src/shared";
import { getCloudflareUrl } from "@/src/shared/utils/image";

export const CostumeItem = ({ costume }: { costume: string }) => {
	return (
		<Column className="overflow-hidden justify-center items-center max-w-max lg:max-w-16">
			<Box className="w-fit p-2">
				<ImageWithFallback
					className="w-12 h-12 object-contain p-0"
					width={48}
					height={48}
					src={getCloudflareUrl(
						`https://utrndoiwtfajgzlsmsxj.supabase.co/storage/v1/object/public/costume/${costume}.png`,
					)}
					alt={costume}
					unoptimized
				/>
			</Box>
			<Typography
				className="p-1 max-w-max lg:max-w-16 text-center truncate"
				variant="caption"
			>
				{COSTUMES[costume].name}
			</Typography>
		</Column>
	);
};
