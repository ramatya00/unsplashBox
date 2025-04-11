import { getUnsplashCollection } from "@/lib/data";
import AddNewCollectionButton from "@/ui/collections/AddNewCollection";
import CollectionPreview from "@/ui/collections/CollectionPreview";
import HeaderGradient from "@/ui/HeaderGradient";
import MaxWidthWrapper from "@/ui/MaxWidthWrapper";
import { SignInButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { PUBLIC_COLLECTION_IDS } from "@/lib/utils";

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
		<MaxWidthWrapper>
			<HeaderGradient title="Collections">
				Explore the world through collections of beautiful photos free to use under the
				<span className="font-medium underline">Unsplash License</span>.
			</HeaderGradient>

			{collections.length > 0 ? (
				<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12 mt-10">
					{/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
					{collections.map((collection: any) => {
						const previewPhotos = collection.preview_photos || [];
						const coverPhoto = collection.cover_photo;
						const sourcePhotos = previewPhotos.length > 0 ? previewPhotos : coverPhoto ? [coverPhoto] : [];

						// prettier-ignore
						{/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
						const imagesForPreview = sourcePhotos.map((photo: any) => ({
							id: photo.id,
							slug: photo.slug || photo.alt_description || null,
							url: photo.urls?.small || photo.urls?.thumb || "",
						}));

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
						<SignInButton mode="modal">
							<AddNewCollectionButton />
						</SignInButton>
					)}
				</div>
			) : (
				<p className="text-center mt-16 text-gray-3">Could not load featured collections.</p>
			)}
		</MaxWidthWrapper>
	);
}
