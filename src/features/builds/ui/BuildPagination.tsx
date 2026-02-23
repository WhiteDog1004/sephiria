import { type Dispatch, type SetStateAction, useMemo } from "react";
import { cn } from "@/lib/utils";
import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
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
	const maxVisibleNumbers = 5;
	const jumpSize = 5;
	const isFirstPage = page <= 1;
	const isLastPage = page >= totalPage;
	const jumpPrevPage = page - jumpSize >= 1 ? page - jumpSize : null;
	const jumpNextPage = page + jumpSize <= totalPage ? page + jumpSize : null;
	const edgeCount = Number(jumpPrevPage !== null) + Number(jumpNextPage !== null);
	const centerCount = Math.max(1, maxVisibleNumbers - edgeCount);

	const visiblePages = useMemo(() => {
		if (totalPage <= 0) return [];

		const half = Math.floor(centerCount / 2);

		const initialStart = Math.max(1, page - half);
		const end = Math.min(totalPage, initialStart + centerCount - 1);
		const start = Math.max(1, end - centerCount + 1);

		return Array.from({ length: end - start + 1 }, (_, i) => start + i);
	}, [page, totalPage, centerCount]);
	const firstVisible = visiblePages[0];
	const lastVisible = visiblePages[visiblePages.length - 1];
	const showLeftEllipsis =
		jumpPrevPage !== null &&
		firstVisible !== undefined &&
		jumpPrevPage < firstVisible - 1;
	const showRightEllipsis =
		jumpNextPage !== null &&
		lastVisible !== undefined &&
		jumpNextPage > lastVisible + 1;

	return (
		<Pagination>
			<PaginationContent>
				<PaginationItem>
					<PaginationPrevious
						href="#"
						className={cn(isFirstPage && "pointer-events-none opacity-50")}
						onClick={(e) => {
							e.preventDefault();
							if (page > 1) setPage(page - 1);
						}}
						aria-disabled={isFirstPage}
					/>
				</PaginationItem>
				{jumpPrevPage !== null && (
					<PaginationItem>
						<PaginationLink
							href="#"
							onClick={(e) => {
								e.preventDefault();
								setPage(jumpPrevPage);
							}}
						>
							{jumpPrevPage}
						</PaginationLink>
					</PaginationItem>
				)}
				{showLeftEllipsis && (
					<PaginationItem>
						<PaginationEllipsis />
					</PaginationItem>
				)}

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
				{showRightEllipsis && (
					<PaginationItem>
						<PaginationEllipsis />
					</PaginationItem>
				)}
				{jumpNextPage !== null && (
					<PaginationItem>
						<PaginationLink
							href="#"
							onClick={(e) => {
								e.preventDefault();
								setPage(jumpNextPage);
							}}
						>
							{jumpNextPage}
						</PaginationLink>
					</PaginationItem>
				)}

				<PaginationItem>
					<PaginationNext
						href="#"
						className={cn(isLastPage && "pointer-events-none opacity-50")}
						onClick={(e) => {
							e.preventDefault();
							if (page < totalPage) setPage(page + 1);
						}}
						aria-disabled={isLastPage}
					/>
				</PaginationItem>
			</PaginationContent>
		</Pagination>
	);
};
