"use client";

import { DialogContent, DialogHeader, DialogTitle, Dialog } from "@/ui/motion-primitives/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CollectionSchema, TCollectionSchema } from "@/lib/zodSchema";
import { createCollection, editCollection, searchUserCollections } from "@/lib/actions";
import { toast } from "sonner";
import { Transition, Variants } from "motion/react";
import { useState, useEffect } from "react";

type Collection = {
	id: string;
	name: string;
	// Add other collection properties if available from searchUserCollections
};

type ModalWrapperProps = {
	children: React.ReactNode;
	mode?: "create" | "edit";
	initialData?: { name: string; collectionId?: string };
	closeDropdown?: () => void;
	onCollectionCreated?: () => void; // Added for refresh
};

export default function ModalCollection({ children, mode = "create", initialData, closeDropdown, onCollectionCreated }: ModalWrapperProps) {
	const [isOpen, setIsOpen] = useState(false);

	const customVariants: Variants = {
		initial: { scale: 0, filter: "blur(5px)" },
		animate: { scale: 1, filter: "blur(0px)" },
	};
	const customTransition: Transition = { type: "spring", bounce: 0.2, duration: 0.3 };
	const closeDialog = () => setIsOpen(false);

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen} variants={customVariants} transition={customTransition}>
			{children}
			<ModalFormContent
				closeDialog={closeDialog}
				mode={mode}
				initialData={initialData}
				closeDropDown={closeDropdown}
				onCollectionCreated={onCollectionCreated} // Pass down the callback
			/>
		</Dialog>
	);
}

type ModalFormContentProps = {
	closeDialog: () => void;
	mode: "create" | "edit";
	initialData?: { name: string; collectionId?: string };
	closeDropDown?: () => void;
	onCollectionCreated?: () => void; // Added for refresh
};

function ModalFormContent({ closeDialog, mode, initialData, closeDropDown, onCollectionCreated }: ModalFormContentProps) {
	const [existingCollections, setExistingCollections] = useState<Collection[]>([]);
	const [isSubmitting, setIsSubmitting] = useState(false);

	useEffect(() => {
		const fetchCollections = async () => {
			try {
				const collections = await searchUserCollections("");
				setExistingCollections(collections);
			} catch {
				// Handle error fetching collections, e.g., show a toast notification
				toast.error("Failed to load existing collections.");
			}
		};
		fetchCollections();
	}, []);

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
		setError,
	} = useForm<TCollectionSchema>({
		resolver: zodResolver(CollectionSchema),
		defaultValues: mode === "edit" ? { name: initialData?.name || "" } : {},
	});

	const onSubmit = async (data: TCollectionSchema) => {
		// Check for duplicate names
		const isDuplicate = existingCollections?.some(
			(collection) =>
				collection.name.toLowerCase() === data.name.trim().toLowerCase() &&
				collection.id !== initialData?.collectionId
		);

		if (isDuplicate) {
			setError("name", {
				type: "manual",
				message: "A collection with this name already exists.",
			});
			return;
		}

		if (data.name === initialData?.name) {
			closeDialog();
			if (closeDropDown) closeDropDown();
			return;
		}

		setIsSubmitting(true);
		setError("root.serverError", {}); // Clear previous server errors

		try {
			if (mode === "edit") {
				if (!initialData?.collectionId) {
					throw new Error("Collection Id is required for editing.");
				}
				await editCollection({ ...data, collectionId: initialData.collectionId });
			} else {
				await createCollection(data);
				onCollectionCreated?.(); // Call the callback after successful creation
			}
			closeDialog();
			if (closeDropDown) closeDropDown();
			// TODO: Consider how to refresh the collections list if it's displayed elsewhere
			// For example, you might pass a refresh function as a prop
			// or use a global state management solution.
			toast.success(mode === "edit" ? "Collection updated successfully!" : "New collection created!");
			reset();
		} catch (error: unknown) {
			const message = error instanceof Error ? error.message : "An unexpected server error occurred.";
			setError("root.serverError", {
				type: "server",
				message,
			});
		} finally {
			setIsSubmitting(false);
		}
	};


	const handleCancel = () => {
		reset();
		setError("root.serverError", {});
		closeDialog();
		if (closeDropDown) closeDropDown();
	};

	return (
		<DialogContent className="w-full md:w-fit md:min-w-[500px] bg-white p-5 rounded-sm border-none backdrop-opacity-0">
			<DialogHeader>
				<DialogTitle className="text-xl font-medium text-center tracking-tighter">
					{mode === "edit" ? "Edit Collection" : "Add Collection"}
				</DialogTitle>
			</DialogHeader>

			<form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
				<div>
					<label htmlFor="collection-name" className="sr-only">
						Collection Name
					</label>
					<input
						id="collection-name"
						placeholder="Collection name"
						{...register("name")}
						aria-invalid={errors.name ? "true" : "false"}
						aria-describedby="name-error"
						className="px-5 py-3 border border-gray-2 rounded w-full shadow-xs focus:outline-0 text-sm"
					/>
					{errors.name && (
						<p id="name-error" className="ml-0.5 mt-1 text-[10px] text-red-500" role="alert">
							{errors.name.message}
						</p>
					)}
					{errors.root?.serverError && (
						<p id="server-error" className="ml-0.5 mt-1 text-[10px] text-red-500" role="alert">
							{errors.root.serverError.message}
						</p>
					)}
				</div>

				<div className="flex justify-center pt-2 text-sm gap-2">
					<SubmitButton pending={isSubmitting} mode={mode} />
					<button
						type="button"
						onClick={handleCancel}
						className="bg-white font-medium cursor-pointer px-4 py-1.5 rounded-sm"
					>
						Cancel
					</button>
				</div>
			</form>
		</DialogContent>
	);
}

function SubmitButton({ pending, mode }: { pending: boolean; mode: "create" | "edit" }) {
	return (
		<button
			type="submit"
			disabled={pending}
			aria-disabled={pending}
			className="bg-gray-2 px-4 py-1.5 rounded-sm font-medium cursor-pointer disabled:cursor-not-allowed"
		>
			{pending ? "Saving..." : mode === "edit" ? "Update" : "Save"}
		</button>
	);
}
