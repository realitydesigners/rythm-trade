import { WebSocketProvider } from "@/app/components/context/WebSocketContext";
import Navbar from "@/app/components/ui/Navbar";

import { Metadata } from "next";

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <WebSocketProvider>{children}</WebSocketProvider>;
}
