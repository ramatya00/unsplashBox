export default function Loading() {
	return (
		<div className="absolute inset-0 flex items-center justify-center bg-white">
			<div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-gray-3" />
		</div>
	);
}
