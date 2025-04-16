import MaxWidthWrapper from "@/ui/MaxWidthWrapper";
import Loader from "@/ui/search/Loader";
import { Suspense } from "react";
import { getCollectionDetails, getImagesInCollection } from "@/lib/data";
import HeaderGradient from "@/ui/HeaderGradient";
import { PHOTOS_PER_PAGE } from "@/lib/utils";
import PhotoGrid from "@/ui/PhotoGrid";
import PaginationControls from "@/ui/PaginationControls";

type UserCollectionPageProps = {
	params: Promise<{
		collectionId: string;
		userId: string;
	}>;
	searchParams: Promise<{ page?: string }>;
};

export default async function UserCollectionPage({ params, searchParams }: UserCollectionPageProps) {
	const { collectionId, userId } = await params;
	const { page } = await searchParams;
	const currentPage = parseInt(page || "1", 10) || 1;

	const collectionData = await getCollectionDetails(collectionId).catch((err) => {
		console.error(`Failed to load collection details ${collectionId}:`, err);
		return null;
	});

	const images = await getImagesInCollection(collectionId).catch((err) => {
		console.error(`Failed to load images for collection ${collectionId}:`, err);
		return [];
	});

	const totalPhotos = images.length;
	const totalPages = Math.ceil(totalPhotos / PHOTOS_PER_PAGE);

	// Paginate images
	const startIndex = (currentPage - 1) * PHOTOS_PER_PAGE;
	const paginatedImages = images.slice(startIndex, startIndex + PHOTOS_PER_PAGE);

	return (
		<MaxWidthWrapper>
			{collectionData ? (
				<HeaderGradient title={collectionData.name}>{totalPhotos} photos</HeaderGradient>
			) : (
				<HeaderGradient title="Collection">Failed to load collection details</HeaderGradient>
			)}

			<Suspense key={`${collectionId}-${currentPage}`} fallback={<Loader message="Loading Photos..." />}>
				<div className="mt-10">
					{paginatedImages.length > 0 ? (
						<>
							<PhotoGrid photos={paginatedImages} />
							<PaginationControls currentPage={currentPage} totalPages={totalPages} baseUrl={`/collection/${collectionId}/${userId}`} />
						</>
					) : (
						<p className="text-center mt-16 text-gray-3">No photos found in this collection.</p>
					)}
				</div>
			</Suspense>
		</MaxWidthWrapper>
	);
}
