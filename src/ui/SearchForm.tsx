"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import React from "react";

type SearchFormProps = {
	defaultQuery: string;
};

export default function SearchForm({ defaultQuery }: SearchFormProps) {
	const router = useRouter();

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		const query = formData.get("query") as string;
		if (query?.trim()) {
			router.push(`/search?query=${encodeURIComponent(query)}`);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="w-full h-fit relative max-w-[500px] mx-auto">
			<input
				type="text"
				name="query"
				defaultValue={defaultQuery}
				className="w-full p-4 px-5 bg-white rounded-lg relative border border-gray-2 text-sm shadow-sm"
				placeholder="Enter image keywords..."
			/>
			<button type="submit" className="absolute right-0 top-0 mt-4 mr-4 cursor-pointer">
				<Image src="/Search.svg" alt="search" width={22} height={22} />
			</button>
		</form>
	);
}
