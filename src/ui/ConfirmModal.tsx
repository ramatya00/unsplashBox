"use client";

import { Dialog, DialogContent } from "@/ui/motion-primitives/dialog";

type ConfirmModalProps = {
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
	message: string;
	onConfirm: () => void;
};

export default function ConfirmModal({ isOpen, onOpenChange, message, onConfirm }: ConfirmModalProps) {
	return (
		<Dialog open={isOpen} onOpenChange={onOpenChange}>
			<DialogContent className="w-full max-w-md bg-white p-5 rounded-xs border-none backdrop-opacity-0">
				<div className="text-sm">
					<p>{message}</p>
				</div>
				<div className="flex justify-center pt-2 text-sm gap-2 mt-4">
					<button
						onClick={() => {
							onConfirm();
							onOpenChange(false);
						}}
						type="button"
						className="bg-gray-2 font-medium px-4 py-1.5 rounded-sm cursor-pointer"
					>
						Confirm
					</button>
					<button onClick={() => onOpenChange(false)} type="button" className="bg-white font-medium px-4 py-1.5 rounded-sm cursor-pointer">
						Cancel
					</button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
