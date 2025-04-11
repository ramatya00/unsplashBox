import Image from "next/image";
import Link from "next/link";
import { PhotoGridProps } from "@/lib/types";

export default function PhotoGrid({ photos, photoBaseUrl = "/photos/" }: PhotoGridProps) {
	if (!photos || photos.length === 0) {
		return null;
	}

	return (
		<div className="masonry-grid">
			{photos.map((photo) => (
				<div key={photo.id} className="masonry-item mb-4 break-inside-avoid">
					<Link href={`${photoBaseUrl}${photo.id}`} className="block">
						<div className="relative rounded-sm overflow-hidden">
							<Image
								src={photo.urls.regular}
								alt={photo.alt_description || photo.description || "Photo"}
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
