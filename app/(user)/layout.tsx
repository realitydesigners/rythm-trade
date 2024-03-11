import { WebSocketProvider } from "@/components/context/WebSocketContext";
import Navbar from "@/components/ui/Navbar";
import { Toaster } from "@/components/ui/sonner";

import { Metadata } from "next";

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<WebSocketProvider>
			{children}
			<Toaster />
		</WebSocketProvider>
	);
}
