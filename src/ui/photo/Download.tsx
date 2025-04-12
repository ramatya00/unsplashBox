"use client";

import Image from "next/image";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

type DownloadVariables = {
	downloadEndpoint: string;
	filename: string;
};

const downloadImage = async ({ downloadEndpoint, filename }: DownloadVariables) => {
	let blobUrl = "";
	try {
		// 1. Fetch the download trigger URL from Unsplash API
		const res = await fetch(downloadEndpoint);
		if (!res.ok) {
			throw new Error(`Failed to get download URL: ${res.statusText} (${res.status})`);
		}
		const { url } = await res.json();

		if (!url) {
			throw new Error("Download URL not found in the response.");
		}

		// 2. Fetch the actual image data as a blob
		const imageResponse = await fetch(url);
		if (!imageResponse.ok) {
			throw new Error(`Failed to fetch image data: ${imageResponse.statusText} (${imageResponse.status})`);
		}
		const blob = await imageResponse.blob();
		blobUrl = window.URL.createObjectURL(blob);

		// 3. Create a temporary anchor to trigger the download
		const a = document.createElement("a");
		a.href = blobUrl;
		const fileExtension = blob.type.split("/")[1] || "jpg";
		a.download = `${filename}.${fileExtension}`;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);

		return { success: true };
	} catch (error) {
		console.error("Download failed:", error);
		throw error;
	} finally {
		if (blobUrl) {
			window.URL.revokeObjectURL(blobUrl);
		}
	}
};

export default function DownloadImage({
	downloadEndpoint,
	description,
}: {
	downloadEndpoint: string;
	description: string;
}) {
	const filename =
		downloadEndpoint && description ? description.replace(/\s+/g, "-").toLowerCase() : `unsplashBox-image`;

	const mutation = useMutation<unknown, Error, DownloadVariables>({
		mutationFn: downloadImage,
		onSuccess: () => {
			toast.success("Image successfully downloaded!");
		},
		onError: (error) => {
			toast.error(`Download failed: ${error.message}`);
		},
	});

	const handleDownloadClick = () => {
		mutation.mutate({ downloadEndpoint, filename });
	};

	return (
		<button
			onClick={handleDownloadClick}
			disabled={mutation.isPending}
			className="flex items-center justify-center px-4 py-2 rounded-sm bg-gray-2 text-xs font-medium gap-2 hover:bg-gray-300 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
		>
			<Image src="/down arrow.svg" alt="Download icon" width={16} height={16} />
			{mutation.isPending ? "Downloading..." : "Download"}
		</button>
	);
}
