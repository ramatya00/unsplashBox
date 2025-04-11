export type PreviewImage = {
	id: string;
	slug: string | null;
	url: string;
};

export type CollectionPreviewProps = {
	images: PreviewImage[];
	altText?: string;
	href: string;
	title: string;
	photoCount: number;
};

export type Photo = {
	id: string;
	urls: {
		regular: string;
	};
	alt_description?: string | null;
	description?: string | null;
	width: number;
	height: number;
};

export type PhotoGridProps = {
	photos: Photo[];
	photoBaseUrl?: string;
};

export type PaginationControlsProps = {
	currentPage: number;
	totalPages: number;
	baseUrl: string;
	pageParamName?: string;
};

export type CollectionPhotosGridProps = {
	collectionId: string;
	currentPage: number;
	photosPerPage: number;
	totalPages: number;
};
