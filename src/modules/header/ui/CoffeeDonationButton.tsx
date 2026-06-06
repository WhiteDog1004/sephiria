import { Coffee } from "lucide-react";
import { Button } from "@/src/shared";

const DONATION_URL = "https://toon.at/donate/wolfdog1004";

export const CoffeeDonationButton = () => {
	return (
		<Button
			asChild
			variant="outline"
			className="coffee-donation-button inline-flex size-9 border-amber-500/50 bg-amber-500/5 px-0 text-xs font-semibold text-amber-500 hover:border-amber-400 hover:bg-amber-500/10 hover:text-amber-400 lg:h-8 lg:w-auto lg:px-3"
		>
			<a
				href={DONATION_URL}
				target="_blank"
				rel="noopener noreferrer"
				aria-label="개발자에게 커피 사주기"
				title="개발자에게 커피 사주기"
			>
				<Coffee />
				<span className="hidden lg:inline">개발자에게 커피 사주기</span>
			</a>
		</Button>
	);
};
