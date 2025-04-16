"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../motion-primitives/dialog";
import SearchCollections from "./SearchCollections";

type AddToCollectionModalProps = {
	children: React.ReactNode;
	imageData: {
		id: string;
		altDescription: string | null;
		imageUrlRegular: string;
		imageUrlSmall: string;
		width: number;
		height: number;
	};
};

export default function AddToCollectionModal({ children, imageData }: AddToCollectionModalProps) {
	return (
		<Dialog>
			{children}
			<DialogContent className="w-full h-[80%] md:w-fit md:min-w-[550px] bg-white p-5 md:p-8 rounded-sm border-none backdrop-opacity-0">
				<DialogHeader>
					<DialogTitle className="text-xl font-medium text-start tracking-tighter mb-5">
						Add To Collections
					</DialogTitle>
				</DialogHeader>
				<SearchCollections imageId={imageData.id} imageData={imageData} />
			</DialogContent>
		</Dialog>
	);
}
