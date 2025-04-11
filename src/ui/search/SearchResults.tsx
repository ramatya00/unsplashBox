import { searchUnsplashImages } from "@/lib/data";

import PhotoGrid from "../PhotoGrid";
import PaginationControls from "../PaginationControls";

export default async function SearchResults({ query, page }: { query: string; page: number }) {
	const { photos, totalPages } = await searchUnsplashImages(query, page);

	if (photos.length === 0) {
		return (
			<div className="text-center py-16">
				<p className="text-gray-3">No images found for {query}</p>
			</div>
		);
	}

	return (
		<div className="mt-10">
			<PhotoGrid photos={photos} />

			<PaginationControls
				currentPage={page}
				totalPages={totalPages}
				baseUrl={`/search?query=${encodeURIComponent(query)}`}
			/>
		</div>
	);
}
