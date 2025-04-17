import { getUnsplashCollection } from "@/lib/data";
import CollectionPreview from "@/ui/collections/CollectionPreview";
import { SignUpButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { PUBLIC_COLLECTION_IDS } from "@/lib/utils";
import { CollectionPreviewData } from "@/lib/types";
import { redirect } from "next/navigation";

export default async function PublicCollectionPage() {
	const { userId } = await auth();
	if (userId) redirect(`collections/${userId}`);

	const collectionPromises = PUBLIC_COLLECTION_IDS.map((id) =>
		getUnsplashCollection(id).catch((err) => {
			console.error(`Failed to load public collection ${id}`, err);
			return null;
		})
	);
	const collections = (await Promise.all(collectionPromises)).filter(Boolean);

	return (
		<>
			{collections.length > 0 ? (
				<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12 mt-10">
					{collections.map((collection: CollectionPreviewData) => {
						const previewPhotos = collection.preview_photos || [];
						const imagesForPreview = previewPhotos.map((photo) => photo.urls.small);

						return (
							<CollectionPreview
								key={collection.id}
								href={`/collection/${collection.id}`}
								images={imagesForPreview}
								title={collection.title}
								photoCount={collection.total_photos}
								altText={`Preview for ${collection.title}`}
							/>
						);
					})}

					{!userId && (
						<SignUpButton mode="modal">
							<div
								className={`flex flex-col items-center justify-center w-full h-[225px] bg-gray-2 rounded text-gray-3 cursor-pointer hover:bg-gray-300 transition-colors duration-300`}
							>
								<h1 className="text-5xl">+</h1>
								<h1 className="font-medium text-xl">Add new collection</h1>
							</div>
						</SignUpButton>
					)}
				</div>
			) : (
				<p className="text-center mt-16 text-gray-3">Could not load featured collections.</p>
			)}
		</>
	);
}
