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
			<form
				action="/search"
				className="text-center w-full max-w-[500px] relative mx-auto -mt-5 shadow-md rounded-lg"
			>
				<input
					type="text"
					name="query"
					className="w-full p-3 pl-4 bg-white rounded-lg relative text-sm"
					placeholder="Enter image keywords..."
					defaultValue={query}
				/>
				<button type="submit" className="absolute right-0 top-0 mt-3 mr-3 cursor-pointer">
					<Image src="/Search.svg" alt="search" width={22} height={22} />
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
