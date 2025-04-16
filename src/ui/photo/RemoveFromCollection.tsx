"use client";

import { removeImageFromCollection } from "@/lib/actions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

type RemoveFromCollectionProps = {
	imageId: string;
	collectionId: string;
};

export default function RemoveFromCollection({ imageId, collectionId }: RemoveFromCollectionProps) {
	const queryClient = useQueryClient();
	const mutation = useMutation({
		mutationFn: () => removeImageFromCollection({ imageId, collectionId }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["collections", collectionId] });
		},
		onError: (err) => {
			toast.error(err.message);
		},
	});

	async function handleRemoveFromCollection() {
		await mutation.mutateAsync();
	}

	return (
		<button
			onClick={handleRemoveFromCollection}
			disabled={mutation.isPending}
			className="flex items-center cursor-pointer pr-2 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-500"
		>
			{mutation.isPending ? (
				<div className="h-4 w-4 border-2 border-t-transparent border-gray-500 rounded-full animate-spin mr-2"></div>
			) : (
				<>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						className="h-4 w-4 mr-2"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4"></path>
					</svg>
					<span className="text-[11px] font-medium">Remove</span>
				</>
			)}
		</button>
	);
}
