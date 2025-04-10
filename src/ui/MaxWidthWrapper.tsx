export default function MaxWidthWrapper({ children }: { children: React.ReactNode }) {
	return <div className="max-w-7xl mx-auto px-4 lg:px-8">{children}</div>;
}
