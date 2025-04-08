import ImageSlider from "@/ui/layout/ImageSlider";
import MaxWidthWrapper from "@/ui/MaxWidthWrapper";
import { GlowEffect } from "@/ui/motion-primitives/glow-effect";
import Image from "next/image";

export default function Home() {
	return (
		<MaxWidthWrapper>
			<div className="h-screen flex items-center justify-center relative overflow-hidden">
				<ImageSlider />
				<div className="absolute inset-0 bg-white/50 top-0 left-0" />

				<form className="text-center w-[600px] h-fit relative">
					<GlowEffect
						colors={["#0894FF", "#C959DD", "#FF2E54", "#FF9004"]}
						mode="rotate"
						blur="strongest"
						scale={1.1}
					/>
					<input
						type="text"
						className="w-full p-4  bg-white rounded-lg relative"
						placeholder="Enter image keywords..."
					/>
					<button type="submit" className="absolute right-0 top-0 mt-3.5 mr-4">
						<Image src="/Search.svg" alt="search" width={28} height={28} />
					</button>
				</form>
			</div>
		</MaxWidthWrapper>
	);
}
