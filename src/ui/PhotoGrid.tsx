import { Photo, DatabaseImage } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";

type PhotoGridProps = {
	photos: (Photo | DatabaseImage)[];
	photoBaseUrl?: string;
};

export default function PhotoGrid({ photos, photoBaseUrl = "/photo/" }: PhotoGridProps) {
	if (!photos || photos.length === 0) {
		return null;
	}

	const getImageUrl = (photo: Photo | DatabaseImage): string => {
		if ("urls" in photo) {
			return photo.urls.regular;
		}
		return photo.imageUrlRegular;
	};

	const getAltText = (photo: Photo | DatabaseImage): string => {
		if ("alt_description" in photo) {
			return photo.alt_description || "Photo";
		}
		return "Photo";
	};

	return (
		<div className="masonry-grid">
			{photos.map((photo) => (
				<div key={photo.id} className="masonry-item mb-4 break-inside-avoid">
					<Link href={`${photoBaseUrl}${photo.id}`} className="block">
						<div className="relative rounded-sm overflow-hidden">
							<Image
								src={getImageUrl(photo)}
								alt={getAltText(photo)}
								width={photo.width}
								height={photo.height}
								className="w-full h-auto"
								sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
							/>
						</div>
					</Link>
				</div>
			))}
		</div>
	);
}
