import { getCollections } from "@/lib/data";
import { CollectionWithPreviewsAndCount } from "@/lib/types";
import CollectionPreview from "@/ui/collections/CollectionPreview";
import { DialogTrigger } from "@/ui/motion-primitives/dialog";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import ModalWrapper from "@/ui/collections/ModalCollection";

type UserCollectionsProps = {
	params: Promise<{ id: string }>;
};

export default async function UserCollections({ params }: UserCollectionsProps) {
	const { id } = await params;
	const { userId } = await auth();

	if (!userId) redirect("/collections");
	if (id !== userId) redirect("/");

	const collections = await getCollections();

	return (
		<>
			{collections.length > 0 ? (
				<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12 mt-10">
					{collections.map((collection: CollectionWithPreviewsAndCount) => {
						const imagesForPreview = collection.images.map((imgRelation) => imgRelation.image.imageUrlSmall);
						const photoCount = collection._count.images;

						return (
							<CollectionPreview
								key={collection.id}
								href={`/collection/${collection.id}/${id}`}
								images={imagesForPreview}
								title={collection.name}
								photoCount={photoCount}
								altText={`Preview for ${collection.name}`}
								userId={userId}
								collectionId={collection.id}
							/>
						);
					})}

					<ModalWrapper>
						<ModalTrigger />
					</ModalWrapper>
				</div>
			) : (
				<ModalWrapper>
					<ModalTrigger className="mx-auto max-w-md mt-10" />
				</ModalWrapper>
			)}
		</>
	);
}

function ModalTrigger({ className }: { className?: string }) {
	return (
		<DialogTrigger
			className={`flex flex-col items-center justify-center w-full h-[225px] bg-gray-2 rounded text-gray-3 cursor-pointer hover:bg-gray-300 transition-colors duration-300 ${className}`}
		>
			<h1 className="text-5xl">+</h1>
			<h1 className="font-medium text-xl">Add new collection</h1>
		</DialogTrigger>
	);
}
