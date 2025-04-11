import Link from "next/link";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import MaxWidthWrapper from "../MaxWidthWrapper";
import Nav from "./Nav";
import Image from "next/image";
import { GlowEffect } from "../motion-primitives/glow-effect";
import MobileHeader from "./MobileHeader";

export default async function Header() {
	return (
		<div className=" border-b border-gray-2 fixed inset-0 top-0 h-fit z-50 bg-white">
			<MaxWidthWrapper>
				<header className="hidden sm:flex justify-between items-center py-3">
					<Link href="/">
						<Image src="/logo.svg" alt="logo" width={118} height={24} priority />
					</Link>

					<div className="flex items-center gap-6">
						<Nav />

						<SignedIn>
							<div className={`w-[32px] h-[32px] rounded-full bg-gray-3`}>
								<UserButton
									appearance={{
										elements: {
											avatarBox: {
												width: "32px",
												height: "32px",
											},
										},
									}}
								/>
							</div>
						</SignedIn>
						<SignedOut>
							<div className="relative">
								<GlowEffect
									colors={["#0894FF", "#C959DD", "#FF2E54", "#FF9004"]}
									mode="static"
									blur="soft"
								/>
								<SignInButton mode="modal">
									<button className="relative px-4 py-1.5 bg-dark text-white font-medium text-sm rounded-sm cursor-pointer ">
										Sign In
									</button>
								</SignInButton>
							</div>
						</SignedOut>
					</div>
				</header>

				<MobileHeader />
			</MaxWidthWrapper>
		</div>
	);
}
