import { InfiniteSlider } from "@/ui/motion-primitives/infinite-slider";
import Image from "next/image";

const imageNumbers = [...Array(19).keys()].map((n) => n + 1).filter((n) => n !== 2);
const images = imageNumbers.map((num) => ({
	src: `/preview/${num}.webp`,
	alt: `${num}`,
}));
// Divide images into 4 columns
const columns = [
	images.filter((_, i) => i % 4 === 0),
	images.filter((_, i) => i % 4 === 1),
	images.filter((_, i) => i % 4 === 2),
	images.filter((_, i) => i % 4 === 3),
];

export default function ImageSlider() {
	return (
		<div className="absolute inset-0">
			<div className="md:hidden w-full justify-between gap-4 flex">
				{columns.slice(1, 3).map((columnImages, index) => (
					<InfiniteSlider key={index} direction="vertical" speed={20} reverse={index % 2 === 0}>
						{columnImages.map((image) => (
							<Image
								key={image.alt}
								src={image.src}
								alt={image.alt}
								width={180}
								height={300}
								className="min-w-full h-auto"
							/>
						))}
					</InfiniteSlider>
				))}
			</div>
			<div className="hidden md:flex lg:hidden w-full justify-between gap-4">
				{columns.slice(1, 4).map((columnImages, index) => (
					<InfiniteSlider key={index} direction="vertical" speed={20} reverse={index % 2 === 0}>
						{columnImages.map((image) => (
							<Image
								key={image.alt}
								src={image.src}
								alt={image.alt}
								width={300}
								height={300}
								className="min-w-full h-auto"
							/>
						))}
					</InfiniteSlider>
				))}
			</div>
			<div className="hidden lg:flex w-full justify-between gap-4">
				{columns.map((columnImages, index) => (
					<InfiniteSlider key={index} reverse={index % 2 === 0} direction="vertical" speed={20}>
						{columnImages.map((image) => (
							<Image
								key={image.alt}
								src={image.src}
								alt={image.alt}
								width={280}
								height={300}
								className="min-w-full h-auto"
							/>
						))}
					</InfiniteSlider>
				))}
			</div>
		</div>
	);
}
