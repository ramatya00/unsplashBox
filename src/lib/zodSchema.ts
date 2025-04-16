import { z } from "zod";

export const CollectionSchema = z.object({
	name: z.string().min(1, { message: "Collection name cannot be empty." }).max(100, { message: "Collection name too long (max 100 characters)." }),
});
export type TCollectionSchema = z.infer<typeof CollectionSchema>;

export const AddImageSchema = z.object({
	imageId: z.string(),
	collectionId: z.string(),
	imageData: z.object({
		altDescription: z.string().nullable(),
		imageUrlRegular: z.string(),
		imageUrlSmall: z.string(),
		width: z.number(),
		height: z.number(),
	}),
});

export type TAddImageSchema = z.infer<typeof AddImageSchema>;
