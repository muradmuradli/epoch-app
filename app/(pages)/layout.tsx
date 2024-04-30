import Navbar from "@/components/navbar";

export default function PageLayout({ children }: { children: React.ReactNode }) {
	return (
		<div>
			<Navbar />
			{children}
		</div>
	);
}
