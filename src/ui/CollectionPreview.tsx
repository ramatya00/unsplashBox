import { CollectionPreviewProps } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";

export default function CollectionPreview({
	images,
	altText = "Collection preview",
	href,
	title,
	photoCount,
}: CollectionPreviewProps) {
	const imageCount = images.length;

	// Function to render the image grid part
	const renderImageGrid = () => {
		// Handle case with no images
		if (imageCount === 0) {
			return (
				<div className="flex items-center justify-center w-full h-[225px] bg-gray-2 rounded-lg text-gray-3">
					No Preview Available
				</div>
			);
		}

		// Layout for 1 image
		if (imageCount === 1) {
			return (
				<div className="relative w-full h-[225px] rounded-lg overflow-hidden">
					<Image
						src={images[0].url}
						alt={images[0].slug || altText}
						fill
						className="object-cover"
						sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
					/>
				</div>
			);
		}

		// Layout for 2 images
		if (imageCount === 2) {
			return (
				<div className="grid grid-cols-2 gap-1 w-full h-[225px] rounded-lg overflow-hidden">
					{images.slice(0, 2).map((photo) => (
						<div key={photo.id} className="relative w-full h-full">
							<Image
								src={photo.url}
								alt={photo.slug || altText}
								fill
								className="object-cover"
								sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 17vw"
							/>
						</div>
					))}
				</div>
			);
		}

		// Layout for 3 or more images (use the first 3 for the layout)
		return (
			<div className="grid grid-cols-4 grid-rows-2 gap-1 w-full h-[225px] rounded-lg overflow-hidden">
				<div className="relative row-span-2 col-span-3">
					<Image
						src={images[0].url}
						alt={images[0].slug || altText}
						fill
						className="object-cover"
						sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 17vw"
					/>
				</div>
				<div className="relative">
					<Image
						src={images[1].url}
						alt={images[1].slug || altText}
						fill
						className="object-cover"
						sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 17vw"
					/>
				</div>
				<div className="relative">
					<Image
						src={images[2].url}
						alt={images[2].slug || altText}
						fill
						className="object-cover"
						sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 17vw"
					/>
				</div>
			</div>
		);
	};

	return (
		<Link href={href} className="group block">
			{renderImageGrid()}
			<div className="ml-0.5">
				<h2 className="mt-2 text-sm font-medium truncate group-hover:text-blue-600 transition-colors">
					{title}
				</h2>
				<p className="text-xs text-gray-3">{photoCount} photos</p>
			</div>
		</Link>
	);
}
