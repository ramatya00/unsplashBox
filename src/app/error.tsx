"use client";

import MaxWidthWrapper from "@/ui/MaxWidthWrapper";
import Image from "next/image";

export default function notFound() {
	return (
		<MaxWidthWrapper>
			<div className="flex flex-col justify-center items-center h-screen gap-10 md:flex-row">
				<div className="relative w-[200px]">
					<Image src="/scarecrow.png" alt="scare crow" width={1079} height={895} />
				</div>
				<div className="space-y-2">
					<h1 className="text-2xl font-semibold">Oops.</h1>
					<p className="text-gray-3">Something went wrong.</p>
				</div>
			</div>
		</MaxWidthWrapper>
	);
}
