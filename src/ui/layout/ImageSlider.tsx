import { InfiniteSlider } from "@/ui/motion-primitives/infinite-slider";
import Image from "next/image";

const imageNumbers = [...Array(19).keys()].map((n) => n + 1).filter((n) => n !== 2);
const images = imageNumbers.map((num) => ({
	src: `/preview/${num}.webp`,
	alt: `${num}`,
}));
// Divide images into 4 columns
const columnsFour = [
	images.filter((_, i) => i % 4 === 0),
	images.filter((_, i) => i % 4 === 1),
	images.filter((_, i) => i % 4 === 2),
	images.filter((_, i) => i % 4 === 3),
];

export default function ImageSlider() {
	return (
		<div className="absolute inset-0">
			<div className="w-full justify-between gap-4 flex">
				{columnsFour.map((columnImages, index) => (
					<InfiniteSlider key={index} direction="vertical" speed={25} reverse={index % 2 === 0}>
						{columnImages.map((image) => (
							<Image key={image.alt} src={image.src} alt={image.alt} width={300} height={300} />
						))}
					</InfiniteSlider>
				))}
			</div>
		</div>
	);
}
