import MaxWidthWrapper from "@/ui/MaxWidthWrapper";
import Image from "next/image";

export default function SearchLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className="w-full min-h-screen">
			{/* gradient header */}
			<div className="relative w-full h-26 md:h-36">
				<Image
					src="/gradiend-bg.svg"
					alt="gradient background"
					fill
					priority
					className="w-full h-full object-cover"
				/>
			</div>

			<MaxWidthWrapper>{children}</MaxWidthWrapper>
		</div>
	);
}
