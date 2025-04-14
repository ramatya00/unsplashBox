import { Prisma } from "@prisma/client";

export type Photo = {
	id: string;
	urls: {
		regular: string;
	};
	alt_description?: string | null;
	width: number;
	height: number;
};

export type PhotoPreview = {
	urls: {
		small: string;
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
			select: { image: { select: { imageUrlSmall: true } } };
			take: 3;
		};
		_count: {
			select: { images: true };
		};
	};
}>;
