import { type Dispatch, type SetStateAction, useMemo } from "react";
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/src/shared";

export const BuildPagination = ({
	page,
	setPage,
	totalPage,
}: {
	page: number;
	setPage: Dispatch<SetStateAction<number>>;
	totalPage: number;
}) => {
	const maxVisible = 5;
	const visiblePages = useMemo(() => {
		if (totalPage <= 0) return [];

		const half = Math.floor(maxVisible / 2);

		const initialStart = Math.max(1, page - half);
		const end = Math.min(totalPage, initialStart + maxVisible - 1);
		const start = Math.max(1, end - maxVisible + 1);

		return Array.from({ length: end - start + 1 }, (_, i) => start + i);
	}, [page, totalPage]);

	return (
		<Pagination>
			<PaginationContent>
				<PaginationItem>
					<PaginationPrevious
						href="#"
						onClick={(e) => {
							e.preventDefault();
							if (page > 1) setPage((p) => p - 1);
						}}
						aria-disabled={page === 1}
					/>
				</PaginationItem>

				{visiblePages.map((num) => (
					<PaginationItem key={num}>
						<PaginationLink
							href="#"
							isActive={page === num}
							onClick={(e) => {
								e.preventDefault();
								setPage(num);
							}}
						>
							{num}
						</PaginationLink>
					</PaginationItem>
				))}

				<PaginationItem>
					<PaginationNext
						href="#"
						onClick={(e) => {
							e.preventDefault();
							if (page < totalPage) setPage((p) => p + 1);
						}}
						aria-disabled={page === totalPage}
					/>
				</PaginationItem>
			</PaginationContent>
		</Pagination>
	);
};
