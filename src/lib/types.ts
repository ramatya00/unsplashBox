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
