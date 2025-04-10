export default function Loader({ message }: { message?: string }) {
	return (
		<div className="flex flex-col items-center justify-center py-44 text-gray-3">
			<div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-gray-3 mb-4" />
			{message && <p>{message}</p>}
		</div>
	);
}
