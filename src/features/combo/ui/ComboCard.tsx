import Image from "next/image";
import Link from "next/link";
import type { ComboItem } from "@/src/entities/combo/model/types";
import {
	Badge,
	Button,
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
	Column,
	getComboBuildSearchHref,
	Row,
	Typography,
} from "@/src/shared";

export const ComboCard = ({ combo }: { combo: ComboItem }) => {
	return (
		<Card className="gap-0 border-slate-700 bg-slate-900/70 py-0">
			<CardHeader className="px-4 py-4 md:px-5">
				<Row className="items-start justify-between gap-2">
					<Row className="items-center gap-3">
						<Image
							width={36}
							height={36}
							unoptimized
							src={combo.image}
							alt={combo.label}
							className="rounded-md border border-slate-700 p-1 bg-slate-800"
						/>
						<Column className="items-start p-0 gap-1">
							<Row className="items-center gap-2 flex-wrap">
								<CardTitle className="text-slate-100">{combo.label}</CardTitle>
							</Row>
							<CardDescription className="text-slate-400">
								최소 {combo.minCount} · 최대 {combo.maxCount}
							</CardDescription>
						</Column>
					</Row>

					<Link href={getComboBuildSearchHref(combo.key)}>
						<Button
							size="sm"
							variant="outline"
							className="text-xs border-slate-600 hover:border-slate-400"
						>
							빌드 보러가기
						</Button>
					</Link>
				</Row>
			</CardHeader>

			<CardContent className="px-4 pb-4 md:px-5 md:pb-5">
				<Column className="w-full items-start p-0 gap-2">
					{combo.effects.map((tier) => (
						<Row
							key={`${combo.key}-${tier.count}`}
							className="w-full items-start gap-2 rounded-lg border border-slate-700 bg-slate-800/70 px-3 py-2"
						>
							<Badge className="min-w-6 border-amber-300/30 bg-amber-500/20 text-amber-200">
								{tier.count}
							</Badge>
							<Typography
								variant="body2"
								className="text-slate-200 whitespace-pre-line"
							>
								{tier.effect}
							</Typography>
						</Row>
					))}
				</Column>
			</CardContent>
		</Card>
	);
};
