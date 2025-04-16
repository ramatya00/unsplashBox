import HeaderGradient from "@/ui/HeaderGradient";
import MaxWidthWrapper from "@/ui/MaxWidthWrapper";

export default function collectionsLayout({ children }: { children: React.ReactNode }) {
	return (
		<MaxWidthWrapper>
			<div className="mb-16">
				<HeaderGradient title="Collections">
					Explore the world through collections of beautiful photos free to use under the{" "}
					<a className="font-medium underline" href="https://unsplash.com/license" target="_blank">
						Unsplash License
					</a>
					.
				</HeaderGradient>
				{children}
			</div>
		</MaxWidthWrapper>
	);
}
