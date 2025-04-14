"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "./prisma";
import { revalidatePath } from "next/cache";
import { CollectionSchema, TCollectionSchema } from "./zodSchema";

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
		await prisma.collection.create({
			data: {
				name: name.trim(),
				userId: userId,
			},
		});
	} catch (error) {
		console.error("Database Error:", error);
		throw new Error("Database Error: Failed to create collection.");
	}

	revalidatePath(`/collections/${userId}`);
}

export async function deleteCollection({ collectionId }: { collectionId: string }) {
	const { userId } = await auth();
	if (!userId) throw new Error("Authentication Required.");

	const collection = await prisma.collection.findUnique({
		where: { id: collectionId },
		select: { userId: true },
	});

	if (!collection) throw new Error("Collection not found.");
	if (collection.userId !== userId) throw new Error("Unauthorized: You do not own this collection.");
	try {
		await prisma.collection.delete({
			where: { id: collectionId },
		});
	} catch (error) {
		console.error("Database Error deleting collection:", error);
		throw new Error("Database Error: Failed to delete collection.");
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
		await prisma.collection.update({
			where: { id: collectionId },
			data: {
				name: name.trim(),
			},
		});
	} catch (error) {
		console.error("Database Error updating collection:", error);
	}
	revalidatePath(`/collections/${userId}`);
	revalidatePath(`/collection/${collectionId}/${userId}`);
}
