import SearchResults from "@/ui/search/SearchResults";
import { Suspense } from "react";
import Loader from "@/ui/search/Loader";
import Image from "next/image";

export default async function SearchPage({
	searchParams,
}: {
	searchParams: Promise<{ query?: string; page?: string }>;
}) {
	const params = await searchParams;
	const query = params.query || "";
	const page = parseInt(params.page || "1");

	return (
		<>
			<form action="/search" className="w-full h-fit relative max-w-[500px] mx-auto -mt-6">
				<input
					type="text"
					name="query"
					className="w-full p-4 px-5 bg-white rounded-lg relative border border-gray-2 text-sm shadow"
					placeholder="Enter image keywords..."
					defaultValue={query}
				/>
				<button type="submit" className="absolute right-0 top-0 mt-3.5 mr-4 cursor-pointer">
					<Image src="/Search.svg" alt="search" width={26} height={26} />
				</button>
			</form>
			{query ? (
				<Suspense key={`${query}-${page}`} fallback={<Loader message="Loading images..." />}>
					<SearchResults query={query} page={page} />
				</Suspense>
			) : (
				<div className="text-center py-16">
					<p className="text-gray-3">Enter a search term to find images</p>
				</div>
			)}
		</>
	);
}
