import { searchUnsplashImages } from "@/lib/data";
import Image from "next/image";
import Link from "next/link";
import { UnsplashPhoto } from "@/lib/types";

export default async function SearchResults({ query, page }: { query: string; page: number }) {
	const { photos, totalPages } = await searchUnsplashImages(query, page);

	if (photos.length === 0) {
		return (
			<div className="text-center py-16">
				<p className="text-gray-3">No images found for {query}</p>
			</div>
		);
	}

	return (
		<div className="mt-10">
			<div className="masonry-grid">
				{photos.map((photo: UnsplashPhoto) => (
					<div key={photo.id} className="masonry-item mb-4 break-inside-avoid">
						<Link href={`/photos/${photo.id}`} className="block">
							<div className="relative rounded-sm overflow-hidden">
								<Image
									src={photo.urls.regular}
									alt={photo.alt_description || "Unsplash image"}
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

			{totalPages > 1 && (
				<div className="flex justify-center gap-2 mt-8 mb-8 font-medium text-sm">
					{page > 1 && (
						<Link
							href={`/search?query=${encodeURIComponent(query)}&page=${page - 1}`}
							className="px-4 py-1.5 bg-gray-2 rounded-sm"
						>
							Previous
						</Link>
					)}
					{page < totalPages && (
						<Link
							href={`/search?query=${encodeURIComponent(query)}&page=${page + 1}`}
							className="px-4 py-1.5 bg-gray-2 rounded-sm"
						>
							Next
						</Link>
					)}
				</div>
			)}
		</div>
	);
}
