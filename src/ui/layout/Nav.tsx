"use client";

import Link from "next/link";
import { AnimatedBackground } from "../motion-primitives/animated-background";
import { usePathname } from "next/navigation";
import { useAuth } from "@clerk/nextjs";

export default function Nav() {
	const { isSignedIn, userId } = useAuth();
	const pathname = usePathname();
	const activeValue = pathname.startsWith("/collections") ? "/collections" : pathname;
	return (
		<div>
			<AnimatedBackground
				defaultValue={activeValue || undefined}
				className="rounded-sm bg-gray-2"
				transition={{
					type: "easeInOut",
					duration: 0.2,
				}}
			>
				<Link href="/" className="px-4 py-1.5 font-medium text-sm" data-id="/">
					Home
				</Link>
				<Link
					href={isSignedIn ? `/collections/${userId}` : "/collections"}
					className="px-4 py-1.5 font-medium text-sm"
					data-id="/collections"
				>
					Collections
				</Link>
			</AnimatedBackground>
		</div>
	);
}
