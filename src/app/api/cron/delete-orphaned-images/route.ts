import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

// Secure the endpoint: Allow only Vercel Cron or requests with a secret
export async function GET(request: Request) {
	const authHeader = request.headers.get("authorization");
	if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
		return new Response("Unauthorized", { status: 401 });
	}

	try {
		console.log("Starting orphaned image cleanup job...");

		// Find images that are not associated with any collection
		const orphanedImages = await prisma.image.findMany({
			where: {
				collections: {
					none: {}, // Key condition: no related ImagesInCollections records
				},
			},
			select: {
				id: true, // Select only IDs for deletion
			},
			take: 500, // Process in batches to avoid overwhelming the DB/function
		});

		if (orphanedImages.length === 0) {
			console.log("No orphaned images found.");
			return NextResponse.json({ success: true, deletedCount: 0 });
		}

		const idsToDelete = orphanedImages.map((img) => img.id);

		console.log(`Found ${idsToDelete.length} orphaned images to delete.`);

		// Delete the orphaned images
		const deleteResult = await prisma.image.deleteMany({
			where: {
				id: {
					in: idsToDelete,
				},
			},
		});

		console.log(`Successfully deleted ${deleteResult.count} orphaned images.`);
		return NextResponse.json({ success: true, deletedCount: deleteResult.count });
	} catch (error) {
		console.error("Error deleting orphaned images:", error);
		// Log specific Prisma errors if helpful
		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			console.error(`Prisma Error Code: ${error.code}`);
		}
		return NextResponse.json({ success: false, error: "Failed to delete orphaned images" }, { status: 500 });
	}
}
