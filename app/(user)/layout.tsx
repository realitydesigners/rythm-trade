import { WebSocketProvider } from "@/components/context/WebSocketContext";
import { Toaster } from "@/components/ui/sonner";

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
