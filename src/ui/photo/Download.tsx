"use client";

import Image from "next/image";
import { toast } from "sonner";
import { useState } from "react";

type DownloadVariables = {
	downloadEndpoint: string;
	filename: string;
};

const downloadImage = async ({ downloadEndpoint, filename }: DownloadVariables) => {
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

		// 3. Create a temporary anchor to trigger the download
		const a = document.createElement("a");
		a.href = URL.createObjectURL(blob);
		const fileExtension = blob.type.split("/")[1] || "jpg";
		a.download = `${filename}.${fileExtension}`;
		a.style.display = "none";
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(a.href);

		return { success: true };
	} catch (error) {
		console.error("Download failed:", error);
		throw error;
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

	const [isDownloading, setIsDownloading] = useState(false);

	const handleDownloadClick = async () => {
		setIsDownloading(true);
		try {
			await downloadImage({ downloadEndpoint, filename });
			toast.success("Image successfully downloaded!");
		} catch (error: unknown) {
			const message = error instanceof Error ? error.message : "An unexpected error occurred.";
			toast.error(`Download failed: ${message}`);
		} finally {
			setIsDownloading(false);
		}
	};

	return (
		<button
			onClick={handleDownloadClick}
			disabled={isDownloading}
			className="flex items-center justify-center px-4 py-2 rounded-sm bg-gray-2 text-xs font-medium gap-2 hover:bg-gray-300 transition-colors disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
		>
			<Image src="/down arrow.svg" alt="Download icon" width={16} height={16} />
			{isDownloading ? "Downloading..." : "Download"}
		</button>
	);
}
