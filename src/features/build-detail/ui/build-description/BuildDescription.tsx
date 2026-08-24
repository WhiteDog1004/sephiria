import type { BuildRow } from "@/src/entities/builds/model/builds.types";
import { Column, Typography } from "@/src/shared";
import { sanitizeBuildDescriptionHtml } from "@/src/shared/model/buildDescriptionHtml";

export const BuildDescription = ({
	description,
}: {
	description: BuildRow["description"];
}) => {
	return (
		<Column className="gap-4">
			<Typography variant="header3">빌드 설명</Typography>
			<Column className="border rounded-lg p-4 bg-secondary/50">
				<div
					className="build-description-content text-sm leading-6 [&_blockquote]:border-l-2 [&_blockquote]:pl-3 [&_blockquote]:text-muted-foreground [&_img[data-emote='true']]:mx-1 [&_img[data-emote='true']]:inline-block [&_img[data-emote='true']]:size-28 [&_img[data-emote='true']]:align-middle [&_img[data-emote='true']]:[image-rendering:pixelated] [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:min-h-5 [&_pre]:overflow-x-auto [&_pre]:rounded-md [&_pre]:bg-secondary [&_pre]:p-3 [&_ul]:list-disc [&_ul]:pl-5"
					// biome-ignore lint/security/noDangerouslySetInnerHtml: build descriptions are sanitized before rendering.
					dangerouslySetInnerHTML={{
						__html: sanitizeBuildDescriptionHtml(description),
					}}
				/>
			</Column>
		</Column>
	);
};
