import MaxWidthWrapper from "@/ui/MaxWidthWrapper";
import Image from "next/image";
import { getUnsplashImageDetails, getCollectionsForImage } from "@/lib/data";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import DownloadImage from "@/ui/photo/Download";
import { auth } from "@clerk/nextjs/server";
import { SignUpButton } from "@clerk/nextjs";
import { DialogTrigger } from "@/ui/motion-primitives/dialog";
import AddToCollectionModal from "@/ui/photo/AddToCollectionModal";
import RemoveFromCollection from "@/ui/photo/RemoveFromCollection";
import Link from "next/link";
import BackButton from "@/ui/BackButton";

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
  const altText =
    imageDetails.alt_description ||
    imageDetails.description ||
    `Photo by ${imageDetails.user.name}`;

  const isLandscape = imageDetails.width > imageDetails.height;
  const layoutClasses = isLandscape ? "flex-col" : "flex-col md:flex-row gap-6";
  const imageContainerClasses = isLandscape
    ? "w-full mb-8"
    : "w-full md:w-8/12";
  const sidebarContainerClasses = isLandscape
    ? "w-full max-w-xl"
    : "w-full md:w-4/12";
  const imageSizes = isLandscape ? "100vw" : "(max-width: 768px) 100vw, 41.6vw";

  const downloadEndpoint = `${imageDetails.links.download_location}?client_id=${process.env.UNSPLASH_ACCESS_KEY}`;

  return (
    <MaxWidthWrapper>
      <div className="my-16 md:mt-24">
        <div className="flex justify-start mb-5">
          <BackButton />
        </div>
        <main className={`flex ${layoutClasses} `}>
          <div
            className={cn(
              "border rounded border-gray-1",
              imageContainerClasses
            )}
          >
            <Image
              src={imageDetails.urls.full}
              alt={altText}
              width={imageDetails.width}
              height={imageDetails.height}
              className="w-full h-auto rounded"
              sizes={imageSizes}
              priority
            />
          </div>
          <div className={cn(sidebarContainerClasses)}>
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
                {imageDetails.user.location && (
                  <p className="text-xs text-gray-500">
                    {imageDetails.user.location}
                  </p>
                )}
              </div>
            </div>

            <p className="text-gray-600 text-xs mb-6">
              Published on {publishedDate}
            </p>

            <div className="flex gap-3 mb-8 flex-wrap">
              {/* Add to Collection */}
              {userId ? (
                <div className="shrink-0">
                  <AddToCollectionModal
                    imageData={{
                      id: imageDetails.id,
                      altDescription: imageDetails.alt_description,
                      imageUrlRegular: imageDetails.urls.regular,
                      imageUrlSmall: imageDetails.urls.small,
                      width: imageDetails.width,
                      height: imageDetails.height,
                    }}
                  >
                    <DialogTrigger>
                      <div className="flex items-center justify-center px-4 py-2 gap-2 rounded-sm bg-gray-2 text-xs font-medium hover:bg-gray-300 transition-colors cursor-pointer">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 4v16m8-8H4"
                          ></path>
                        </svg>
                        Add to Collection
                      </div>
                    </DialogTrigger>
                  </AddToCollectionModal>
                </div>
              ) : (
                <div className="shrink-0">
                  <SignUpButton mode="modal">
                    <button className="flex items-center justify-center px-4 py-2 gap-2 rounded-sm bg-gray-2 text-xs font-medium hover:bg-gray-300 transition-colors cursor-pointer">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 4v16m8-8H4"
                        ></path>
                      </svg>
                      Add to Collection
                    </button>
                  </SignUpButton>
                </div>
              )}
              <DownloadImage
                downloadEndpoint={downloadEndpoint}
                description={imageDetails.description}
              />
            </div>

            <h2 className="text-lg font-semibold mb-2">Collections</h2>

            <div className="space-y-1">
              {userId && userCollectionsForImage.length > 0 ? (
                userCollectionsForImage.map((collection) => (
                  <div
                    key={collection.id}
                    className="flex gap-3 hover:bg-gray-2 p-2 rounded group transition-colors duration-500 mb-2"
                  >
                    <Link
                      href={`/collection/${collection.id}/${userId}`}
                      className="relative w-14 h-14 rounded overflow-hidden"
                    >
                      {collection.images[0] ? (
                        <Image
                          src={collection.images[0].image.imageUrlSmall}
                          alt={collection.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-2" />
                      )}
                    </Link>
                    <div className="grow flex items-center justify-between">
                      <Link href={`/collection/${collection.id}/${userId}`}>
                        <div className="hover:opacity-80 transition-opacity">
                          <h1 className="font-medium text-xs md:text-sm mb-0.5">
                            {collection.name}
                          </h1>
                          <p className="text-xs text-gray-3">
                            {collection._count.images} photos
                          </p>
                        </div>
                      </Link>
                      <RemoveFromCollection
                        imageId={id}
                        collectionId={collection.id}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-gray-3">
                  Not in any of your collections.
                </p>
              )}
            </div>
          </div>
        </main>
      </div>
    </MaxWidthWrapper>
  );
}
