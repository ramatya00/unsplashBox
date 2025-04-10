"use client";

import Link from "next/link";
import { AnimatedBackground } from "../motion-primitives/animated-background";
import { usePathname } from "next/navigation";

export default function Nav() {
	const pathname = usePathname();
	const tabs = [
		{ name: "Home", href: "/" },
		{ name: "Collections", href: "/collections" },
	];

	// Determine the active tab based on pathname
	const activeTabName = tabs.find((tab) =>
		tab.href === "/" ? pathname === tab.href : pathname.startsWith(tab.href)
	)?.name;

	return (
		<div>
			<AnimatedBackground
				defaultValue={activeTabName}
				className="rounded-sm bg-gray-2 text-gray-3"
				transition={{
					type: "easeInOut",
					duration: 0.2,
				}}
			>
				{tabs.map((tab, index) => (
					<Link href={tab.href} key={index} data-id={tab.name} className="px-4 py-1.5 font-medium text-sm">
						{tab.name}
					</Link>
				))}
			</AnimatedBackground>
		</div>
	);
}
