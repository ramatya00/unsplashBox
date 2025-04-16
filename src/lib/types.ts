import { Prisma } from "@prisma/client";

export type Photo = {
	id: string;
	width: number;
	height: number;
	urls: {
		raw: string;
		full: string;
		regular: string;
		small: string;
		thumb: string;
	};
	alt_description?: string;
};

export type DatabaseImage = {
	id: string;
	width: number;
	height: number;
	imageUrlRegular: string;
	imageUrlSmall: string;
	altDescription: string | null;
	createdAt: Date;
	updatedAt: Date;
};

export type PhotoPreview = {
	urls: {
		small: string;
		regular: string;
	};
};

export type CollectionPreviewData = {
	id: string;
	title: string;
	total_photos: number;
	preview_photos: PhotoPreview[];
};

export type CollectionWithPreviewsAndCount = Prisma.CollectionGetPayload<{
	include: {
		images: {
			select: { image: { select: { imageUrlRegular: true } } };
			take: 3;
		};
		_count: {
			select: { images: true };
		};
	};
}>;
