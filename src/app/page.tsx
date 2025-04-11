import MaxWidthWrapper from "@/ui/MaxWidthWrapper";
import SearchForm from "@/ui/SearchForm";
import Image from "next/image";

export default function Home() {
	return (
		<div className="max-w-[1920px] mx-auto w-full h-screen relative">
			<MaxWidthWrapper>
				<div className="h-screen flex flex-col items-center justify-center">
					<div className="absolute bottom-0 right-0 w-full h-1/3 md:w-1/2 lg:h-full lg:w-1/4">
						<Image
							src="/hero-right.png"
							alt="hero"
							fill
							className="w-full h-full object-cover object-top lg:object-contain lg:object-right"
							priority
						/>
					</div>
					<div className="absolute top-0 left-0 w-full h-1/3 md:w-1/2 lg:h-full lg:w-1/4">
						<Image
							src="/hero-left.png"
							alt="hero"
							fill
							className="w-full h-full object-cover object-bottom lg:object-contain lg:object-left"
							priority
						/>
					</div>

					<div className="text-center mb-8 -mt-20">
						<h1 className="font-semibold text-5xl tracking-tighter">Search</h1>
						<p className="text-sm mt-2 mb-5">Search high-resolution images from Unsplash</p>
					</div>
					<SearchForm defaultQuery="" />
				</div>
			</MaxWidthWrapper>
		</div>
	);
}
