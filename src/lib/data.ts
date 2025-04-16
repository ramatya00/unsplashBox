import { auth } from "@clerk/nextjs/server";
import { prisma } from "./prisma";
import { fetchUnsplash } from "./unsplash";
import { Prisma } from "@prisma/client";

// --- Unsplash Data ---
export async function searchUnsplashImages(query: string, page: number = 1, perPage: number = 20) {
	if (!query) return { photos: [], totalPages: 0 };
	const data = await fetchUnsplash(
		`/search/photos?query=${encodeURIComponent(query)}&page=${page}&per_page=${perPage}`
	);
	return {
		photos: data.results,
		totalPages: data.total_pages,
	};
}
export async function getUnsplashImageDetails(imageId: string) {
	if (!imageId) return null;
	const data = await fetchUnsplash(`/photos/${imageId}`);
	return data;
}
export async function getUnsplashCollection(id: string) {
	if (!id) throw new Error("Unsplash collection ID is required.");
	try {
		const data = await fetchUnsplash(`/collections/${encodeURIComponent(id)}`);
		return data;
	} catch (error) {
		console.error("Unsplash API Error (getUnsplashCollection):", error);
		throw new Error(`Failed to fetch Unsplash collection ${id}.`);
	}
}
export async function getUnsplashCollectionPhotos(
	id: string,
	page: number = 1,
	perPage: number = 20,
	orientation?: "landscape" | "portrait" | "squarish"
) {
	if (!id) throw new Error("Unsplash collection ID is required.");

	// Build the query string
	let endpoint = `/collections/${encodeURIComponent(id)}/photos?page=${page}&per_page=${perPage}`;
	if (orientation) {
		endpoint += `&orientation=${orientation}`;
	}

	try {
		const data = await fetchUnsplash(endpoint);
		return data;
	} catch (error) {
		console.error("Unsplash API Error (getUnsplashCollectionPhotos):", error);
		throw new Error(`Failed to fetch photos for Unsplash collection ${id}.`);
	}
}

// --- Collection Data (Requires Auth) ---
export async function getCollections() {
	const { userId } = await auth();
	if (!userId) {
		throw new Error("Not authenticated");
	}

	try {
		const collections = await prisma.collection.findMany({
			where: { userId: userId },
			orderBy: { createdAt: "desc" },
			include: {
				images: {
					orderBy: { addedAt: "desc" },
					take: 3,
					select: {
						image: {
							select: { imageUrlRegular: true },
						},
					},
				},
				_count: {
					select: { images: true },
				},
			},
		});
		return collections;
	} catch (error) {
		console.error("Database Error:", error);
		throw new Error("Failed to fetch collections.");
	}
}

export async function getCollectionDetails(collectionId: string) {
	try {
		const collection = await prisma.collection.findUnique({
			where: {
				id: collectionId,
			},
		});
		return collection;
	} catch (error) {
		console.error("Database Error:", error);
		throw new Error("Failed to fetch collection details.");
	}
}

export async function getImagesInCollection(collectionId: string) {
	try {
		const collection = await prisma.collection.findUnique({
			where: { id: collectionId },
			select: { id: true },
		});

		if (!collection) {
			throw new Error("Collection not found or access denied.");
		}

		const images = await prisma.image.findMany({
			where: {
				collections: {
					some: {
						collectionId: collectionId,
					},
				},
			},
			orderBy: {
				createdAt: "desc",
			},
		});
		return images;
	} catch (error) {
		console.error("Database Error:", error);
		throw new Error("Failed to fetch images in collection.");
	}
}

// Fetch collections an image belongs to *for the current user*
export async function getCollectionsForImage(imageId: string) {
	const { userId } = await auth();
	if (!userId) return [];

	try {
		const collections = await prisma.collection.findMany({
			where: {
				userId: userId,
				images: {
					some: {
						imageId: imageId,
					},
				},
			},
			include: {
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
				_count: {
					select: { images: true },
				},
			},
		});
		return collections;
	} catch (error) {
		console.error("Database Error:", error);
		throw new Error("Failed to fetch collections for the image.");
	}
}

// Needs to return collections owned by the user that *don't* contain the image
export async function getAvailableCollectionsForImage(imageId: string) {
	const { userId } = await auth();
	if (!userId) return [];

	try {
		const whereClause: Prisma.CollectionWhereInput = {
			userId: userId,
			images: {
				none: {
					imageId: imageId,
				},
			},
		};

		const collections = await prisma.collection.findMany({
			where: whereClause,
			orderBy: { name: "asc" },
		});
		return collections;
	} catch (error) {
		console.error("Database Error:", error);
		throw new Error("Failed to fetch available collections.");
	}
}
