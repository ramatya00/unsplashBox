import type { Metadata } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Header from "@/ui/layout/Header";

const vietnamPro = Be_Vietnam_Pro({
	subsets: ["latin"],
	weight: ["300", "500", "600"],
});

export const metadata: Metadata = {
	title: "Unsplash Box",
	description: "Discover, browse, and curate personalized collections of high-quality images from Unsplash.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<ClerkProvider>
			<html lang="en">
				<body className={`${vietnamPro.className} font-light bg-white text-dark antialiased`}>
					<div className="lg:hidden flex items-center justify-center min-h-screen">
						<p className="text-2xl px-5 font-medium">Sorry, Need bigger screen to run the app.</p>
					</div>
					<div className="hidden lg:block">
						<Header />
						{children}
					</div>
				</body>
			</html>
		</ClerkProvider>
	);
}
