// --- Unsplash Types ---
export type UnsplashPhoto = {
	id: string;
	slug: string;
	created_at: string;
	updated_at: string;
	promoted_at: string | null;
	width: number;
	height: number;
	color: string;
	blur_hash: string;
	description: string | null;
	alt_description: string | null;
	urls: {
		raw: string;
		full: string;
		regular: string;
		small: string;
		thumb: string;
	};
	links: {
		self: string;
		html: string;
		download: string;
		download_location: string;
	};
	likes: number;
	liked_by_user: boolean;
	user: {
		id: string;
		username: string;
		name: string;
		portfolio_url: string | null;
		bio: string | null;
		location: string | null;
		profile_image: {
			small: string;
			medium: string;
			large: string;
		};
	};
};
