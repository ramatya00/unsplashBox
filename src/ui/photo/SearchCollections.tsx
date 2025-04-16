"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { searchUserCollections, addImageToCollection } from "@/lib/actions";
import ModalCollection from "../collections/ModalCollection";
import { DialogTrigger } from "../motion-primitives/dialog";
import { toast } from "sonner";

function useDebounce<T>(value: T, delay: number): T {
	const [debouncedValue, setDebouncedValue] = useState(value);

	useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedValue(value);
		}, delay);

		return () => {
			clearTimeout(timer);
		};
	}, [value, delay]);

	return debouncedValue;
}

type SearchCollectionsProps = {
	onCollectionSelect?: (collectionId: string) => void;
	imageId?: string;
	imageData?: {
		id: string;
		altDescription: string | null;
		imageUrlRegular: string;
		imageUrlSmall: string;
		width: number;
		height: number;
	};
};

export default function SearchCollections({ imageId, imageData }: SearchCollectionsProps) {
	const [searchTerm, setSearchTerm] = useState("");
	const [addedCollectionIds, setAddedCollectionIds] = useState<string[]>([]);
	const [loadingCollectionId, setLoadingCollectionId] = useState<string | null>(null);
	const debouncedSearch = useDebounce(searchTerm, 300);

	const { data: collections, isLoading } = useQuery({
		queryKey: ["collections", debouncedSearch, imageId],
		queryFn: () => searchUserCollections(debouncedSearch, imageId),
	});

	// Filter out collections that have been added
	const availableCollections = collections?.filter((collection) => !addedCollectionIds.includes(collection.id)) || [];

	const handleAddToCollection = async (collectionId: string) => {
		if (!imageData) return;

		setLoadingCollectionId(collectionId);

		try {
			await addImageToCollection({
				imageId: imageData.id,
				collectionId,
				imageData: {
					altDescription: imageData.altDescription,
					imageUrlRegular: imageData.imageUrlRegular,
					imageUrlSmall: imageData.imageUrlSmall,
					width: imageData.width,
					height: imageData.height,
				},
			});
			toast.success("Image added to collection.");
			setAddedCollectionIds((prev) => [...prev, collectionId]);
		} catch (error) {
			console.error(error);
			toast.error("Failed to add image to collection.");
		} finally {
			setLoadingCollectionId(null);
		}
	};

	return (
		<div className="w-full">
			<form className="w-full h-fit relative mx-auto mb-5" onSubmit={(e) => e.preventDefault()}>
				<input
					type="text"
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
					className="w-full p-3.5 px-4 bg-white rounded-lg relative border border-gray-2 text-sm shadow-sm outline-0"
					placeholder="Search collection"
				/>
				<div className="absolute right-0 top-0 mt-3.5 mr-4">
					<Image src="/Search.svg" alt="search" width={22} height={22} />
				</div>
			</form>

			<div className="flex justify-end mb-4">
				<ModalCollection>
					<DialogTrigger className="flex items-center gap-2 px-4 py-2 bg-gray-2 rounded-sm text-xs font-medium hover:bg-gray-300 transition-colors">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-4 w-4"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
						</svg>
						Create new collection
					</DialogTrigger>
				</ModalCollection>
			</div>

			{isLoading && <p className="text-sm text-gray-3">Searching...</p>}

			{/* Available collections */}
			{availableCollections.map((collection) => (
				<div
					key={collection.id}
					className="flex gap-3 hover:bg-gray-2 p-2 rounded group transition-colors duration-500 mb-2"
				>
					<div className="relative w-14 h-14 rounded overflow-hidden">
						{collection.images[0] ? (
							<Image
								src={collection.images[0].image.imageUrlSmall}
								alt={collection.name}
								fill
								className="object-cover"
							/>
						) : (
							<div className="w-full h-full bg-gray-2" />
						)}
					</div>
					<div className="grow flex items-center justify-between">
						<div>
							<h1 className="font-medium text-xs md:text-sm mb-0.5">{collection.name}</h1>
							<p className="text-xs text-gray-3">{collection._count.images} photos</p>
						</div>
						<button
							type="button"
							onClick={() => handleAddToCollection(collection.id)}
							disabled={loadingCollectionId === collection.id}
							className="flex items-center gap-2 cursor-pointer lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-500"
						>
							{loadingCollectionId === collection.id ? (
								<div className="h-4 w-4 border-2 border-t-transparent border-gray-500 rounded-full animate-spin"></div>
							) : (
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-4 w-4"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
								</svg>
							)}
							<span className="hidden md:block text-[11px] font-medium pr-2 text-dark">
								{loadingCollectionId === collection.id ? "" : "Add to collection"}
							</span>
						</button>
					</div>
				</div>
			))}

			{availableCollections.length === 0 && !isLoading && (
				<p className="text-sm text-center text-gray-3 py-20">No available collections found.</p>
			)}
		</div>
	);
}
