"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";

export default function BackButton() {
  const router = useRouter();
  return (
    <button
      onClick={() => router.back()}
      className="relative px-4 py-1.5  font-medium text-sm rounded-sm cursor-pointer flex items-center justify-center gap-2 hover:bg-gray-2 transition-colors"
    >
      <Image src="/arrow-left.svg" alt="arrow left" width={25} height={25} />
      <span className="">Back</span>
    </button>
  );
}
