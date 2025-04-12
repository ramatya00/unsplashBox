import Link from "next/link";

type PaginationControlsProps = {
	currentPage: number;
	totalPages: number;
	baseUrl: string;
	pageParamName?: string;
};

export default function PaginationControls({
	currentPage,
	totalPages,
	baseUrl,
	pageParamName = "page",
}: PaginationControlsProps) {
	if (totalPages <= 1) {
		return null;
	}

	// Helper to construct the URL, preserving existing query params if baseUrl has them
	const createPageUrl = (pageNumber: number) => {
		const url = new URL(baseUrl, "http://dummybase");
		url.searchParams.set(pageParamName, pageNumber.toString());
		return `${url.pathname}${url.search}`;
	};

	return (
		<div className="flex justify-center gap-2 mt-8 mb-8 font-medium text-sm">
			{currentPage > 1 && (
				<Link
					href={createPageUrl(currentPage - 1)}
					className="px-4 py-1.5 bg-gray-2 rounded-sm hover:bg-gray-300 transition-colors"
				>
					Previous
				</Link>
			)}
			{currentPage < totalPages && (
				<Link
					href={createPageUrl(currentPage + 1)}
					className="px-4 py-1.5 bg-gray-2 rounded-sm hover:bg-gray-300 transition-colors"
				>
					Next
				</Link>
			)}
		</div>
	);
}
