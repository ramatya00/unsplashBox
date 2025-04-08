"use client";

import Link from "next/link";
import { AnimatedBackground } from "../motion-primitives/animated-background";

export default function Nav() {
	const tabs = [
		{ name: "Home", href: "/" },
		{ name: "Collections", href: "/collections" },
	];
	return (
		<div>
			<AnimatedBackground
				defaultValue={tabs[0].name}
				className="rounded-sm bg-gray-2 text-gray-3"
				transition={{
					type: "easeInOut",
					duration: 0.2,
				}}
			>
				{tabs.map((tab, index) => (
					<Link href={tab.href} key={index} data-id={tab.name} className="px-4 py-1.5  font-medium text-sm">
						{tab.name}
					</Link>
				))}
			</AnimatedBackground>
		</div>
	);
}
