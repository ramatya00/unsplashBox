export type PreviewImageCollection = {
	id: string;
	url: string;
	slug: string | null;
};

export type Photo = {
	id: string;
	urls: {
		regular: string;
	};
	alt_description?: string | null;
	width: number;
	height: number;
};
