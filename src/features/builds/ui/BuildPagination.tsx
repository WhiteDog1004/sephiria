import type { Dispatch, SetStateAction } from "react";
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

				{Array.from({ length: totalPage }).map((_, i) => (
					<PaginationItem key={i}>
						<PaginationLink
							href="#"
							isActive={page === i + 1}
							onClick={(e) => {
								e.preventDefault();
								setPage(i + 1);
							}}
						>
							{i + 1}
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
