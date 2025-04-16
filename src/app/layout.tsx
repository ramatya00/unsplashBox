import type { Metadata } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Header from "@/ui/layout/Header";
import QueryProvider from "@/lib/Providers";
import { Toaster } from "sonner";
import { Analytics } from "@vercel/analytics/react";

const vietnamPro = Be_Vietnam_Pro({
	subsets: ["latin"],
	weight: ["300", "500", "600"],
});

export const metadata: Metadata = {
	title: "Unsplash Box",
	description: "Your space to discover and organize inspiring visuals from Unsplash.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<ClerkProvider>
			<html lang="en">
				<body className={`${vietnamPro.className} font-light bg-white text-dark antialiased overflow-x-hidden`}>
					<Header />
					<QueryProvider>{children}</QueryProvider>
					<Toaster richColors position="bottom-right" />
					<Analytics />
				</body>
			</html>
		</ClerkProvider>
	);
}
