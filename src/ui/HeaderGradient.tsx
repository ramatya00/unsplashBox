type HeaderGradientProps = {
	title: string;
	children?: React.ReactNode;
};

export default function HeaderGradient({ title, children }: HeaderGradientProps) {
	return (
		<header className="mt-24 text-center">
			<h1 className="gradient-text text-[38px] font-medium tracking-tighter mb-1">{title}</h1>
			<p className="max-w-[350px] mx-auto text-sm">{children}</p>
		</header>
	);
}
