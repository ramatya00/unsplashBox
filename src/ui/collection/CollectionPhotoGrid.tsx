import { getUnsplashCollectionPhotos } from "@/lib/data";
import PaginationControls from "../PaginationControls";
import PhotoGrid from "../PhotoGrid";
import { CollectionPhotosGridProps } from "@/lib/types";

export default async function CollectionPhotosGrid({
	collectionId,
	currentPage,
	photosPerPage,
	totalPages,
}: CollectionPhotosGridProps) {
	const photos = await getUnsplashCollectionPhotos(collectionId, currentPage, photosPerPage).catch((err) => {
		console.error(`Failed to load photos for collection ${collectionId}, page ${currentPage}:`, err);
		return [];
	});

	if (photos.length === 0) {
		return <p className="text-center mt-16 text-gray-3">No photos found for this page.</p>;
	}

	return (
		<div className="mt-10">
			<PhotoGrid photos={photos} />
			<PaginationControls
				currentPage={currentPage}
				totalPages={totalPages}
				baseUrl={`/collection/${collectionId}`}
			/>
		</div>
	);
}
