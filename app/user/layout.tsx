import { WebSocketProvider } from "@/components/context/WebSocketContext";
import { Toaster } from "@/components/ui/sonner";
import UserNavigation from "./userNavigation";
import UserStatusBar from "./userStatusBar";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <WebSocketProvider>
                <UserNavigation />
                {children}
                <Toaster />
                <UserStatusBar />
            </WebSocketProvider>
        </>
    );
}
