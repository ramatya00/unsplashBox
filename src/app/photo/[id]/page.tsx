import MaxWidthWrapper from "@/ui/MaxWidthWrapper";
import Image from "next/image";
import { getUnsplashImageDetails, getCollectionsForImage } from "@/lib/data";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import DownloadImage from "@/ui/photo/Download";
import { auth } from "@clerk/nextjs/server";
import { SignInButton } from "@clerk/nextjs";

type ImagePageProps = {
	params: Promise<{ id: string }>;
};

export default async function ImagePage({ params }: ImagePageProps) {
	const { id } = await params;
	const { userId } = await auth();

	const [imageDetails, userCollectionsForImage] = await Promise.all([
		getUnsplashImageDetails(id).catch((err) => {
			console.error("Failed to fetch image details:", err);
			return null;
		}),
		getCollectionsForImage(id).catch((err) => {
			console.error("Failed to fetch user collections for image:", err);
			return [];
		}),
	]);

	if (!imageDetails) notFound();

	const publishedDate = imageDetails.created_at
		? format(new Date(imageDetails.created_at), "MMMM d, yyyy")
		: "Date unknown";
	const altText = imageDetails.alt_description || imageDetails.description || `Photo by ${imageDetails.user.name}`;

	const isLandscape = imageDetails.width > imageDetails.height;
	const imageContainerClasses = isLandscape ? "md:w-8/12" : "md:w-5/12";
	const sidebarContainerClasses = isLandscape ? "md:w-4/12" : "md:w-7/12";
	const imageSizes = isLandscape ? "(max-width: 768px) 100vw, 66.6vw" : "(max-width: 768px) 100vw, 41.6vw";

	const downloadEndpoint = `${imageDetails.links.download_location}?client_id=${process.env.UNSPLASH_ACCESS_KEY}`;

	return (
		<MaxWidthWrapper>
			<main className="flex flex-col md:flex-row gap-6 my-16 md:mt-24">
				<div className={cn("w-full", imageContainerClasses)}>
					<Image
						src={imageDetails.urls.regular}
						alt={altText}
						width={imageDetails.width}
						height={imageDetails.height}
						className="w-full h-auto rounded shadow-sm"
						sizes={imageSizes}
						priority
					/>
				</div>
				<div className={cn("w-full", sidebarContainerClasses)}>
					<div className="flex items-center mb-4">
						<Image
							src={imageDetails.user.profile_image.medium}
							alt={`${imageDetails.user.name}'s profile picture`}
							width={40}
							height={40}
							className="w-10 h-10 rounded-full"
						/>
						<div className="ml-3">
							{imageDetails.user.portfolio_url ? (
								<a
									href={imageDetails.user.portfolio_url}
									target="_blank"
									rel="noopener noreferrer"
									className="font-medium hover:underline"
								>
									{imageDetails.user.name}
								</a>
							) : (
								<h3 className="font-medium">{imageDetails.user.name}</h3>
							)}
							{imageDetails.user.location && <p className="text-xs text-gray-500">{imageDetails.user.location}</p>}
						</div>
					</div>

					<p className="text-gray-600 text-xs mb-6">Published on {publishedDate}</p>

					<div className="flex flex-col md:flex-row gap-3 mb-8">
						{/* TODO: Implement Add to Collection functionality */}
						{userId ? (
							<button className="flex items-center justify-center px-4 py-2 gap-2 rounded-sm bg-gray-2 text-xs font-medium hover:bg-gray-300 transition-colors">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-4 w-4"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
								</svg>
								Add to Collection
							</button>
						) : (
							<SignInButton mode="modal">
								<button className="flex items-center justify-center px-4 py-2 gap-2 rounded-sm bg-gray-2 text-xs font-medium hover:bg-gray-300 transition-colors">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-4 w-4"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
									</svg>
									Add to Collection
								</button>
							</SignInButton>
						)}
						<DownloadImage downloadEndpoint={downloadEndpoint} description={imageDetails.description} />
					</div>

					<h2 className="text-lg font-semibold mb-2">Collections</h2>

					<div className="space-y-1">
						{userId && userCollectionsForImage.length > 0 ? (
							userCollectionsForImage.map((collection) => (
								<div key={collection.id} className="flex items-center justify-between bg-gray-100 rounded-md p-3">
									<div className="flex items-center">
										{/* Placeholder for collection preview image */}
										<div className="w-16 h-16 rounded-md bg-gray-300 flex items-center justify-center text-xs text-gray-500">
											Preview
										</div>
										<div className="ml-3">
											<h4 className="font-medium">{collection.name}</h4>
											<p className="text-sm text-gray-600">X photos</p>
										</div>
									</div>
									<div className="flex items-center">
										{/* TODO: Implement Remove from Collection functionality */}
										<button className="text-gray-700 mr-2 hover:text-red-600 transition-colors">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className="h-5 w-5"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
											>
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4"></path>
											</svg>
										</button>
										<span className="text-sm">Remove</span>
									</div>
								</div>
							))
						) : (
							<p className="text-xs text-gray-3">
								{userId
									? "Not in any of your collections."
									: "Sign in to see if the image is in one of your collections."}
							</p>
						)}
					</div>
				</div>
			</main>
		</MaxWidthWrapper>
	);
}
