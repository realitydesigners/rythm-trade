import { Metadata } from "next";
import "./globals.css";

import Navbar from "@/app/components/ui/Navbar";
import { ClerkProvider } from "@clerk/nextjs";

export const metadata: Metadata = {
	title: "RYTHM - High Precision Algorithmic Trading",
	description:
		"A geometrical trading model inspired by fractal mathematics and multi-dimensional time series.",
};

export default function RootLayout({
	children,
}: { children: React.ReactNode }) {
	return (
		<ClerkProvider>
			<html lang="en">
				<head>
					<link rel="icon" href="/favicon.ico" sizes="any" />
				</head>
				<body className="bg-black">
					<Navbar />
					<div className="p-0">{children}</div>
				</body>
			</html>
		</ClerkProvider>
	);
}
