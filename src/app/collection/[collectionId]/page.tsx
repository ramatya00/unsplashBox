import MaxWidthWrapper from "@/ui/MaxWidthWrapper";
import Loader from "@/ui/search/Loader";
import { Suspense } from "react";
import { getUnsplashCollection } from "@/lib/data";
import HeaderGradient from "@/ui/HeaderGradient";
import CollectionPhotosGrid from "@/ui/collection/CollectionPhotoGrid";
import { PHOTOS_PER_PAGE } from "@/lib/utils";

type CollectionPhotosPageProps = {
	params: Promise<{ collectionId: string }>;
	searchParams: Promise<{ page?: string }>;
};

export default async function CollectionPhotos({ params, searchParams }: CollectionPhotosPageProps) {
	const { collectionId } = await params;
	const { page } = await searchParams;
	const currentPage = parseInt(page || "1", 10) || 1;

	const collectionData = await getUnsplashCollection(collectionId).catch((err) => {
		console.error(`Failed to load collection details ${collectionId}:`, err);
		return null;
	});

	const totalPhotos = collectionData?.total_photos || 0;
	const totalPages = Math.ceil(totalPhotos / PHOTOS_PER_PAGE);

	return (
		<MaxWidthWrapper>
			{collectionData ? (
				<HeaderGradient title={collectionData.title}>{collectionData.total_photos} photos</HeaderGradient>
			) : (
				<HeaderGradient title="Collection Photos">Failed to load collection details</HeaderGradient>
			)}

			<Suspense key={`${collectionId}-${currentPage}`} fallback={<Loader message="Loading Photos..." />}>
				<CollectionPhotosGrid
					collectionId={collectionId}
					currentPage={currentPage}
					photosPerPage={PHOTOS_PER_PAGE}
					totalPages={totalPages}
				/>
			</Suspense>
		</MaxWidthWrapper>
	);
}
