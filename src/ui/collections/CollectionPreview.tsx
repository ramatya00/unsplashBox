"use client";

import { deleteCollection } from "@/lib/actions";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import ModalWrapper from "./ModalCollection";
import { DialogTrigger } from "../motion-primitives/dialog";
import ConfirmModal from "../ConfirmModal";

type CollectionPreviewProps = {
	images: string[];
	altText?: string;
	href: string;
	title: string;
	photoCount: number;
	collectionId?: string;
	userId?: string | null;
};

export default function CollectionPreview({
	images,
	altText = "Collection preview",
	href,
	title,
	photoCount,
	userId,
	collectionId,
}: CollectionPreviewProps) {
	const imageCount = images.length;

	const [showOptions, setShowOption] = useState(false);
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);

	const handleDelete = async () => {
		if (!collectionId) return;
		setIsDeleting(true);
		try {
			await deleteCollection({ collectionId });
			toast.success(`Collection "${title}" deleted successfully.`);
			setShowDeleteModal(false); // Close modal on success
			setShowOption(false); // Close dropdown options
		} catch (error: unknown) {
			if (error instanceof Error) {
				toast.error(`Failed to delete collection: ${error.message}`);
			} else {
				toast.error("An unknown error occurred while deleting the collection.");
			}
		} finally {
			setIsDeleting(false);
		}
	};

	const renderImageGrid = () => {
		if (imageCount === 0) {
			return (
				<div className="flex items-center justify-center w-full h-[225px] bg-gray-2 rounded text-gray-3">
					Collection still empty.
				</div>
			);
		}

		// Layout for 1 image
		if (imageCount === 1) {
			return (
				<div className="relative w-full h-[225px] rounded overflow-hidden">
					<Image
						src={images[0]}
						alt={altText}
						fill
						className="object-cover"
						sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
					/>
				</div>
			);
		}

		// Layout for 2 images
		if (imageCount === 2) {
			return (
				<div className="grid grid-cols-2 gap-1 w-full h-[225px] rounded overflow-hidden">
					{images.slice(0, 2).map((photo) => (
						<div key={photo} className="relative w-full h-full">
							<Image
								src={photo}
								alt={altText}
								fill
								className="object-cover"
								sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 17vw"
							/>
						</div>
					))}
				</div>
			);
		}

		// Layout for 3 or more images (use the first 3 for the layout)
		return (
			<div className="grid grid-cols-4 grid-rows-2 gap-1 w-full h-[225px] rounded overflow-hidden">
				<div className="relative row-span-2 col-span-3">
					<Image
						src={images[0]}
						alt={altText}
						fill
						className="object-cover"
						sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 17vw"
					/>
				</div>
				<div className="relative">
					<Image
						src={images[1]}
						alt={altText}
						fill
						className="object-cover"
						sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 17vw"
					/>
				</div>
				<div className="relative">
					<Image
						src={images[2]}
						alt={altText}
						fill
						className="object-cover"
						sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 17vw"
					/>
				</div>
			</div>
		);
	};

	return (
		<div className="relative">
			{renderImageGrid()}
			<div className="absolute bottom-0 left-0 h-[60px] px-3 bg-dark/75 text-white flex items-center justify-between w-3/5 rounded-tr-xs rounded-bl-sm">
				<Link href={href} className="flex-grow overflow-hidden mr-2">
					<h2 className="text-sm font-medium truncate">{title}</h2>
					<p className="text-xs text-gray-400">
						{photoCount} {photoCount === 1 ? "photo" : "photos"}
					</p>
				</Link>

				{userId && (
					<>
						<button onClick={() => setShowOption((prev) => !prev)} className="cursor-pointer px-2 shrink-0">
							<Image src="/3-dots.svg" alt="3 dots" width={16} height={800} />
						</button>
						{showOptions && (
							<div className="absolute bottom-0 right-0 -translate-y-[80%] flex flex-col items-start bg-white shadow-2xl text-dark px-4 py-3 space-y-2">
								<ModalWrapper
									mode="edit"
									initialData={{ name: title, collectionId }}
									closeDropdown={() => setShowOption(false)}
								>
									<DialogTrigger className="text-xs font-medium cursor-pointer">Edit</DialogTrigger>
								</ModalWrapper>
								<button className="text-xs font-medium cursor-pointer" onClick={() => setShowDeleteModal(true)} disabled={isDeleting}>
									Delete
								</button>
							</div>
						)}
						<ConfirmModal
							isOpen={showDeleteModal}
							onOpenChange={setShowDeleteModal}
							message={`Are you sure you want to delete this collection ?`}
							onConfirm={handleDelete}
							closeDropDown={() => setShowOption(false)}
						/>
					</>
				)}
			</div>
		</div>
	);
}
