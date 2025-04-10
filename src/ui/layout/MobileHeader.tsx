"use client";

import Image from "next/image";
import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { GlowEffect } from "../motion-primitives/glow-effect";
import { useState } from "react";

export default function MobileHeader() {
	const [isOpen, setIsOpen] = useState(false);
	const toggleMenu = () => {
		setIsOpen((prev) => !prev);
	};
	return (
		<header className="sm:hidden flex justify-between items-center py-3 relative">
			<Link href="/">
				<Image src="/logo.svg" alt="logo" width={118} height={24} />
			</Link>

			<div className="relative w-8 h-8 cursor-pointer" onClick={toggleMenu}>
				<Image src="/menu-icon.svg" alt="menu icon" width={800} height={800} className="w-full h-full" />
			</div>

			<div
				className={`absolute top-[120%] flex flex-col gap-4 bg-white border border-gray-2 rounded-sm shadow-lg min-w-[175px] py-3 px-4 ${
					isOpen ? "right-0" : "-right-full"
				} transition-all duration-200 ease-in-out z-50 items-end`}
			>
				<div className="flex flex-col gap-2 text-end font-medium text-sm">
					<Link href="/">Home</Link>
					<Link href="/collections">Collections</Link>
				</div>
				<div>
					<SignedIn>
						<UserButton
							showName
							appearance={{
								elements: {
									avatarBox: {
										width: "32px",
										height: "32px",
									},
								},
							}}
						/>
					</SignedIn>
					<SignedOut>
						<div className="relative">
							<GlowEffect
								colors={["#0894FF", "#C959DD", "#FF2E54", "#FF9004"]}
								mode="static"
								blur="soft"
							/>
							<SignInButton mode="modal">
								<button className="relative px-4 py-1.5 bg-dark text-white font-medium text-sm rounded-sm cursor-pointer">
									Sign In
								</button>
							</SignInButton>
						</div>
					</SignedOut>
				</div>
			</div>
		</header>
	);
}
