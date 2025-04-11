import SearchForm from "@/ui/SearchForm";
import SearchResults from "@/ui/search/SearchResults";
import { Suspense } from "react";
import Loader from "@/ui/search/Loader";

type SearchPageProps = {
	searchParams: Promise<{ query?: string; page?: string }>;
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
	const params = await searchParams;
	const query = params.query || "";
	const page = parseInt(params.page || "1");

	return (
		<>
			<SearchForm defaultQuery={query} />
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
