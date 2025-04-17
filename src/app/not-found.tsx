import MaxWidthWrapper from "@/ui/MaxWidthWrapper";
import Image from "next/image";

export default function notFound() {
	return (
		<MaxWidthWrapper>
			<div className="flex flex-col justify-center items-center h-screen gap-10 md:flex-row">
				<div className="relative w-[200px]">
					<Image src="/Scarecrow.png" alt="scare crow" width={1079} height={895} />
				</div>
				<div className="space-y-2">
					<h1 className="text-2xl font-semibold">404 - Page Not Found</h1>
					<p className="text-gray-3">Sorry, the page you are looking for does not exist.</p>
				</div>
			</div>
		</MaxWidthWrapper>
	);
}
