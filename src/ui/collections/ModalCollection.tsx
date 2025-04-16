"use client";

import { DialogContent, DialogHeader, DialogTitle, Dialog } from "@/ui/motion-primitives/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CollectionSchema, TCollectionSchema } from "@/lib/zodSchema";
import { createCollection, editCollection } from "@/lib/actions";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { searchUserCollections } from "@/lib/actions";
import { Transition, Variants } from "motion/react";
import { useState } from "react";

type ModalWrapperProps = {
	children: React.ReactNode;
	mode?: "create" | "edit";
	initialData?: { name: string; collectionId?: string };
	closeDropdown?: () => void;
};

export default function ModalCollection({ children, mode = "create", initialData, closeDropdown }: ModalWrapperProps) {
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
			/>
		</Dialog>
	);
}

type ModalFormContentProps = {
	closeDialog: () => void;
	mode: "create" | "edit";
	initialData?: { name: string; collectionId?: string };
	closeDropDown?: () => void;
};

function ModalFormContent({ closeDialog, mode, initialData, closeDropDown }: ModalFormContentProps) {
	const queryClient = useQueryClient();

	// Add query to get existing collections
	const { data: existingCollections } = useQuery({
		queryKey: ["collections"],
		queryFn: () => searchUserCollections(""),
	});

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

	const onSubmit = (data: TCollectionSchema) => {
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
		mutation.mutate(data);
		setError("root.serverError", {});
	};

	const mutation = useMutation({
		mutationFn:
			mode === "edit"
				? (data: TCollectionSchema) => {
						if (!initialData?.collectionId) {
							throw new Error("Collection Id is required for editing.");
						}
						return editCollection({ ...data, collectionId: initialData.collectionId });
				  }
				: createCollection,
		onSuccess: () => {
			closeDialog();
			if (closeDropDown) closeDropDown();
			// Invalidate collections query to trigger a refresh
			queryClient.invalidateQueries({ queryKey: ["collections"] });
			toast.success(mode === "edit" ? "Collection updated successfully!" : "New collection created!");
			reset();
		},
		onError: (error) => {
			setError("root.serverError", {
				type: "server",
				message: error.message || "An unexpected server error occurred.",
			});
		},
	});

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
					<SubmitButton pending={mutation.isPending} mode={mode} />
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
