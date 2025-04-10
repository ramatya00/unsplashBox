// Utility function to fetch data from Unsplash API
export async function fetchUnsplash(endpoint: string) {
	const baseUrl = "https://api.unsplash.com";
	const accessKey = process.env.UNSPLASH_ACCESS_KEY;

	if (!accessKey) {
		throw new Error("Unsplash access key is missing");
	}

	const response = await fetch(`${baseUrl}${endpoint}`, {
		headers: {
			Authorization: `Client-ID ${accessKey}`,
			"Content-Type": "application/json",
		},
		next: { revalidate: 3600 }, // Cache for 1 hour
	});

	if (!response.ok) {
		throw new Error(`Unsplash API error: ${response.status}`);
	}

	return response.json();
}
