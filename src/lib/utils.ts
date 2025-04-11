import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const PHOTOS_PER_PAGE = 20;
export const PUBLIC_COLLECTION_IDS = ["1717804", "2406842"];
