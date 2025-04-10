import MaxWidthWrapper from "@/ui/MaxWidthWrapper";
import Image from "next/image";
import { redirect } from "next/navigation";

export async function handleSearch(formData: FormData) {
	"use server";
	const query = formData.get("query") as string;
	if (query?.trim()) {
		redirect(`/search?query=${encodeURIComponent(query)}`);
	}
}
export default function Home() {
	return (
		<div className="max-w-[1920px] mx-auto w-full h-screen relative">
			<MaxWidthWrapper>
				<div className="h-screen flex items-center justify-center overflow-hidden">
					<div className="absolute bottom-0 right-0 w-full h-1/3 md:w-1/2 lg:h-full lg:w-1/4">
						<Image
							src="/hero-right.png"
							alt="hero"
							fill
							className="w-full h-full object-cover object-top lg:object-contain lg:object-top-left"
							priority
						/>
					</div>
					<div className="absolute top-0 left-0 w-full h-1/3 md:w-1/2 lg:h-full lg:w-1/4">
						<Image
							src="/hero-left.png"
							alt="hero"
							fill
							className="w-full h-full object-cover object-bottom lg:object-contain"
							priority
						/>
					</div>

					<div className="max-w-[500px] w-full text-center bg-transparent relative">
						<h1 className="font-semibold text-5xl tracking-tighter">Search</h1>
						<p className="text-sm mt-2 mb-5">Search high-resolution images from Unsplash</p>

						<form action={handleSearch} className="w-full h-fit relative">
							<input
								type="text"
								name="query"
								className="w-full p-4 px-5 bg-white rounded-lg relative border border-gray-2 text-sm shadow"
								placeholder="Enter image keywords..."
							/>
							<button type="submit" className="absolute right-0 top-0 mt-3.5 mr-4 cursor-pointer">
								<Image src="/Search.svg" alt="search" width={26} height={26} />
							</button>
						</form>
					</div>
				</div>
			</MaxWidthWrapper>
		</div>
	);
}
