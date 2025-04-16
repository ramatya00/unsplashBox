"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "./prisma";
import { revalidatePath } from "next/cache";
import { AddImageSchema, CollectionSchema, TAddImageSchema, TCollectionSchema } from "./zodSchema";

export async function createCollection(data: TCollectionSchema) {
	const { userId } = await auth();
	if (!userId) {
		throw new Error("Authentication Required.");
	}
	const validatedFields = CollectionSchema.safeParse(data);
	if (!validatedFields.success) {
		const errorMsg = validatedFields.error.flatten().fieldErrors.name?.join(", ") || "Invalid collection name.";
		throw new Error(`Validation Error: ${errorMsg}`);
	}
	const { name } = validatedFields.data;

	try {
		// Check if collection name already exists for this user
		const existingCollection = await prisma.collection.findFirst({
			where: {
				name: name.trim(),
				userId: userId,
			},
		});

		if (existingCollection) {
			throw new Error("A collection with this name already exists.");
		}

		await prisma.collection.create({
			data: {
				name: name.trim(),
				userId: userId,
			},
		});
	} catch (error) {
		console.error("Database Error:", error);
		if (error instanceof Error) {
			throw error;
		}
		throw new Error("Database Error: Failed to create collection.");
	}

	revalidatePath(`/collections/${userId}`);
}

type EditCollectionInput = TCollectionSchema & { collectionId: string };
export async function editCollection(data: EditCollectionInput) {
	const validatedFields = CollectionSchema.safeParse({ name: data.name });
	if (!validatedFields.success) {
		const errorMsg = validatedFields.error.flatten().fieldErrors.name?.join(", ") || "Invalid collection name.";
		throw new Error(`Validation Error: ${errorMsg}`);
	}
	const { name } = validatedFields.data;
	const { collectionId } = data;

	const { userId } = await auth();
	if (!userId) {
		throw new Error("Authentication Required.");
	}

	const collection = await prisma.collection.findUnique({
		where: { id: collectionId },
		select: { userId: true },
	});

	if (!collection) {
		throw new Error("Collection not found.");
	}
	if (collection.userId !== userId) {
		throw new Error("Unauthorized: You do not own this collection.");
	}

	try {
		// Check if new name conflicts with existing collections
		const existingCollection = await prisma.collection.findFirst({
			where: {
				name: name.trim(),
				userId: userId,
				NOT: {
					id: collectionId,
				},
			},
		});

		if (existingCollection) {
			throw new Error("A collection with this name already exists.");
		}

		await prisma.collection.update({
			where: { id: collectionId },
			data: {
				name: name.trim(),
			},
		});
	} catch (error) {
		console.error("Database Error updating collection:", error);
		if (error instanceof Error) {
			throw error;
		}
		throw new Error("Failed to update collection.");
	}
	revalidatePath(`/collections/${userId}`);
}

export async function deleteCollection({ collectionId }: { collectionId: string }) {
	const { userId } = await auth();
	if (!userId) throw new Error("Authentication Required.");

	const collection = await prisma.collection.findUnique({
		where: { id: collectionId },
		select: {
			userId: true,
			images: {
				select: {
					imageId: true,
				},
			},
		},
	});

	if (!collection) throw new Error("Collection not found.");
	if (collection.userId !== userId) throw new Error("Unauthorized: You do not own this collection.");

	try {
		// Get all image IDs in this collection
		const imageIds = collection.images.map((img) => img.imageId);

		// Delete the collection (this will cascade delete the ImagesInCollections entries)
		await prisma.collection.delete({
			where: { id: collectionId },
		});

		// For each image, check if it's used in other collections
		// If not, delete the image
		for (const imageId of imageIds) {
			const imageUsageCount = await prisma.imagesInCollections.count({
				where: {
					imageId: imageId,
				},
			});

			if (imageUsageCount === 0) {
				await prisma.image.delete({
					where: {
						id: imageId,
					},
				});
			}
		}
	} catch (error) {
		console.error("Database Error deleting collection:", error);
		throw new Error("Database Error: Failed to delete collection.");
	}
	revalidatePath(`/collections/${userId}`);
}

export async function addImageToCollection(data: TAddImageSchema) {
	const { userId } = await auth();
	if (!userId) throw new Error("Authentication required");

	const validatedFields = AddImageSchema.safeParse(data);
	if (!validatedFields.success) {
		throw new Error("Invalid image data");
	}

	const { imageId, collectionId, imageData } = validatedFields.data;

	try {
		const collection = await prisma.collection.findUnique({
			where: {
				id: collectionId,
				userId: userId,
			},
		});

		if (!collection) {
			throw new Error("Collection not found or access denied");
		}

		const image = await prisma.image.upsert({
			where: { id: imageId },
			create: {
				id: imageId,
				...imageData,
			},
			update: {},
		});
		await prisma.imagesInCollections.create({
			data: {
				imageId: image.id,
				collectionId: collectionId,
			},
		});

		revalidatePath(`/collection/${collectionId}/${userId}`);
		revalidatePath(`/collections/${userId}`);
		return { success: true };
	} catch (error) {
		console.error("Database Error:", error);
		throw new Error("Failed to add image to collection");
	}
}

export async function searchUserCollections(query: string, imageId?: string) {
	const { userId } = await auth();
	if (!userId) throw new Error("Authentication required");

	try {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const whereConditions: any = {
			userId: userId,
		};

		// Add name filter if query is provided
		if (query) {
			whereConditions.name = {
				contains: query,
				mode: "insensitive",
			};
		}

		// If imageId is provided, exclude collections that already have this image
		if (imageId) {
			whereConditions.images = {
				none: {
					imageId: imageId,
				},
			};
		}

		const collections = await prisma.collection.findMany({
			where: whereConditions,
			include: {
				_count: {
					select: { images: true },
				},
				images: {
					take: 1,
					select: {
						image: {
							select: {
								imageUrlSmall: true,
							},
						},
					},
				},
			},
			orderBy: {
				name: "asc",
			},
		});

		return collections;
	} catch (error) {
		console.error("Database Error:", error);
		throw new Error("Failed to search collections");
	}
}

export async function removeImageFromCollection({ imageId, collectionId }: { imageId: string; collectionId: string }) {
	const { userId } = await auth();
	if (!userId) throw new Error("Authentication Required.");

	try {
		// First verify the user owns the collection
		const collection = await prisma.collection.findUnique({
			where: { id: collectionId },
			select: { userId: true },
		});

		if (!collection) throw new Error("Collection not found.");
		if (collection.userId !== userId) throw new Error("Unauthorized: You do not own this collection.");

		// Delete the association between the image and collection
		await prisma.imagesInCollections.delete({
			where: {
				imageId_collectionId: {
					imageId: imageId,
					collectionId: collectionId,
				},
			},
		});

		// Check if the image is used in any other collections
		const imageUsageCount = await prisma.imagesInCollections.count({
			where: {
				imageId: imageId,
			},
		});

		// If the image is not used in any other collections, delete it
		if (imageUsageCount === 0) {
			await prisma.image.delete({
				where: {
					id: imageId,
				},
			});
		}

		revalidatePath(`/collection/${collectionId}/${userId}`);
		revalidatePath(`/collections/${userId}`);
		revalidatePath(`/photo/${imageId}`);

		return { success: true };
	} catch (error) {
		console.error("Database Error:", error);
		throw new Error("Failed to remove image from collection");
	}
}
