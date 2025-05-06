"use client";

import { removeImageFromCollection } from "@/lib/actions";
import { toast } from "sonner";
import { useState } from "react";

type RemoveFromCollectionProps = {
	imageId: string;
	collectionId: string;
};

export default function RemoveFromCollection({ imageId, collectionId }: RemoveFromCollectionProps) {
	const [isRemoving, setIsRemoving] = useState(false);

	async function handleRemoveFromCollection() {
		setIsRemoving(true);
		try {
			await removeImageFromCollection({ imageId, collectionId });
			toast.success("Image removed from collection.");
		} catch (error: unknown) {
			const message = error instanceof Error ? error.message : "Failed to remove image from collection.";
			toast.error(message);
		} finally {
			setIsRemoving(false);
		}
	}

	return (
		<button
			onClick={handleRemoveFromCollection}
			disabled={isRemoving}
			className="flex items-center cursor-pointer pr-2 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-500"
		>
			{isRemoving ? (
				<div className="h-4 w-4 border-2 border-t-transparent border-gray-500 rounded-full animate-spin mr-2"></div>
			) : (
				<>
					<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4"></path>
					</svg>
					<span className="text-[11px] font-medium">Remove</span>
				</>
			)}
		</button>
	);
}
